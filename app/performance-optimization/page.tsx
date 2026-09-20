import InterviewPageClient from '../components/InterviewPageClient';
import { sections, sectionQuizzes, consoleExamples, sectionDiagrams } from './data';

export const metadata = {
  title: 'Performance Optimization at Every Layer — Interview Prep',
};

export default function PerformanceOptimizationPage() {
  return (
    <InterviewPageClient
      pageId="performance-optimization"
      title="Optimize at Every Layer"
      subtitle="A senior-architect-ready answer to 'how would you optimize this system' — client, network/edge, API/gateway, application server, caching, database, async/messaging, and the observability loop that tells you what to fix first."
      accentFrom="from-amber-500"
      accentTo="to-orange-600"
      accentHoverBg="bg-amber-100"
      accentHoverText="text-amber-700"
      checkColor="text-amber-500"
      sections={sections}
      sectionQuizzes={sectionQuizzes}
      consoleExamples={consoleExamples}
      sectionDiagrams={sectionDiagrams}
    />
  );
}
