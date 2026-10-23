import useThemeStore from "@/store/themeStore";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggleButton() {
  const dark = useThemeStore((state) => state.dark);
  const toggleDark = useThemeStore((state) => state.toggleDark);

  return (
    <button onMouseUp={toggleDark} className="w-fit p-1 justify-self-end">
       {dark ? <Sun className="w-5"/> : <Moon className="w-5 text-white"/>}
    </button>
  );
}
