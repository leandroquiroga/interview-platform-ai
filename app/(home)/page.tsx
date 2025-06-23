import { Button } from '@/components/ui/button';
import { dummyInterviews } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import InterviewCard from '@/components/InterviewCard';

const HomePage = () => {
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>AI-powered coding interview prep and practice</h2>
          <p>Ace coding interviews with an AI agent.</p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href={'/interview'}>Get Started</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="AI-powered coding interview prep and practice"
          width={400}
          height={400}
          className="max-w-sm max-sm:hidden"
          priority
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviewers</h2>

        <div className="interviews-section">
          {dummyInterviews.map(interviewer => (
            <InterviewCard key={interviewer.id} {...interviewer} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an Interview</h2>

        <div className="interviews-section">
          {dummyInterviews.map(interviewer => (
            <InterviewCard key={interviewer.id} {...interviewer} />
          ))}

          {/* <p>You haven&apos;t taken any interviews yet</p> */}
        </div>
      </section>
    </>
  );
};

export default HomePage;
