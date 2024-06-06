"use client";

import Navigation from "../../../components/common/Navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { fetchAccessToken } from "../../../api/krogerAuth";
import axios from "axios";
import { Spinner } from "@nextui-org/react";
import { useRouter } from 'next/navigation';

export default function AccessTokenRedirect() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchAndStoreToken = async () => {
      console.log("User loaded:", isUserLoaded);
      console.log("User:", user);
      const authCode = new URLSearchParams(window.location.search).get("code");
      if (authCode) {
        console.log("Fetching new Token from Auth Code");
        try {
          const tokenData = await fetchAccessToken(
            authCode,
            process.env.NEXT_PUBLIC_KROGER_REDIRECT_URI as string
          );
          const responseDataString = JSON.stringify(tokenData);
          localStorage.setItem("customer_access_token", responseDataString);

          const updateTokenEndpoint = "http://localhost:3333/users/updateToken";
          if (user) {
            axios
              .patch(updateTokenEndpoint, null, {
                params: {
                  email: user.emailAddresses[0].emailAddress,
                  accessToken: tokenData.access_token,
                  refreshToken: tokenData.refresh_token,
                },
                headers: {
                  accept: "application/json",
                },
              })
              .then((response) => {
                console.log(response.data);
              })
              .catch((error) => {
                console.error("Error updating token:", error);
              });
              router.push("/ingest");
          }
        } catch (error) {
          console.error("Error fetching token:", error);
        }
      }
    };

    if (isUserLoaded && user) {
      fetchAndStoreToken();
    }
  }, [isUserLoaded, user]);

  return (
    <div className="bg-off-white min-h-screen flex flex-col text-green-text">
      <Navigation />
      <div className="flex p-10 justify-center text-6xl">
      <Spinner
              size="lg"
              label="Redirecting!"
              color="success"
              classNames={{ label: "text-green-text" }}
            />
      </div>
    </div>
  );
}