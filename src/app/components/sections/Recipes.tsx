"use client";
import { Button } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

export default function Recipes() {
  return (
    <div className="p-4 md:p-10 bg-off-white">
      <div className="flex flex-col items-center">
        <Divider className="bg-dark-green max-w-2xl w-full" />
        <div className="py-8 md:py-16">
          <h1 className="text-3xl md:text-5xl font-thin text-green-text text-center">
            Recommended Recipes
          </h1>
        </div>
        <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-8">
          <div className="flex flex-col items-start p-4 w-full md:w-auto">
            <Image
              src="/pizza.jpg"
              alt="Recipe 2"
              width={250} // Adjusted width
              height={175} // Adjusted height
              className="w-full h-auto"
            />
            <h1 className="text-xl text-green-text font-medium my-4 md:my-8">
              Pizza Margherita
            </h1>
            <p className="text-green-text w-full font-thin">
              This pizza is simple, fresh and a guaranteed crowd pleaser.
              It&apos;s a delight to make and even better to eat. How about
              pizza tonight?
            </p>
          </div>
          <div className="flex flex-col items-start p-4 w-full md:w-auto">
            <Image
              src="/tsao-chicken.jpg"
              alt="Recipe 1"
              width={250} // Adjusted width
              height={175} // Adjusted height
              className="w-full h-auto"
            />
            <h1 className="text-xl text-green-text font-medium my-4 md:my-8">
              General Tso&apos;s Chicken
            </h1>
            <p className="text-green-text w-full font-thin">
              Looking for tangy, spicy, and savory flavors all found in one
              dish? This top-rated recipe for General Tso&apos;s chicken
              combines crispy, flash-fried chicken and a rich garlic-chile sauce
              that turns up the heat.
            </p>
          </div>
          <div className="flex flex-col items-start p-4 w-full md:w-auto">
            <Image
              src="/salad.jpg"
              alt="Recipe 3"
              width={250} // Adjusted width
              height={175} // Adjusted height
              className="w-full h-auto"
            />
            <h1 className="text-xl text-green-text font-medium my-4 md:my-8">
              Caesar Salad
            </h1>
            <p className="text-green-text w-full font-thin">
              A great Caesar salad hits a satisfying balance between fresh and
              crisp, and creamy and cheesy. It&apos;s the perfect accompaniment
              to a main dish or even better as a meal of its own.
            </p>
          </div>
        </div>
        <Link href="/recipes">
          <Button
            variant="bordered"
            radius="none"
            size="lg"
            className="mt-8 md:mt-14 mb-12 md:mb-36 w-full md:w-72 border-dark-green bg-peach font-thin"
          >
            Search Recipes
          </Button>
        </Link>
      </div>
    </div>
  );
}
