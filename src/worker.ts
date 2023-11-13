/* eslint-disable no-restricted-globals */

import { FileEntry, WorkerRequest, WorkerResponse } from './types';

/**
 * WebWorker エントリポイント
 */
self.onmessage = (event: MessageEvent<WorkerRequest>) => {
    const { type, name } = event.data;
    switch (type) {
        case 'read':
            readFile(name);
            break;
        case 'write':
            writeFile(name, event.data.content);
            break;
        case 'remove':
            removeFile(name);
            break;
        case 'list':
            listFiles(name);
            break;
    }
};

async function readFile(name: string) {
    const response: WorkerResponse = {
        type: 'read',
        name,
        content: '',
        ok: true,
    };

    try {
        const root = await navigator.storage.getDirectory();
        const fileHandle = await root.getFileHandle(name);
        const file = await fileHandle.getFile();
        const content = await file.text();
        response.content = content;
    } catch (err) {
        response.ok = false;
        if (err instanceof Error) {
            response.error = err;
        }
    } finally {
        self.postMessage(response);
    }
}

async function writeFile(name: string, context: string) {
    const response: WorkerResponse = {
        type: 'write',
        name,
        ok: true,
    };

    try {
        const root = await navigator.storage.getDirectory();
        const fileHandle = await root.getFileHandle(name, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(context);
        await writable.close();
    } catch (err) {
        response.ok = false;
        if (err instanceof Error) {
            response.error = err;
        }
    } finally {
        self.postMessage(response);
    }
}

async function removeFile(name: string) {
    const response: WorkerResponse = {
        type: 'remove',
        name,
        ok: true,
    };

    try {
        const root = await navigator.storage.getDirectory();
        root.removeEntry(name);
    } catch (err) {
        response.ok = false;
        if (err instanceof Error) {
            response.error = err;
        }
    } finally {
        self.postMessage(response);
    }
}

async function listFiles(name: string) {
    const response: WorkerResponse = {
        type: 'list',
        name,
        content: [],
        ok: true,
    };

    try {
        const root = await navigator.storage.getDirectory();
        let entries: AsyncIterableIterator<FileSystemDirectoryHandle | FileSystemFileHandle>;
        if (name) {
            const dirHandle = await root.getDirectoryHandle(name);
            entries = dirHandle.values();
        } else {
            entries = root.values();
        }
        const files: FileEntry[] = [];
        for await (const entry of entries) {
            const kind = entry.kind === 'directory' ? 'directory' : 'file';
            files.push({ kind, name: entry.name });
        }

        response.content = files;
    } catch (err) {
        console.error(err);
        response.ok = false;
        if (err instanceof Error) {
            response.error = err;
        }
    } finally {
        self.postMessage(response);
    }
}
