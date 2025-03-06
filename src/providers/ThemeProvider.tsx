"use client";
import { ThemeContext } from "@/context/ThemeContext";
import React, { useContext, useState, useEffect } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}
const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme } = useContext(ThemeContext) || {};
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // if not mounted or theme is undefined, don't render anything
  if (!mounted || !theme) {
    return null;
  }

  return <div className={theme}>{children}</div>;
};

export default ThemeProvider;
