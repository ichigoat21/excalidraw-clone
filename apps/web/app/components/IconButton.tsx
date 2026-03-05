import { ReactNode } from "react";

export function IconButton({
  icon,
  onClick,
  activated,
  title,
}: {
  icon: ReactNode;
  onClick: () => void;
  activated: boolean;
  title?: string;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`
        relative flex items-center justify-center
        w-10 h-10 rounded-xl
        transition-all duration-200 ease-out
        outline-none focus:outline-none
        ${
          activated
            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/40 scale-105"
            : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80 hover:scale-105"
        }
      `}
    >
      <span className="w-[18px] h-[18px] flex items-center justify-center">
        {icon}
      </span>
    </button>
  );
}