import React, { useState, useEffect } from "react";
import {
  Card,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Tabs,
  Tab,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import DataDrawer from "./DataDrawer";
import { useNavigate } from "react-router-dom";

// Use Solar icons for better consistency
const typeIcons: Record<string, string> = {
  Product: "solar:box-minimalistic-bold",
  Report: "solar:documents-bold",
  DataSet: "solar:chart-2-bold",
  default: "solar:star-bold",
};

// Add this function for type-based color
const getTypeColor = (type: string) => {
  switch (type) {
    case "Report":
      return {
        bg: "bg-blue-100 dark:bg-blue-900",
        icon: "text-blue-600 dark:text-blue-400",
      };
    case "Product":
      return {
        bg: "bg-purple-100 dark:bg-purple-900",
        icon: "text-purple-600 dark:text-purple-400",
      };
    case "DataSet":
      return {
        bg: "bg-success-100 dark:bg-success-900",
        icon: "text-success-600 dark:text-success-400",
      };
    default:
      return {
        bg: "bg-gray-100 dark:bg-gray-800",
        icon: "text-gray-600 dark:text-gray-400",
      };
  }
};

function getLabel(item: any) {
  return (
    item["Product Name (Business)"] ||
    item["Product Name (Tech)"] ||
    item["Report and Dataset Name"] ||
    item["Report Name"] ||
    "No Name"
  );
}
const getDescription = (item: any) => item.Description || "No description.";

export const RecommendedFavorites: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"recommended" | "favorites">(
    "recommended"
  );
  const [drawerItem, setDrawerItem] = useState<any | null>(null);
  const [published, setPublished] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const { publishedAnalytics } = await import(
        "../data/published-analytics"
      );
      const publishedItems = publishedAnalytics.filter(
        (item: any) => item["Portal Status"] === "Published"
      );
      setPublished(publishedItems);
      const shuffled = publishedItems.sort(() => 0.5 - Math.random());
      setRecommended(shuffled.slice(0, 7));
    };
    loadData();
  }, []);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    if (!published.length) return;
    const favoriteIds = Object.keys(favorites).filter((id) => favorites[id]);
    const last7 = favoriteIds.slice(-7).reverse();
    const items = last7
      .map((id) => published.find((item) => item.Id === id))
      .filter(Boolean);
    setFavoriteItems(items);
  }, [favorites, published]);

  const shortcuts = activeTab === "recommended" ? recommended : favoriteItems;

  const handleFavorite = (id: string) => {
    const newFavorites = {
      ...favorites,
      [id]: !favorites[id],
    };
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const handleCardClick = (item: any) => {
    setDrawerItem(item);
  };

  return (
    <div className="w-full mx-auto">
      <div className="flex justify-center items-center gap-10 relative">
        <Tabs
          variant="underlined"
          onSelectionChange={(key) => setActiveTab(key as any)}
        >
          {[
            { key: "recommended", label: "Recommended to me" },
            { key: "favorites", label: "Favorites" },
          ].map(({ key, label }) => (
            <Tab
              key={key}
              onClick={() => setActiveTab(key as any)}
              title={label}
            ></Tab>
          ))}
        </Tabs>
      </div>

      {/* Shortcuts list */}
      <div className="flex flex-wrap justify-center gap-3 mt-2.5 w-full lg:w-[1000px] px-2 pb-2">
        {shortcuts.length === 0 && (
          <div className="text-gray-400 text-center w-full">
            No items to show.
          </div>
        )}
        {shortcuts.map((item, idx) => {
          const type = item.Type || "default";
          const typeColor = getTypeColor(type);
          return (
            <Card
              key={item.Id}
              isPressable
              className={`relative flex flex-col items-center w-full max-w-[6.5rem] p-2 gap-2 cursor-pointer bg-transparent border-0 shadow-none rounded-xl transition-transform duration-200 animate-fadein hover:scale-105`}
              onPress={() => handleCardClick(item)}
            >
              <div
                className={`flex ${typeColor.bg} rounded-full p-2 items-center mt-2 justify-center`}
              >
                <Icon
                  icon={typeIcons[type] || typeIcons.default}
                  fontSize={28}
                  className={typeColor.icon}
                />
              </div>
              <div className="text-[12px] text-center truncate max-w-[6.5rem]">
                {getLabel(item)}
              </div>
            </Card>
          );
        })}
        {/* Other card */}
        {shortcuts.length > 0 && (
          <Card
            isPressable
            className="relative flex flex-col items-center w-full max-w-[6.5rem] p-2 gap-2 cursor-pointer bg-transparent border-0 shadow-none rounded-xl transition-transform duration-200 animate-fadein hover:scale-105"
            style={{ animationDelay: `${shortcuts.length * 40}ms` }}
            onPress={() =>
              activeTab === "recommended"
                ? navigate("/")
                : navigate("/favorites")
            }
          >
            <div className="flex bg-blue-50 dark:bg-gray-950 rounded-full p-2 items-center mt-2 justify-center">
              <Icon
                icon="solar:menu-dots-bold"
                fontSize={28}
                className="text-blue-600 dark:text-blue-400"
              />
            </div>
            <div className="text-[12px] text-center truncate max-w-[6.5rem]">
              Other
            </div>
          </Card>
        )}
      </div>

      {/* Drawer for details */}
      <DataDrawer
        open={!!drawerItem}
        item={drawerItem}
        onClose={() => setDrawerItem(null)}
        onFavorite={
          drawerItem && drawerItem.Id
            ? () => handleFavorite(drawerItem.Id)
            : undefined
        }
        isFavorite={
          drawerItem && drawerItem.Id ? !!favorites[drawerItem.Id] : false
        }
      />
      <style>{`
        @keyframes fadein {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadein {
          animation: fadein 0.5s both;
        }
      `}</style>
    </div>
  );
};

export default RecommendedFavorites;
