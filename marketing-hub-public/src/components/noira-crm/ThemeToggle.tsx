import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "./svgs";

type ThemeToggleProps = {
  className?: string;
};

const ThemeToggle = ({ className = "" }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={`rounded-full p-2 transition hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-primary-500 ${className}`}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-light-2 hover:text-yellow-400 transition" />
      ) : (
        <Moon className="h-5 w-5 text-light-2 hover:text-primary-500 transition" />
      )}
    </button>
  );
};

export default ThemeToggle;
