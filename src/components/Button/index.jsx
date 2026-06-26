export const Button = ({ children, onClick, type = "button", ...props }) => (
  <button
    type={type}
    onClick={onClick}
    className="w-full h-[44px] rounded-[15px] font-semibold text-[16px] transition-all duration-200 cursor-pointer shadow-[0px_4px_6px_0px_rgba(0,0,0,0.22)] bg-[#ffe14e] text-[#192853] hover:brightness-105 active:scale-[0.98]"
    {...props}
  >
    {children}
  </button>
);
