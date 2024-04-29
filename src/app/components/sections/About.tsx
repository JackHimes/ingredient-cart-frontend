"use client";
import Image from "next/image";

export default function About() {
  return (
    <div className="bg-off-white py-12">
      <div className="mx-36 flex justify-between">
        <h1 className="w-80 text-dark-green text-4xl font-sans">
          Save Time and Money When Cooking
        </h1>
        <p className="w-96 text-dark-green font-sans">
          Ingredient Cart is your gateway to a virtual culinary experience. With
          just a click, you can explore an array of recipes and ingredients
          without leaving your home. It's an easy and convenient way to discover
          new flavors and create delightful meals.
        </p>
      </div>
      <div className="mx-36 flex justify-between">
        <Image
          className="mt-44"
          src="/about-section-cooking.jpg"
          alt="Cooking"
          width={416}
          height={515}
        />
        <Image
          className="mt-64"
          src="/about-section-bagged-food.jpg"
          alt="Bagged Food"
          width={335}
          height={400}
          style={{ width: "335px", height: "400px" }}
        />
      </div>
      <div className="mx-36 pt-44 flex justify-between">
        <div className="flex flex-col items-center">
          <Image
            src="/recipe.png"
            alt="Vegatable Icon"
            width={130}
            height={122}
          />
          <h2 className="text-green-text text-center">
            Easily Save and Organize Favorite Recipes
          </h2>
          <p className="text-green-text text-center">
            Keep your culinary inspirations organized and accessible with
            Ingredient Cart's recipe saving feature. By importing recipes
            directly through their URLs, you can create a personalized cookbook
            within the app. Favorite, categorize, and retrieve your best recipes
            anytime, making meal planning a breeze and ensuring you're never
            short of cooking ideas.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Image
            src="/vegetables.png"
            alt="Vegatable Icon"
            width={130}
            height={122}
          />
          <h2 className="text-green-text text-center">
            Selecting the Best Ingredients for Your Needs
          </h2>
          <p className="text-green-text text-center">
            Navigate a curated selection of ingredients that align perfectly
            with your dietary preferences and cooking style. Our app simplifies
            your shopping by extracting ingredient lists from any recipe URL you
            provide, allowing you to customize your selections. Whether you're
            looking for organic produce, budget-friendly options, or specialty
            items, Ingredient Cart ensures you get exactly what you need for
            your meals.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Image
            src="/box-car.png"
            alt="Vegatable Icon"
            width={130}
            height={122}
          />
          <h2 className="text-green-text text-center">
            Streamlined Grocery Pickup and Delivery Options
          </h2>
          <p className="text-green-text text-center">
            Turn your recipe ingredients into a ready-to-pick-up grocery order
            at local stores like Kroger, Walmart, and Whole Foods, or opt for
            the convenience of home delivery. Ingredient Cart bridges the gap
            between recipe planning and meal preparation by facilitating a
            seamless transition from digital cart to physical groceries,
            tailored to fit your schedule.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Image
            src="/cooking.png"
            alt="Vegatable Icon"
            width={130}
            height={122}
          />
          <h2 className="text-green-text text-center">
            Cooking Healthy, Delicious Meals Made Easy
          </h2>
          <p className="text-green-text text-center">
            Empower your home cooking with ingredients that promote health and
            taste. Whether you're cooking for yourself or your family,
            Ingredient Cart makes it simple to follow through on your meal
            plans. From sourcing the freshest ingredients to delivering them at
            your doorstep, our app supports you every step of the way, ensuring
            that your kitchen is always ready for a healthy feast.
          </p>
        </div>
      </div>
    </div>
  );
}
