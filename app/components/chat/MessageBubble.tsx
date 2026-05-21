"use client";

import React from "react";
import { User, Bot } from "lucide-react";

interface MessageBubbleProps {
  message: {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
    isTyping?: boolean;
  };
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex w-full mb-4 ${isUser ? "justify-end" : "justify-start"}`}
      data-testid={`message-${message.id}`}
      role="article"
      aria-label={`${isUser ? "User" : "Bot"} message`}
    >
      <div
        className={`flex max-w-[85%] md:max-w-[75%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        } items-start gap-2`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? "bg-blue-500" : "bg-gray-500"
          }`}
          aria-hidden="true"
        >
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>

        {/* Bubble */}
        <div
          className={`flex flex-col ${
            isUser
              ? "items-end"
              : "items-start"
          }`}
        >
          <div
            className={`px-4 py-3 rounded-2xl ${
              isUser
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-gray-100 text-gray-800 rounded-bl-none dark:bg-gray-700 dark:text-gray-100"
            }`}
          >
            {message.isTyping ? (
              <div className="flex items-center gap-1" data-testid="typing-indicator">
                <span className="sr-only">Bot is typing</span>
                <div className="typing-dots">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            ) : (
              <div
                className="markdown-content"
                dangerouslySetInnerHTML={{ __html: message.text }}
              />
            )}
          </div>
          <span className="text-xs text-gray-500 mt-1 px-1">
            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>
    </div>
  );
}
