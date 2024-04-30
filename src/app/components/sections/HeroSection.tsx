"use client";
import { Button } from "@nextui-org/react";
import ParallaxBannerComponent from "../common/ParallaxBannerComponent";

export default function HeroSection() {
 
  return (
    <div className="relative bg-light-green flex flex-col items-center justify-center pt-36 mx-10 z-10">
      <h1 className="text-6xl text-green-text font-sans">
        The Fast Track from Recipe to Pantry
      </h1>
      <Button
        variant="bordered"
        radius="none"
        size="lg"
        className="mt-14 mb-36 border-dark-green bg-peach font-sans"
      >
        Add Ingredients
      </Button>
      <ParallaxBannerComponent />
    </div>
  );
}