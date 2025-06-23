'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import Image from 'next/image';
import Link from 'next/link';
import { authFormSchema } from '@/utils/functions';
import { toast } from 'sonner';
import FormFields from './FormFields';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/firebase/client';
import { signIn, signUp } from '@/lib/actions/auth.actions';

type FormType = 'sign-in' | 'sign-up';

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === 'sign-up') {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success('Sign up successful!');
        router.push('/sign-in');
        return;
      }

      const { email, password } = data;

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken();

      if (!idToken) {
        toast.error('Failed to retrieve user token. Please try again.');
        return;
      }

      await signIn({ email, idToken });

      toast.success('Sign in successful!');
      router.push('/');
    } catch (error) {
      console.error('Error during form submission:', error);
      toast.error(
        `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
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
