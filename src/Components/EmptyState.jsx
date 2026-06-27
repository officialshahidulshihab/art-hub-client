import React from 'react';
import { MdOutlineShoppingBag } from "react-icons/md";

const EmptyState = ({ title, subtitle }) => {
    return (
        <div className="mt-8 flex flex-col items-center justify-center border border-dashed border-border bg-card py-14">
      <MdOutlineShoppingBag className="h-8 w-8 text-muted-foreground" />
      <p className="mt-3 font-serif text-lg text-foreground">{title}</p>
      <p className="mt-1 text-sm text-primary">{subtitle}</p>
    </div>
    );
};

export default EmptyState;