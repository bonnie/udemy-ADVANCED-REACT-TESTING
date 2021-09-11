import { useToast, UseToastOptions } from "@chakra-ui/react";
import React from "react";

import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { resetToast } from "../redux/toastSlice";

export const toastConfig: UseToastOptions = {
  isClosable: true,
  variant: "solid",
  position: "bottom",
};

export function useGlobalToast(): null {
  const dispatch = useAppDispatch();
  const toast = useToast(toastConfig);
  const toastOptions = useAppSelector((state) => state.toast.toastOptions);

  React.useEffect(() => {
    if (toastOptions !== null) {
      const { title, status } = toastOptions;
      toast({ title, status });
      dispatch(resetToast());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toastOptions]);
  return null;
}
