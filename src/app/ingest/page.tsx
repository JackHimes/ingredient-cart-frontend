"use client";

import { Button, Card, CardBody, Input } from "@nextui-org/react";
import Navbar from "../components/Navigation";
import axios from "axios";
import * as dotenv from "dotenv";
import { ChangeEvent, useEffect, useState } from "react";

dotenv.config();

export default function Page() {
  let scrappedFoods: string[] = [];
	let krogerFoodUpcs: string [] = [];
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
        searchItems(scrappedFoods);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error here
      });
  };

  const searchItems = async (items: string[]): Promise<any> => {
    try {
      for (const item of items) {
        const url = `https://api.kroger.com/v1/products?filter.term=${encodeURIComponent(item)}`;

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

        // Handle response data for each item
				if (response.data.data[0]){
					krogerFoodUpcs.push(response.data.data[0].upc)
				} else{
					// TODO: HANDLE CASE WHEN NO ITEMS ARE FOUND IN SEARCH
					console.log("NO ITEM FOUND");
					
				}
      }
			console.log(krogerFoodUpcs);
			
    } catch (error) {
      // Handle error
      console.error("Error:", error);
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
      </div>
    </div>
  );
}
