"use client";
import { useEffect, useState } from "react";
import { userStore } from "@/store/userStore";
import { getCurrentUser } from "@/utils/functions/auth.action";

export const useProfile = () => {
  const { user, setUser } = userStore();
  const [isUser, setIsUser] = useState(false);

  const userProfile = async () => {
    try {
      if (isUser) return;
      const userData = await getCurrentUser();
      if (!userData) {
        setUser(null);
        return;
      }

      setUser(userData);
      setIsUser(true);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(null);
    }
  }

  useEffect(() => {
    userProfile();
  }, []);

  return {
    user,
    userProfile
  };
};