import InterviewPageClient from '../components/InterviewPageClient';
import { sections, sectionQuizzes, consoleExamples, sectionDiagrams } from './data';

export default function TailwindCssInterviewPage() {
  return (
    <InterviewPageClient
      pageId="tailwind-css"
      title="CSS & Tailwind Interview Mastery"
      subtitle="Box model, specificity, Flexbox & Grid, responsive design, and Tailwind's utility-first model, JIT engine, variants & theming."
      accentFrom="from-sky-500"
      accentTo="to-cyan-600"
      accentHoverBg="bg-sky-100"
      accentHoverText="text-sky-700"
      checkColor="text-sky-500"
      sections={sections}
      sectionQuizzes={sectionQuizzes}
      consoleExamples={consoleExamples}
      sectionDiagrams={sectionDiagrams}
    />
  );
}
