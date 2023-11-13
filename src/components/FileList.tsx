import { List, ListItemButton, ListItemText, SxProps, Theme } from '@mui/material';
import { useCallback } from 'react';
import { FileEntry } from '../types';
import { Loadable } from '../utils/loadable';

interface Props {
    sx?: SxProps<Theme>;
    data?: Loadable<FileEntry[]>;
    selectedName?: string;
    onClick: (name: string) => void;
}

export default function FileList({ sx = {}, data, selectedName, onClick }: Props) {
    const files = data?.read() ?? [];

    return (
        <List sx={sx}>
            {files.map((file) => (
                <FileListItem
                    key={file.name}
                    file={file}
                    selected={file.name === selectedName}
                    onClick={onClick}
                />
            ))}
        </List>
    );
}

interface FileListItemProps {
    file: FileEntry;
    selected?: boolean;
    onClick: (name: string) => void;
}

function FileListItem({ file, selected = false, onClick }: FileListItemProps) {
    const handleClick = useCallback(() => {
        if (file.kind === 'file') {
            onClick(file.name);
        }
    }, [file.kind, file.name, onClick]);

    return (
        <ListItemButton selected={selected} onClick={handleClick}>
            <ListItemText primary={file.name} />
        </ListItemButton>
    );
}
