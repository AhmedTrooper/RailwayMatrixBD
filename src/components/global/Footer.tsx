import { FaGithub } from "react-icons/fa6";

export default function Footer() {
  return (
    <div className="shadow-sm rounded-md mb-5 shadow-black grid mt-5 justify-center justify-items-center justify-self-center w-fit h-fit p-2">
      <a
        href="https://github.com/AhmedTrooper"
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold"
      >
        <FaGithub className="text-3xl text-green-600"/>
      </a>
    </div>
  );
}
