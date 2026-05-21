"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MessageThread } from "@/components/chat/MessageThread";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { SuggestedPrompts } from "@/components/chat/SuggestedPrompts";

// Types
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

  // Mock search service
  const mockSearchService = async (query: string): Promise<{ answer: string; suggestedPrompts: string[] }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const queryLower = query.toLowerCase();
    
    // Simple mock responses based on keywords
    if (queryLower.includes("vdi") || queryLower.includes("virtual")) {
      return {
        answer: "To access the VDI system, please follow these steps:\n\n1. Open your web browser\n2. Navigate to https://vdi.company.com\n3. Enter your domain credentials\n4. Select your virtual desktop\n\nFor first-time setup, download the VMware Horizon client from the IT portal.",
        suggestedPrompts: ["VDI connection issues", "Reset VDI password", "VDI performance", "Install VDI client"]
      };
    }
    
    if (queryLower.includes("phone") || queryLower.includes("voip")) {
      return {
        answer: "For phone system issues:\n\n1. Check your network connection\n2. Restart your phone device\n3. Verify your account settings\n\nContact the phone support team at extension 1234 for further assistance.",
        suggestedPrompts: ["VPN connection issues", "Phone system access", "VoIP configuration", "Phone hardware issues"]
      };
    }
    
    if (queryLower.includes("scanner") || queryLower.includes("scan")) {
      return {
        answer: "Scanner troubleshooting steps:\n\n1. Ensure the scanner is powered on\n2. Check USB connections\n3. Install latest drivers from IT portal\n4. Restart your computer\n\nIf issues persist, contact IT Helpdesk at helpdesk@company.com",
        suggestedPrompts: ["Scanner not responding", "Scan to email issues", "Scanner drivers", "Network scanner setup"]
      };
    }
    
    if (queryLower.includes("helpdesk") || queryLower.includes("contact")) {
      return {
        answer: "IT Helpdesk Contact Information:\n\n📧 Email: helpdesk@company.com\n📞 Phone: Extension 1234\n⏰ Hours: Monday-Friday, 8:00 AM - 8:00 PM\n🌐 Portal: https://helpdesk.company.com",
        suggestedPrompts: ["IT support hours", "Contact IT department", "Submit ticket", "Track ticket status"]
      };
    }

    // Default response
    return {
      answer: "I could not find an exact solution. Please contact IT Helpdesk: helpdesk@company.com Extension: 1234",
      suggestedPrompts: ["VDI connection issues", "VPN connection issues", "Scanner troubleshooting", "Phone system access"]
    };
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
      const response = await mockSearchService(query);

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
