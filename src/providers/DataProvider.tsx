import { ReactNode, createContext, useCallback, useEffect, useState } from 'react';
import { FileEntry } from '../types';
import { listAsync, readAsync } from '../utils/file';
import { Loadable } from '../utils/loadable';

interface Props {
    children: ReactNode;
}

interface IDataContext {
    files?: Loadable<FileEntry[]>;
    loadFiles: VoidFunction;
    data?: Loadable<string>;
    selectedName?: string;
    selectFile: (name?: string) => void;
}

export const DataContext = createContext<IDataContext>(undefined!);

export default function DataProvider({ children }: Props) {
    const [files, setFiles] = useState<Loadable<FileEntry[]>>();
    const [data, setData] = useState<Loadable<string>>();
    const [selectedName, setSelectedName] = useState<string>();

    const loadFiles = useCallback(() => {
        setFiles(new Loadable(listAsync()));
    }, []);

    const selectFile = useCallback((name?: string) => {
        setSelectedName(name);
        if (name) {
            setData(new Loadable(readAsync(name)));
        } else {
            setData(undefined);
        }
    }, []);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    return (
        <DataContext.Provider
            value={{
                files,
                loadFiles,
                data,
                selectedName,
                selectFile,
            }}
        >
            {children}
        </DataContext.Provider>
    );
}
