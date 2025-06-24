'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import Image from 'next/image';
import Link from 'next/link';
import FormFields from './FormFields';
import { useAuth, useAuthForm } from '@/hooks';

const AuthForm = ({ type }: { type: FormType }) => {
  const form = useAuthForm(type);
  const { handleAuth } = useAuth(type);

  const onSubmit = async (data: AuthFormData) => {
    await handleAuth(data);
  };

  const isSignIn = type === 'sign-in';

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image alt="logo" src="/logo.svg" height={32} width={38} />
          <h2 className="text-primary-100">AI InterviewPro</h2>
        </div>
        <h3>Practice job interviewer</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormFields
                control={form.control}
                name="name"
                label="Username"
                placeholder="Your Name"
                type="text"
              />
            )}
            <FormFields
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your Email Address"
              type="email"
            />
            <FormFields
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your Password"
              type="password"
            />
            {/* <FormFields isSignIn={isSignIn} form={form} /> */}
            <Button className="btn" type="submit">
              {isSignIn ? 'Sign in' : 'Create account'}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? 'New to AI InterviewPro?' : 'Already have an account?'}
          <Link
            href={`${!isSignIn ? '/sign-in' : '/sign-up'}`}
            className="font-bold text-user-primary ml-1"
          >
            {isSignIn ? ' Create an account' : ' Sign in'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
