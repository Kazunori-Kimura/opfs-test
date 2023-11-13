import { FileEntry, WorkerResponse } from '../types';

const worker = new Worker(new URL('../worker.ts', import.meta.url));

export function readAsync(name: string): Promise<string> {
    return new Promise((resolve) => {
        worker.addEventListener(
            'message',
            (event: MessageEvent<WorkerResponse>) => {
                const { type, ok, error } = event.data;
                if (type === 'read') {
                    if (ok) {
                        resolve(event.data.content);
                    } else {
                        console.error(error);
                        resolve('');
                    }
                }
            },
            {
                once: true,
            }
        );
        worker.postMessage({ type: 'read', name });
    });
}

export function writeAsync(name: string, content: string): Promise<void> {
    return new Promise((resolve, reject) => {
        worker.addEventListener(
            'message',
            (event: MessageEvent<WorkerResponse>) => {
                const { type, ok, error } = event.data;
                if (type === 'write') {
                    if (ok) {
                        resolve();
                    } else {
                        reject(error);
                    }
                }
            },
            {
                once: true,
            }
        );
        worker.postMessage({ type: 'write', name, content });
    });
}

export function removeAsync(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
        worker.addEventListener(
            'message',
            (event: MessageEvent<WorkerResponse>) => {
                const { type, ok, error } = event.data;
                if (type === 'remove') {
                    if (ok) {
                        resolve();
                    } else {
                        reject(error);
                    }
                }
            },
            {
                once: true,
            }
        );
        worker.postMessage({ type: 'remove', name });
    });
}

export function listAsync(name: string = ''): Promise<FileEntry[]> {
    return new Promise((resolve, reject) => {
        worker.addEventListener(
            'message',
            (event: MessageEvent<WorkerResponse>) => {
                const { type, ok, error } = event.data;
                if (type === 'list') {
                    if (ok) {
                        resolve(event.data.content);
                    } else {
                        reject(error);
                    }
                }
            },
            {
                once: true,
            }
        );
        worker.postMessage({ type: 'list', name });
    });
}
