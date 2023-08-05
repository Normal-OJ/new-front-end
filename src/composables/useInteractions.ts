import { useMediaQuery } from "@vueuse/core";

export default function useInteractions() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return {
    isDesktop,
  };
}
