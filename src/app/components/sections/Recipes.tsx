"use client";
import { Button } from "@nextui-org/react";
import {Divider} from "@nextui-org/react";
import Image from "next/image";

export default function Recipes() {
  return (
    <div className="p-10 bg-off-white">
      <div className="flex flex-col items-center">
            <Divider className="bg-dark-green max-w-2xl"/>
        <div className="py-16">
          <h1 className="text-5xl font-thin text-green-text text-center">
            Recommended Recipes
          </h1>
        </div>
        <div className="flex justify-between space-x-48">
          <div className="flex flex-col items-start p-4">
            <Image src="/pizza.jpg" alt="Recipe 2" width={287} height={200} />
            <h1 className="text-xl text-green-text font-medium my-8">
              Pizza Margherita
            </h1>
            <p className="text-green-text w-72 font-thin">
              This pizza is simple, fresh and a guaranteed crowd pleaser. Its a
              delight to make and even better to eat. How about pizza tonight?
            </p>
          </div>
          <div className="flex flex-col items-start p-4">
            <Image
              src="/tsao-chicken.jpg"
              alt="Recipe 1"
              width={287}
              height={200}
            />
            <h1 className="text-xl text-green-text font-medium my-8">
              General Tso's Chicken
            </h1>
            <p className="text-green-text w-72 font-thin">
              Looking for tangy, spicy, and savory flavors all found in one
              dish? This top-rated recipe for General Tso's chicken combines
              crispy, flash-fried chicken and a rich garlic-chile sauce that
              turns up the heat.
            </p>
          </div>
          <div className="flex flex-col items-start p-4">
            <Image src="/salad.jpg" alt="Recipe 3" width={287} height={200} />
            <h1 className="text-xl text-green-text font-medium my-8">
              Caesar Salad
            </h1>
            <p className="text-green-text w-72 font-thin">
              A great Caesar salad hits a satisfying balance between fresh and
              crisp, and creamy and cheesy. Its the perfect accompaniment to a
              main dish or even better as a meal of its own.
            </p>
          </div>
        </div>
        <Button
          variant="bordered"
          radius="none"
          size="lg"
          className="mt-14 mb-36 w-72 border-dark-green bg-peach font-thin"
        >
          Search Recipes
        </Button>
      </div>
    </div>
  );
}
