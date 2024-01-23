"use client";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Image,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import Navbar from "../components/Navigation";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

export default function Page() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    // Function to extract query parameters from the URL
    const getQueryParam = (name: string) => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    };

    // Check if the 'code' parameter is present in the URL
    const authorizationCode = getQueryParam("code");
    console.log(authorizationCode?.toString());

    const fetchData = async () => {
      console.log("authorizationCode");
      console.log(authorizationCode);
      console.log("REDIRECT_URI");
      console.log(process.env.NEXT_PUBLIC_KROGER_REDIRECT_URI);
      const redirectURI =
        process.env.NEXT_PUBLIC_KROGER_REDIRECT_URI?.toString();

      if (authorizationCode) {
        try {
          const response = await axios.post(
            "https://api.kroger.com/v1/connect/oauth2/token",
            `grant_type=authorization_code&code=${encodeURIComponent(
              authorizationCode
            )}&redirect_uri=${process.env.NEXT_PUBLIC_KROGER_REDIRECT_URI}`,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${process.env.NEXT_PUBLIC_KROGER_API_TOKEN}`,
              },
            }
          );

          console.log("SUCCESS, VERY NICE!");
          console.log(response.data);

          const responseDataString = JSON.stringify(response.data);

          localStorage.setItem("customer_access_token", responseDataString);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, []);

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
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

  return (
    <div className="flex flex-col h-screen bg-green-200">
      <Navbar />
      <div className="flex-1 flex">
        <div className="w-1/4 p-4">
          <Table>
            <TableHeader>
              <TableColumn>CONFIGURATIONS</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow
                onClick={() => handleItemClick("Grocery Stores")}
                className="text-slate-800"
              >
                <TableCell>Grocery Stores</TableCell>
              </TableRow>
              <TableRow
                onClick={() => handleItemClick("Locations")}
                className="text-slate-800"
              >
                <TableCell>Locations</TableCell>
              </TableRow>
              <TableRow
                onClick={() => handleItemClick("Account")}
                className="text-slate-800"
              >
                <TableCell>Account</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="w-3/4 p-4">
          {selectedItem === "Grocery Stores" && (
            <div className="bg-slate-50 rounded-lg text-slate-800 p-4">
              <div>Added Stores:</div>
              <div>
                <p>Add a store:</p>
                <Button onClick={openKrogerAuth}>
                  <Image
                    className="object-cover"
                    height={200}
                    src="https://developer.kroger.com/assets/logos/integrated-blue-text.svg"
                    width={200}
                  />
                </Button>
              </div>
            </div>
          )}
          {selectedItem === "Locations" && (
            <div className="bg-slate-50 rounded-lg text-slate-800">FOCO</div>
          )}
        </div>
      </div>
    </div>
  );
}
