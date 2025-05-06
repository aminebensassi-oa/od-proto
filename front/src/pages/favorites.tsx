import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Link, Pagination } from "@heroui/react";
import { Icon } from "@iconify/react";
import DataCard from "../components/DataCard";
import NavigationHeader from "../components/NavigationHeader";
import { Footer } from "../components/Footer";
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
}

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [favoriteItems, setFavoriteItems] = useState<DataItem[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 12;
  const [pages, setPages] = useState(1);

  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Load favorite items from publishedAnalytics
  useEffect(() => {
    const loadFavoriteItems = async () => {
      try {
        // Import the publishedAnalytics data
        const { publishedAnalytics } = await import(
          "../data/published-analytics"
        );

        // Filter to only include favorite items
        const favoriteIds = Object.keys(favorites).filter(
          (id) => favorites[id]
        );

        // Convert to DataItem format
        const items = publishedAnalytics
          .filter((item) => favoriteIds.includes(item.Id))
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
          }));

        setFavoriteItems(items);
        setPages(Math.ceil(items.length / rowsPerPage));
      } catch (error) {
        console.error("Error loading favorite items:", error);
      }
    };

    loadFavoriteItems();
  }, [favorites, rowsPerPage]);

  // Get paginated data
  const paginatedData = favoriteItems.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleFavorite = (id: string) => {
    const newFavorites = {
      ...favorites,
      [id]: !favorites[id],
    };
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#fff] dark:bg-gray-900">
      <Link href="/" className="absolute top-8 left-0 sm:left-8">
        <img src="/logo-black.png" alt="logo" className="h-8 dark:hidden" />
        <img
          src="/logo-white.png"
          alt="logo"
          className="hidden h-8 dark:block"
        />
      </Link>

      <NavigationHeader />

      <div className="container max-w-7xl mx-auto px-4 py-8 pt-36">
        <div className="mx-auto">
          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4 dark:border-gray-700">
            <h1 className="sm:text-3xl text-2xl font-bold">My Favorites</h1>
            <Button
              color="default"
              variant="bordered"
              startContent={<Icon icon="mynaui:arrow-left" />}
              onPress={handleBackToHome}
            >
              Back to Home
            </Button>
          </div>

          {favoriteItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedData.map((item) => (
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
                  />
                ))}
              </div>

              {pages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    total={pages}
                    page={page}
                    onChange={setPage}
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
            <div className="text-center py-12">
              <Icon
                icon="heroicons:heart"
                fontSize={64}
                className="mx-auto text-gray-300 mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
              <p className="text-gray-500 mb-6">
                You haven't added any items to your favorites yet.
              </p>
              <Button
                color="primary"
                variant="flat"
                startContent={<Icon icon="mynaui:arrow-left" />}
                onClick={handleBackToHome}
              >
                Back to Home
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FavoritesPage;
