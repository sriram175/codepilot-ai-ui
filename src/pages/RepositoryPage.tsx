import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRepository } from "../api/repositoryApi";
import type { Repository } from "../types/Temp";
import type { Conversation } from "../types/conversation";
import ConversationList from "../components/conversation/ConversationList";
import ChatWindow from "../components/chat/ChatWindow";
import { getMessages, sendMessage } from "../api/chatApi";
import type { Message } from "../types/message";
import {
    getConversations,
    createConversation,
    updateConversationTitle,
} from "../api/conversationApi";
import { useNavigate } from "react-router-dom";
import { deleteConversation } from "../api/conversationApi";
import { toast } from "sonner";

export default function RepositoryPage() {

    const { repositoryId } = useParams();

    const [repository, setRepository] = useState<Repository | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversationId, setSelectedConversationId] =
        useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadRepository();
    }, []);

    useEffect(() => {

        if (!selectedConversationId) {
            setMessages([]);
            return;
        }

        loadMessages();

    }, [selectedConversationId]);

    async function loadRepository() {

        if (!repositoryId) {
            return;
        }

        try {

            const repositoryData = await getRepository(Number(repositoryId));
            setRepository(repositoryData);

            const conversationData = await getConversations(Number(repositoryId));
            setConversations(conversationData);

        } catch (error) {

            console.error(error);

            toast.error("Failed to load repository.");

        }

    }

    async function loadMessages() {

        if (!selectedConversationId) {
            return;
        }

        try {

            const data = await getMessages(selectedConversationId);

            setMessages(data);

        } catch (error) {

            console.error(error);

            setMessages([]);

            toast.error("Failed to load messages.");

        }

    }

    async function handleCreateConversation() {

        if (!repositoryId) {
            return;
        }

        try {

            const conversation = await createConversation(
                Number(repositoryId)
            );

            setConversations(prev => [
                conversation,
                ...prev,
            ]);

            setSelectedConversationId(conversation.id);

            setMessages([]);

        } catch (error) {

            console.error(error);

            toast.error("Failed to create conversation.");

        }

    }

    async function handleSend(question: string) {

        if (!selectedConversationId) {
            return;
        }

        const userMessage: Message = {
            id: Date.now(),
            content: question,
            messageRole: "USER",
        };

        setMessages(prev => [...prev, userMessage]);

        setLoading(true);

        try {

            const selectedConversation = conversations.find(
                conversation => conversation.id === selectedConversationId
            );

            const title =
                question.length > 50
                    ? question.substring(0, 50) + "..."
                    : question;

            if (selectedConversation?.title === "New Chat") {

                await updateConversationTitle(
                    selectedConversationId,
                    title
                );

                setConversations(prev =>
                    prev.map(conversation =>
                        conversation.id === selectedConversationId
                            ? {
                                ...conversation,
                                title,
                            }
                            : conversation
                    )
                );
            }

            const response = await sendMessage(
                selectedConversationId,
                question
            );

            const assistantMessage: Message = {
                id: Date.now() + 1,
                content: response.answer,
                messageRole: "ASSISTANT",
                sources: response.sources,
            };

            setMessages(prev => [...prev, assistantMessage]);

        } catch (error) {

            console.error(error);

            const errorMessage: Message = {
                id: Date.now() + 1,
                content:
                    "⚠️ Sorry, something went wrong while generating the response. Please try again.",
                messageRole: "ASSISTANT",
            };

            setMessages(prev => [...prev, errorMessage]);

        } finally {

            setLoading(false);

        }
    }
    async function handleDeleteConversation(
        conversationId: number
    ) {

        const confirmed = window.confirm(
            "Delete this conversation?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteConversation(conversationId);

            setConversations(prev =>
                prev.filter(c => c.id !== conversationId)
            );

            if (selectedConversationId === conversationId) {
                setSelectedConversationId(null);
                setMessages([]);
            }

        } catch (error) {

            console.error(error);

            toast.error("Failed to delete conversation.");

        }

    }

    if (!repository) {
        return <h2>Loading...</h2>;
    }
    console.log({
        handleCreateConversation,
        handleDeleteConversation,
    });

    return (
        <div className="min-h-screen bg-gray-100">

            <div className="max-w-7xl mx-auto p-8">

                <div className="flex justify-between items-center mb-8">

                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">
                            {repository.repositoryName}
                        </h1>

                        <p className="text-gray-500 mt-2">
                            {repository.repositoryUrl}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/")}
                        className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                    >
                        ← Back
                    </button>

                </div>

                <div className="grid grid-cols-4 gap-8">

                    <ConversationList
                        conversations={conversations}
                        selectedConversationId={selectedConversationId}
                        onConversationSelect={setSelectedConversationId}
                        onCreateConversation={handleCreateConversation}
                        onDeleteConversation={handleDeleteConversation}
                    />

                    <div className="col-span-3">
                        <ChatWindow
                            messages={messages}
                            loading={loading}
                            onSend={handleSend}
                            hasConversation={selectedConversationId !== null}
                        />
                    </div>

                </div>

            </div>

        </div>
    );
}
