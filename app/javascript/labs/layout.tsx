import StudyGuideLink from '../../components/StudyGuideLink';

export default function LabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <StudyGuideLink href="/javascript" />
    </>
  );
}
