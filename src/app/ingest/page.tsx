"use client";

import {
  Button,
  Card,
  CardBody,
  Select,
  SelectItem,
  Input,
} from "@nextui-org/react";
import Navbar from "../components/common/Navigation";
import axios from "axios";
import * as dotenv from "dotenv";
import { ChangeEvent, useEffect, useState } from "react";
import Footer from "../components/common/Footer";
import { Spinner } from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";
import { getTokenHandler } from "../factories/TokenHandlerFactory";
import {
  fetchKrogerAccessToken,
  handleToken,
} from "../handlers/UserTokenHandler";

dotenv.config();

export default function Page() {
  let scrappedFoods: string[] = [];
  type Item = {
    item: string;
    upc: string;
    description?: string;
    size?: string;
    thumbnailUrl?: string;
  };

  type GrocerSelectItem = {
    label: string;
    value: string;
    description: string;
  };

  let grocers: GrocerSelectItem[] = [
    {
      label: "Kroger",
      value: "kroger",
      description: "The second most popular pet in the world",
    },
    {
      label: "Walmart",
      value: "walmart",
      description: "The second most popular pet in the world",
    },
  ];

  const [krogerFoodUpcs, setKrogerFoodUpcs] = useState<Item[][]>([]);
  const [recipeUrl, setRecipeUrl] = useState<string>("");
  const [storedToken, setStoredToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<
    { upc: string; quantity: number }[]
  >([]);
  const [authCode, setAuthCode] = useState("");
  const [redirectUri, setRedirectUri] = useState("");
  const [grocer, setGrocer] = useState("");
  const [config, setConfig] = useState(null);
  const user = useUser();

  useEffect(() => {
    const fetchAndStoreToken = async () => {
      const email = user.user?.emailAddresses[0].emailAddress;
      if (email) {
        const token = await handleToken(email);
        if (token) {
          setStoredToken(token);
        }
      }
    };

    fetchAndStoreToken();
  }, [user]);

  const openKrogerAuth = async (): Promise<any> => {
    try {
      const SCOPES = "profile.compact cart.basic:write product.compact";
      const CLIENT_ID =
        "ingredientcart-61754b7bda0bee174de5ec7c46e5351c6969468600073263900";

      // Construct the URL
      const authUrl = `https://api.kroger.com/v1/connect/oauth2/authorize?scope=${SCOPES}&response_type=code&client_id=${CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KROGER_REDIRECT_URI}`;

      window.location.href = authUrl;
    } catch (error: any) {
      // Handle errors
      console.error("Error in Kroger authentication:", error.message);
    }
  };

  const handleButtonClick = async () => {
    const storedTokenString = localStorage.getItem("customer_access_token");
    if (!storedTokenString) {
      console.log("No token found, fetching new one");
      await openKrogerAuth();
    } else {
      const storedTokenObject = JSON.parse(storedTokenString);
      setStoredToken(storedTokenObject.access_token);
      // if (isTokenExpired(storedTokenObject.access_token)) {
      //   console.log("Token expired, refreshing");
      //   const refreshedToken = await refreshKrogerAccessToken(storedTokenObject.refresh_token, redirectUri);
      //   if (refreshedToken) {
      //     localStorage.setItem("customer_access_token", JSON.stringify(refreshedToken));
      //     setStoredToken(refreshedToken.access_token);
      //   }
      // } else {
      //   setStoredToken(storedTokenObject.access_token);
      // }
    }
  };


  const ingestRecipe = async (scriptName: string) => {
    setKrogerFoodUpcs([]);
    setSelectedItems([]);
    // TODO: REPLACE WITH ACTUAL ENDPOINT
    const endpoint = "http://localhost:3333/tasks/scrape_recipe";

    axios
      .get(endpoint, {
        params: {
          recipeUrl: recipeUrl,
        },
        headers: {
          accept: "application/json",
        },
      })
      .then((response) => {
        scrappedFoods = response.data.result.ingredients as string[];
        getItemsUpcs(scrappedFoods);
      })
      .catch((error) => {
        console.error("Error Ingesting Recipe:", error);
      });
  };

  const getItemsUpcs = async (items: string[]): Promise<any> => {
    const upcsArray: {
      item: string;
      upc: string;
      description: string;
      thumbnailUrl?: string;
      size?: string;
    }[][] = [];

    try {
      setIsLoading(true); // Start Spinner
      for (const item of items) {
        // Kroger only lets 8 terms per search
        let processedItem = item;
        if (item.split(" ").length > 8) {
          console.log("Item is longer than 8 words:", item);
          processedItem = item.split(" ").slice(0, 8).join(" ");
        }

        const url = `https://api.kroger.com/v1/products?filter.term=${processedItem}`;

        if (!storedToken) {
          console.error("Undefine Token");
          return;
        }

        const response = await axios.get(url, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.data.data.length > 0) {
          console.log(response.data.data);

          const upcs = response.data.data.slice(0, 5).map((data: any) => {
            const thumbnailImage = data.images.find(
              (image: any) => image.perspective === "front"
            );
            const thumbnailUrl = thumbnailImage
              ? thumbnailImage.sizes[3].url
              : undefined;
            const size = data.items.length > 0 ? data.items[0].size : undefined;

            return {
              item: processedItem,
              upc: data.upc,
              description: data.description,
              size: size,
              thumbnailUrl: thumbnailUrl,
            };
          });

          upcsArray.push(upcs);
        } else {
          // TODO: HANDLE CASE WHEN NO ITEMS ARE FOUND IN SEARCH
          console.log("NO ITEM FOUND:" + item);
        }
      }
      console.log(upcsArray);
      setKrogerFoodUpcs(upcsArray);
      setIsLoading(false); // Stop Spinner
    } catch (error) {
      console.error("Error searching items:", error);
    }
  };

  const addToCart = async (items: { upc: string; quantity: number }[]) => {
    const payloadItems = items.map((item) => ({
      upc: item.upc,
      quantity: item.quantity,
      modality: "PICKUP",
    }));

    const payload = {
      items: payloadItems,
    };

    console.log(payload);

    try {
      const response = await axios.put(
        "https://api.kroger.com/v1/cart/add",
        payload,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      console.log(response.data);
    } catch (error: any) {
      console.error("Error adding to cart: ", error.message);
    }
  };
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRecipeUrl(event.target.value);
  };

  return (
    <div className="bg-off-white min-h-screen flex flex-col text-green-text">
      <Navbar />
      <div className="flex flex-col items-center min-h-[600px] overflow-auto">
        <div className="bg-off-white border border-border-color w-1/2 my-12 flex flex-col items-center justify-center">
          <Input
            value={recipeUrl}
            onChange={handleInputChange}
            isInvalid={false}
            label="Recipe URL"
            variant="underlined"
            defaultValue="https://your-recipe-url-here.com"
            classNames={{
              label: "text-center font-thin w-full",
              innerWrapper: "w-1/2 text-center items-center w-full",
              inputWrapper: "text-center items-center w-full",
              input: "text-center items-center w-full",
              base: "w-1/2",
            }}
          />
          <Button
            className="my-8 bg-peach border border-dark-green font-thin"
            radius="none"
            onClick={() => ingestRecipe("scrape_recipe")}
          >
            Extract Ingredients!
          </Button>
          <div className="flex">
            <Select
              placeholder="Grocer"
              radius="none"
              className="my-2 w-48"
              onChange={(value) => setGrocer(value.target.value)}
              value={grocer}
              aria-label="Grocer"
            >
              {grocers.map((grocer) => (
                <SelectItem
                  key={grocer.value}
                  value={grocer.value}
                  className="flex items-center text-black bg-white"
                >
                  {grocer.label}
                </SelectItem>
              ))}
            </Select>
            <Button
              className="m-4 bg-peach border border-dark-green font-thin"
              radius="none"
              onClick={() => handleButtonClick()}
            >
              Select Grocer
            </Button>
          </div>
        </div>
        {isLoading && (
          <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-opacity-50 bg-black">
            <Spinner
              size="lg"
              label="Gathering Ingredients!"
              color="success"
              classNames={{ label: "text-green-text" }}
            />
          </div>
        )}
        {krogerFoodUpcs.map((upcs, arrayIndex) => (
          <Card
            key={arrayIndex}
            radius="none"
            shadow="none"
            className="flex flex-col mx-10 mb-4 px-2 bg-off-white border border-border-green"
          >
            <h3 className="text-center text-green-text font-medium mb-4">
              {upcs[0].item}
            </h3>
            <CardBody className="flex flex-row overflow-auto items-center justify-start flex-row pt-4">
              {upcs.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center max-w-72 mb-4 mr-4 flex-shrink-0"
                >
                  <img
                    src={item.thumbnailUrl}
                    alt={item.item}
                    className="mb-2"
                    onClick={() => {
                      const existingItem = selectedItems.find(
                        (i) => i.upc === item.upc
                      );

                      if (existingItem) {
                        // If the item already exists, increment its quantity
                        const newItems = selectedItems.map((i) =>
                          i.upc === item.upc
                            ? { ...i, quantity: i.quantity + 1 }
                            : i
                        );
                        setSelectedItems(newItems);
                      } else {
                        // If the item doesn't exist, add it to the array
                        setSelectedItems([
                          ...selectedItems,
                          { upc: item.upc, quantity: 1 },
                        ]);
                      }
                    }}
                  />
                  <div className="text-center mx-6">
                    <p className="mb-2">{item.description}</p>
                    <p className="mb-2">{item.size}</p>
                    {selectedItems.some((i) => i.upc === item.upc) && (
                      <>
                        <Button
                          className="mx-2 bg-peach border border-dark-green font-thin"
                          radius="none"
                          size="sm"
                          onClick={() => {
                            const newItems = selectedItems.reduce<
                              { upc: string; quantity: number }[]
                            >((acc, i) => {
                              if (i.upc === item.upc) {
                                if (i.quantity > 1) {
                                  acc.push({ ...i, quantity: i.quantity - 1 });
                                }
                              } else {
                                acc.push(i);
                              }
                              return acc;
                            }, []);
                            setSelectedItems(newItems);
                          }}
                        >
                          -
                        </Button>

                        <span>
                          {selectedItems.find((i) => i.upc === item.upc)
                            ?.quantity || 0}
                        </span>

                        <Button
                          className="mx-2 bg-peach border border-dark-green font-thin"
                          radius="none"
                          size="sm"
                          onClick={() => {
                            const newItems = selectedItems.map((i) =>
                              i.upc === item.upc
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                            );
                            setSelectedItems(newItems);
                          }}
                        >
                          +
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex justify-end items-center ml-4">
                <Button
                  className="mx-2 bg-peach border border-dark-green font-thin"
                  radius="none"
                  size="sm"
                  onClick={() => {
                    const removedItems = krogerFoodUpcs[arrayIndex];
                    setKrogerFoodUpcs((prevState) =>
                      prevState.filter((_, i) => i !== arrayIndex)
                    );
                    setSelectedItems((prevState) =>
                      prevState.filter(
                        (item) =>
                          !removedItems.some(
                            (removedItem) => removedItem.upc === item.upc
                          )
                      )
                    );
                  }}
                >
                  x
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
        {selectedItems.length > 0 && (
          <Button
            className="my-8 bg-peach border border-dark-green font-thin"
            radius="none"
            isDisabled={selectedItems.length === 0}
            onClick={() => {
              addToCart(selectedItems);
              setSelectedItems([]);
              setKrogerFoodUpcs([]);
              setRecipeUrl("");
            }}
          >
            Add to Cart
          </Button>
        )}
        {selectedItems.length > 0 && (
          <Button
            className="my-8 bg-peach border border-dark-green font-thin"
            radius="none"
            onClick={() => {
              setSelectedItems([]);
            }}
          >
            Clear Selected Items
          </Button>
        )}
      </div>
      <Footer />
    </div>
  );
}
