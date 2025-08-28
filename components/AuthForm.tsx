'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import Image from 'next/image';
import Link from 'next/link';
import FormFields from './FormFields';
import { useAuth, useAuthForm } from '@/hooks';
import { Loader2Icon } from 'lucide-react';
import { FormType, AuthFormData } from '@/types';
import FormFieldsOTP from './FormFieldsOPT';
import { resendVerificationCode } from '@/lib/actions/verification.actions';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

const AuthForm = ({ type }: { type: FormType }) => {
  const form = useAuthForm(type);
  const { isLoading, handleAuth } = useAuth(type);
  const [userEmail, setUserEmail] = useState<string>('');
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (type === 'verify-code') {
      const signupDataStr = sessionStorage.getItem('signup-data');
      if (signupDataStr) {
        const signupData = JSON.parse(signupDataStr);
        setUserEmail(signupData.email);
      }
    }
  }, [type]);

  const handleResendCode = async () => {
    if (!userEmail) {
      toast.error('Email not found. Please start registration again.');
      return;
    }

    setResendLoading(true);
    const result = await resendVerificationCode(userEmail);

    if (result.success) {
      toast.success('Verification code resent successfully');
    } else {
      toast.error(result.message);
    }
    setResendLoading(false);
  };

  const onSubmit = async (data: AuthFormData) => await handleAuth(data);

  const isSignIn = type === 'sign-in';
  const isChangePassword = type === 'change-password';
  const isVerifyCode = type === 'verify-code';

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image alt="logo" src="/logo.svg" height={32} width={38} />
          <h2 className="text-primary-100">AI InterviewPro</h2>
        </div>
        <h3 className="text-center">Practice job interviewer</h3>
        <Form {...(form as any)}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {isVerifyCode && (
              <>
                <FormFieldsOTP
                  control={form.control as any}
                  name="code"
                  label="Verification Code"
                />
              </>
            )}
            {!isSignIn && !isChangePassword && !isVerifyCode && (
              <FormFields
                control={form.control as any}
                name="name"
                label="Username"
                placeholder="Your Name"
                type="text"
              />
            )}
            {!isChangePassword && !isVerifyCode && (
              <FormFields
                control={form.control as any}
                name="email"
                label="Email"
                placeholder="Your Email Address"
                type="email"
              />
            )}
            {!isVerifyCode && !isChangePassword && (
              <FormFields
                control={form.control as any}
                name="password"
                label="Password"
                placeholder="Enter your Password"
                type="password"
              />
            )}
            {isChangePassword && (
              <>
                <FormFields
                  control={form.control as any}
                  name="oldPassword"
                  label="Current Password"
                  placeholder="Enter your Current Password"
                  type="password"
                />
                <FormFields
                  control={form.control as any}
                  name="newPassword"
                  label="New Password"
                  placeholder="Enter your New Password"
                  type="password"
                />
              </>
            )}
            <Button className="btn" type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2Icon className="animate-spin" />
              ) : isSignIn ? (
                'Sign in'
              ) : isVerifyCode ? (
                'Verify code'
              ) : (
                'Create account'
              )}
            </Button>
          </form>
        </Form>
        {isVerifyCode && userEmail && (
          <div className="text-center space-y-2 mb-4">
            <p className="text-sm text-gray-600">
              We've sent a verification code to:
            </p>
            <p className="font-semibold text-primary-100">{userEmail}</p>
            <p className="text-xs text-gray-500">
              Check your email and enter the 6-digit code below. The code
              expires in 10 minutes.
            </p>
          </div>
        )}
        {isVerifyCode && (
          <Button
            onClick={handleResendCode}
            disabled={resendLoading}
            variant="link"
            className="w-full mb-4"
          >
            {resendLoading ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              'Resend code'
            )}
          </Button>
        )}
        {!isVerifyCode && (
          <p className="text-center">
            {isSignIn ? 'New to AI InterviewPro?' : 'Already have an account?'}
            <Link
              href={`${!isSignIn ? '/sign-in' : '/sign-up'}`}
              className="font-bold text-user-primary ml-1"
            >
              {isSignIn ? 'Create an account' : 'Sign in'}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
