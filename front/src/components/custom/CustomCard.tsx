import React from "react";
import { Card, CardProps } from "@heroui/react";
import { Icon } from "@iconify/react";

interface CustomCardProps extends CardProps {
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  href?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  title?: string;
}

export const CustomCard: React.FC<CustomCardProps> = ({
  className = "",
  children,
  title,
  isLoading = false,
  disabled = false,
  action,
  href,
  ...props
}) => {
  return (
    <Card
      className={`shadow-none text-sm bg-white/90 border border-default-300 dark:border-default-100 backdrop-blur dark:bg-gray-950/20 rounded-2xl overflow-hidden  flex text-left ${className} ${disabled ? "pointer-events-none opacity-50" : ""}`}
      style={{ opacity: isLoading || disabled ? 0.5 : 1 }}
      {...props}
    >
      {(title || action) && (
        <div className="flex justify-between items-center">
          {title && <div className="font-medium">{title}</div>}
          {action && <>{action}</>}
        </div>
      )}
      {isLoading && (
        <div className="flex justify-center absolute z-[100] items-center w-full h-full">
          <Icon
            icon="mdi:loading"
            width={50}
            className="animate-spin text-primary-500"
          />
        </div>
      )}
      {children}
    </Card>
  );
};
