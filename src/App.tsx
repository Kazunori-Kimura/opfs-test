import { Button, CssBaseline, Grid, Skeleton, Stack, TextField } from '@mui/material';
import { ChangeEvent, FormEvent, Suspense, useCallback, useRef, useState } from 'react';
import Content from './components/Content';
import FileList from './components/FileList';
import useFile from './hooks/file';
import { writeAsync } from './utils/file';

export default function App() {
    const { files, loadFiles, data, selectFile, selectedName } = useFile();

    const [name, setName] = useState('');
    const [content, setContent] = useState('');

    const isEditing = useRef(false);

    const handleClickNewFile = useCallback(() => {
        // ファイル選択を解除する
        selectFile();
    }, [selectFile]);

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        switch (name) {
            case 'name':
                setName(value);
                break;
            case 'content':
                setContent(value);
                isEditing.current = true;
                break;
        }
    }, []);

    const handleSubmit = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            if (isEditing.current && event.currentTarget.checkValidity()) {
                // 変更があったら保存する
                await writeAsync(name, content);
                // リストの再読み込み
                loadFiles();
            }
        },
        [content, loadFiles, name]
    );

    return (
        <>
            <CssBaseline />
            <Grid container sx={{ p: 3 }} spacing={1}>
                <Grid item xs={2}>
                    <Button variant="contained" fullWidth onClick={handleClickNewFile}>
                        新規ファイル
                    </Button>
                    <FileList data={files} selectedName={selectedName} onClick={selectFile} />
                </Grid>
                <Grid item xs={10}>
                    <Stack
                        direction="column"
                        spacing={2}
                        component="form"
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit}
                    >
                        <TextField
                            id="file-name"
                            name="name"
                            label="ファイル名"
                            fullWidth
                            required
                            value={selectedName || name}
                            onChange={handleChange}
                            InputProps={{
                                readOnly: Boolean(selectedName),
                            }}
                        />
                        <Suspense fallback={<Skeleton variant="rectangular" height="140" />}>
                            <Content data={data} onChange={handleChange} />
                        </Suspense>
                        <Stack direction="row">
                            <Button variant="contained" type="submit">
                                保存
                            </Button>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}
