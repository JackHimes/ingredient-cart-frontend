"use client";
import Image from "next/image";

export default function About() {
  return (
    <div className="bg-off-white py-12">
      <div className="mx-36 flex justify-between">
        <div className="flex flex-col">
          <h1 className="w-80 text-dark-green text-4xl font-sans">
            Save Time and Money When Cooking
          </h1>
          <Image
            className="mt-44"
            src="/about-section-cooking.jpg"
            alt="Cooking"
            width={416}
            height={515}
          />
        </div>
        <div className="flex flex-col">
          <p className="w-96 text-dark-green font-sans">
{`            Ingredient Cart is your gateway to a virtual culinary experience.
            With just a click, you can explore an array of recipes and
            ingredients without leaving your home. It's an easy and convenient
            way to discover new flavors and create delightful meals.`}
          </p>
          <Image
            className="mt-56"
            src="/about-section-bagged-food.jpg"
            alt="Bagged Food"
            width={335}
            height={400}
            style={{ width: "335px", height: "400px" }}
          />
        </div>
      </div>
      <div className="mx-36 pt-44 flex justify-between">
        <div className="flex flex-col items-center w-48">
          <Image
            src="/recipe.png"
            alt="Vegatable Icon"
            width={130}
            height={122}
          />
          <h2 className="text-green-text text-center py-10">Save Favorite Recipes</h2>
          <p className="text-green-text text-center">
            Create your digital cookbook by saving recipes from any site. Access
            and organize your favorites for easy meal planning.
          </p>
        </div>
        <div className="flex flex-col items-center w-48">
          <Image
            src="/vegetables.png"
            alt="Vegatable Icon"
            width={130}
            height={122}
          />
          <h2 className="text-green-text text-center py-10">
            Pick the Best Ingredients
          </h2>
          <p className="text-green-text text-center">
            Customize your grocery list by selecting ingredients directly from
            your favorite recipes. Shop smart with options that match your
            dietary needs and budget.
          </p>
        </div>
        <div className="flex flex-col items-center w-48">
          <Image
            src="/box-car.png"
            alt="Vegatable Icon"
            width={130}
            height={122}
          />
          <h2 className="text-green-text text-center py-10">
            Easy Grocery Pickup or Delivery
          </h2>
          <p className="text-green-text text-center">
            Convert your selected ingredients into an order at local stores like
            Kroger, Walmart, and Whole Foods, choosing pickup or delivery to
            suit your schedule.
          </p>
        </div>
        <div className="flex flex-col items-center w-48">
          <Image
            src="/cooking.png"
            alt="Vegatable Icon"
            width={130}
            height={122}
          />
          <h2 className="text-green-text text-center py-10">
            Cook Healthy Meals Easily
          </h2>
          <p className="text-green-text text-center">
            Bring healthy, delicious meals to the table with ease. Our app helps
            you from planning to plate, ensuring fresh ingredients and happy
            dining.
          </p>
        </div>
      </div>
    </div>
  );
}
