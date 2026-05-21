"use client";

import React from "react";
import { Search, Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
  onSearch: (query: string) => void;
}

export function Header({ onMenuClick, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchQuery("");
    }
  };

  return (
    <header
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3"
      data-testid="chat-header"
      role="banner"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Company Logo */}
        <div className="flex items-center gap-3" data-testid="header-logo">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle sidebar"
              data-testid="menu-toggle"
            >
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">IT</span>
            </div>
            <span className="font-semibold text-gray-800 dark:text-white hidden sm:block">
              Company IT Helpdesk
            </span>
          </div>
        </div>

        {/* Center: Chatbot Title */}
        <div className="flex-1 text-center" data-testid="chat-title">
          <h1 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white">
            AI Assistant
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Instant IT Support
          </p>
        </div>

        {/* Right: Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-md hidden md:block"
          data-testid="search-bar"
          role="search"
          aria-label="Search knowledge base"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search knowledge base..."
              className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 rounded-lg text-sm transition-all outline-none"
              data-testid="search-input"
              aria-label="Search knowledge base"
            />
          </div>
        </form>
      </div>
    </header>
  );
}
