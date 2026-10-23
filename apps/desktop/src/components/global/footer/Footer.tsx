import { FaGithub, FaYoutube } from "react-icons/fa";
import ApplicationVersion from "./ApplicationVersion";

export default function Footer() {
  return (
    <div className="mt-2 w-full p-4 items-center content-center">
      <ul className="grid items-center content-center justify-self-center self-center w-full justify-items-center grid-cols-3">
        <li className="grid cursor-pointer justify-self-start">
          <a
            target="_blank"
            href="https://github.com/AhmedTrooper"
          >
            <FaGithub className="w-fit text-4xl" />
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://www.youtube.com/@AhmedTrooper"
             className="cursor-pointer grid grid-cols-2 items-center gap-2"
          >
            Tutorial :
            <span>
              <FaYoutube />
            </span>
          </a>
        </li>
        <li className="w-fit justify-self-end cursor-pointer">
          <ApplicationVersion />
        </li>
      </ul>
    </div>
  );
}
