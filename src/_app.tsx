import React from "react";
import "./globals.css";
import { Outfit } from "next/font/google";

const outfit = Outfit({
    subsets: ["latin"],
    variable: '--font-outfit',
  });
  
function MyApp({
  Component,
  pageProps,
}: {
  Component: React.ComponentType<any>;
  pageProps: any;
}) {
  return (
    <div className={`${outfit.variable} + font-sans`}>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
