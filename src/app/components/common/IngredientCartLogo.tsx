import Image from 'next/image';

export default function IngredientCartLogo() {
  return (
    <div className='mt-4 mb-2 flex justify-center items-center'>
      <Image
        priority
        src={'/ingredient-cart-logo.webp'}
        alt="Ingredient Cart Logo"
        width={150} 
        height={150}
        className="w-auto h-auto max-h-[120px]"
      />
    </div>
  )
}