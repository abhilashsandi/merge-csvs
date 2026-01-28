'use client';

import { ParsedCSV, AppAction } from '@/app/types/csv';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, FileText, Trash2, Star } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/components/ui/tooltip';

interface FileListProps {
    files: ParsedCSV[];
    dispatch: React.Dispatch<AppAction>;
}

function SortableFile({
    file,
    index,
    onRemove,
}: {
    file: ParsedCSV;
    index: number;
    onRemove: () => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: file.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
        >
            {/* Gradient overlay for primary file */}
            {index === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10"
                />
            )}

            <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Drag handle */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    {...attributes}
                                    {...listeners}
                                    className="cursor-grab text-zinc-400 hover:text-zinc-600 active:cursor-grabbing dark:hover:text-zinc-300"
                                    aria-label="Drag to reorder files"
                                >
                                    <GripVertical className="h-5 w-5" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>Drag to reorder</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/* File icon */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow"
                    >
                        <FileText className="h-5 w-5" />
                    </motion.div>

                    {/* File info */}
                    <div>
                        <div className="flex items-center gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <p className="font-medium text-zinc-900 dark:text-zinc-100">
                                            {file.filename}
                                        </p>
                                    </TooltipTrigger>
                                    <TooltipContent>{file.filename}</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            {index === 0 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                                >
                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                        <Star className="h-3 w-3" />
                                        Primary
                                    </span>
                                </motion.div>
                            )}
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {file.rowCount.toLocaleString()} rows • {file.headers.length} columns
                        </p>
                    </div>
                </div>

                {/* Remove button */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onRemove}
                                className="opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                                aria-label={`Remove ${file.filename}`}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Remove file</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </motion.div>
    );
}

export function FileList({ files, dispatch }: FileListProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = files.findIndex((file) => file.id === active.id);
            const newIndex = files.findIndex((file) => file.id === over.id);
            const newFiles = arrayMove(files, oldIndex, newIndex);
            dispatch({ type: 'REORDER_FILES', payload: newFiles });
        }
    };

    if (files.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-3"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Uploaded Files ({files.length})
                </h3>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xs text-zinc-500 dark:text-zinc-400"
                >
                    Drag to reorder • First file is primary
                </motion.p>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={files.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                    <AnimatePresence mode="popLayout">
                        <div className="space-y-2">
                            {files.map((file, index) => (
                                <SortableFile
                                    key={file.id}
                                    file={file}
                                    index={index}
                                    onRemove={() => dispatch({ type: 'REMOVE_FILE', payload: file.id })}
                                />
                            ))}
                        </div>
                    </AnimatePresence>
                </SortableContext>
            </DndContext>
        </motion.div>
    );
}
