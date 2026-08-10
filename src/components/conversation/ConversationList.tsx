import type { Conversation } from "../../types/conversation";

interface ConversationListProps {
    conversations: Conversation[];
    selectedConversationId: number | null;
    onConversationSelect: (conversationId: number) => void;
    onCreateConversation: () => void;
    onDeleteConversation: (conversationId: number) => void;
}

export default function ConversationList({
    conversations,
    selectedConversationId,
    onConversationSelect,
    onCreateConversation,
    onDeleteConversation,
}: ConversationListProps) {

    console.log({
    onCreateConversation,
    onDeleteConversation,
});
    return (
        <div className="bg-gray-50 rounded-xl p-4 shadow">

            <h2 className="text-xl font-semibold mb-4">
                Conversations
            </h2>

            {conversations.map((conversation) => (

                <div
                    key={conversation.id}
                    className={`flex items-center justify-between p-3 rounded-lg transition ${selectedConversationId === conversation.id
                            ? "bg-blue-100"
                            : "hover:bg-gray-200"
                        }`}
                >

                    <div
                        onClick={() => onConversationSelect(conversation.id)}
                        className="flex-1 cursor-pointer"
                    >
                        💬 {conversation.title}
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(conversation.id);
                        }}
                        className="ml-2 text-red-500 hover:text-red-700"
                        title="Delete Conversation"
                    >
                        🗑
                    </button>

                </div>

            ))}

            <button
                onClick={onCreateConversation}
                className="mt-6 w-full rounded-lg bg-blue-600 text-white py-2 hover:bg-blue-700"
            >
                + New Conversation
            </button>

        </div>
    );
}