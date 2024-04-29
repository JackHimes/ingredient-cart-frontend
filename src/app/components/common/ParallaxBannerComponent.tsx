'use client';

import { ParallaxBanner } from 'react-scroll-parallax';

export default function ParallaxBannerComponent() {
  return (
    <ParallaxBanner
      layers={[{ image: '/hero-section-image.jpg', speed: -25}]}
      className='aspect-[2/1] border-b-8 border-b-dark-green'>
    </ParallaxBanner >
  );
}