'use client'

import { NextUIProvider } from '@nextui-org/react';
import { ParallaxProvider } from 'react-scroll-parallax';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <ParallaxProvider>
        {children}
      </ParallaxProvider>
    </NextUIProvider>
  )
}