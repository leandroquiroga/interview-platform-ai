import dayjs from 'dayjs';
import Image from 'next/image';
import { getRandomInterviewCover } from '@/lib/utils';
import { Button } from './ui/button';
import Link from 'next/link';
import DisplayIconTech from './DisplayIconTech';

const InterviewCard = ({
  createdAt,
  finalized,
  id,
  level,
  questions,
  role,
  techstack,
  type,
  userId,
}: Interview) => {
  const feedback = null as Feedback | null;
  const normalizedType = /mix/i.test(type) ? 'Mixed' : type;
  const formatedDate = dayjs(
    feedback?.createdAt || createdAt || new Date()
  ).format('MMM D, YYYY');

  return (
    <div className="card-border w-[360px] mx-sm:w-full min-h-96">
      <div className="card-interview">
        <div>
          <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
            <p className="badge-text">{normalizedType}</p>
          </div>

          <Image
            src={getRandomInterviewCover()}
            alt="Interview Cover"
            width={900}
            height={900}
            className="rounded-full object-fit size-[90px]"
          />

          <h3 className="mt-5 capitalize">{role} Interview</h3>

          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <Image
                src={'/calendar.svg'}
                alt="Calendar Icon"
                width={22}
                height={22}
              />

              <p>{formatedDate}</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Image src={'/star.svg'} alt="Star Icon" width={22} height={22} />
              <p>{feedback?.totalScore || '---'}/100</p>
            </div>
          </div>
          <p className="line-clamp-2 mt-5">
            {feedback?.finalAssessment ||
              'You haven’t taken the interview yet. Take it to improve your skills!'}
          </p>
        </div>
        <div className="flex flex-row justify-between">
          <DisplayIconTech techStack={techstack} />

          <Button className="btn-primary">
            <Link
              href={feedback ? `/interview/${id}/feedback` : `/interview/${id}`}
            >
              {feedback ? 'View Feedback' : 'Take Interview'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
