import Image from 'next/image';

export default function IngredientCartLogo() {
  return(
  <div className='mt-4 mb-2'>
    <Image
      priority
      src={'/ingredient-cart-logo.png'}
      alt="Follow us on Twitter"
      width={150}
      height={150}
    />
  </div>
  )
}