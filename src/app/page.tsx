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
    <div className="bg-light-green text-amber-50">
      <Navbar />
      <HeroSection />
      <div className="relative bg-off-white flex flex-col items-center justify-center pt-[656px] -mt-[506px]" />
      <About />
      <Recipes />
      {/* <div className="h-screen">
        <div>
          <Card isFooterBlurred radius="lg" className="m-8 p-3 border-none max-w-60 h-80">
            <p>Not linked up yet? Link your Kroger account here:</p>
            <CardFooter>
              <Image
                className="object-cover"
                height={200}
                src="https://developer.kroger.com/assets/logos/integrated-blue-text.svg"
                width={200}
                onClick={openKrogerAuth}
              />
            </CardFooter>
          </Card>
        </div>
      </div> */}
      <Footer />
    </div>
  )
}
