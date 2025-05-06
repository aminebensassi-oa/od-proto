import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useRandomBackground } from "@/hooks/useRandomBackground";
import { CustomCard } from "@/components/custom/CustomCard";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Skeleton,
  Tab,
  Tabs,
  Textarea,
  Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import SearchComponent from "@/components/SearchInput";
import PortalChartExample from "@/components/PortalChartExample";
import { Link, useSearchParams } from "react-router-dom";
import { PromptSuggestions } from "@/components/PromptSuggestions";
import DataCardExample from "@/components/DataCardExample";
import { Footer } from "@/components/Footer";
import NavigationHeader from "@/components/NavigationHeader";
import { useTheme } from "@heroui/use-theme";
import RecommendedFavorites from "@/components/RecommendedFavorites";
import DataDrawer from "@/components/DataDrawer";
import { setTimeout } from "timers/promises";

export default function IndexPage() {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState("1");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerItem, setDrawerItem] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const updateUrl = (query: string) => {
    if (query) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  };

  const handleSendClick = (query: string | null) => {
    setQuery(query || "");
    query && setIsSent(true);
    updateUrl(query || "");
  };

  const isQueryExist = searchParams.get("q") !== null;

  const isQueryExistOrSent = isQueryExist || isSent;

  // Find the first DataSet in the search results
  const firstDataset = searchResults.find((item) => item.type === "DataSet");
  const datasetDescription =
    firstDataset?.description || "Aucune description disponible.";
  const datasetLink = firstDataset ? `/datasets/${firstDataset.id}` : "#";
  const reportLink = firstDataset?.relatedProduct?.link || null;

  return (
    <div
      className={`w-full h-screen overflow-auto relative transition-background duration-500 dark:bg-gray-900 bg-center   ${
        isQueryExistOrSent
          ? " dark:bg-black"
          : "bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-950  dark:via-gray-950 dark:to-gray-950"
      }`}
    >
      <div
        className={`relative z-10 w-full h-full flex flex-col transition-all duration-500`}
      >
        <motion.div
          className={`relative z-10 w-full  transition-background  ${
            isQueryExistOrSent
              ? "border-b border-gray-300/90   backdrop-blur dark:border-gray-700"
              : "bg-transparent"
          }`}
          initial={{ opacity: 0, margin: 0 }}
          animate={{
            opacity: 1,
            top: isQueryExistOrSent ? 0 : "calc(50% - 150px)", // Animate to 0 for the final position
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
            opacity: { delay: 0.5, duration: 0.5 },
            top: { duration: 0.5 },
            left: { duration: 0.5 },
            margin: { duration: 0.5 },
          }}
        >
          <div className="flex flex-col">
            <div className="flex justify-between">
              <div
                className={`flex transition-all duration-500 w-[1300px]  max-w-full  ${
                  isQueryExistOrSent
                    ? "flex-col xl:flex-row gap-6  p-4 px-3 md:px-9  rounded-2xl w-full items-start "
                    : "flex-col gap-10 mx-auto items-center px-8"
                }`}
                style={{ transition: "margin 0.5s ease-in-out" }}
              >
                <img
                  src={"/logo-white.png"}
                  alt=""
                  className={`w-auto cursor-pointe hidden dark:flex ${
                    isQueryExistOrSent ? "h-8 mt-3" : "h-11 md:h-16"
                  }`}
                  onClick={() => {
                    setIsSent(false);
                    setQuery("");
                    updateUrl("");
                  }}
                />
                <img
                  src={"/logo-black.png"}
                  alt=""
                  className={`w-auto cursor-pointer dark:hidden ${
                    isQueryExistOrSent ? "h-8 mt-3" : "h-11 md:h-16"
                  }`}
                  onClick={() => {
                    setIsSent(false);
                    setQuery("");
                    updateUrl("");
                  }}
                />
                <SearchComponent
                  isQueryExistOrSent={isQueryExistOrSent}
                  handleSend={handleSendClick}
                  query={query}
                  setQuery={(value) => {
                    setQuery(value ?? "");
                  }}
                />

                {!isQueryExistOrSent ? (
                  <div className="flex flex-col gap-12">
                    <RecommendedFavorites />

                    <Footer />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {(isQueryExist || isSent) && (
          <motion.div
            className="flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="container px-4 py-8 gap-7 xl:pl-[200px] max-w-[1400px] w-full grid grid-cols-12 flex-col xl:flex-row">
              <div className="col-span-12 md:col-span-7 lg:col-span-8">
                <CustomCard key={searchParams.get("q")}>
                  <PortalChartExample />
                  <Divider className=" bg-gray-200 dark:bg-gray-800" />
                  <div className="p-3 flex flex-col gap-4  bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-950  dark:via-gray-950 dark:to-gray-950 dark:border-gray-700">
                    <div className="flex flex-wrap gap-3 justify-between items-center">
                      <div className="flex flex-row items-center gap-1">
                        <CustomCard
                          isPressable
                          className="inline-flex flex-row items-center gap-1 px-3 py-1 rounded-full bg-teal-100 text-teal-700  dark:bg-teal-900  dark:text-teal-400 font-semibold hover:bg-teal-200 dark:hover:bg-teal-800 transition relative"
                          onPress={() => {
                            setDrawerItem(firstDataset);
                            setIsDrawerOpen(true);
                          }}
                        >
                          <Icon icon="mdi:database" fontSize={18} />
                          View dataset
                          <Tooltip
                            content={datasetDescription}
                            placement="top"
                            showArrow
                            classNames={{
                              content:
                                "px-3 py-2 w-max max-w-lg bg-black text-white text-xs",
                            }}
                          >
                            <button
                              type="button"
                              className="ml-1 p-0.5 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800 transition"
                              aria-label="Show dataset details"
                            >
                              <Icon
                                icon="mdi:information-outline"
                                fontSize={16}
                                className="text-teal-700 cursor-pointer"
                              />
                            </button>
                          </Tooltip>
                        </CustomCard>
                        {reportLink && (
                          <CustomCard
                            isPressable
                            href={reportLink}
                            className="inline-flex flex-row items-center gap-1 px-3 py-1 rounded-full bg-blue-100  dark:bg-blue-900 text-blue-700 dark:text-blue-400 font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                            as={Link}
                            rel="noopener noreferrer"
                          >
                            <Icon
                              icon="mdi:file-document-outline"
                              fontSize={18}
                            />
                            View associated report
                          </CustomCard>
                        )}
                      </div>
                      <div className="pl-2 mt-1 flex items-center justify-end gap-2">
                        <span className="font-medium text-gray-600">
                          To go further:
                        </span>
                        <a
                          href="https://gpt.loreal.net"
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-gray-100 via-white-50 to-gray-100 dark:from-primary-900 dark:via-primary-800 dark:to-success-900 text-primary-700 dark:text-primary-300 font-semibold border border-primary-200 dark:border-primary-800 shadow-sm hover:from-[#d6d7ff]/30 hover:to-[#3f488a]/30 dark:hover:from-primary-800 dark:hover:to-success-800 transition"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Icon
                            icon="mdi:robot-excited-outline"
                            fontSize={18}
                          />
                          <span>Chat with Data</span>
                        </a>
                      </div>
                    </div>

                    <div className="flex justify-end -mt-1 px-1">
                      <a
                        href="https://gpt.loreal.net"
                        target="_blank"
                        className="text-[11px] text-gray-500 dark:text-gray-600 underline flex items-center gap-2"
                      >
                        Powered by L'OréalGPT
                        <img
                          src="/gpt.svg"
                          alt="L'OréalGPT"
                          className="w-6 h-6"
                        />
                      </a>
                    </div>
                  </div>
                </CustomCard>
              </div>
              <div className="w-full col-span-12 md:col-span-5 lg:col-span-4">
                <div className="sticky top-5">
                  <CustomCard>
                    <div className="p-4 font-medium text-lg">Summary</div>
                    <div className="px-4 pb-4 text-md text-gray-500 dark:text-gray-200">
                      Users can find detailed insights, summaries, and
                      comprehensive information about their search results,
                      helping them make informed decisions based on the data
                      provided.
                    </div>
                    <div className="px-4 pb-4 text-md text-gray-500 dark:text-gray-200">
                      <span className="font-bold">Example:</span>
                      We have found that the data platform features a cockpit,
                      which represents a significant advancement in operational
                      efficiency and decision-making. This cockpit provides
                      real-time data and insights that help streamline processes
                      and improve overall performance.
                    </div>
                    <div className="px-4">
                      <Divider />
                    </div>
                    <div className=" p-4 flex flex-col gap-2">
                      <div className="p-0 font-medium text-lg">
                        Source of data
                      </div>

                      <div className="text-[15px]  text-gray-800 dark:text-gray-100 leading-7">
                        <span className="">
                          This chart is based on the dataset
                        </span>
                        <br />
                        <span className="font-medium bg-teal-100 text-teal-700 px-2 py-0.5 rounded-lg mr-1">
                          {firstDataset?.["Report and Dataset Name"]}
                        </span>
                        <span className="text-gray-600 dark:text-gray-300">
                          , it represents the evolution of
                        </span>
                        <span className="font-medium bg-pink-100 text-pink-700 px-2 py-0.5 rounded-lg mx-1">
                          Actual Official 2025
                        </span>
                        <span className="text-gray-600 dark:text-gray-300">
                          filtered on
                        </span>{" "}
                        <br />
                        <span className="font-medium bg-[#b5f1ff] text-blue-500 px-2 py-0.5 rounded-lg ml-1">
                          PLP Actual - L4 Cluster
                        </span>
                        ,
                        <span className="font-medium bg-[#b5f1ff] text-blue-500 px-2 py-0.5 rounded-lg ml-1">
                          France
                        </span>
                      </div>
                    </div>
                  </CustomCard>
                </div>
              </div>
              <div className="col-span-12 xl:col-span-8">
                <CustomCard>
                  <div className="p-5 py-3 pb-1 font-medium text-lg">
                    Search results
                  </div>

                  {isQueryExist || isSent ? (
                    <div className="w-full pb-0  sticky top-10 overflow-auto">
                      <Tabs
                        classNames={{
                          tabList: "gap-0 w-full p-0",
                          cursor: "w-full",
                          tab: "max-w-fit h-12 min-h-14 px-5 shadow-none",
                        }}
                        size="md"
                        variant="underlined"
                        selectedKey={selectedTab}
                        onSelectionChange={(key) =>
                          setSelectedTab(key.toString())
                        }
                      >
                        <Tab
                          key="1"
                          title={
                            <div className="flex items-center gap-2 px-4">
                              All
                            </div>
                          }
                        />
                        <Tab
                          key="2"
                          title={
                            <div className="flex items-center gap-2 py-4">
                              <Icon icon="mdi:package-variant" fontSize={22} />{" "}
                              Products
                            </div>
                          }
                        />
                        <Tab
                          key="3"
                          title={
                            <div className="flex items-center gap-2">
                              <Icon
                                icon="mdi:file-document-outline"
                                fontSize={22}
                              />{" "}
                              Reports
                            </div>
                          }
                        />
                        <Tab
                          key="4"
                          title={
                            <div className="flex items-center gap-2">
                              <Icon icon="mdi:database" fontSize={22} /> Data
                            </div>
                          }
                        />
                      </Tabs>
                      <Divider />
                    </div>
                  ) : null}

                  <DataCardExample
                    searchQuery={searchParams.get("q")}
                    selectedTab={selectedTab}
                    onResultsChange={setSearchResults}
                  />
                </CustomCard>
              </div>
              <div className="col-span-12 xl:col-span-8">
                <Footer />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <NavigationHeader />

      <DataDrawer
        open={isDrawerOpen}
        item={drawerItem}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Scroll to top button */}
      {showScrollTop && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-6 left-[calc(50%-20px)] z-50"
        >
          <Button
            isIconOnly
            color="default"
            radius="full"
            size="md"
            onPress={scrollToTop}
            className=" bg-opacity-30 backdrop-blur text-gray-600"
          >
            <Icon icon="mynaui:arrow-up" fontSize={24} />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
