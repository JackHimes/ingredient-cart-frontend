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
    console.log("Auth loaded:", isAuthLoaded);
    console.log("Signed in:", isSignedIn);
    console.log("Session loaded:", isSessionLoaded);
    console.log("User loaded:", isUserLoaded);
    console.log("Session:", session);
    console.log("User:", user);

    if (isAuthLoaded && isSignedIn && isSessionLoaded && isUserLoaded && user && !userDataStored) {
      const storeUser = async () => {
        try {
          const userData = {
            email: user.emailAddresses[0].emailAddress,
            fullName: `${user.firstName} ${user.lastName}`,
            phoneNumbers: user.phoneNumbers.map((phone) => phone.phoneNumber),
          };

          console.log("Storing user data:", userData);

          await axios.post("http://localhost:3333/users", userData);
          console.log("User stored successfully!");
          setUserDataStored(true); // Prevent multiple API calls

        } catch (error) {
          console.error("Error storing user:", error);
        }
      };

      storeUser();
    }
  }, [isAuthLoaded, isSignedIn, isSessionLoaded, isUserLoaded, user, userDataStored]);
};

export default useStoreUser;