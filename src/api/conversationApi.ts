import api from "./axios";
import type { Conversation } from "../types/conversation";

export async function getConversations(
    repositoryId: number
): Promise<Conversation[]> {

    const response = await api.get(
        `/repositories/${repositoryId}/conversations`
    );

    return response.data;
}

export async function createConversation(repositoryId: number) {
    const response = await api.post(
        `/repositories/${repositoryId}/conversations`
    );

    return response.data;
}

export async function updateConversationTitle(
    conversationId: number,
    title: string
) {
    await api.patch(
        `/repositories/conversations/${conversationId}/title`,
        {
            title,
        }
    );
}

export async function deleteConversation(
    conversationId: number
) {
    await api.delete(
        `/repositories/conversations/${conversationId}`
    );
}