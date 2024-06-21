import Link from "next/link";
import { Recipe } from "../../types/Recipe";

export default function RecipeCard({ recipe }: { recipe: Recipe}) {
  return (
    <div className="flex flex-row border border-border-color p-4 max-w-lg m-2 w-full sm:w-1/2 md:w-1/3">
      <div className="flex-1 space-y-1">
        <p className="text-lg font-semibold text-dark-green">{recipe.title}</p>
        <p className="text-sm font-thin text-dark-green">{recipe.description}</p>
        <Link href={`http://localhost:3000/recipes/${recipe._id}`} target="_blank">
          <p className="text-dark-green hover:text-peach mt-6 transition duration-150 ease-in-out">Go now</p>
        </Link>
      </div>
      <div className="flex-initial pl-4">
        <img
          src={recipe.image || "/recipes-page.jpg"}
          width={150}
          height={150}
          alt="recipe image"
        />
      </div>
    </div>
  );
}