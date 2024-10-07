"use client";

import { Button } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import Image from "next/image";
import IngredientCartLogo from "./IngredientCartLogo";

export default function Footer() {
  return (
    <div className="bg-light-green w-full mb-0 border-b-8 border-peach">
      <div className="bg-dark-green w-full mt-0 flex flex-col items-center justify-center">
        <div className="bg-peach my-2">
          <IngredientCartLogo />
        </div>
        <h1 className="text-off-white text-4xl font-thin text-center mb-10 md:mt-0 md:ml-4">
          Ingredient Cart - Click, Eat
        </h1>
      </div>
      <div className="flex flex-col md:flex-row justify-between content-center">
        <div className="basis-1/3 flex flex-col justify-start items-center mb-8">
          <h2 className="text-dark-green text-center font-lg font-medium my-16">
            About Ingredient Cart
          </h2>
          <a
            href="https://github.com/JackHimes/ingredient-cart-frontend"
            target="_blank"
          >
            <p className="text-dark-green font-thin">Github - Front End</p>
          </a>
          <a
            href="https://github.com/JackHimes/ingredient-cart"
            target="_blank"
          >
            <p className="text-dark-green font-thin">Github - Back End</p>
          </a>
        </div>
        <div className="basis-1/3 flex flex-col justify-center items-center mb-8">
          <h2 className="text-dark-green text-center font-lg font-medium my-16">
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
                "placeholder:text-dark-green text-center font-thin",
              ],
            }}
          />
          <Button
            variant="bordered"
            radius="none"
            size="lg"
            className="mt-20 mb-24 w-72 border-dark-green bg-peach font-thin"
          >
            Sign Up
          </Button>
        </div>
        <div className="basis-1/3 flex flex-col items-center mb-8">
          <h2 className="text-dark-green text-center font-lg font-medium my-16">Contact</h2>
          <p className="text-dark-green font-thin">Mail: info@IngredientCart.com</p>
          <div className="flex mt-4">
            <Button className="bg-transparent">
              <Image
                src="/facebook-logo.webp"
                alt="Facebook Icon"
                width={24}
                height={24}
              />
            </Button>
            <Button className="bg-transparent">
              <Image
                src="/instagram-logo.webp"
                alt="Instagram Icon"
                width={24}
                height={24}
              />
            </Button>
            <Button className="bg-transparent">
              <Image src="/x-logo.webp" alt="X Icon" width={24} height={24} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}