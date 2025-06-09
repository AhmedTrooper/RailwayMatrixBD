import ThemeToggleButton from "@/ui/ThemeToggleButton";
import { FaGithub } from "react-icons/fa";

export default function MobileMenuBar(){
    return(<div className="grid grid-cols-2 p-2 bg-[#191f1f] dark:bg-zinc-900 dark:bg-transparent dark:text-white content-center items-center h-15 mt-0">
         <a
                    target="_blank"
                    href="https://github.com/AhmedTrooper"
                  >
                    <FaGithub className="w-fit text-4xl" />
                  </a>
        <ThemeToggleButton/>
    </div>)
}