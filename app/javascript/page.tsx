import StaticPrepClient from '../components/StaticPrepClient';
import content from './content.json';

export const metadata = {
  title: 'JavaScript — Interview Prep',
};

export default function Page() {
  return (
    <StaticPrepClient
      html={(content as { html: string }).html}
      title="JavaScript — Interview Prep"
      loadingLabel="Loading study guide…"
    />
  );
}
