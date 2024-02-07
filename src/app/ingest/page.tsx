"use client";

import { Button, Card, CardBody, Input } from "@nextui-org/react";
import Navbar from "../components/Navigation";
import axios from "axios";
import * as dotenv from "dotenv";
import { ChangeEvent, useEffect, useState } from "react";

dotenv.config();

export default function Page() {
  let scrappedFoods: string[] = [];
  const [krogerFoodUpcs, setKrogerFoodUpcs] = useState<
    { item: string; upc: string }[]
  >([]);
  const [recipeUrl, setRecipeUrl] = useState<string>("");
  const [storedToken, setStoredToken] = useState<string>("");

  useEffect(() => {
    const storedTokenString = localStorage.getItem("customer_access_token");
    if (storedTokenString) {
      const storedTokenObject = JSON.parse(storedTokenString);
      setStoredToken(storedTokenObject.access_token);
    } else {
      setStoredToken("");
    }
  }, []);

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
    try {
      for (const item of items) {
        // Kroger only lets 8 terms per search
        let processedItem = item;
        if (item.split(" ").length > 8) {
          console.log("Item is longer than 8 words:", item);
          processedItem = item.split(" ").slice(0, 8).join(" ");
        }

        const url = `https://api.kroger.com/v1/products?filter.term=${encodeURIComponent(
          processedItem
        )}`;

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

        if (response.data.data[0]) {
          setKrogerFoodUpcs((prevState) => [
            ...prevState,
            {
              item: processedItem,
              upc: response.data.data[0].upc,
            },
          ]);
        } else {
          // TODO: HANDLE CASE WHEN NO ITEMS ARE FOUND IN SEARCH
          console.log("NO ITEM FOUND:" + item);
        }
      }
      console.log(krogerFoodUpcs);
    } catch (error) {
      console.error("Error searching items:", error);
    }
  };

  const addToCart = async (items: { upc: string }[]) => {
    const payloadItems = items.map((item) => ({
      upc: item.upc,
      quantity: 1,
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
    <div className="bg-green-200 text-amber-50">
      <Navbar />
      <div className="h-screen flex justify-center">
        <Card className="w-1/2 h-1/2 mt-16">
          <CardBody className="flex items-center justify-center">
            <Input
              value={recipeUrl}
              onChange={handleInputChange}
              isInvalid={false}
              label="Recipe URL"
              variant="bordered"
              defaultValue="https://your-recipe-url-here.com"
              errorMessage="Please enter a valid recipe"
              className="max-w-xs"
            />
            <Button onClick={() => ingestRecipe("scrape_recipe")}>
              Extract Ingredients!
            </Button>
          </CardBody>
        </Card>
        {krogerFoodUpcs.length > 0 && (
          <Card className="w-1/2 mt-16">
            <CardBody className="flex items-center justify-center flex-col pt-4">
              {krogerFoodUpcs.map((item, index) => (
                <div key={index} className="flex justify-between w-full mb-2">
                  <p>{item.item}</p>
                  <Button
                    color="danger"
                    variant="bordered"
                    size="sm"
                    onClick={() => {
                      setKrogerFoodUpcs((prevState) =>
                        prevState.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    x
                  </Button>
                </div>
              ))}
              <Button onClick={() => addToCart(krogerFoodUpcs)}>
                Add to Cart
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
