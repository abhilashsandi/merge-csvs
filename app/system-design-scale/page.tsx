import InterviewPageClient from '../components/InterviewPageClient';
import { sections, sectionQuizzes, consoleExamples, sectionDiagrams } from './data';

export const metadata = {
  title: 'System Design at Scale — Interview Prep',
};

export default function SystemDesignScalePage() {
  return (
    <InterviewPageClient
      pageId="system-design-scale"
      title="Design a Full-Stack App for Millions of Users"
      subtitle="A senior-architect-ready answer, end to end — requirements, capacity estimate, web framework, auth, edge/CDN/gateway, service architecture, data layer, caching, async, deployment, reliability, security, and how to pace all of it in a 30–45 minute interview."
      accentFrom="from-violet-500"
      accentTo="to-purple-600"
      accentHoverBg="bg-violet-100"
      accentHoverText="text-violet-700"
      checkColor="text-violet-500"
      sections={sections}
      sectionQuizzes={sectionQuizzes}
      consoleExamples={consoleExamples}
      sectionDiagrams={sectionDiagrams}
    />
  );
}
