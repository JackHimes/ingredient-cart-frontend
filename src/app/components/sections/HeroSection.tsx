"use client";
import { Button } from "@nextui-org/react";
import ParallaxBannerComponent from "../common/ParallaxBannerComponent";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="relative bg-light-green flex flex-col items-center justify-center pt-36 mx-10 z-10">
      <h1 className="text-6xl text-green-text font-light">
        The Fast Track from Recipe to Pantry
      </h1>
      <Link href="/ingest">
        <Button
          variant="bordered"
          radius="none"
          size="lg"
          className="mt-14 mb-36 border-dark-green bg-peach font-thin"
        >
          Add Ingredients
        </Button>
      </Link>
      <ParallaxBannerComponent />
    </div>
  );
}
