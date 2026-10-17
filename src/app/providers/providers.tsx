'use client'

import { NextUIProvider } from '@nextui-org/react';
import { ParallaxProvider } from 'react-scroll-parallax';
import useStoreUser from '../hooks/useStoreUser';

export function Providers({ children }: { children: React.ReactNode }) {
  // Make sure the signed-in Clerk user has a matching record in the backend DB
  useStoreUser();
  return (
    <NextUIProvider>
      <ParallaxProvider>
        {children}
      </ParallaxProvider>
    </NextUIProvider>
  )
}