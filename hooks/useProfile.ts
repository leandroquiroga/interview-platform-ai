"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
        toast.error("No user profile found. Please log in.");
        return;
      }

      setUser(userData);
      setIsUser(true);
      toast.success("User profile loaded successfully.");
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(null);
      toast.error("Error fetching user profile. Please try again later.");
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