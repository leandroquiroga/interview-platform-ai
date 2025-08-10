import AuthForm from '@/components/AuthForm';
import { isAuthenticated } from '@/utils/functions/auth.action';
import { redirect } from 'next/navigation';
import React from 'react';

const ChangePassword = async () => {
  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) redirect('/sign-in');
  return <AuthForm type="change-password" />;
};

export default ChangePassword;
