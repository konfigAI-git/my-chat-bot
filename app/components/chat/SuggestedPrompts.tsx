"use client";

import React from "react";
import { Tag } from "lucide-react";

interface SuggestedPromptsProps {
  prompts: string[];
  onPromptClick: (prompt: string) => void;
}

export function SuggestedPrompts({ prompts, onPromptClick }: SuggestedPromptsProps) {
  if (prompts.length === 0) return null;

  return (
    <div
      className="flex flex-wrap gap-2 mt-4"
      data-testid="suggested-prompts"
      role="region"
      aria-label="Suggested related questions"
    >
      {prompts.map((prompt, index) => (
        <button
          key={index}
          className="suggested-chip"
          data-testid={`suggested-prompt-${index}`}
          onClick={() => onPromptClick(prompt)}
          aria-label={`Ask: ${prompt}`}
        >
          <Tag className="w-3 h-3 mr-1" />
          {prompt}
        </button>
      ))}
    </div>
  );
}
