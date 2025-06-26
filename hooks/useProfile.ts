import { getCurrentUser } from "@/utils/functions/auth.action";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export const useProfile = () => {


  const [user, setUser] = useState<User | null>(null);


  const userProfile = async () => {

    try {
      const userData = await getCurrentUser();

      if (!userData) {
        setUser(null);
        toast.error("No user profile found. Please log in.");
        return;
      }

      setUser(userData);
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