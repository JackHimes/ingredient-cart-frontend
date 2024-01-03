import Image from 'next/image'
import {Button, ButtonGroup} from "@nextui-org/react";

import Header from './components/Header'

export default function Home() {
  return (
    <div>
      <Button color='primary'>Click me</Button>
      <Header />
      <div>Hello World</div>
      </div>
  )
}
