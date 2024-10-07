"use client";
import { Button } from "@nextui-org/react";
// import ParallaxBannerComponent from "../common/ParallaxBannerComponent";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="relative bg-light-green flex flex-col items-center justify-center pt-20 md:pt-36 px-4 md:px-10 z-10">
      <h1 className="text-3xl md:text-6xl text-green-text font-light text-center">
        The Fast Track from Recipe to Pantry
      </h1>
      <Link href="/ingest">
        <Button
          variant="bordered"
          radius="none"
          size="lg"
          className="mt-8 md:mt-14 mb-12 md:mb-36 border-dark-green bg-peach font-thin"
        >
          Add Ingredients
        </Button>
      </Link>
      {/* <ParallaxBannerComponent /> */}
    </div>
  );
}