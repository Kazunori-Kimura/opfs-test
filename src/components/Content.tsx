import { TextField } from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Loadable } from '../utils/loadable';

interface Props {
    data?: Loadable<string>;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function Content({ data, onChange }: Props) {
    const content = data?.read();
    const [value, setValue] = useState(content ?? '');

    const handleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setValue(event.target.value);
            onChange(event);
        },
        [onChange]
    );

    useEffect(() => {
        setValue(content ?? '');
    }, [content]);

    return (
        <TextField
            id="file-content"
            name="content"
            label="内容"
            multiline
            rows={8}
            fullWidth
            value={value}
            onChange={handleChange}
        />
    );
}
