'use client';
import { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { Highlight, themes } from 'prism-react-renderer';

/* ─── Types ─── */
export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

/* ─── Syntax Highlighted Code ─── */
export function SyntaxCode({ code, language = 'tsx' }: { code: string; language?: string }) {
  return (
    <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className="mt-3 p-4 rounded-lg overflow-x-auto text-xs leading-5 border border-zinc-800"
          style={{ ...style, margin: 0 }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })} className="flex">
              <span className="select-none text-zinc-600 mr-3 w-6 text-right shrink-0 text-[11px]">
                {i + 1}
              </span>
              <span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </span>
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

/* ─── Quiz ─── */
export function Quiz({
  questions,
  onAnswer,
}: {
  questions: QuizQuestion[];
  onAnswer?: (isCorrect: boolean) => void;
}) {
  return (
    <div className="space-y-6 mt-4">
      {questions.map((q, i) => (
        <QuizItem key={i} q={q} index={i} onAnswer={onAnswer} />
      ))}
    </div>
  );
}

function QuizItem({
  q,
  index,
  onAnswer,
}: {
  q: QuizQuestion;
  index: number;
  onAnswer?: (isCorrect: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (optIdx: number) => {
    if (selected !== null) return;
    setSelected(optIdx);
    onAnswer?.(optIdx === q.correctIndex);
  };

  const isAnswered = selected !== null;
  const isCorrect = selected === q.correctIndex;

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
      <h4 className="font-bold text-zinc-900 dark:text-zinc-50 mt-0 mb-3 flex items-center gap-2 text-sm">
        <HelpCircle className="h-5 w-5 text-violet-500 shrink-0" />
        Quiz #{index + 1}: {q.question}
      </h4>
      <div className="space-y-2">
        {q.options.map((opt, oi) => {
          let classes =
            'w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-200 ';
          if (!isAnswered) {
            classes +=
              'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-violet-400 dark:hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 cursor-pointer';
          } else if (oi === q.correctIndex) {
            classes +=
              'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-200 font-semibold';
          } else if (oi === selected) {
            classes +=
              'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-200 line-through';
          } else {
            classes +=
              'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 opacity-50';
          }

          return (
            <button
              key={oi}
              onClick={() => handleSelect(oi)}
              disabled={isAnswered}
              className={classes}
            >
              <span className="flex items-center gap-2">
                {isAnswered && oi === q.correctIndex && (
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
                )}
                {isAnswered && oi === selected && oi !== q.correctIndex && (
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                )}
                {!isAnswered && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-600 text-xs font-mono text-zinc-500 shrink-0">
                    {String.fromCharCode(65 + oi)}
                  </span>
                )}
                {opt}
              </span>
            </button>
          );
        })}
      </div>
      {isAnswered && (
        <div
          className={`mt-3 p-3 rounded-lg text-xs ${
            isCorrect
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-900 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-200'
          }`}
        >
          <p className="m-0">
            <strong>{isCorrect ? '✅ Correct!' : '❌ Incorrect.'}</strong>{' '}
            {q.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Console Output ─── */
export function ConsoleOutput({ lines }: { lines: string[] }) {
  return (
    <div className="mt-3 rounded-lg overflow-hidden border border-zinc-700">
      <div className="bg-zinc-800 px-3 py-1.5 flex items-center gap-2 border-b border-zinc-700">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-zinc-400 text-xs font-mono ml-2">Console Output</span>
      </div>
      <div className="bg-zinc-950 p-3 font-mono text-xs text-zinc-200 space-y-0.5">
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="text-zinc-600 select-none mr-3 w-4 text-right shrink-0">
              {i + 1}
            </span>
            <span
              className={
                line.startsWith('//')
                  ? 'text-zinc-500 italic'
                  : line.startsWith('>')
                  ? 'text-green-400'
                  : line.startsWith('Error') || line.startsWith('❌')
                  ? 'text-red-400'
                  : ''
              }
            >
              {line}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Diagram ─── */
export function Diagram({ title, svg }: { title: string; svg: string }) {
  return (
    <div className="mt-4 mb-2">
      {title && (
        <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{title}</h4>
      )}
      <div
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
