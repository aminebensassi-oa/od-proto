import React, { useState, useEffect, useRef } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Textarea } from "@heroui/react";
import { publishedAnalytics } from "../data/published-analytics";
import Fuse from "fuse.js";

interface SearchComponentProps {
  setQuery: (item: string | null) => void;
  query: string;
  handleSend: (item: string | null) => void;
  isQueryExistOrSent: boolean;
}

// Define the type for our searchable items
interface SearchableItem {
  id: string;
  name: string;
  description: string;
  type: string;
  productOwner: string;
}

// Define the type for search history
interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

export const SearchComponent: React.FC<SearchComponentProps> = ({
  setQuery,
  query,
  handleSend,
  isQueryExistOrSent,
}) => {
  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [fuse, setFuse] = useState<Fuse<SearchableItem> | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const suggestionsRef = useRef<HTMLDivElement | null>(null);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Initialize Fuse.js for fuzzy search
  useEffect(() => {
    // Extract searchable fields from publishedAnalytics
    const searchableItems: SearchableItem[] = publishedAnalytics
      .filter((item) => item["Portal Status"] === "Published")
      .map((item) => ({
        id: item.Id,
        name:
          item["Report and Dataset Name"] ||
          item["Product Name (Business)"] ||
          "",
        description: item.Description || "",
        type: item.Type || "",
        productOwner: item["Product Owner"] || "",
      }));

    // Configure Fuse.js with options
    const fuseOptions = {
      keys: ["name", "description", "type", "productOwner"],
      threshold: 0.3, // Lower threshold means more strict matching
      distance: 100, // How far to search for matches
      minMatchCharLength: 2, // Minimum characters to match
      shouldSort: true,
    };

    setFuse(new Fuse(searchableItems, fuseOptions));
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);

    if (value.length >= 0 && fuse) {
      const searchResults = fuse.search(value);
      setFilteredItems(searchResults.map((result) => result.item.name));
      setShowSuggestions(true);
      setSelectedIndex(null);
    } else {
      setShowSuggestions(false);
    }
  };

  // Filtered history based on query
  const filteredHistory = query
    ? searchHistory.filter((item) =>
        item.query.toLowerCase().includes(query.toLowerCase())
      )
    : searchHistory;

  // Combine history and search results for unified selection
  const combinedList = [
    ...filteredHistory.map((item) => ({ type: "history", value: item.query })),
    ...filteredItems.map((item) => ({ type: "result", value: item })),
  ];

  // Handle key press to navigate or select suggestions
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && selectedIndex !== null) {
      const selectedItem = combinedList[selectedIndex];
      setQuery(selectedItem.value);
      handleSend(selectedItem.value);
      if (selectedItem.type === "result") saveToHistory(selectedItem.value);
      setShowSuggestions(false);
      e.preventDefault();
      return;
    }

    if (e.key === "Enter" && query && !e.shiftKey) {
      setQuery(query);
      handleSend(query);
      saveToHistory(query);
      setShowSuggestions(false);
      e.preventDefault();
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (combinedList.length === 0) return;
      if (selectedIndex === null || selectedIndex === combinedList.length - 1) {
        setSelectedIndex(0);
      } else {
        setSelectedIndex((prev) => (prev !== null ? prev + 1 : 0));
      }
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (combinedList.length === 0) return;
      if (selectedIndex === 0) {
        setSelectedIndex(combinedList.length - 1);
      } else {
        setSelectedIndex((prev) =>
          prev !== null ? prev - 1 : combinedList.length - 1
        );
      }
    }
  };

  // Save a search query to history
  const saveToHistory = (query: string) => {
    const newHistoryItem: SearchHistoryItem = {
      query,
      timestamp: Date.now(),
    };

    // Add new item to the beginning of the array
    setSearchHistory((prev) => [newHistoryItem, ...prev].slice(0, 10)); // Keep only last 10 searches
  };

  // Handle selection of an item from the suggestions list
  const handleSelection = (item: { type: string; value: string }) => {
    setQuery(item.value);
    handleSend(item.value);
    if (item.type === "result") saveToHistory(item.value);
    setShowSuggestions(false);
  };

  // Close suggestions if clicked outside
  const handleClickOutside = (event: MouseEvent) => {
    if (
      suggestionsRef.current &&
      !suggestionsRef.current.contains(event.target as Node) &&
      !inputRef.current?.contains(event.target as Node)
    ) {
      setShowSuggestions(false); // Hide suggestions when clicking outside
    }
  };

  // Set up event listener for outside click
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup on unmount
    };
  }, []);

  // Remove a search query from history by index
  const removeFromHistory = (removeIndex: number) => {
    setSearchHistory((prev) => prev.filter((_, idx) => idx !== removeIndex));
  };

  return (
    <div className="relative  w-[750px] max-w-full">
      <style>{`
        @keyframes rotateGradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animated-border {
          background-size: 200% 200%;
          animation: rotateGradient 2s linear infinite;
        }
      `}</style>
      {/* <div
        className={` ${
          !isQueryExistOrSent
            ? "p-[4px] bg-gradient-to-r from-pink-500/80 via-purple-500/80 to-white/80 rounded-[24px] overflow-hidden animated-border"
            : ""
        }`}
      > */}
      <Textarea
        ref={inputRef}
        size={isQueryExistOrSent ? "lg" : "lg"}
        minRows={1}
        maxRows={5}
        placeholder="Search for analytics products, reports and datasets..."
        value={query}
        classNames={{
          inputWrapper:
            "pl-4 items-center justify-center bg-white dark:bg-gray-950 border-default-200  rounded-2xl " +
            (isQueryExistOrSent
              ? "p-0.5 pl-5 pr-2 text-sm shadow-sm  border-1"
              : "py-2 pt-1 sm:py-2 pl-6 pr-2 shadow-lg dark:border-1 dark:border-gray-800"),
          input:
            "bg-white dark:bg-gray-950 " +
            (isQueryExistOrSent ? "mt-[7px]" : "mt-[8px]"),
        }}
        onValueChange={handleInputChange}
        onKeyDown={handleKeyPress}
        onFocus={() => {
          if (combinedList.length > 0 || (query && query.length >= 3)) {
            setShowSuggestions(true);
          }
        }}
        endContent={
          <Button
            isIconOnly
            variant="light"
            isDisabled={!query}
            onPress={() => {
              setQuery(query);
              handleSend(query);
              saveToHistory(query);
              setShowSuggestions(false);
            }}
          >
            <Icon icon="mynaui:search" fontSize={24} />
          </Button>
        }
      />
      {/* </div> */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 right-0 overflow-hidden w-full mt-2 bg-white dark:bg-gray-950 backdrop-blur-sm rounded-xl shadow-lg border border-white/80 dark:border-gray-800/80"
        >
          <ul className="w-full max-h-60 overflow-auto">
            {/* Render combined list: history first, then search results */}
            {combinedList.length > 0 && (
              <>
                {filteredHistory.length > 0 && (
                  <div className="p-2 border-b border-gray-100 dark:border-gray-800">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Recent searches
                    </div>
                    {combinedList.map((item, index) =>
                      item.type === "history" ? (
                        <li
                          key={`history-${index}`}
                          className={`p-2 py-2.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 group ${selectedIndex === index ? "bg-gray-200 dark:bg-gray-800" : ""}`}
                          onClick={() => handleSelection(item)}
                          onMouseEnter={() => setSelectedIndex(index)}
                        >
                          <Icon icon="mdi:history" className="text-gray-400" />
                          <span className="flex-1">{item.value}</span>
                          <button
                            className="ml-2 opacity-60 hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromHistory(
                                filteredHistory.findIndex(
                                  (h) => h.query === item.value
                                )
                              );
                            }}
                            aria-label="Remove from history"
                          >
                            <Icon icon="mdi:close" className="w-4 h-4" />
                          </button>
                        </li>
                      ) : null
                    )}
                  </div>
                )}
                {/* Show search results below history */}
                {combinedList.map((item, index) =>
                  item.type === "result" ? (
                    <li
                      key={`result-${index}`}
                      className={`p-2 py-2.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${selectedIndex === index ? "bg-gray-200 dark:bg-gray-800" : ""}`}
                      onClick={() => handleSelection(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      {item.value}
                    </li>
                  ) : null
                )}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
