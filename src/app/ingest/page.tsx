"use client";

import { Button, Card, CardBody, Input } from "@nextui-org/react";
import Navbar from "../components/Navigation";
import axios from "axios";
import * as dotenv from "dotenv";
import { ChangeEvent, useState } from "react";

dotenv.config();

export default function Page() {
	const [recipeUrl, setRecipeUrl] = useState<string>('');

	const ingestRecipe = () => {
		console.log(recipeUrl);
		
	}

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setRecipeUrl(event.target.value)
	}

  return (
    <div className="bg-green-200 text-amber-50">
      <Navbar />
      <div className="h-screen flex justify-center">
        <Card className="w-1/2 h-1/2 mt-16">
          <CardBody className="flex items-center justify-center">
            <Input
							value={recipeUrl}
							onChange={handleInputChange}
              isInvalid={false}
              label="Recipe URL"
              variant="bordered"
              defaultValue="https://your-recipe-url-here.com"
              errorMessage="Please enter a valid recipe"
              className="max-w-xs"
            />
            <Button onClick={ingestRecipe}>Extract Ingredients!</Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
