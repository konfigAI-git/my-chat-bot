"use client";

import React from "react";
import { 
  Monitor, 
  Phone, 
  FileText, 
  MessageSquare, 
  Search as SearchIcon,
  History,
  Star
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  onPromptClick: (prompt: string) => void;
  recentSearches: string[];
  popularIssues: string[];
}

export function Sidebar({ 
  isOpen, 
  onClose,
  selectedCategory,
  onCategorySelect,
  onPromptClick,
  recentSearches,
  popularIssues
}: SidebarProps) {
  const categories = [
    { id: "all", name: "All Categories", icon: FileText },
    { id: "vdi", name: "VDI", icon: Monitor },
    { id: "phone", name: "Phone", icon: Phone },
    { id: "scanner", name: "Scanner", icon: FileText },
    { id: "general", name: "General", icon: MessageSquare },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          data-testid="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-full w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out z-30 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        data-testid="sidebar"
        role="complementary"
        aria-label="Sidebar navigation"
      >
        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-80px)]">
          {/* Categories Section */}
          <section data-testid="categories-section">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Categories
            </h2>
            <nav className="space-y-1" data-testid="category-list" role="navigation" aria-label="Categories">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    onCategorySelect(category.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === category.id
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  data-testid={`category-${category.id}`}
                  aria-current={selectedCategory === category.id ? "page" : undefined}
                >
                  <category.icon className="w-4 h-4" />
                  {category.name}
                </button>
              ))}
            </nav>
          </section>

          {/* Popular Issues Section */}
          <section data-testid="popular-issues-section">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Popular Issues
            </h2>
            <ul className="space-y-2" data-testid="popular-issues-list">
              {popularIssues.map((issue, index) => (
                <li key={index}>
                  <button
                    onClick={() => onPromptClick(issue)}
                    className="w-full text-left text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 truncate transition-colors"
                    data-testid={`popular-issue-${index}`}
                  >
                    {issue}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Recent Searches Section */}
          <section data-testid="recent-searches-section">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <History className="w-4 h-4" />
              Recent Searches
            </h2>
            {recentSearches.length > 0 ? (
              <ul className="space-y-2" data-testid="recent-searches-list">
                {recentSearches.map((search, index) => (
                  <li key={index}>
                    <button
                      onClick={() => onPromptClick(search)}
                      className="w-full flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      data-testid={`recent-search-${index}`}
                    >
                      <SearchIcon className="w-3 h-3" />
                      {search}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No recent searches
              </p>
            )}
          </section>
        </div>
      </aside>
    </>
  );
}
