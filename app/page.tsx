'use client';

import { FileUploadZone } from './components/file-upload/FileUploadZone';
import { FileList } from './components/file-upload/FileList';
import { ActiveColumnsList } from './components/column-manager/ActiveColumnsList';
import { RemovedColumnsList } from './components/column-manager/RemovedColumnsList';
import { PrimaryKeySelector } from './components/column-manager/PrimaryKeySelector';
import { MergeControls } from './components/merge/MergeControls';
import { PreviewTable } from './components/merge/PreviewTable';
import { DownloadButton } from './components/download/DownloadButton';
import { useAppState } from './hooks/useAppState';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function Home() {
  const { state, dispatch } = useAppState();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Scroll to results when mergedData is populated
  useEffect(() => {
    if (state.mergedData && state.mergedData.length > 0) {
      // Small timeout to ensure DOM is rendered before scrolling
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [state.mergedData]);

  return (
    <div className="min-h-screen bg-zinc-50 selection:bg-zinc-900 selection:text-white dark:bg-zinc-950 dark:selection:bg-white dark:selection:text-zinc-900">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid gap-6 lg:grid-cols-3"
        >
          {/* Column 1: Upload & Keys */}
          <div className="space-y-6">
            {/* 1. Upload Section */}
            <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  1. Upload CSV Files
                </h2>
              </div>
              <FileUploadZone dispatch={dispatch} />
              <div className="mt-4">
                <FileList files={state.uploadedFiles} dispatch={dispatch} />
              </div>
            </section>

            {/* 2. Primary Keys Section */}
            {state.uploadedFiles.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-4">
                  <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    2. Select Primary Key(s)
                  </h2>
                </div>
                <PrimaryKeySelector
                  availableColumns={state.allColumns}
                  selectedKeys={state.primaryKeys}
                  dispatch={dispatch}
                />
              </motion.section>
            )}
          </div>

          {/* Column 2: Column Management */}
          <div className="space-y-6">
            {state.uploadedFiles.length > 0 ? (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col h-full rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-4">
                  <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    3. Manage Columns
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Drag to reorder active columns ({state.activeColumns.length})
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                  <ActiveColumnsList
                    columns={state.activeColumns}
                    primaryKeys={state.primaryKeys}
                    dispatch={dispatch}
                  />
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <RemovedColumnsList
                    columns={state.removedColumns}
                    dispatch={dispatch}
                  />
                </div>
              </motion.section>
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
                <p className="text-sm text-zinc-400 dark:text-zinc-500">
                  Columns will appear here
                </p>
              </div>
            )}
          </div>

          {/* Column 3: Merge & Download */}
          <div className="space-y-6">
            {state.uploadedFiles.length > 0 ? (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-4">
                  <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    4. Merge & Download
                  </h2>
                </div>
                <MergeControls state={state} dispatch={dispatch} />
              </motion.section>
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
                <p className="text-sm text-zinc-400 dark:text-zinc-500">
                  Merge controls will appear here
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Bottom Section: Results */}
        <motion.div layout className="mt-8 space-y-6">
          {state.mergedData && (
            <motion.section
              ref={resultsRef} // Attach ref here
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-4 dark:border-zinc-800">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Merged Data Preview
                </h2>
                <div className="w-full sm:w-auto">
                  <DownloadButton
                    data={state.mergedData}
                    activeColumns={state.activeColumns}
                  />
                </div>
              </div>
              <PreviewTable
                data={state.mergedData}
                activeColumns={state.activeColumns}
                primaryKeys={state.primaryKeys}
              />
            </motion.section>
          )}
        </motion.div>
      </div>
    </div>
  );
}
