import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="mt-2 w-full p-4">
      <ul className="grid justify-self-center self-center w-full justify-items-center">
        <li className="grid cursor-pointer">
          <a
            target="_blank"
            href="https://github.com/AhmedTrooper"
          >
            <FaGithub className="w-fit text-4xl" />
          </a>
        </li>
      </ul>
    </div>
  );
}
