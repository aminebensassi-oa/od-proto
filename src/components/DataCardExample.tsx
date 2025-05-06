import React, { useState, useEffect, useRef } from "react";
import DataCard from "./DataCard";
import { publishedAnalytics } from "../data/published-analytics";
import Fuse from "fuse.js";
import { Pagination } from "@heroui/react";

interface DataItem {
  id: string;
  type: "Report" | "Product" | "DataSet";
  title: string;
  description: string;
  relatedProduct?: {
    name: string;
    link: string;
  };
  isNew?: boolean;
  analyticsCount?: number;
  lastPublished?: string;
}

interface DataCardExampleProps {
  searchQuery?: string | null;
  selectedTab?: string;
  onResultsChange?: (results: DataItem[]) => void;
}

const DataCardExample: React.FC<DataCardExampleProps> = ({
  searchQuery,
  selectedTab,
  onResultsChange,
}) => {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const [fuse, setFuse] = useState<Fuse<any> | null>(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [pages, setPages] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    const searchableItems = publishedAnalytics
      .filter((item) => item["Portal Status"] === "Published")
      .map((item) => ({
        ...item,
        id: item.Id,
        type: (item.Type || "Product") as "Report" | "Product" | "DataSet",
        title:
          item["Report and Dataset Name"] ||
          item["Product Name (Business)"] ||
          "",
        description: item.Description || "",
        relatedProduct: item["Product Owner"]
          ? {
              name: item["Product Owner"],
              link: "#",
            }
          : undefined,
        isNew: false,
        analyticsCount: undefined,
        productOwner: item["Product Owner"],
        lastPublished: item["Last Published"],
      }));

    const fuseOptions = {
      keys: ["title", "description", "type"],
      threshold: 0.3,
      distance: 100,
      minMatchCharLength: 2,
      shouldSort: true,
    };

    setFuse(new Fuse(searchableItems, fuseOptions));
  }, []);

  useEffect(() => {
    if (!fuse) return;

    let data: DataItem[] = [];

    if (!searchQuery) {
      data = publishedAnalytics
        .filter((item) => item["Portal Status"] === "Published")
        .map((item) => ({
          id: item.Id,
          type: (item.Type || "Product") as "Report" | "Product" | "DataSet",
          title:
            item["Report and Dataset Name"] ||
            item["Product Name (Business)"] ||
            "",
          description: item.Description || "",
          relatedProduct: item["Product Owner"]
            ? {
                name: item["Product Owner"],
                link: "#",
              }
            : undefined,
          isNew: false,
          analyticsCount: undefined,
          productOwner: item["Product Owner"],
          lastPublished: item["Last Published"],
        }));
    } else {
      const searchResults = fuse.search(searchQuery);
      data = searchResults.map((result) => result.item);
    }

    if (typeof onResultsChange === "function") {
      onResultsChange(data);
    }

    if (selectedTab && selectedTab !== "1") {
      let typeFilter: "Report" | "Product" | "DataSet" | null = null;

      if (selectedTab === "2") {
        typeFilter = "Product";
      } else if (selectedTab === "3") {
        typeFilter = "Report";
      } else if (selectedTab === "4") {
        typeFilter = "DataSet";
      }

      if (typeFilter) {
        data = data.filter((item) => item.type === typeFilter);
      }
    }

    setFilteredData(data);
    setPages(Math.ceil(data.length / rowsPerPage));
    setPage(1);
  }, [searchQuery, fuse, selectedTab, rowsPerPage, onResultsChange]);

  const handleFavorite = (id: string) => {
    const newFavorites = {
      ...favorites,
      [id]: !favorites[id],
    };
    setFavorites(newFavorites);

    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  // Get paginated data
  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  useEffect(() => {
    if (containerRef.current) {
      const offsetPosition =
        containerRef.current.getBoundingClientRect().top +
        window.pageYOffset -
        120;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, [page]);

  return (
    <div className="flex flex-col gap-4 p-4" ref={containerRef}>
      {filteredData.length > 0 ? (
        <>
          {paginatedData.map((item, index) => (
            <DataCard
              key={item.id}
              type={item.type}
              title={item.title}
              description={item.description}
              relatedProduct={item.relatedProduct}
              isNew={item.isNew}
              analyticsCount={item.analyticsCount}
              isFavorite={favorites[item.id]}
              onFavorite={() => handleFavorite(item.id)}
              isRecommended={index < 2}
              recommendedLabel="Recommended"
              publishedDate={item.lastPublished}
            />
          ))}

          {pages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination
                total={pages}
                page={page}
                onChange={(page) => {
                  setPage(page);
                }}
                showControls
                size="lg"
                radius="full"
                classNames={{
                  wrapper: "gap-1",
                  item: "w-8 h-8 text-sm",
                  cursor: "bg-primary text-white",
                }}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center p-8 text-gray-500">
          No results found. Try a different search term or filter.
        </div>
      )}
    </div>
  );
};

export default DataCardExample;
