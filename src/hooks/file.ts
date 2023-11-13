import { useContext } from 'react';
import { DataContext } from '../providers/DataProvider';

export default function useFile() {
    const { files, loadFiles, data, selectFile, selectedName } = useContext(DataContext);

    return {
        files,
        loadFiles,
        data,
        selectFile,
        selectedName,
    };
}
