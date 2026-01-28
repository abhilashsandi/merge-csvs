'use client';

import { AppAction } from '@/app/types/csv';
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
import { GripVertical, X, Key } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/components/ui/tooltip';

interface ActiveColumnsListProps {
    columns: string[];
    primaryKeys: string[];
    dispatch: React.Dispatch<AppAction>;
}

function SortableColumn({
    column,
    isPrimaryKey,
    onRemove,
}: {
    column: string;
    isPrimaryKey: boolean;
    onRemove: () => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: column });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1, // Reduced opacity when dragging
        zIndex: isDragging ? 50 : 1,
        position: 'relative' as const,
    };

    return (
        <div ref={setNodeRef} style={style} className="touch-none">
            <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`
                    group flex items-center justify-between rounded-md border px-3 py-2.5 shadow-sm transition-all
                    ${isPrimaryKey
                        ? 'border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50'
                        : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'
                    }
                    ${isDragging ? 'shadow-lg ring-2 ring-zinc-900 ring-offset-2 dark:ring-zinc-100' : ''}
                `}
            >
                <div className="flex flex-1 items-center gap-3 overflow-hidden">
                    {/* Drag handle */}
                    <button
                        {...attributes}
                        {...listeners}
                        className="cursor-grab text-zinc-400 hover:text-zinc-600 active:cursor-grabbing dark:hover:text-zinc-300"
                        aria-label="Drag to reorder"
                    >
                        <GripVertical className="h-4 w-4" />
                    </button>

                    {/* Column name */}
                    <div className="flex flex-1 items-center gap-2 overflow-hidden">
                        <span
                            className={`truncate text-sm font-medium ${isPrimaryKey
                                ? 'text-zinc-900 dark:text-zinc-100'
                                : 'text-zinc-700 dark:text-zinc-300'
                                }`}
                            title={column}
                        >
                            {column}
                        </span>

                        {isPrimaryKey && (
                            <span className="flex items-center gap-1 rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white dark:bg-zinc-100 dark:text-zinc-900">
                                <Key className="h-3 w-3" />
                                Key
                            </span>
                        )}
                    </div>
                </div>

                {/* Remove button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onRemove}
                    className="h-7 w-7 text-zinc-400 opacity-0 transition-all hover:bg-zinc-100 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-zinc-800"
                >
                    <X className="h-3.5 w-3.5" />
                    <span className="sr-only">Remove {column} column</span>
                </Button>
            </motion.div>
        </div>
    );
}

export function ActiveColumnsList({ columns, primaryKeys, dispatch }: ActiveColumnsListProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = columns.indexOf(active.id as string);
            const newIndex = columns.indexOf(over.id as string);
            const newColumns = arrayMove(columns, oldIndex, newIndex);
            dispatch({ type: 'REORDER_COLUMNS', payload: newColumns });
        }
    };

    if (columns.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 bg-zinc-50/50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900/50"
            >
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    No active columns. Upload CSV files or add columns from the removed list.
                </p>
            </motion.div>
        );
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={columns} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {columns.map((column) => (
                            <SortableColumn
                                key={column}
                                column={column}
                                isPrimaryKey={primaryKeys.includes(column)}
                                onRemove={() => dispatch({ type: 'REMOVE_COLUMN', payload: column })}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </SortableContext>
        </DndContext>
    );
}
