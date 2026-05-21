import type Fuse from "fuse.js";

// Type definitions
export interface KnowledgeEntry {
  id: string;
  category: "VDI" | "Phone" | "Scanner" | "General";
  question: string;
  keywords: string[];
  answer: string;
  tags: string[];
  priority: number;
}

// Load data from JSON files
const loadJsonData = async (filename: string): Promise<KnowledgeEntry[]> => {
  try {
    const response = await fetch(`/data/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return [];
  }
};

// Load all knowledge base data
export const loadKnowledgeBase = async (): Promise<KnowledgeEntry[]> => {
  const [vdiData, phoneData, scannerData, generalData] = await Promise.all([
    loadJsonData("vdi.json"),
    loadJsonData("phone.json"),
    loadJsonData("scanner.json"),
    loadJsonData("general.json"),
  ]);

  return [...vdiData, ...phoneData, ...scannerData, ...generalData];
};

// Create Fuse.js instance
export const createSearchIndex = (data: KnowledgeEntry[]) => {
  return new Fuse(data, {
    includeScore: true,
    threshold: 0.3,
    keys: ["question", "keywords", "tags"],
  });
};

// Search function with ranking logic
export const searchKnowledgeBase = async (
  query: string,
  knowledgeBase: KnowledgeEntry[],
  searchIndex: Fuse<KnowledgeEntry>
): Promise<{
  results: { entry: KnowledgeEntry; score: number }[];
  bestMatch: { entry: KnowledgeEntry; score: number } | null;
  hasLowConfidence: boolean;
}> => {
  if (!query.trim()) {
    return {
      results: [],
      bestMatch: null,
      hasLowConfidence: true,
    };
  }

  const queryLower = query.toLowerCase();
  const results = searchIndex.search(query, {
    limit: 10,
  });

  // Rank results based on match type
  const rankedResults = results
    .map(({ item, score }) => {
      // Determine match type for ranking
      let matchType = 4; // Fuzzy match (lowest priority)
      const questionLower = item.question.toLowerCase();
      const keywordsLower = item.keywords.map((k) => k.toLowerCase());
      const tagsLower = item.tags.map((t) => t.toLowerCase());

      // Check for exact match on question
      if (questionLower === queryLower) {
        matchType = 1; // Exact match (highest priority)
      }
      // Check for keyword match
      else if (keywordsLower.some((k) => k === queryLower)) {
        matchType = 2; // Keyword match
      }
      // Check for tag match
      else if (tagsLower.some((t) => t === queryLower)) {
        matchType = 3; // Tag match
      }

      // Adjust score based on match type and priority
      // Lower Fuse score = better match, so we invert it for ranking
      const adjustedScore = score! + (matchType - 1) * 0.1 - item.priority * 0.05;

      return {
        entry: item,
        score: adjustedScore,
        matchType,
      };
    })
    .sort((a, b) => {
      // Sort by adjusted score (lower is better)
      if (a.score !== b.score) {
        return a.score - b.score;
      }
      // If scores are equal, prefer higher priority items
      return b.entry.priority - a.entry.priority;
    });

  const bestMatch = rankedResults.length > 0 ? rankedResults[0] : null;
  const hasLowConfidence = bestMatch ? bestMatch.score > 0.3 : true;

  return {
    results: rankedResults.map(({ entry, score }) => ({ entry, score })),
    bestMatch,
    hasLowConfidence,
  };
};

// Get escalation message
export const getEscalationMessage = (): string => {
  return "I couldn't find a specific solution for your issue. Please contact IT Helpdesk:\n\n📧 Email: helpdesk@company.com\n📞 Phone: Extension 1234\n⏰ Hours: Monday-Friday, 8:00 AM - 8:00 PM\n🌐 Portal: https://helpdesk.company.com";
};
