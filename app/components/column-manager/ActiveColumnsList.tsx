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
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
        group flex items-center justify-between rounded-lg border p-3 
        ${isPrimaryKey
                    ? 'border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30'
                    : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
                }
        transition-all hover:shadow-md
      `}
        >
            <div className="flex items-center gap-2">
                {/* Drag handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab text-zinc-400 hover:text-zinc-600 active:cursor-grabbing dark:hover:text-zinc-300"
                    aria-label="Drag to reorder"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>

                {/* Column name */}
                <span
                    className={`text-sm font-medium ${isPrimaryKey
                        ? 'text-blue-900 dark:text-blue-100'
                        : 'text-zinc-900 dark:text-zinc-100'
                        }`}
                    title={column}
                >
                    {column}
                </span>

                {isPrimaryKey && (
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                        Key
                    </span>
                )}
            </div>

            {/* Remove button */}
            <button
                onClick={onRemove}
                className="rounded p-1 text-zinc-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                aria-label={`Remove ${column}`}
            >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
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
            <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    No columns available. Upload CSV files to get started.
                </p>
            </div>
        );
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={columns} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                    {columns.map((column) => (
                        <SortableColumn
                            key={column}
                            column={column}
                            isPrimaryKey={primaryKeys.includes(column)}
                            onRemove={() => dispatch({ type: 'REMOVE_COLUMN', payload: column })}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
