import StaticPrepClient from '../components/StaticPrepClient';
import content from './content.json';

export const metadata = {
  title: 'Optimize at Every Layer — Interview Prep',
};

export default function PerformanceOptimizationPage() {
  return (
    <StaticPrepClient
      html={(content as { html: string }).html}
      title="Optimize at Every Layer — Interview Prep"
      loadingLabel="Loading optimization guide…"
    />
  );
}
