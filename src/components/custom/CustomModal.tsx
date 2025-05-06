import React, { ReactNode } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalProps,
  Form,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface CustomModalProps extends ModalProps {
  children: ReactNode;
  head?: ReactNode;
  footer?: ReactNode;
  outsideContent?: ReactNode;
  className?: string;
  classNameModalBody?: string;
  isLoading?: boolean;
  onSubmit?: (formData: any) => void;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  title,
  children,
  head,
  footer,
  className = "",
  classNameModalBody = "",
  size = "2xl",
  scrollBehavior = "inside",
  backdrop = "opaque",
  onSubmit,
  isLoading,
  outsideContent,
  ...props
}) => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSubmit && onSubmit(formData);
  };

  return (
    <Modal
      size={size}
      scrollBehavior={scrollBehavior}
      backdrop={backdrop}
      {...props}
      classNames={{ header: "p-0 ", base: "z-10" }}
      closeButton={
        <div className="absolute z-[100] right-0 top-0 m-3">
          <Icon icon="mdi:close" fontSize={24}></Icon>
        </div>
      }
    >
      <Form onSubmit={handleSubmit} validationBehavior="native">
        <ModalContent
          className={`bg-white/80  dark:bg-gray-900 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden  relative  max-h-[calc(100%-72px)] dark:border-gray-700 ${className}`}
          style={{ opacity: isLoading ? 0.7 : 1 }}
        >
          {isLoading && (
            <div className="flex justify-center absolute z-[100] items-center w-full h-full">
              <Icon
                icon="mdi:loading"
                width={50}
                className="animate-spin text-primary-500"
              />
            </div>
          )}

          {title && (
            <ModalHeader className="text-lg p-3 px-4 font-semibold bg-white  border-default-50/50 shadow-sm dark:bg-gray-950/50">
              {title}
            </ModalHeader>
          )}
          {head && <div className="flex justify-between">{head}</div>}

          <ModalBody className={"p-3 " + classNameModalBody}>
            {children}
          </ModalBody>

          {footer && (
            <div className="flex justify-end p-3 gap-2 ">{footer}</div>
          )}
        </ModalContent>
      </Form>
      {outsideContent}
    </Modal>
  );
};

export default CustomModal;
