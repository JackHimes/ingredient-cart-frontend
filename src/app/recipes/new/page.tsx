"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Input, Textarea, Button, Spinner } from "@nextui-org/react";
import Navbar from "../../components/common/Navigation";
import Footer from "../../components/common/Footer";

export default function NewRecipe() {
  const { user } = useUser();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to add a recipe.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:3333/recipes", {
        title,
        ingredients: ingredients
          .split("\n")
          .map((i) => i.trim())
          .filter((i) => i !== ""),
        instructions: instructions
          .split("\n")
          .map((i) => i.trim())
          .filter((i) => i !== ""),
        url,
        image,
        createdBy: user.id,
      });

      router.push(`/recipes/${response.data._id}`);
    } catch (error) {
      console.error("Error adding new recipe:", error);
      setError("Failed to add new recipe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-off-white min-h-screen flex flex-col text-green-text">
      <Navbar />
      <div className="flex-grow p-8">
        <h1 className="text-4xl mb-6">Add New Recipe</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a brief description of your recipe (optional)"
          />

          <Textarea
            label="Ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Enter each ingredient on a new line"
            required
          />
          <Textarea
            label="Instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Enter each step on a new line"
            required
          />
          <Input
            label="Recipe URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/recipe"
          />
          <Input
            label="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/recipe-image.jpg"
          />
          {error && <p className="text-red-500">{error}</p>}
          <Button
            type="submit"
            className="bg-peach border border-dark-green font-thin"
            radius="none"
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="sm" /> : "Add Recipe"}
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
