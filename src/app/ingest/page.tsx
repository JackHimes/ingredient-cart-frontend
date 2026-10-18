"use client";

import {
  Button,
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
import TokenStatusIndicator from "../components/common/TokenStatusIndicator";
import StoreSelector from "../components/common/StoreSelector";
import IngredientStack, {
  ProductOption,
  SelectedItem,
} from "../components/common/IngredientStack";
import {
  getStoredStore,
  saveStore,
  KrogerStore,
} from "../services/storeService";
import recipeScraperService, {
  ScrapedRecipe,
} from "../services/recipeScraperService";

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

// Mirrors how the backend's getItemsUpcs rewrites each search term, so we can
// match the `item` it returns back to the ingredient we sent.
const toSearchTerm = (ingredient: string) =>
  ingredient.replace(/[()]/g, "").split(" ").slice(0, 8).join(" ");

const formatItemName = (item: string, amount?: string) =>
  amount ? `${item} (${amount})` : item;

export default function Ingest() {
  let scrappedFoods: string[] = [];
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

  const [krogerFoodUpcs, setKrogerFoodUpcs] = useState<ProductOption[][]>([]);
  // Recipe quantity + unit (e.g. "3 cloves"), keyed by search term
  const [recipeAmounts, setRecipeAmounts] = useState<Record<string, string>>(
    {}
  );
  const [recipeUrl, setRecipeUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [grocer, setGrocer] = useState("");
  const { user } = useUser();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [scrapedRecipe, setScrapedRecipe] = useState<ScrapedRecipe | null>(
    null
  );
  const [tokenStatus, setTokenStatus] = useState<
    "loading" | "valid" | "invalid"
  >("loading");
  const [store, setStore] = useState<KrogerStore | null>(null);

  useEffect(() => {
    setStore(getStoredStore());
  }, []);

  const handleStoreChange = (newStore: KrogerStore) => {
    saveStore(newStore);
    setStore(newStore);
  };

  useEffect(() => {
    const initializeToken = async () => {
      if (user?.emailAddresses[0].emailAddress) {
        setTokenStatus("loading");
        console.log(tokenStatus);

        try {
          const newToken = await ensureToken(
            user.emailAddresses[0].emailAddress
          );
          if (newToken) {
            setToken(newToken);
            setTokenStatus("valid");
            console.log(tokenStatus);
          } else {
            setToken("");
            setTokenStatus("invalid");
            console.log(tokenStatus);
          }
        } catch (error) {
          console.error("Error initializing token:", error);
          setToken("");
          setTokenStatus("invalid");
          console.log(tokenStatus);
        }
      }
    };

    initializeToken();
  }, [user]);

  const ingestRecipe = useCallback(
    async (url: string) => {
      if (!store) {
        setError("Select a store before extracting ingredients");
        return;
      }

      setKrogerFoodUpcs([]);
      setRecipeAmounts({});
      setSelectedItems([]);
      setIsLoading(true);
      setError(null);
  
      try {
        const processedIngredients = await recipeScraperService.scrapeIngredientsWithNER(url);
  
        if (!processedIngredients || Object.keys(processedIngredients).length === 0) {
          throw new Error("No ingredients found in the recipe");
        }
  
        console.log("Processed ingredients:", processedIngredients);
  
        const ingredientLines: string[] = [];
        const amounts: Record<string, string> = {};

        Object.values(processedIngredients).forEach((item) => {
          const ingredientData = item.Ingredient;

          if (!ingredientData) return;

          const ingredients = Array.isArray(ingredientData)
            ? ingredientData
            : [ingredientData];
          const amount = [...(item.Quantity ?? []), ...(item.Unit ?? [])]
            .join(" ")
            .trim();

          ingredients.forEach((ingredient) => {
            ingredientLines.push(ingredient);
            if (amount) amounts[toSearchTerm(ingredient)] = amount;
          });
        });

        console.log("Extracted ingredient lines:", ingredientLines);
        setRecipeAmounts(amounts);
  
        await waitForToken();
        const currentToken = await ensureToken(user?.emailAddresses[0].emailAddress || "");
  
        if (!currentToken) {
          throw new Error("Token not available");
        }
  
        const upcs = await getItemsUpcs(
          ingredientLines,
          store.locationId,
          currentToken
        );
        console.log(upcs);
  
        setKrogerFoodUpcs(upcs);
      } catch (error: any) {
        console.error("Error Ingesting Recipe:", error);
        setError(error.message || "An error occurred while ingesting the recipe");
      } finally {
        setIsLoading(false);
      }
    },
    [user, store]
  );

    // Automatically call ingestRecipe when the page loads and a URL is present in the query params
    useEffect(() => {
      const recipeUrlFromParams = searchParams.get("url");
      if (recipeUrlFromParams && store) {
        ingestRecipe(decodeURIComponent(recipeUrlFromParams));
      }
    }, [searchParams, store, ingestRecipe]);  

  const addToCart = async (items: SelectedItem[]) => {
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
      console.log("Response from cart add:", response.data);
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
    // tokenStatus already reflects the backend check, so anything stored locally is stale here
    if (tokenStatus === "invalid") {
      localStorage.removeItem("customer_access_token");
      await openKrogerAuth();
    }
  };

  return (
    <div className="bg-off-white min-h-screen flex flex-col text-green-text">
      <Navbar />
      <div className="flex flex-col items-center min-h-[600px] overflow-auto p-4 md:p-8">
        <div className="bg-off-white border border-border-color w-full md:w-1/2 my-12 flex flex-col items-center justify-center p-4 md:p-8">
          <Input
            value={recipeUrl}
            onChange={handleInputChange}
            isInvalid={false}
            label="Recipe URL"
            variant="underlined"
            defaultValue="https://your-recipe-url-here.com"
            classNames={{
              label: "text-center font-thin w-full",
              innerWrapper: "w-full text-center items-center",
              inputWrapper: "text-center items-center w-full",
              input: "text-center items-center w-full",
              base: "w-full",
            }}
          />
          <Button
            className="my-8 bg-peach border border-dark-green font-thin w-full md:w-auto"
            radius="none"
            onClick={() => ingestRecipe(recipeUrl)}
            disabled={tokenStatus !== "valid" || !store}
          >
            Extract Ingredients!
          </Button>
          <div className="flex flex-col md:flex-row items-center w-full justify-center space-x-2">
            <Select
              placeholder="Grocer"
              radius="none"
              className="my-2 w-full md:w-48"
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
              className="mx-0 md:mx-4 my-2 md:my-0 bg-peach border border-dark-green font-thin w-full md:w-auto"
              radius="none"
              onClick={() => handleButtonClick()}
              disabled={tokenStatus === "loading"}
            >
              {tokenStatus === "invalid" ? "Authenticate" : "Select Grocer"}
            </Button>
            <TokenStatusIndicator status={tokenStatus} />
          </div>
          <StoreSelector
            token={token}
            isTokenValid={tokenStatus === "valid"}
            store={store}
            onStoreChange={handleStoreChange}
          />
        </div>
        {isLoading && (
          <div className="top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <Spinner
              size="lg"
              label="Gathering Ingredients!"
              color="success"
              classNames={{ label: "text-green-text" }}
            />
          </div>
        )}
        {krogerFoodUpcs.length > 0 && (
          <IngredientStack
            groups={krogerFoodUpcs}
            getTitle={(group) =>
              formatItemName(group[0].item, recipeAmounts[group[0].item])
            }
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        )}
        {krogerFoodUpcs.length > 0 && (
          <Button
            className="my-8 bg-peach border border-dark-green font-thin w-full md:w-auto"
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
            className="my-8 bg-peach border border-dark-green font-thin w-full md:w-auto"
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
