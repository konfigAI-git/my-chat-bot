"use client";

import React from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isTyping: boolean;
}

export function ChatInput({ value, onChange, onSend, onKeyPress, isTyping }: ChatInputProps) {
  return (
    <div
      className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4"
      data-testid="chat-input-area"
      role="search"
      aria-label="Chat input"
    >
      <div className="max-w-7xl mx-auto flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Type your question here..."
            className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 rounded-xl text-sm resize-none outline-none max-h-32 min-h-[44px]"
            rows={1}
            data-testid="chat-input"
            aria-label="Type your question"
            disabled={isTyping}
          />
          <button
            onClick={onSend}
            disabled={!value.trim() || isTyping}
            className="absolute right-2 bottom-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            data-testid="send-button"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
        AI responses may be inaccurate. For critical issues, contact IT Helpdesk.
      </p>
    </div>
  );
}
