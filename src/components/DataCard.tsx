import React, { useState } from "react";
import { Button, Image, Tooltip, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { CustomCard } from "./custom/CustomCard";
import DataDrawer from "./DataDrawer";

interface DataCardProps {
  type: "Report" | "Product" | "DataSet";
  title: string;
  description: string;
  image?: string;
  relatedProduct?: {
    name: string;
    link: string;
  };
  isNew?: boolean;
  analyticsCount?: number;
  onFavorite?: () => void;
  isFavorite?: boolean;
  isRecommended?: boolean;
  recommendedLabel?: string;
  publishedDate?: string;
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "Report":
      return "bg-blue-100 text-blue-600";
    case "Product":
      return "bg-purple-100 text-purple-600";
    case "DataSet":
      return "bg-teal-100 text-teal-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "Report":
      return "mdi:file-document-outline";
    case "Product":
      return "mdi:package-variant";
    case "DataSet":
      return "mdi:database";
    default:
      return "mdi:help-circle";
  }
};

export const DataCard: React.FC<DataCardProps> = ({
  type,
  title,
  description,
  image,
  relatedProduct,
  isNew = false,
  analyticsCount,
  onFavorite,
  isFavorite = false,
  publishedDate,
  isRecommended,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Compose the item object for DataDrawer
  const drawerItem = {
    type,
    title,
    description,
    image,
    relatedProduct,
    isNew,
    analyticsCount,
  };

  return (
    <>
      <CustomCard
        className={`shadow-sm relative transition-all duration-300 ${
          isRecommended
            ? "border-0 border-yellow-500 shadow-none bg-gradient-to-br from-yellow-50/20 via-pink-50/30 to-white  dark:from-yellow-950/20 dark:via-pink-950/30 dark:to-gray-950 ring-2 ring-yellow-500/40"
            : ""
        }`}
        onPress={() => {
          setIsDrawerOpen(true);
        }}
        isPressable
      >
        <div className="flex flex-col h-full">
          {/* Image Section */}
          {image && (
            <div className="w-full h-48 relative">
              <Image
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                radius="none"
              />
              {isNew && (
                <span className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                  RECENTLY ADDED
                </span>
              )}
            </div>
          )}

          <div className="p-3.5 pt-1.5 flex flex-col gap-1 flex-grow">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${getTypeColor(type)}`}
              >
                <div className="flex items-center gap-1.5">
                  <Icon icon={getTypeIcon(type)} className="w-4 h-4" />
                  <span>{type}</span>
                </div>
              </div>
              <Button
                isIconOnly
                onPress={() => {
                  onFavorite?.();
                }}
                variant="light"
                className="text-gray-400 hover:text-pink-500 transition-colors"
              >
                <Icon
                  icon={isFavorite ? "mdi:heart" : "mdi:heart-outline"}
                  className="w-6 h-6"
                  color={isFavorite ? "#ec4899" : "currentColor"}
                />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
                {isRecommended && (
                  <div className="group relative">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-yellow-500/90 dark:text-success-400">
                      <Icon
                        icon="solar:star-bold"
                        className="text-yellow-500/90"
                        fontSize={14}
                      />
                      <span>Recommended</span>
                      <Tooltip
                        content="This item is recommended based on your preferences and usage patterns"
                        placement="top"
                        showArrow
                        classNames={{
                          content:
                            "px-3 py-2 w-max max-w-xs bg-black text-white text-xs",
                        }}
                      >
                        <Icon
                          icon="mdi:information-outline"
                          fontSize={16}
                          className="text-gray-300 cursor-pointer"
                        />
                      </Tooltip>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">
                {description}
              </p>
            </div>

            <Divider className="border-gray-100 my-1.5 bg-gray-200 dark:border-gray-800 dark:bg-gray-800" />
            {/* Footer */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 justify-between border-gray-100 dark:border-gray-800">
              {relatedProduct && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Icon icon="mdi:account-tie" className="w-4 h-4" />
                  <span>Owner: </span>
                  <span>{relatedProduct.name}</span>
                </div>
              )}
              {publishedDate && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Icon icon="mdi:calendar-check" className="w-4 h-4" />
                  <span>Published on: </span>
                  <span>
                    {new Date(publishedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
              {analyticsCount !== undefined && (
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Icon icon="mdi:chart-line" className="w-4 h-4" />
                  <span>{analyticsCount} analytic(s)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CustomCard>
      <DataDrawer
        open={isDrawerOpen}
        item={drawerItem}
        onClose={() => setIsDrawerOpen(false)}
        onFavorite={onFavorite}
        isFavorite={isFavorite}
      />
    </>
  );
};

export default DataCard;
