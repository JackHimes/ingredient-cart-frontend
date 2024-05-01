"use client";

import { Button } from "@nextui-org/react";
import {Input} from "@nextui-org/react";
import Image from "next/image";
import IngredientCartLogo from "./IngredientCartLogo";

export default function Footer() {
  return (
    <div className="bg-light-green w-full mb-0">
      <div className="bg-dark-green w-full mt-0 flex flex-col items-center justify-center">
        <IngredientCartLogo />
        <h1 className="text-off-white text-center mb-10 md:mt-0 md:ml-4">
          Ingredient Cart - Instant Groceries
        </h1>
      </div>
      <div className="flex justify-between mx-36 content-center">
        <div className="flex flex-col items-center">
          <h2 className="text-dark-green text-center my-16">About Ingredient Cart</h2>
          <a href="https://github.com/JackHimes/ingredient-cart-frontend" target="_blank"><p className="text-dark-green">Github - Front End</p></a>
          <a href="https://github.com/JackHimes/ingredient-cart" target="_blank"><p className="text-dark-green">Github - Back End</p></a>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-dark-green text-center my-16">
            Ready to get started? Sign up now!
          </h2>
          <Input
            placeholder="Enter your email here *"
            variant="underlined"
            type="email"
            labelPlacement="outside"
            classNames={{
                label: "pl-10 text-green-500", 
                input: [
                  "text-green-100",
                  "placeholder:text-dark-green pl-16",
                ],
              }}
            />
          <Button
            variant="bordered"
            radius="none"
            size="lg"
            className="mt-20 mb-24 w-72 border-dark-green bg-peach font-sans"
          >
            Sign Up
          </Button>
        </div>
        <div>
          <h2 className="text-dark-green text-center my-16">Contact</h2>
          <p className="text-dark-green">Mail: info@IngredientCart.com</p>
          <Button className="bg-transparent">
            <Image src="/facebook-logo.png" alt="Facebook Icon" width={24} height={24} />
          </Button>
          <Button className="bg-transparent">
            <Image src="/instagram-logo.png" alt="Instagram Icon" width={24} height={24} />
          </Button>
          <Button className="bg-transparent">
            <Image src="/x-logo.png" alt="X Icon" width={24} height={24} />
          </Button>
        </div>
      </div>
    </div>
  );
}
