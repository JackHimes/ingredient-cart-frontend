"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";
import Logo from "./IngredientCartLogo.tsx";
import { UserButton } from "@clerk/nextjs";

export default function Navigation() {
  return (
    <Navbar height="75px" maxWidth="full" className="bg-light-green p-4 pb-8 border-t-4 border-peach">
      <NavbarContent className=" basis-1/3 flex justify-start">
        <NavbarItem>
          <Link className="font-thin" color="foreground" href="../">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="font-thin" color="foreground" href="../ingest">
            Automated Cart
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="font-thin" color="foreground" href="../configuration">
            Settings
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarBrand className="basis-1/3 flex justify-center">
        <Logo />
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <UserButton afterSignOutUrl="/" />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
