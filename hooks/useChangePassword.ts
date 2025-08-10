'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks';
import { ChangePasswordFormData } from '@/types';

export const useChangePassword = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { handleAuth, isLoading } = useAuth('change-password');

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    await handleAuth(data);
    setIsOpen(false);
  };

  return {
    isOpen,
    setIsOpen,
    handleChangePassword,
    isLoading,
  };
};
