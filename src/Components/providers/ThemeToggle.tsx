"use client";



import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/Components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
   
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        aria-label="Loading theme"
        className="h-9 w-9 opacity-0"
      >
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      id="theme-toggle-btn"
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="
        h-9 w-9 cursor-pointer rounded-full
        text-slate-700 hover:text-[#f05a28]
        dark:text-slate-200 dark:hover:text-[#f05a28]
        hover:bg-slate-100 dark:hover:bg-zinc-800
        transition-all duration-200
      "
    >
      {isDark ? (
        
        <Sun className="h-5 w-5 transition-transform duration-300 rotate-0 scale-100" />
      ) : (
        
        <Moon className="h-5 w-5 transition-transform duration-300 rotate-0 scale-100" />
      )}
    </Button>
  );
}
