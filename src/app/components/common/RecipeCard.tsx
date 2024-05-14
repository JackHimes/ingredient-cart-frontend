import Image from "next/image";
import Link from "next/link";

export default function RecipeCard() {
  return (
<div className="flex flex-row border border-border-color p-4 max-w-lg m-2 w-full sm:w-1/2 md:w-1/3">
      <div className="flex-1 space-y-1">
        <p className="text-lg font-semibold text-dark-green">DYNAMIC RECIPE NAME</p>
        <p className="text-sm font-thin text-dark-green">DYNAMIC RECIPE DESCRIPTION</p>
        <Link href="https://www.allrecipes.com/recipe/16383/basic-crepes/" target="_blank">
          <p className="text-dark-green hover:text-peach mt-6 transition duration-150 ease-in-out">DYNAMIC URL</p>
        </Link>
      </div>
      <div className="flex-initial pl-4">
        <Image
          src="/recipes-page.jpg"
          width={150}
          height={150}
          alt="recipe image"
        />
      </div>
    </div>
  );
}
