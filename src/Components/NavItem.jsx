import React from "react";
import { BiChevronRight } from "react-icons/bi";

const NavItem = ({ icon, label, active = false, onClick }) => {
  const base =
    "flex w-full items-center gap-3 rounded-none px-6 py-2.5 text-sm transition-colors text-left";
  const activeClass = "bg-foreground text-background font-medium";
  const inactiveClass =
    "text-foreground/70 hover:text-foreground hover:bg-secondary/60";
  

  return (
    <button
      onClick={onClick}
      className={`${base} ${active ? activeClass : inactiveClass}`}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {active && <BiChevronRight />}
    </button>
  );
};

export default NavItem;
