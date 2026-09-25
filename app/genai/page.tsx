import StaticPrepClient from '../components/StaticPrepClient';
import content from './content.json';

export const metadata = {
  title: 'GenAI Interview Prep',
};

export default function GenAIPage() {
  return (
    <StaticPrepClient
      html={(content as { html: string }).html}
      title="GenAI Interview Prep"
      loadingLabel="Loading GenAI guide…"
    />
  );
}
