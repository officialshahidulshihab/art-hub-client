import React from 'react';

const StatCard = ({ label, value, valueClass = "text-foreground" }) => {
    return (
        <div className="flex-1 border border-border bg-card px-6 py-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
      <p className={`mt-2 font-serif text-3xl ${valueClass}`}>{value}</p>
    </div>
    );
};

export default StatCard;