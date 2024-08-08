"use client";
import Image from "next/image";

export default function About() {
  return (
    <div className="bg-off-white py-12 px-4 md:px-36">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex flex-col mb-8 md:mb-0">
          <h1 className="w-full md:w-80 text-dark-green text-4xl font-sans mb-4 md:mb-0">
            Save Time and Money When Cooking
          </h1>
          <Image
            className="mt-8 md:mt-44"
            src="/about-section-cooking.jpg"
            alt="Cooking"
            width={416}
            height={515}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div className="flex flex-col">
          <p className="w-full md:w-96 text-dark-green font-thin mb-4 md:mb-0">
            {`            Ingredient Cart is your gateway to a virtual culinary experience.
            With just a click, you can explore an array of recipes and
            ingredients without leaving your home. It's an easy and convenient
            way to discover new flavors and create delightful meals.`}
          </p>
          <Image
            className="mt-8 md:mt-56"
            src="/about-section-bagged-food.jpg"
            alt="Bagged Food"
            width={335}
            height={400}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>
      <div className="pt-12 md:pt-44 flex flex-col md:flex-row justify-between">
        <div className="flex flex-col items-center w-full md:w-48 mb-8 md:mb-0 px-2">
          <Image
            src="/recipe.png"
            alt="Vegatable Icon"
            width={130}
            height={122}
          />
          <h2 className="text-green-text text-center py-10 font-semibold">
            Save Favorite Recipes
          </h2>
          <p className="text-green-text text-center font-thin">
            Create your digital cookbook by saving recipes from any site. Access
            and organize your favorites for easy meal planning.
          </p>
        </div>
        <div className="flex flex-col items-center w-full md:w-48 mb-8 md:mb-0 px-2">
          <Image
            src="/vegetables.png"
            alt="Vegatable Icon"
            width={130}
            height={122}
          />
          <h2 className="text-green-text text-center py-10 font-semibold">
            Pick the Best Ingredients
          </h2>
          <p className="text-green-text text-center font-thin">
            Customize your grocery list by selecting ingredients directly from
            your favorite recipes. Shop smart with options that match your
            dietary needs and budget.
          </p>
        </div>
        <div className="flex flex-col items-center w-full md:w-48 mb-8 md:mb-0 px-2">
          <Image
            src="/box-car.png"
            alt="Vegatable Icon"
            width={130}
            height={122}
          />
          <h2 className="text-green-text text-center py-10 font-semibold">
            Easy Grocery Pickup or Delivery
          </h2>
          <p className="text-green-text text-center font-thin">
            Convert your selected ingredients into an order at local stores like
            Kroger, Walmart, and Whole Foods, choosing pickup or delivery to
            suit your schedule.
          </p>
        </div>
        <div className="flex flex-col items-center w-full md:w-48 px-2">
          <Image
            src="/cooking.png"
            alt="Vegatable Icon"
            width={130}
            height={122}
          />
          <h2 className="text-green-text text-center py-10 font-semibold">
            Cook Healthy Meals Easily
          </h2>
          <p className="text-green-text text-center font-thin">
            Bring healthy, delicious meals to the table with ease. Our app helps
            you from planning to plate, ensuring fresh ingredients and happy
            dining.
          </p>
        </div>
      </div>
    </div>
  );
}