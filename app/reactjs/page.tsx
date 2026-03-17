import InterviewPageClient from '../components/InterviewPageClient';
import { sections, sectionQuizzes, consoleExamples, sectionDiagrams } from './data';

export default function ReactJsInterviewPage() {
  return (
    <InterviewPageClient
      pageId="reactjs"
      title="React.js Interview Mastery"
      subtitle="The ultimate full-stack engineer's guide — TypeScript, hooks, state, rendering, performance, patterns, Next.js, testing, security & accessibility."
      accentFrom="from-blue-500"
      accentTo="to-indigo-600"
      accentHoverBg="bg-indigo-100"
      accentHoverText="text-indigo-700"
      checkColor="text-indigo-500"
      sections={sections}
      sectionQuizzes={sectionQuizzes}
      consoleExamples={consoleExamples}
      sectionDiagrams={sectionDiagrams}
    />
  );
}
