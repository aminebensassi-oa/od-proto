import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Image,
} from "@heroui/react";
import { Icon } from "@iconify/react";

const typeColors: Record<string, string> = {
  Product: "bg-purple-100 text-purple-700",
  Report: "bg-blue-100 text-blue-700",
  DataSet: "bg-teal-100 text-teal-700",
  default: "bg-gray-100 text-gray-700",
};
const typeIcons: Record<string, string> = {
  Product: "mdi:package-variant",
  Report: "mdi:file-document-outline",
  DataSet: "mdi:database",
  default: "mdi:help-circle",
};

function getLabel(item: any) {
  return (
    item?.["Product Name (Business)"] ||
    item?.["Product Name (Tech)"] ||
    item?.["Report and Dataset Name"] ||
    item?.["Report Name"] ||
    item?.title ||
    item?.label ||
    "No Name"
  );
}
const getDescription = (item: any) =>
  item?.Description || item?.description || "No description.";

const DataDrawer = ({
  open,
  item,
  onClose,
  onFavorite,
  isFavorite,
}: {
  open: boolean;
  item: any;
  onClose: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
}) => {
  if (!item) return null;
  const type = item.Type || item.type || "default";
  const title = item.title || getLabel(item);
  const description = item.description || getDescription(item);
  const image = item.image;
  const relatedProduct = item.relatedProduct;
  const isNew = item.isNew;
  const analyticsCount = item.analyticsCount;

  return (
    <Drawer
      isOpen={open}
      placement="right"
      size="4xl"
      onOpenChange={(drawerOpen) => !drawerOpen && onClose()}
      classNames={{
        header: "p-0",
        base: "z-10",
        closeButton: "absolute z-[100] right-2 top-0 m-4",
      }}
      closeButton={
        <div>
          <Icon icon="mdi:close" fontSize={24} className="" />
        </div>
      }
      radius="none"
    >
      <DrawerContent className="bg-white dark:bg-gray-900  max-w-[90%] xl:max-w-[50%]">
        {(onCloseDrawer) => (
          <>
            <DrawerHeader className="flex flex-col gap-4 p-4 border-b dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${typeColors[type]}`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        icon={typeIcons[type] || typeIcons.default}
                        className="w-5 h-5"
                      />
                      <span>{type}</span>
                    </div>
                  </div>
                  {isNew && (
                    <span className="bg-blue-600 text-white dark:text-gray-900 px-3 py-1.5 rounded-full text-sm font-medium">
                      Recently Added
                    </span>
                  )}
                </div>
              </div>
              <h2 className="text-2xl font-bold items-center flex flex-between gap-2">
                {onFavorite && (
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={onFavorite}
                    className="text-gray-400 dark:text-gray-500 hover:text-pink-500 transition-colors p-2 rounded-full hover:bg-gray-100"
                  >
                    <Icon
                      icon={isFavorite ? "mdi:heart" : "mdi:heart-outline"}
                      className="w-6 h-6"
                      color={isFavorite ? "#ec4899" : "currentColor"}
                    />
                  </Button>
                )}
                {title}
              </h2>
            </DrawerHeader>

            <DrawerBody>
              <div className="space-y-8 py-6">
                {/* Image */}
                {image && (
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src={image}
                      alt={title}
                      className="w-full h-[300px] object-cover"
                      radius="none"
                    />
                  </div>
                )}

                {/* Description */}
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold mb-3">Description</h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Related Product */}
                  {relatedProduct && (
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                      <h4 className="text-lg font-semibold mb-3">
                        Related Product
                      </h4>
                      <a
                        href={relatedProduct.link}
                        className="text-blue-600 hover:underline flex items-center gap-2 group"
                      >
                        <Icon
                          icon="mdi:link-variant"
                          className="w-5 h-5 group-hover:rotate-45 transition-transform"
                        />
                        {relatedProduct.name}
                      </a>
                    </div>
                  )}

                  {/* Analytics */}
                  {analyticsCount !== undefined && (
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                      <h4 className="text-lg font-semibold mb-3">Analytics</h4>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Icon icon="mdi:chart-line" className="w-5 h-5" />
                        <span>{analyticsCount} available analytics</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DrawerBody>

            <DrawerFooter className="border-t dark:border-gray-800">
              <Button color="danger" variant="light" onPress={onCloseDrawer}>
                Close
              </Button>
              {relatedProduct && (
                <Button
                  color="primary"
                  variant="solid"
                  className="shadow"
                  onPress={() => {
                    if (relatedProduct) {
                      window.location.href = relatedProduct.link;
                    }
                    onCloseDrawer();
                  }}
                  startContent={
                    <Icon icon="mdi:link-variant" className="w-5 h-5" />
                  }
                >
                  View Product
                </Button>
              )}
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default DataDrawer;
