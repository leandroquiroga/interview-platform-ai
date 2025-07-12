import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

enum CallStatus {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
  CONNECTING = 'CONNECTING',
  FINISHED = 'FINISHED',
}

const Agent = ({ type, userName, userId }: AgentProps) => {
  const callStatus = CallStatus.FINISHED; // Esto normalmente vendría de props o estado
  const isSpeaking = true;

  const message = [
    'What is your name?',
    'My name is Leandro, nice to meet you!',
  ];

  const lastMessage = message[message.length - 1];

  let buttonContent;
  if (callStatus === CallStatus.ACTIVE) {
    // Mostrar botón para finalizar entrevista
    buttonContent = <button className="btn-disconnect">End Interview</button>;
  } else if (callStatus === CallStatus.FINISHED) {
    // Mostrar botón para iniciar entrevista
    buttonContent = (
      <button className="relative btn-call">
        <span
          className={cn(
            'absolute animate-ping rounded-full',
            callStatus !== CallStatus.CONNECTING && 'hidden'
          )}
        />
        <span>Start Interview</span>
      </button>
    );
  } else if (callStatus === CallStatus.CONNECTING) {
    buttonContent = (
      <button className="relative btn-call">
        <span className="absolute animate-ping rounded-full" />
        <span>...</span>
      </button>
    );
  }

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="avatar"
              width={65}
              height={65}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak"></span>}
          </div>
          <h3> AI Interviewer </h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="user-avatar"
              width={540}
              height={540}
              className="rounded-full object-cover size-[120px]"
            />
            {userName}
          </div>
        </div>
      </div>

      {message.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              className={cn(
                'transition-opacity duration-500 opacity-0',
                'animate-fadeIn opacity-100'
              )}
              key={lastMessage}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">{buttonContent}</div>
    </>
  );
};

export default Agent;
