import StaticPrepClient from '../components/StaticPrepClient';
import content from './content.json';

export const metadata = {
  title: 'React + TypeScript Interview Mastery',
};

export default function Page() {
  return (
    <StaticPrepClient
      html={(content as { html: string }).html}
      title="React + TypeScript Interview Mastery"
      loadingLabel="Loading study guide…"
    />
  );
}
