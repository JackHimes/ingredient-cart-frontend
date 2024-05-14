"use client";

import Navbar from "../components/common/Navigation.tsx";
import Image from "next/image";
import { Tabs, Tab } from "@nextui-org/tabs";

import * as dotenv from "dotenv";
import RecipeCard from "../components/common/RecipeCard.tsx";
import { Divider } from "@nextui-org/react";

dotenv.config();

export default function Page() {
  return (
    <div className="bg-off-white min-h-screen flex flex-col text-green-text">
      <Navbar />
      <div className="relative w-full- h-64 overflow-hidden">
        <Image
          src="/recipes-page.jpg"
          layout="fill"
          objectFit="cover"
          objectPosition="center 20%"
          quality={100}
          alt="Recipe"
        />
      </div>
      <div className="p-8 m-2">
        <h1 className="text-5xl">Recipes</h1>
        <p className="my-4">
          Search through our list of recipes for quick and easy meals. Don't see
          your favorite recipe? add them here!
        </p>
        <Tabs variant="underlined" classNames={{ tab: "text-dark-green "}}>
          <Tab title="Popular Recipes" >
            <div>
              <Divider className="bg-dark-green my-4"></Divider>
              <h2 className="text-3xl mb-3">Popular</h2>
              <div className="flex flex-wrap -m-2">
                <RecipeCard />
                <RecipeCard />
                <RecipeCard />
                <RecipeCard />
                <RecipeCard />
                <RecipeCard />
              </div>
            </div>
          </Tab>
          <Tab title="Your Recipes">
            <div className="flex text-xl">
              <p>Favorites</p>
              <p className="px-4">Recents</p>
            </div>
            <Divider className="bg-dark-green my-4"></Divider>
            <div>
              <div>
                <h1 className="text-3xl">Favorite Recipes</h1>
                <RecipeCard />
              </div>
              <div className="text-3xl">
                <h1>Recent Recipes</h1>
              </div>
            </div>
          </Tab>
          <Tab title="Pantry Suggestions"></Tab>
        </Tabs>
      </div>
    </div>
  );
}
