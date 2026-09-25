import StaticPrepClient from '../components/StaticPrepClient';
import content from './content.json';

export const metadata = {
  title: 'CSS & Tailwind Interview Mastery',
};

export default function Page() {
  return (
    <StaticPrepClient
      html={(content as { html: string }).html}
      title="CSS & Tailwind Interview Mastery"
      loadingLabel="Loading study guide…"
    />
  );
}
