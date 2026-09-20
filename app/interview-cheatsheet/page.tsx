import StaticPrepClient from '../components/StaticPrepClient';
import content from './content.json';

export const metadata = {
  title: 'Interview Cheatsheet',
};

export default function InterviewCheatsheetPage() {
  return (
    <StaticPrepClient
      html={(content as { html: string }).html}
      title="Interview Cheatsheet"
      loadingLabel="Loading cheatsheet…"
    />
  );
}
