import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import SafeIcon from "@/components/common/safe-icon";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      size="icon"
      className="fixed bottom-8 right-8 z-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 animate-in fade-in zoom-in"
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <SafeIcon name="ArrowUp" size={20} aria-hidden="true" />
    </Button>
  );
}









