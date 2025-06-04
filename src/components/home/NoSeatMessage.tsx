import SorryLogo from "../../assets/sorry.png";
export default function NoSeatMessage() {
  return (
    <div className="grid justify-center justify-items-center">
      <img
        src={SorryLogo}
        alt="Not found"
        className="w-[30vw] h-[30vw]"
      ></img>
      <h1 className="text-red-600 font-bold text-xl ">No seat Available !</h1>
    </div>
  );
}
