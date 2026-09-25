import StaticPrepClient from '../components/StaticPrepClient';
import content from './content.json';

export const metadata = {
  title: 'React Training — Interview Prep',
};

export default function Page() {
  return (
    <StaticPrepClient
      html={(content as { html: string }).html}
      title="React Training — Interview Prep"
      loadingLabel="Loading study guide…"
    />
  );
}
