"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/common/Navigation.tsx";
import Image from "next/image";
import { Tabs, Tab } from "@nextui-org/tabs";
import * as dotenv from "dotenv";
import RecipeCard from "../components/common/RecipeCard.tsx";
import { Button, Divider } from "@nextui-org/react";
import axios from "axios";
import { Recipe } from "../types/Recipe.tsx";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

dotenv.config();

const fetchPopularRecipes = async (): Promise<Recipe[]> => {
  try {
    const response = await axios.get(`http://localhost:3333/recipes/popular`);
    return response.data;
  } catch (error) {
    console.error("Error fetching popular recipes:", error);
    return [];
  }
};

const fetchFavoriteRecipes = async (userEmail: string): Promise<Recipe[]> => {
  try {
    const response = await axios.get(
      `http://localhost:3333/users/${encodeURIComponent(userEmail)}/favorites`
    );
    const favoriteIds = response.data;
    const recipesPromises = favoriteIds.map((id: string) =>
      axios.get(`http://localhost:3333/recipes/${id}`)
    );
    const recipesResponses = await Promise.all(recipesPromises);
    return recipesResponses.map((response) => response.data);
  } catch (error) {
    console.error("Error fetching favorite recipes:", error);
    return [];
  }
};

const fetchRecentRecipes = async (userEmail: string): Promise<Recipe[]> => {
  try {
    const response = await axios.get(
      `http://localhost:3333/users/${encodeURIComponent(userEmail)}/recent`
    );
    const recentRecipes = response.data;
    const recipesPromises = recentRecipes.map((recent: { recipeId: string }) =>
      axios.get(`http://localhost:3333/recipes/${recent.recipeId}`)
    );
    const recipesResponses = await Promise.all(recipesPromises);
    return recipesResponses.map((response) => response.data);
  } catch (error) {
    console.error("Error fetching recent recipes:", error);
    return [];
  }
};

export default function Page() {
  const [popularRecipes, setPopularRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    const getPopularRecipes = async () => {
      const recipes = await fetchPopularRecipes();
      console.log(recipes);

      setPopularRecipes(recipes);
    };

    getPopularRecipes();
  }, []);

  useEffect(() => {
    const getFavoriteRecipes = async () => {
      if (isLoaded && user) {
        const userEmail = user.primaryEmailAddress?.emailAddress;
        if (userEmail) {
          const recipes = await fetchFavoriteRecipes(userEmail);
          setFavoriteRecipes(recipes);

          const recents = await fetchRecentRecipes(userEmail);
          setRecentRecipes(recents);
        }
      }
    };

    getFavoriteRecipes();
  }, [isLoaded, user]);

  const handleAddNewRecipe = () => {
    router.push("/recipes/new");
  };

  return (
    <div className="bg-off-white min-h-screen flex flex-col text-green-text">
      <Navbar />
      <div className="relative w-full h-64 overflow-hidden">
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
        <Button
          onClick={handleAddNewRecipe}
          className="bg-peach border border-dark-green font-thin"
          radius="none"
        >
          Add New Recipe
        </Button>

        <p className="my-4">
          Search through our list of recipes for quick and easy meals.
          Don&apos;t see your favorite recipe? Add them here!
        </p>
        <Tabs variant="underlined" classNames={{ tab: "text-dark-green " }}>
          <Tab title="Popular Recipes">
            <div>
              <Divider className="bg-dark-green my-4"></Divider>
              <h2 className="text-3xl mb-3">Popular</h2>
              <div className="flex flex-wrap -m-2">
                {popularRecipes.map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
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
                <h1 className="text-3xl mb-3">Favorite Recipes</h1>
                <div className="flex flex-wrap -m-2">
                  {favoriteRecipes.map((recipe) => (
                    <RecipeCard key={recipe._id} recipe={recipe} />
                  ))}
                </div>
                {favoriteRecipes.length === 0 && (
                  <p>You haven't added any favorite recipes yet.</p>
                )}
              </div>
              <div className="mt-8">
                <h1 className="text-3xl mb-3">Recent Recipes</h1>
                <div className="flex flex-wrap -m-2">
                  {recentRecipes.map((recipe) => (
                    <RecipeCard key={recipe._id} recipe={recipe} />
                  ))}
                </div>
                {recentRecipes.length === 0 && (
                  <p>You haven't viewed any recipes recently.</p>
                )}
              </div>
            </div>
          </Tab>
          <Tab title="Pantry Suggestions"></Tab>
        </Tabs>
      </div>
    </div>
  );
}
