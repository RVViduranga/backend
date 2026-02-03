import {
  createElement,
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { Circle, type LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { logger } from "@/lib/logger";

interface SafeIconProps extends LucideProps {
  name: string;
}

type LucideIcon = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

// Cache for loaded icons
const iconCache = new Map<
  string,
  LazyExoticComponent<LucideIcon> | LucideIcon
>();

export default function SafeIcon({ name, ...props }: SafeIconProps) {
  // Check cache first
  if (!iconCache.has(name)) {
    try {
      // Dynamically import icon
      const IconComponent = lazy(async () => {
        try {
          const module = await import("lucide-react");
          const icon = (module as any)[name] as LucideIcon | undefined;
          if (!icon) {
            logger.warn(
              `Icon "${name}" not found in lucide-react, using fallback`
            );
            return { default: Circle as LucideIcon };
          }
          return { default: icon };
        } catch {
          logger.warn(`Failed to load icon "${name}", using fallback`);
          return { default: Circle as LucideIcon };
        }
      });
      iconCache.set(name, IconComponent);
    } catch {
      iconCache.set(name, Circle as LucideIcon);
    }
  }

  const IconComponent = iconCache.get(name) || (Circle as LucideIcon);
  const { ref: _, ...iconProps } = props;

  return (
    <Suspense fallback={<Circle {...iconProps} />}>
      <IconComponent {...iconProps} />
    </Suspense>
  );
}
