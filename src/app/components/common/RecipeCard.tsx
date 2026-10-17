import Link from "next/link";
import { Recipe } from "../../types/Recipe";

export default function RecipeCard({ recipe }: { recipe: Recipe}) {
  return (
    <div className="flex flex-col md:flex-row border border-border-color p-4 max-w-lg m-2 w-full">
      <div className="flex-1 space-y-1">
        <p className="text-lg font-semibold text-dark-green">{recipe.title}</p>
        <p className="text-sm font-thin text-dark-green">{recipe.description}</p>
        <Link href={`http://localhost:3000/recipes/${recipe._id}`} target="_blank">
          <p className="text-dark-green hover:text-peach mt-6 transition duration-150 ease-in-out">Go now</p>
        </Link>
      </div>
      <div className="flex-initial pl-4 mt-4 md:mt-0">
        <img
          src={recipe.image || "/recipes-page.webp"}
          className="w-full max-w-[150px] h-auto"
          alt="recipe image"
        />
      </div>
    </div>
  );
}