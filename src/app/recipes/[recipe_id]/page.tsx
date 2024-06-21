"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Recipe } from "../../types/Recipe";
import Navbar from "../../components/common/Navigation";
import Footer from "@/app/components/common/Footer";
import { Button, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface RecipeDetailProps {
  params: {
    recipe_id: string;
  };
}

export default function RecipeDetail({ params }: RecipeDetailProps) {
  const { recipe_id } = params;
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipeAndUpdateRecent = async () => {
      if (!recipe_id || !isLoaded || !user) return;

      const userEmail = user.primaryEmailAddress?.emailAddress;
      if (!userEmail) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch recipe details
        const recipeResponse = await axios.get(`http://localhost:3333/recipes/${recipe_id}`);
        setRecipe(recipeResponse.data);

        // Add to recent recipes
        await axios.post(`http://localhost:3333/users/${encodeURIComponent(userEmail)}/recent/${recipe_id}`);

        // Check if the recipe is a favorite
        const favoriteResponse = await axios.get(`http://localhost:3333/users/${encodeURIComponent(userEmail)}/favorites/${recipe_id}`);
        setIsFavorite(favoriteResponse.data);
      } catch (error) {
        console.error("Error fetching recipe or updating recent:", error);
        setError("Failed to load recipe or update recent views. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipeAndUpdateRecent();
  }, [recipe_id, isLoaded, user]);


  const handleIngest = () => {
    if (!recipe) return;
    router.push(`/ingest?recipeUrl=${encodeURIComponent(recipe.url)}`);
  };

  const handleToggleFavorite = async () => {
    if (!isLoaded || !user || !recipe_id) return;

    const userEmail = user.primaryEmailAddress?.emailAddress;
    if (!userEmail) return;

    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:3333/users/${encodeURIComponent(userEmail)}/favorites/${recipe_id}`);
      } else {
        await axios.post(`http://localhost:3333/users/${encodeURIComponent(userEmail)}/favorites/${recipe_id}`);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (isLoading)
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-opacity-50 bg-black">
        <Spinner
          size="lg"
          label="Loading Recipe!"
          color="success"
          classNames={{ label: "text-green-text" }}
        />
      </div>
    );

    if (!recipe) {
      return <div>Recipe not found</div>;
    } 

  return (
    <div className="bg-off-white">
      <Navbar />
      <div className="p-10">
        <h1 className="text-5xl font-thin text-green-text">{recipe.title}</h1>
        <img
          src={recipe.image}
          alt="Description"
          style={{ width: "500px", height: "300px" }}
        />{" "}
        <p className="text-lg my-4 font-thin text-green-text">{recipe.url}</p>
        {recipe.description && (
          <p className="text-lg my-4 font-thin text-green-text">{recipe.description}</p>
        )}
        <div className="my-4">
          <Button
            onClick={handleIngest}
            className="bg-peach border border-dark-green font-thin"
            radius="none"
          >
            Add to Cart!
          </Button>
          {user && (
            <Button
              onClick={handleToggleFavorite}
              className={`font-thin ${
                isFavorite
                  ? "bg-green-text text-peach"
                  : "bg-peach text-green-text"
              } border border-dark-green`}
              radius="none"
            >
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </Button>
          )}
          <h2 className="text-2xl font-medium text-green-text">Ingredients</h2>
          <ul className="text-green-text">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="my-4 text-green-text">
          <h2 className="text-2xl font-medium">Instructions</h2>
          <ol>
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
      </div>
      <Footer />
    </div>
  );
}
