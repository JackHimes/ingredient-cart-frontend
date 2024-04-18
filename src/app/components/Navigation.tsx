"use client"

import {  Navbar,   NavbarBrand,   NavbarContent,   NavbarItem,   NavbarMenuToggle,  NavbarMenu,  NavbarMenuItem, Link, Button} from "@nextui-org/react";
import Logo from "./IngredientCartLogo.tsx"
import { UserButton } from "@clerk/nextjs";

export default function Navigation() {
    return (
        <Navbar isBordered height='75px' className="bg-emerald-800 p-4">
            <NavbarBrand>
                <Logo />
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="../">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link color="foreground" href="../ingest" aria-current="page">
            Automated Cart
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="../configuration">
            Settings
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <UserButton afterSignOutUrl="/"/>
        </NavbarItem>
      </NavbarContent>
        </Navbar>
    );
}