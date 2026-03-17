import InterviewPageClient from '../components/InterviewPageClient';
import { sections, sectionQuizzes, consoleExamples, sectionDiagrams } from './data';

export default function NodeJsInterviewPage() {
  return (
    <InterviewPageClient
      pageId="nodejs"
      title="Node.js Interview Mastery"
      subtitle="The definitive full-stack engineer's guide — architecture, event loop, async patterns, streams, security, scaling, databases, testing & microservices."
      accentFrom="from-emerald-500"
      accentTo="to-green-600"
      accentHoverBg="bg-emerald-100"
      accentHoverText="text-emerald-700"
      checkColor="text-emerald-500"
      sections={sections}
      sectionQuizzes={sectionQuizzes}
      consoleExamples={consoleExamples}
      sectionDiagrams={sectionDiagrams}
    />
  );
}
