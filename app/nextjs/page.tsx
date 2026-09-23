import InterviewPageClient from '../components/InterviewPageClient';
import { sections, sectionQuizzes, consoleExamples, sectionDiagrams } from './data';

export default function NextJsInterviewPage() {
  return (
    <InterviewPageClient
      pageId="nextjs"
      title="Next.js Interview Mastery"
      subtitle="App Router, Server Components, rendering strategies, caching, Server Actions, middleware & deployment."
      accentFrom="from-slate-600"
      accentTo="to-slate-900"
      accentHoverBg="bg-slate-100"
      accentHoverText="text-slate-700"
      checkColor="text-slate-500"
      sections={sections}
      sectionQuizzes={sectionQuizzes}
      consoleExamples={consoleExamples}
      sectionDiagrams={sectionDiagrams}
    />
  );
}
