"use client";

import { Button } from "@nextui-org/button";
import Navbar from "../components/Navigation";
import axios from "axios";
import * as dotenv from "dotenv";
import { useEffect } from "react";

dotenv.config();

export default function Page() {
  let storedToken: string;

  useEffect(() => {
    const storedTokenString = localStorage.getItem("customer_access_token");
    if (storedTokenString) {
      const storedTokenObject = JSON.parse(storedTokenString);
      storedToken = storedTokenObject.access_token;
    } else {
      storedToken = "";
    }
  }, []);

  // TODO: MAKE ADDING TO CART PAYLOAD FOR 1 to MANY ITEMS
  const addItemsToCart = async (): Promise<any> => {
    try {
      const response = await axios.put(
        "https://api.kroger.com/v1/cart/add",
        {
          items: [
            {
              upc: "0001200016268",
              quantity: 2,
              modality: "PICKUP",
            },
          ],
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      console.log(response.data);
    } catch (error: any) {
      // Handle errors
      console.error("Error adding to cart: ", error.message);
    }
  };

  return (
    <div className="bg-green-200 text-amber-50">
      <Navbar />
      <div className="h-screen">
        <div>
          <Button onClick={addItemsToCart}></Button>
        </div>
      </div>
    </div>
  );
}
