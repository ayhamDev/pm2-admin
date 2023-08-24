"use client";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { clsx } from "clsx";
import React, { useState } from "react";

export interface IToast {
  header: string;
  text: string;
  ip?: string;
  setToasts?: React.Dispatch<React.SetStateAction<IToast[]>>;
}
const Toast = (props: IToast) => {
  const [open, setOpen] = useState<boolean>(true);
  const isMd = useMediaQuery("(min-width: 768px)");

  return (
    <ToastPrimitive.Provider swipeDirection={isMd ? "right" : "down"}>
      <ToastPrimitive.Root
        open={open}
        onOpenChange={(value) => {
          if (typeof props.setToasts == "function") {
            props.setToasts((prev) => {
              const state = prev.filter((toast) => toast.ip != props.ip);
              return state;
            });
          }
          setOpen(value);
        }}
        className={clsx(
          "z-50 fixed bottom-4 inset-x-4 w-auto md:top-4 md:right-4 md:left-auto md:bottom-auto md:w-full md:max-w-sm shadow-lg rounded-lg",
          "bg-white dark:bg-gray-800",
          "radix-state-open:animate-toast-slide-in-bottom md:radix-state-open:animate-toast-slide-in-right",
          "radix-state-closed:animate-toast-hide",
          "radix-swipe-direction-right:radix-swipe-end:animate-toast-swipe-out-x",
          "radix-swipe-direction-right:translate-x-radix-toast-swipe-move-x",
          "radix-swipe-direction-down:radix-swipe-end:animate-toast-swipe-out-y",
          "radix-swipe-direction-down:translate-y-radix-toast-swipe-move-y",
          "radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease]",
          "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
        )}
      >
        <div className="flex">
          <div className="w-0 flex-1 flex items-center pl-5 py-4">
            <div className="w-full radix">
              <ToastPrimitive.Title className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {props.header}
              </ToastPrimitive.Title>
              <ToastPrimitive.Description className="mt-1 text-sm text-gray-700 dark:text-gray-400">
                {props.text}
              </ToastPrimitive.Description>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col px-3 py-2 space-y-1">
              <div className="h-0 flex-1 flex"></div>
              <div className="h-0 flex-1 flex">
                <ToastPrimitive.Close className="w-full border border-transparent rounded-lg px-3 py-2 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                  Dismiss
                </ToastPrimitive.Close>
              </div>
            </div>
          </div>
        </div>
      </ToastPrimitive.Root>

      <ToastPrimitive.Viewport />
    </ToastPrimitive.Provider>
  );
};

export default Toast;
