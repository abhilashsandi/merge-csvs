import StaticPrepClient from '../components/StaticPrepClient';
import content from './content.json';

export const metadata = {
  title: 'Node.js Interview Mastery',
};

export default function Page() {
  return (
    <StaticPrepClient
      html={(content as { html: string }).html}
      title="Node.js Interview Mastery"
      loadingLabel="Loading study guide…"
    />
  );
}
