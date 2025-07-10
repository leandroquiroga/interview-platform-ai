import Agent from '@/components/Agent';
import React from 'react';

const InterviewPage = () => {
  return (
    <>
      <h3>Interview Generation</h3>
      <Agent userName="Leandro" userId="123" type="generate" />
    </>
  );
};

export default InterviewPage;
