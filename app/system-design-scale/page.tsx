import StaticPrepClient from '../components/StaticPrepClient';
import content from './content.json';

export const metadata = {
  title: 'System Design at Scale — Interview Prep',
};

export default function SystemDesignScalePage() {
  return (
    <StaticPrepClient
      html={(content as { html: string }).html}
      title="System Design at Scale — Interview Prep"
      loadingLabel="Loading system design guide…"
    />
  );
}
