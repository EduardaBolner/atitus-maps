import logoImg from "../../assets/logo.png";

export const Logo = ({ size = "large" }) => {
  const imgSize = size === "large" ? "w-[216px] h-[216px]" : "w-[140px] h-[140px]";
  return (
    <div className="flex flex-col items-center">
      <img src={logoImg} alt="Evenza" className={imgSize + " object-contain"} />
    </div>
  );
};
