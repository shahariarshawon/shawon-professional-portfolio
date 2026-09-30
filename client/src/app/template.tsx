"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { ease } from "@/lib/motion";

// False until the first template has mounted, so the initial (server-rendered)
// page is never hidden behind a fade; only client navigations animate.
let hasMountedOnce = false;

/**
 * Page transition for public routes. Templates remount on navigation, so each
 * page fades in. Opacity only: a transform here would become the containing
 * block for the fixed navbar and overlays. Admin routes are left untouched.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const shouldAnimate = hasMountedOnce;

  useEffect(() => {
    hasMountedOnce = true;

    // The startup intro only belongs to a first landing on the homepage.
    if (pathname !== "/") {
      document.documentElement.setAttribute("data-intro-seen", "");
    }
  }, [pathname]);

  if (isAdmin) {
    return children;
  }

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: ease.out }}
    >
      {children}
    </motion.div>
  );
}
