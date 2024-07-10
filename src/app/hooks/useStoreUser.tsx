"use client";

import { useAuth, useSession, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios";

const useStoreUser = () => {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { session, isLoaded: isSessionLoaded } = useSession();
  const { user, isLoaded: isUserLoaded } = useUser();
  const [userDataStored, setUserDataStored] = useState(false);

  useEffect(() => {
    if (isAuthLoaded && isSignedIn && isSessionLoaded && isUserLoaded && user && !userDataStored) {
      const storeUser = async () => {
        try {
          const userData = {
            email: user.emailAddresses[0].emailAddress,
            fullName: `${user.firstName} ${user.lastName}`,
            phoneNumbers: user.phoneNumbers.map((phone) => phone.phoneNumber),
            verified: true,
            favoriteRecipes: [],
            recentRecipes: []
          };

          console.log("Sending user data:", JSON.stringify(userData, null, 2));

          const response = await axios.post("http://localhost:3333/users", userData);
          console.log("User stored successfully!", JSON.stringify(response.data, null, 2));
          setUserDataStored(true);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error("Error storing user:", error.response?.data || error.message);
            console.error("Error status:", error.response?.status);
            console.error("Error headers:", error.response?.headers);
          } else {
            console.error("Error storing user:", error);
          }
        }
      };

      storeUser();
    }
  }, [isAuthLoaded, isSignedIn, isSessionLoaded, isUserLoaded, user, userDataStored]);
};

export default useStoreUser;