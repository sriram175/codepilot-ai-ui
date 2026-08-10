export interface Source {
    fileName: string;
    filePath: string;
}

export interface Message {
    id: number;
    content: string;
    messageRole: "USER" | "ASSISTANT";
    createdAt?: string;
    sources?: Source[];
}