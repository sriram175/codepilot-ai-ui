import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import type { Message } from "../../types/message";
import MessageInput from "./MessageInput";

interface ChatWindowProps {
    messages: Message[];
    loading: boolean;
    onSend: (question: string) => void;
    hasConversation: boolean;
}

export default function ChatWindow({
    messages,
    loading,
    onSend,
    hasConversation,
}: ChatWindowProps) {

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, loading]);

    return (
        <div className="bg-white rounded-xl shadow p-6 h-[700px] flex flex-col">

            <h2 className="text-2xl font-semibold mb-6">
                Chat
            </h2>

            <div className="flex-1 overflow-y-auto">

                {messages.length === 0 && (
                    <p className="text-gray-500">
                        Select a conversation to begin.
                    </p>
                )}

                {messages.map((message) => (

                    <div
                        key={message.id}
                        className={`mb-4 flex ${message.messageRole === "USER"
                            ? "justify-end"
                            : "justify-start"
                            }`}
                    >

                        <div
                            className={`max-w-[75%] rounded-xl px-4 py-3 ${message.messageRole === "USER"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100"
                                }`}
                        >

                            <ReactMarkdown>
                                {message.content}
                            </ReactMarkdown>

                            {message.sources && message.sources.length > 0 && (

                                <div className="mt-4 border-t pt-3">

                                    <p className="text-sm font-semibold mb-2">
                                        Sources
                                    </p>

                                    {message.sources.map((source) => (

                                        <button
                                            key={source.filePath}
                                            className="w-full text-left text-sm bg-gray-200 hover:bg-gray-300 rounded px-3 py-2 mb-2 transition"
                                        >
                                            📄 {source.fileName}
                                        </button>

                                    ))}

                                </div>

                            )}

                        </div>

                    </div>

                ))}

                {loading && (
                    <div className="mb-4 flex justify-start">
                        <div className="bg-gray-100 rounded-xl px-4 py-3 animate-pulse">
                            Thinking...
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />

            </div>

            <MessageInput
                onSend={onSend}
                disabled={loading || !hasConversation}
            />

        </div>
    );
}