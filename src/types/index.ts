interface WorkerReadRequest {
    type: 'read';
    name: string;
}

interface WorkerWriteRequest {
    type: 'write';
    name: string;
    content: string;
}

interface WorkerRemoveRequest {
    type: 'remove';
    name: string;
}

interface WorkerListRequst {
    type: 'list';
    /**
     * 対象フォルダ
     */
    name: string;
}

export type WorkerRequest =
    | WorkerReadRequest
    | WorkerWriteRequest
    | WorkerRemoveRequest
    | WorkerListRequst;

interface WorkerReadResponse {
    type: 'read';
    name: string;
    content: string;
    ok: boolean;
    error?: Error;
}

interface WorkerWriteResponse {
    type: 'write';
    name: string;
    ok: boolean;
    error?: Error;
}

interface WorkerRemoveResponse {
    type: 'remove';
    name: string;
    ok: boolean;
    error?: Error;
}

export interface FileEntry {
    kind: 'file' | 'directory';
    name: string;
}

interface WorkerListResponse {
    type: 'list';
    name: string;
    content: FileEntry[];
    ok: boolean;
    error?: Error;
}

export type WorkerResponse =
    | WorkerReadResponse
    | WorkerWriteResponse
    | WorkerRemoveResponse
    | WorkerListResponse;
