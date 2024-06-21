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
import { ChangeEvent, useEffect, useState, useCallback } from "react";
import Footer from "../components/common/Footer";
import { Spinner } from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { getItemsUpcs } from "../services/productService";
import { waitForToken, ensureToken } from "../services/tokenService";

dotenv.config();

const retry = async <T,>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 1000,
  shouldRetry: (error: any) => boolean = () => true
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0 && shouldRetry(error)) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retry(operation, retries - 1, delay, shouldRetry);
    }
    throw error;
  }
};

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
  ];

  const [krogerFoodUpcs, setKrogerFoodUpcs] = useState<Item[][]>([]);
  const [recipeUrl, setRecipeUrl] = useState<string>("");
  const [storedToken, setStoredToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<
    { upc: string; quantity: number }[]
  >([]);
  const [grocer, setGrocer] = useState("");
  const { user } = useUser();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const recipeUrl = searchParams.get("recipeUrl");
    if (recipeUrl) {
      setRecipeUrl(recipeUrl as string);
      ingestRecipe(recipeUrl as string);
    }
  }, [searchParams]);

  useEffect(() => {
    const initializeToken = async () => {
      if (user?.emailAddresses[0].emailAddress) {
        const newToken = await ensureToken(user.emailAddresses[0].emailAddress);
        setToken(newToken);
      }
    };

    initializeToken();
  }, [user]);

  const ingestRecipe = useCallback(
    async (url: string) => {
      setKrogerFoodUpcs([]);
      setSelectedItems([]);
      setIsLoading(true);
      setError(null);

      const endpoint = "http://localhost:3333/tasks/scrape_recipe";

      try {
        const scrapeOperation = async (): Promise<string[]> => {
          const response = await axios.get(endpoint, {
            params: {
              recipeUrl: url,
            },
            headers: {
              accept: "application/json",
            },
          });

          if (
            !response.data ||
            !response.data.result ||
            !Array.isArray(response.data.result.ingredients)
          ) {
            throw new Error("Invalid response format from recipe scraper");
          }

          return response.data.result.ingredients;
        };

        const scrappedFoods = await retry(scrapeOperation, 3, 2000);

        if (scrappedFoods.length === 0) {
          throw new Error("No ingredients found in the recipe");
        }

        // Wait for token to be available
        await waitForToken();
        const currentToken = await ensureToken(
          user?.emailAddresses[0].emailAddress || ""
        );

        if (!currentToken) {
          throw new Error("Token not available");
        }

        const upcs = await getItemsUpcs(scrappedFoods, currentToken);
        console.log(upcs);

        setKrogerFoodUpcs(upcs);
      } catch (error: any) {
        console.error("Error Ingesting Recipe:", error);
        setError(
          error.message || "An error occurred while ingesting the recipe"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [user, setKrogerFoodUpcs, setSelectedItems, setIsLoading, setError]
  );

  const addToCart = async (items: { upc: string; quantity: number }[]) => {
    try {
      const response = await axios.post(
        "http://localhost:3333/api/cart/add",
        { items },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
      console.log("Using Locally Stored Token");
      const storedTokenObject = JSON.parse(storedTokenString);
      setStoredToken(storedTokenObject.access_token);
    }
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
            onClick={() => ingestRecipe(recipeUrl)}
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
