"use client"

import {Button, ButtonGroup, Card, CardFooter, Image} from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";
import Navbar from './components/common/Navigation';
import { useRouter } from "next/navigation";
import HeroSection from "./components/sections/HeroSection";
import About from "./components/sections/About";
import Recipes from "./components/sections/Recipes";
import Footer from "./components/common/Footer";


export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const openKrogerAuth = () => {
    router.push('/configuration')
  }

  if (!isLoaded || !isSignedIn ) {
    return null;
  }

  console.log(user.emailAddresses[0].emailAddress);
  

  return (
    <div className="bg-light-green text-green-text">
      <Navbar />
      <HeroSection />
      <div className="relative bg-off-white flex flex-col items-center justify-center pt-[656px] -mt-[506px]" />
      <About />
      <Recipes />
      <Footer />
    </div>
  )
}
