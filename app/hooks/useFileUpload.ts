'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { parseCSVFile } from '../utils/csv-parser';
import { AppAction } from '../types/csv';

interface UseFileUploadProps {
    dispatch: React.Dispatch<AppAction>;
}

export function useFileUpload({ dispatch }: UseFileUploadProps) {
    const [isLoading, setIsLoading] = useState(false);
    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            setIsLoading(true);
            dispatch({ type: 'SET_UPLOADING', payload: true });

            try {
                const parsedFiles = await Promise.all(
                    acceptedFiles.map((file) => parseCSVFile(file))
                );

                dispatch({ type: 'ADD_FILES', payload: parsedFiles });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to upload files';
                dispatch({ type: 'SET_UPLOAD_ERROR', payload: errorMessage });
            } finally {
                setIsLoading(false);
                dispatch({ type: 'SET_UPLOADING', payload: false });
            }
        },
        [dispatch]
    );

    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.csv'],
        },
        multiple: true,
    });

    return {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        isLoading,
    };
}
