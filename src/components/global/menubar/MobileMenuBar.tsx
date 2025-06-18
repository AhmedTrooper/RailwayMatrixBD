import React from "react";
import {
  Navbar,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@heroui/react";
import ThemeToggleButton from "@/ui/ThemeToggleButton";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { CiWarning } from "react-icons/ci";
import { FaGithub, FaYoutube } from "react-icons/fa";
import { useApplicationStore } from "@/store/ApplicationStore";

export default function MobileMenuBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const isUpdateAvailable = useApplicationStore(
    (state) => state.isUpdateAvailable
  );
  const updateMetadata = useApplicationStore((state) => state.updateMetadata);
  const release_url = updateMetadata?.release_url;

  const menuItems = ["Settings"];

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className={clsx(
        "bg-[#191f1f] dark:text-white  dark:bg-zinc-900 w-full h-fit flex",
        {}
      )}
    >
      <NavbarContent
        justify="start"
        className="cursor-pointer"
      >
        <NavbarItem>
          {!isMenuOpen && (
            <Menu
              className="text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
          )}

          {isMenuOpen && (
            <X
              className="text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
          )}
        </NavbarItem>
      </NavbarContent>

      {isUpdateAvailable && release_url && (
        <NavbarContent className="border text-white p-1 cursor-pointer rounded-md dark:border-zinc-600 border-zinc-700 m-1 flex h-fit self-center w-fit">
          <NavbarItem>
            <CiWarning className="text-yellow-300" />
          </NavbarItem>
          <NavbarItem>
            <a
              target="_blank"
              href={release_url ? release_url : "/"}
            >
              Update available
            </a>
          </NavbarItem>
        </NavbarContent>
      )}

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeToggleButton />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className=" bg-[#191f1f] dark:bg-zinc-900 h-screen absolute mt-10">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full text-white"
              color="foreground"
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          {isUpdateAvailable && release_url && (
            <Link
              className="w-full text-white"
              color="foreground"
              href="/update"
              size="lg"
            >
              <Button
                color="success"
                variant="ghost"
              >
                Update Details
              </Button>
            </Link>
          )}
        </NavbarMenuItem>
        <NavbarMenuItem>
           <a
           className="text-white cursor-pointer grid grid-cols-2 items-center gap-2"
                      target="_blank"
                      href="https://www.youtube.com/@AhmedTrooper"
                    >
                      Tutorial : {" "}
                      <span>
                        <FaYoutube />
                      </span>
                    </a>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <a
            target="_blank"
            href="https://github.com/AhmedTrooper"
          >
            <FaGithub className="w-fit text-4xl text-white" />
          </a>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
