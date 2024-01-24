"use client";


import { Button } from "@nextui-org/button";
import Navbar from "../components/Navigation";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

export default function Page() {

  let storedToken: string;
  const storedTokenString = localStorage?.getItem("customer_access_token")
  
  if (storedTokenString !== null) {

    // TODO: CHECK DATABASE FOR ACCESS TOKEN
    let storedTokenObject = JSON.parse(storedTokenString);
    storedToken = storedTokenObject.access_token
    
  } else {
    console.log("TOKEN REFRESH NEEDED YO");
    
  }
  

  const addItemsToCart = async (): Promise<any> => {
    try {
      const response = await axios.put(
        "https://api.kroger.com/v1/cart/add",
        {
          item: [
            {
              upc: "0001200016268",
              quantity: 2,
              modality: "PICKUP"
            }
          ]
        },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vYXBpLmtyb2dlci5jb20vdjEvLndlbGwta25vd24vandrcy5qc29uIiwia2lkIjoiWjRGZDNtc2tJSDg4aXJ0N0xCNWM2Zz09IiwidHlwIjoiSldUIn0.eyJhdWQiOiJpbmdyZWRpZW50Y2FydC02MTc1NGI3YmRhMGJlZTE3NGRlNWVjN2M0NmU1MzUxYzY5Njk0Njg2MDAwNzMyNjM5MDAiLCJleHAiOjE3MDYxMzAwNTEsImlhdCI6MTcwNjEyODI0NiwiaXNzIjoiYXBpLmtyb2dlci5jb20iLCJzdWIiOiJjNmEyZGRjMi1jMTIyLTU5ZDItYWNjZi0zZDYxMDYyMWVkYWIiLCJzY29wZSI6InByb2ZpbGUuY29tcGFjdCBjYXJ0LmJhc2ljOndyaXRlIHByb2R1Y3QuY29tcGFjdCIsImF1dGhBdCI6MTcwNjEyODI1MTQ4NzMyNzA1MCwicGZjeCI6InVybjprcm9nZXJjbzpwcm9maWxlOnNob3BwZXI6NmIwNTk5ODItMTFlOS1kZGU0LWQ1MzctYjkyYTg4ODY2ZmYxIiwiYXpwIjoiaW5ncmVkaWVudGNhcnQtNjE3NTRiN2JkYTBiZWUxNzRkZTVlYzdjNDZlNTM1MWM2OTY5NDY4NjAwMDczMjYzOTAwIn0.Oh-3WDpq0XPOmqkic5Fncv_n3z-U54PxWza-EflGry7QczCZjl1hmcbnm1KZskTHFB_3ycNkXBIxswxojRT9suJc0KSQd7sgV5TXOdB2QoekSVIvXOTtHGLB36NdHs3SMyd0QZWEhUEEHqhJsS5Q-UT-XnArkDrxnpmhjjPyfGPPO0HBWM4LCxQQ3wpBBj6sz-yEkbpcw2aTliZ1ujJJZFqWB0zv2gUjxqf5mYrB_b-AzGIQ2T8wwLwvznjBaRDlnVVPbkIaBvcAeIQmLOwgpOWsP96dFWGSUt3hEJZtePdj3rEIhGdEDPXdD496fDCsHFylNcpJtxjHVsQNvLj4Ew`
          }
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
    </div>  );
}
