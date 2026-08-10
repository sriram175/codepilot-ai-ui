import api from "./axios";

export async function getMessages(conversationId: number) {
    const response = await api.get(
        `/repositories/conversations/${conversationId}/messages`
    );

    return response.data;
}

export async function sendMessage(
    conversationId: number,
    question: string
) {
    const response = await api.post(
        `/chat/conversations/${conversationId}/chat`,
        {
            question,
        }
    );

    return response.data;
}