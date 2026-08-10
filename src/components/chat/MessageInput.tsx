import { useState } from "react";

interface MessageInputProps {
    onSend: (question: string) => void;
    disabled: boolean;
}

export default function MessageInput({
    onSend,
    disabled,
}: MessageInputProps) {

    const [question, setQuestion] = useState("");

    function send() {
        if (disabled) {
            return;
        }
        if (!question.trim()) {
            return;
        }

        onSend(question);

        setQuestion("");

    }

    return (
        <div className="border-t pt-4 flex gap-3">

            <input
                value={question}
                disabled={disabled}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        send();
                    }
                }}
                className="flex-1 border rounded-lg px-4 py-3"
                placeholder="Ask anything about this repository..."
            />

            <button
                onClick={send}
                disabled={disabled}
                className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                Send
            </button>

        </div>
    );
}