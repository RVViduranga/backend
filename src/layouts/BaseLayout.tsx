import React, { ReactNode, useEffect } from "react";
import "../styles/global.css"; // global CSS import

interface BaseLayoutProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  title = "Project",
  description = "Built with React",
  children,
}) => {
  // Set page title and meta description dynamically
  useEffect(() => {
    document.title = title;

    const metaDescription = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement;

    if (metaDescription) {
      metaDescription.content = description;
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }
  }, [title, description]);

  return <>{children}</>;
};

export default BaseLayout;
