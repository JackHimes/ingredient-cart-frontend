"use client"

import {Button, ButtonGroup} from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";
import Navbar from './components/Navigation'

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn ) {
    return null;
  }

  console.log(user.emailAddresses[0].emailAddress);
  

  return (
    <div>
      <Navbar />
      <Button color='primary'>Click me</Button>
      <div>Hello World</div>
      <div> {user.emailAddresses[0].emailAddress}</div>   
      <div>{isLoaded} </div>
    </div>
  )
}
