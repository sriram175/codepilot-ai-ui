import type { Repository } from "../types/Temp";
import api from "./axios";

export async function getRepositories(): Promise<Repository[]> {
    const response = await api.get("/repositories");
    return response.data;
}

export async function getRepository(
    repositoryId: number
): Promise<Repository> {
    const response = await api.get(`/repositories/${repositoryId}`);
    return response.data;
}

export async function deleteRepository(repositoryId: number) {
    await api.delete(`/repositories/${repositoryId}`);
}
export async function ingestRepository(repositoryUrl: string) {
    const response = await api.post("/ingest", {
        repositoryUrl,
    });

    return response.data;
}