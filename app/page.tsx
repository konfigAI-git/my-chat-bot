"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MessageThread } from "@/components/chat/MessageThread";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { SuggestedPrompts } from "@/components/chat/SuggestedPrompts";
import { loadKnowledgeBase, searchKnowledgeBase, createSearchIndex, getEscalationMessage, type KnowledgeEntry } from "@/services/searchService";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isTyping?: boolean;
  suggestedPrompts?: string[];
}

export default function ChatPage() {
  // State
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
  const [popularIssues, setPopularIssues] = React.useState<string[]>([
    "How to reset VDI password?",
    "VPN connection issues",
    "Scanner not responding",
    "Phone system access",
    "General IT support hours"
  ]);
  const [knowledgeBase, setKnowledgeBase] = React.useState<KnowledgeEntry[]>([]);
  const [searchIndex, setSearchIndex] = React.useState<Fuse<KnowledgeEntry> | null>(null);
  const [isDataLoading, setIsDataLoading] = React.useState(true);

  // Load knowledge base on mount
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadKnowledgeBase();
        setKnowledgeBase(data);
        setSearchIndex(createSearchIndex(data));
        setIsDataLoading(false);
      } catch (error) {
        console.error("Error loading knowledge base:", error);
        setIsDataLoading(false);
      }
    };
    loadData();
  }, []);

  // Search service using Fuse.js
  const searchService = async (query: string): Promise<{ answer: string; suggestedPrompts: string[] }> => {
    // Simulate network delay for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 150));

    if (!searchIndex || knowledgeBase.length === 0) {
      // Fallback if data not loaded yet
      return {
        answer: "I'm still loading the knowledge base. Please wait a moment and try again.",
        suggestedPrompts: []
      };
    }

    try {
      const { bestMatch, hasLowConfidence } = await searchKnowledgeBase(query, knowledgeBase, searchIndex);

      if (bestMatch && !hasLowConfidence) {
        // Found a good match
        const matchedEntry = bestMatch.entry;
        
        // Generate suggested prompts based on the matched entry
        const suggestedPrompts = [
          `More about ${matchedEntry.category}`,
          `Issues with ${matchedEntry.category}`,
          `How to use ${matchedEntry.category}`,
          `Troubleshooting ${matchedEntry.category}`
        ].filter((prompt) => !prompt.includes("undefined"));

        return {
          answer: matchedEntry.answer,
          suggestedPrompts
        };
      } else {
        // Low confidence match - escalate to helpdesk
        return {
          answer: getEscalationMessage(),
          suggestedPrompts: ["Contact IT Helpdesk", "Submit a ticket", "IT support hours", "How to reach IT"]
        };
      }
    } catch (error) {
      console.error("Search error:", error);
      return {
        answer: getEscalationMessage(),
        suggestedPrompts: ["Contact IT Helpdesk", "Submit a ticket", "IT support hours"]
      };
    }
  };

  // Handle sending message
  const handleSendMessage = async (query: string) => {
    if (!query.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: query,
      sender: "user",
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Add typing indicator
    setIsTyping(true);

    // Add bot typing message
    const botTypingMessage: Message = {
      id: `bot-typing-${Date.now()}`,
      text: "",
      sender: "bot",
      timestamp: new Date(),
      isTyping: true
    };

    setMessages((prev) => [...prev, botTypingMessage]);

    // Get response from search service
    try {
      const response = await searchService(query);

      // Remove typing indicator
      setMessages((prev) => prev.filter((m) => m.id !== `bot-typing-${Date.now()}`));

      // Add bot response
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: response.answer,
        sender: "bot",
        timestamp: new Date(),
        suggestedPrompts: response.suggestedPrompts
      };

      setMessages((prev) => [...prev, botMessage]);

      // Update recent searches
      if (!recentSearches.includes(query)) {
        setRecentSearches((prev) => [query, ...prev].slice(0, 5));
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => prev.filter((m) => m.id !== `bot-typing-${Date.now()}`));
      
      const errorMessage: Message = {
        id: `bot-error-${Date.now()}`,
        text: "I encountered an error processing your request. Please try again.",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle suggested prompt click
  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  // Handle header search
  const handleHeaderSearch = (query: string) => {
    handleSendMessage(query);
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // In a real app, this would filter the knowledge base
  };

  // Handle keyboard shortcut
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900" data-testid="chat-page">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        onPromptClick={handlePromptClick}
        recentSearches={recentSearches}
        popularIssues={popularIssues}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onSearch={handleHeaderSearch}
        />

        <MessageThread
          messages={messages}
          onPromptClick={handlePromptClick}
        />

        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={() => handleSendMessage(inputValue)}
          onKeyPress={handleKeyPress}
          isTyping={isTyping}
        />
      </div>
    </div>
  );
}
