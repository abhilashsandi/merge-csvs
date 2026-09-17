import InterviewPrepClient from './InterviewPrepClient';
import content from './content.json';

export const metadata = {
  title: 'Fullstack Developer Interview Prep',
};

export default function InterviewPrepPage() {
  return <InterviewPrepClient html={(content as { html: string }).html} />;
}
