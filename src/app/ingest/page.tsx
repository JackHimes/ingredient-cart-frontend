"use client";

import { Button, Card, CardBody, Input } from "@nextui-org/react";
import Navbar from "../components/common/Navigation";
import axios from "axios";
import * as dotenv from "dotenv";
import { ChangeEvent, useEffect, useState } from "react";

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

  const [krogerFoodUpcs, setKrogerFoodUpcs] = useState<Item[][]>([]);
  const [recipeUrl, setRecipeUrl] = useState<string>("");
  const [storedToken, setStoredToken] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<
    { upc: string; quantity: number }[]
  >([]);
  useEffect(() => {
    const storedTokenString = localStorage.getItem("customer_access_token");
    if (storedTokenString) {
      const storedTokenObject = JSON.parse(storedTokenString);
      setStoredToken(storedTokenObject.access_token);
    } else {
      setStoredToken("");
    }

    console.log(selectedItems);
  }, [selectedItems]);

  const ingestRecipe = async (scriptName: string) => {
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
    <div className="bg-light-green text-amber-50">
      <Navbar />
      <div className="flex flex-col items-center overflow-auto">
        <Card className="w-1/2 mt-16">
          <CardBody className="flex items-center justify-center">
            <Input
              value={recipeUrl}
              onChange={handleInputChange}
              isInvalid={false}
              label="Recipe URL"
              variant="bordered"
              defaultValue="https://your-recipe-url-here.com"
              className="max-w-xs"
            />
            <Button onClick={() => ingestRecipe("scrape_recipe")}>
              Extract Ingredients!
            </Button>
          </CardBody>
        </Card>
        {krogerFoodUpcs.map((upcs, arrayIndex) => (
          <Card key={arrayIndex} className="flex flex-col mr-4 mb-4">
            <h3 className="text-center font-bold mb-4">{upcs[0].item}</h3>
            <CardBody className="flex items-center justify-start flex-row pt-4 overflow-auto">
              {upcs.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center mb-4 mr-4"
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
                  <div className="text-center">
                    <p className="mb-2">{item.description}</p>
                    <p className="mb-2">{item.size}</p>
                    {selectedItems.some((i) => i.upc === item.upc) && (
                      <>
                        <Button
                          color="primary"
                          variant="ghost"
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
                          color="primary"
                          variant="ghost"
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
                  color="danger"
                  variant="bordered"
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
        <Button
          onClick={() => {
            setSelectedItems([]);
          }}
        >
          Clear Selected Items
        </Button>
      </div>
    </div>
  );
}
