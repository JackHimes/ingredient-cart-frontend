"use client";

import Navigation from "../../../components/common/Navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Spinner } from "@nextui-org/react";
import { useRouter } from 'next/navigation';

export default function AccessTokenRedirect() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  // Kroger auth codes are single use; dev mode runs effects twice, so only exchange once
  const exchangeStarted = useRef(false);

  useEffect(() => {
    const exchangeCode = async () => {
      const authCode = new URLSearchParams(window.location.search).get("code");
      if (!authCode || !user) {
        setError("Missing Kroger authorization code or signed-in user.");
        return;
      }
      try {
        // The backend swaps the code for tokens and saves them on the user record
        const response = await axios.post("http://localhost:3333/users/kroger/callback", {
          email: user.emailAddresses[0].emailAddress,
          code: authCode,
        });
        localStorage.setItem("customer_access_token", JSON.stringify(response.data));
        router.push("/ingest");
      } catch (error) {
        console.error("Error exchanging Kroger code:", error);
        const message = axios.isAxiosError(error) ? error.response?.data?.message || error.message : String(error);
        setError(`Could not connect your Kroger account: ${message}`);
      }
    };

    if (isUserLoaded && user && !exchangeStarted.current) {
      exchangeStarted.current = true;
      exchangeCode();
    }
  }, [isUserLoaded, user, router]);

  return (
    <div className="bg-off-white min-h-screen flex flex-col text-green-text">
      <Navigation />
      <div className="flex p-10 justify-center text-6xl">
        {error ? (
          <p className="text-base text-red-600 max-w-2xl break-words">{error}</p>
        ) : (
          <Spinner
            size="lg"
            label="Redirecting!"
            color="success"
            classNames={{ label: "text-green-text" }}
          />
        )}
      </div>
    </div>
  );
}
