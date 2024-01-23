"use client"

import {Button, ButtonGroup, Card, CardFooter, Image} from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";
import Navbar from './components/Navigation';
import { useRouter } from "next/navigation";


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
    <div className="bg-green-200 text-amber-50">
      <Navbar />
      <div className="h-screen">
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
      </div>
    </div>
  )
}
