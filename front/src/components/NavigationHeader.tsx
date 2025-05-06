import React from "react";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Divider,
  DropdownSection,
  User,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@heroui/use-theme";

const NavigationHeader: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
    // Redirect to login page or handle session cleanup
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as "light" | "dark");
  };

  return (
    <div className="absolute items-center sm:right-8 right-5 top-[18px] z-10 flex sm:gap-3 gap-2.5">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button
            isIconOnly
            variant="solid"
            radius="full"
            className="hidden md:flex backdrop-blur-sm bg-gray-200/50 dark:bg-gray-800/50"
          >
            <Icon icon="emojione-v1:flag-for-united-kingdom" fontSize={24} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Language Selection">
          <DropdownItem
            key="english"
            startContent={
              <Icon icon="emojione-v1:flag-for-united-kingdom" fontSize={24} />
            }
          >
            English
          </DropdownItem>
          <DropdownItem
            key="french"
            startContent={<Icon icon="twemoji:flag-france" fontSize={24} />}
          >
            Français
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button
            isIconOnly
            variant="solid"
            radius="full"
            className=" flex backdrop-blur-sm bg-gray-200/50 dark:bg-gray-800/50"
          >
            <Icon icon="mynaui:bell" fontSize={24} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Notifications" className="w-80">
          <DropdownSection aria-label="Recent Notifications">
            <DropdownItem
              key="notification2"
              className="text-center h-52 flex items-center justify-center align-middle"
            >
              <div className="flex flex-col items-center justify-center align-middle gap-4">
                <Icon
                  icon="mynaui:bell"
                  fontSize={50}
                  className="text-gray-400"
                />
                <div className="text-xl p-2 text-gray-400">
                  There is no notification available
                </div>
              </div>
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>

      <Button
        isIconOnly
        variant="solid"
        radius="full"
        className="hidden md:flex backdrop-blur-sm bg-gray-200/50 dark:bg-gray-800/50"
        href="/favorites"
        as={Link}
      >
        <Icon icon="heroicons:heart" fontSize={24} />
      </Button>

      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <div className="p-[3px] bg-gradient-to-r from-primary-500/50 via-primary-400/50 to-white/50 overflow-hidden rounded-full animated-border">
            <Avatar src="/matthieu.jpeg" />
          </div>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Custom item styles"
          disabledKeys={["profile"]}
        >
          <DropdownSection showDivider aria-label="Profile & Actions">
            <DropdownItem
              key="profile"
              isReadOnly
              className="h-14 gap-2 opacity-100"
              textValue="Signed in as"
            >
              <User
                avatarProps={{
                  size: "sm",
                  imgProps: {
                    className: "transition-none",
                  },
                  src: "/matthieu.jpeg",
                }}
                classNames={{
                  name: "text-default-600",
                  description: "text-default-500",
                }}
                name="Matthieu BUREL"
              />
            </DropdownItem>
            <DropdownItem key="settings">Data Identity</DropdownItem>
          </DropdownSection>
          <DropdownSection
            showDivider
            aria-label="Favorites"
            className="sm:hidden"
          >
            <DropdownItem
              key="favorites"
              href="/favorites"
              classNames={{
                title: "text-black dark:text-white",
              }}
              as={Link}
            >
              Favorites
            </DropdownItem>
          </DropdownSection>
          <DropdownSection showDivider aria-label="Preferences">
            <DropdownItem
              key="theme"
              isReadOnly
              className="cursor-default"
              endContent={
                <select
                  className="z-10 p-2 rounded-md border-small border-default-300 bg-transparent py-1.5 text-tiny text-default-500 outline-none group-data-[hover=true]:border-default-500 dark:border-default-200"
                  id="theme"
                  name="theme"
                  value={theme}
                  onChange={handleThemeChange}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              }
            >
              Theme
            </DropdownItem>
            <DropdownItem
              key="theme"
              isReadOnly
              className="cursor-default sm:hidden"
              endContent={
                <select className="z-10 p-2 rounded-md border-small border-default-300 bg-transparent py-1.5 text-tiny text-default-500 outline-none group-data-[hover=true]:border-default-500 dark:border-default-200">
                  <option value="dark">
                    <Icon icon="twemoji:flag-united-states" fontSize={24} />
                    English
                  </option>
                  <option value="light">
                    <Icon icon="twemoji:flag-france" fontSize={24} />
                    Français
                  </option>
                </select>
              }
            >
              Langue
            </DropdownItem>
          </DropdownSection>
          <DropdownSection aria-label="Help & Feedback">
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={handleLogout}>
              Log Out
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default NavigationHeader;
