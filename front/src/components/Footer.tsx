import type { IconProps } from "@iconify/react";

import { Link, Spacer } from "@heroui/react";
import { Icon } from "@iconify/react";

type SocialIconProps = Omit<IconProps, "icon">;

const navLinks = [
  {
    name: "Home",
    href: "#",
  },
  {
    name: "Data Identity",
    href: "#",
  },
  {
    name: "Explore All",
    href: "#",
  },
  {
    name: "About",
    href: "#",
  },
  {
    name: "Help",
    href: "#",
  },
];

export function Footer() {
  return (
    <footer className="flex w-full flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 py-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              isExternal
              className="text-default-500"
              href={item.href}
              size="sm"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <Spacer y={4} />

        <p className="mt-1 text-center text-small text-default-400">
          Powered by L'Oréal Beauty Tech
        </p>
      </div>
    </footer>
  );
}
