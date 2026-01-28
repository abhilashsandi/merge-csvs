'use client';

import { useAppState } from './hooks/useAppState';
import { FileUploadZone } from './components/file-upload/FileUploadZone';
import { FileList } from './components/file-upload/FileList';
import { ActiveColumnsList } from './components/column-manager/ActiveColumnsList';
import { RemovedColumnsList } from './components/column-manager/RemovedColumnsList';
import { PrimaryKeySelector } from './components/column-manager/PrimaryKeySelector';
import { MergeControls } from './components/merge/MergeControls';
import { PreviewTable } from './components/merge/PreviewTable';
import { DownloadButton } from './components/download/DownloadButton';

export default function Home() {
  const { state, dispatch } = useAppState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-blue-50 to-purple-50 dark:from-zinc-950 dark:via-blue-950 dark:to-purple-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-white/80 px-6 py-3 shadow-lg backdrop-blur-sm dark:bg-zinc-900/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              CSV Merge Tool
            </h1>
          </div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Merge multiple CSV files with custom column management and primary key joins
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column: Upload & Files */}
          <div className="space-y-6">
            {/* Upload Section */}
            <section className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:bg-zinc-900/80">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                1. Upload CSV Files
              </h2>
              <FileUploadZone dispatch={dispatch} isUploading={state.isUploading} />

              {state.uploadError && (
                <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/20">
                  <p className="text-sm text-red-700 dark:text-red-300">{state.uploadError}</p>
                </div>
              )}

              <div className="mt-6">
                <FileList files={state.uploadedFiles} dispatch={dispatch} />
              </div>
            </section>

            {/* Primary Key Selection */}
            {state.uploadedFiles.length >= 2 && (
              <section className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:bg-zinc-900/80">
                <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  2. Select Primary Key(s)
                </h2>
                <PrimaryKeySelector
                  availableColumns={state.activeColumns}
                  selectedKeys={state.primaryKeys}
                  dispatch={dispatch}
                />
              </section>
            )}
          </div>

          {/* Right Column: Column Management & Merge */}
          <div className="space-y-6">
            {/* Column Management */}
            {state.allColumns.length > 0 && (
              <section className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:bg-zinc-900/80">
                <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  3. Manage Columns
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Active Columns ({state.activeColumns.length})
                    </h3>
                    <ActiveColumnsList
                      columns={state.activeColumns}
                      primaryKeys={state.primaryKeys}
                      dispatch={dispatch}
                    />
                  </div>

                  <RemovedColumnsList columns={state.removedColumns} dispatch={dispatch} />
                </div>
              </section>
            )}

            {/* Merge Controls */}
            {state.uploadedFiles.length > 0 && (
              <section className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:bg-zinc-900/80">
                <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  4. Merge & Download
                </h2>
                <MergeControls state={state} dispatch={dispatch} />
              </section>
            )}
          </div>
        </div>

        {/* Preview & Download Section (Full Width) */}
        {state.mergedData && (
          <div className="mt-8 space-y-6">
            <section className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:bg-zinc-900/80">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Merged Data Preview
              </h2>
              <PreviewTable
                data={state.mergedData}
                columns={state.activeColumns}
                primaryKeys={state.primaryKeys}
              />
            </section>

            <section className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:bg-zinc-900/80">
              <DownloadButton data={state.mergedData} columns={state.activeColumns} />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
