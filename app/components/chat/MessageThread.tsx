"use client";

import React from "react";
import { MessageBubble } from "./MessageBubble";
import { SuggestedPrompts } from "./SuggestedPrompts";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isTyping?: boolean;
  suggestedPrompts?: string[];
}

interface MessageThreadProps {
  messages: Message[];
  onPromptClick: (prompt: string) => void;
}

export function MessageThread({ messages, onPromptClick }: MessageThreadProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="flex-1 overflow-y-auto p-4 md:p-6 chat-scroll"
      data-testid="message-thread"
      role="log"
      aria-label="Chat conversation"
      aria-live="polite"
    >
      {messages.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center h-full text-center py-12"
          data-testid="empty-state"
        >
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-10 h-10 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Welcome to IT Helpdesk
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            Ask me anything about VDI, phone systems, scanners, or general IT support.
          </p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <React.Fragment key={message.id}>
              <MessageBubble message={message} />
              {message.suggestedPrompts && message.sender === "bot" && (
                <SuggestedPrompts
                  prompts={message.suggestedPrompts}
                  onPromptClick={onPromptClick}
                />
              )}
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
