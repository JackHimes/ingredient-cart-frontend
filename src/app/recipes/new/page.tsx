"use client";

import React, { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from 'axios';
import { Input, Textarea, Button, Spinner, Checkbox } from "@nextui-org/react";
import Navbar from "../../components/common/Navigation";
import Footer from "../../components/common/Footer";
import recipeScraperService, { ScrapedRecipe } from '../../services/recipeScraperService';

export default function NewRecipe() {
  const { user } = useUser();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [yields, setYields] = useState('');
  const [totalTime, setTotalTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const handleScrape = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const scrapedRecipe: ScrapedRecipe = await recipeScraperService.scrapeRecipe(scrapeUrl);
      
      setTitle(scrapedRecipe.title || '');
      setIngredients(Array.isArray(scrapedRecipe.ingredients) ? scrapedRecipe.ingredients.join('\n') : '');
      setInstructions(scrapedRecipe.instructions || '');
      
      // Optional fields
      setDescription(scrapedRecipe.description || '');
      setUrl(scrapeUrl|| '');
      setImage(scrapedRecipe.image || '');
      setAuthor(scrapedRecipe.author || '');
      setCategory(scrapedRecipe.category || '');
      setCuisine(scrapedRecipe.cuisine || '');
      setYields(scrapedRecipe.yields || '');
      setTotalTime(scrapedRecipe.total_time?.toString() || '');

      setShowOptionalFields(true);
    } catch (error) {
      console.error('Error in handleScrape:', error);
      setError('Failed to scrape recipe. Please enter details manually.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to add a recipe.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const recipeData = {
        title,
        ingredients: ingredients.split('\n').map(i => i.trim()).filter(i => i !== ''),
        instructions: instructions.split('\n').map(i => i.trim()).filter(i => i !== ''),
        description: description || undefined,
        url: url || undefined,
        image: image || undefined,
        author: author || undefined,
        category: category || undefined,
        cuisine: cuisine || undefined,
        yields: yields || undefined,
        total_time: totalTime ? parseInt(totalTime) : undefined,
        createdBy: user.id
      };

      const response = await axios.post('http://localhost:3333/recipes', recipeData);
      const newRecipeId = response.data._id;

      const userEmail = user.primaryEmailAddress?.emailAddress;
      if (userEmail) {
        // Add to recent recipes
        await axios.post(`http://localhost:3333/users/${encodeURIComponent(userEmail)}/recent/${newRecipeId}`);
      }

      router.push(`/recipes/${response.data._id}`);
    } catch (error) {
      console.error("Error adding new recipe:", error);
      if (axios.isAxiosError(error) && error.response) {
        setError(`Failed to add new recipe: ${error.response.data.message || 'Unknown error'}`);
      } else {
        setError("Failed to add new recipe. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-off-white min-h-screen flex flex-col text-green-text">
      <Navbar />
      <div className="flex-grow p-8">
        <h1 className="text-4xl mb-6">Add New Recipe</h1>
        <div className="mb-4">
          <Input
            label="Scrape Recipe URL (Optional)"
            value={scrapeUrl}
            onChange={(e) => setScrapeUrl(e.target.value)}
            placeholder="https://example.com/recipe"
          />
          <Button
            onClick={handleScrape}
            className="my-5 bg-peach border border-dark-green font-thin"
            radius="none"
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="sm" /> : "Scrape Recipe"}
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Textarea label="Ingredients" value={ingredients} onChange={(e) => setIngredients(e.target.value)} required />
          <Textarea label="Instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} required />
          
          <Checkbox 
            isSelected={showOptionalFields}
            onValueChange={setShowOptionalFields}
          >
            Show Optional Fields
          </Checkbox>

          {showOptionalFields && (
            <>
              <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <Input label="Recipe URL" value={url} onChange={(e) => setUrl(e.target.value)} />
              <Input label="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
              <Input label="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
              <Input label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
              <Input label="Cuisine" value={cuisine} onChange={(e) => setCuisine(e.target.value)} />
              <Input label="Yield" value={yields} onChange={(e) => setYields(e.target.value)} />
              <Input label="Total Time (minutes)" value={totalTime} onChange={(e) => setTotalTime(e.target.value)} type="number" />
            </>
          )}

          {error && <p className="text-red-500">{error}</p>}
          <Button
            type="submit"
            className="bg-peach border border-dark-green font-thin mx-5"
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