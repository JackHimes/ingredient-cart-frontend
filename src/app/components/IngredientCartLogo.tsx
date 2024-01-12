import Image from 'next/image';
import logo from '../assets/IngredientCartLogo.svg'

export default function IngredientCartLogo() {
  return(
  <div className='mt-4 mb-2'>
    <Image
      priority
      src={logo}
      alt="Follow us on Twitter"
    />
  </div>
  )
}