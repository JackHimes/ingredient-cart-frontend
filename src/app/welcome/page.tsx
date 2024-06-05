"use client";

import useStoreUser from "../hooks/useStoreUser";
import Navigation from "../components/common/Navigation";
import Footer from "../components/common/Footer";
import About from "../components/sections/About";

export default function Welcome() {
  useStoreUser();
  return (
    <div className="bg-off-white min-h-screen flex flex-col text-green-text">
      <Navigation />
      <div className="flex p-10 justify-center text-6xl">Welcome to Ingredient Cart!</div>
      <About />
      <Footer />
    </div>
  );
}
