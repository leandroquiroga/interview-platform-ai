"use client";
import { useEffect, useState } from "react";
import { userStore } from "@/store/userStore";
import { getCurrentUser } from "@/lib/actions/auth.actions";

export const useProfile = () => {
  const { user, setUser } = userStore();
  const [isUser, setIsUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const userProfile = async () => {
    try {
      if (isUser) {
        setIsLoading(false);
        return;
      }

      const userData = await getCurrentUser();
      if (!userData) {
        setUser(null);
        setIsLoading(false);
        setIsUser(false);
        return;
      }

      setUser(userData);
      setIsUser(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(null);
      setIsLoading(false);
      setIsUser(false);
    }
  }

  useEffect(() => {
    userProfile();
  }, []);

  return {
    user,
    isLoading,
  };
};