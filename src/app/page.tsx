import {Button, ButtonGroup} from "@nextui-org/react";

import Navbar from './components/Navigation'

export default function Home() {
  return (
    <div>
      <Navbar />
      <Button color='primary'>Click me</Button>
      <div>Hello World</div>
    </div>
  )
}
