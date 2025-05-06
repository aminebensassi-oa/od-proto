import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { publishedAnalytics } from "../data/published-analytics";

interface PromptSuggestionsProps {
  onSelect: (suggestion: string) => void;
}

// Generate suggestions from published analytics
const generateSuggestions = () => {
  // Get a random subset of analytics items
  const shuffled = [...publishedAnalytics].sort(() => 0.5 - Math.random());
  const selectedItems = shuffled.slice(0, 10);

  return selectedItems.map((item, index) => {
    const title =
      item["Report and Dataset Name"] || item["Product Name (Business)"] || "";
    const type = item.Type || "";

    // Get appropriate icon based on type
    let icon = "mynaui:arrow-right";
    if (type === "Report") {
      icon = "mynaui:file";
    } else if (type === "Product") {
      icon = "mynaui:box";
    } else if (type === "DataSet") {
      icon = "mynaui:database";
    }

    return {
      id: index + 1,
      label: title,
      icon,
      type,
    };
  });
};

export const PromptSuggestions = ({ onSelect }: PromptSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState(generateSuggestions());
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Generate new suggestions when component mounts
    setSuggestions(generateSuggestions());

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev + 2 >= suggestions.length ? 0 : prev + 2
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getCurrentSuggestions = () => {
    const first = suggestions[currentIndex];
    // const second = suggestions[(currentIndex + 1) % suggestions.length];
    return [first];
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-4">
      <div className="text-sm text-gray-500 ">Try searching for:</div>

      <div className="flex flex-row items-center justify-center h-14 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="flex gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {getCurrentSuggestions().map((suggestion) => (
              <Button
                key={suggestion.id}
                className="h-10 gap-2 rounded-full border-1 border-default-200 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 shadow-none"
                startContent={
                  <Icon
                    icon={suggestion.icon}
                    width={18}
                    className="text-primary-500"
                  />
                }
                variant="light"
                color="primary"
                onPress={() => onSelect?.(suggestion.label)}
              >
                <span className="font-medium">{suggestion.label}</span>
                <span className="text-xs text-gray-400 ml-1">
                  ({suggestion.type})
                </span>
              </Button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
