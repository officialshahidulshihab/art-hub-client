"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const CATEGORY_COLORS = [
  "#B6633A",
  "#1A1A1A",
  "#9B59B6",
  "#3498DB",
  "#2ECC71",
  "#F1C40F",
];

const CustomLineTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-border bg-card px-3 py-2">
      <p className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="font-serif text-lg text-primary">
        ${payload[0].value?.toLocaleString()}
      </p>
    </div>
  );
};

const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-border bg-card px-3 py-2">
      <p className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground">
        {payload[0].name}
      </p>
      <p className="font-serif text-lg text-foreground">{payload[0].value}</p>
    </div>
  );
};

const RoleBadge = ({ role }) => {
  if (role === "admin") {
    return (
      <span className="bg-foreground px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-background">
        Admin
      </span>
    );
  }
  if (role === "artist") {
    return (
      <span className="border border-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary">
        Artist
      </span>
    );
  }
  return (
    <span className="border border-border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
      User
    </span>
  );
};

const AdminOverviewSection = ({ stats, transactions, users, salesOverTime, categories, onGoTo }) => {
  const recentTransactions = transactions.slice(0, 5);
  const recentUsers = users.slice(0, 6);

  const statItems = [
    { label: "Users", value: stats.users, valueClass: "text-foreground" },
    { label: "Artworks", value: stats.artworks, valueClass: "text-primary" },
    { label: "Transactions", value: stats.transactions, valueClass: "text-foreground" },
    { label: "Revenue", value: `$${stats.revenue?.toLocaleString()}`, valueClass: "text-primary" },
  ];

  return (
    <>
      <h1 className="font-serif text-4xl text-foreground">Admin console</h1>
      <p className="mt-1.5 text-sm text-primary">Vital signs across the platform.</p>

      <div className="mt-8 grid grid-cols-4 border border-border">
        {statItems.map((stat, i) => (
          <div
            key={i}
            className={`px-6 py-5 ${i < statItems.length - 1 ? "border-r border-border" : ""}`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {stat.label}
            </p>
            <p className={`mt-2 font-serif text-4xl ${stat.valueClass}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="border border-border bg-card px-6 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4">
            Sales over time
          </p>
          {salesOverTime.length === 0 ? (
            <p className="font-sans text-sm text-muted-foreground">No sales data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={salesOverTime}
                margin={{ top: 4, right: 8, left: 8, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#D4CFC4"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#6B6457", fontFamily: "sans-serif" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6B6457", fontFamily: "sans-serif" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v.toLocaleString()}`}
                />
                <Tooltip content={<CustomLineTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#B6633A"
                  strokeWidth={1.5}
                  dot={{ fill: "#B6633A", r: 3.5, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "#B6633A", strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="border border-border bg-card px-6 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4">
            Categories
          </p>
          {categories.length === 0 ? (
            <p className="font-sans text-sm text-muted-foreground">No category data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                >
                  {categories.map((_, i) => (
                    <Cell
                      key={i}
                      fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ fontSize: 11, color: "#6B6457", fontFamily: "sans-serif" }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="border border-border bg-card px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Recent Transactions
            </p>
            <button
              onClick={() => onGoTo("transactions")}
              className="font-sans text-[11px] uppercase tracking-widest text-primary hover:text-foreground transition-colors"
            >
              All →
            </button>
          </div>
          {recentTransactions.length === 0 ? (
            <p className="font-sans text-sm text-muted-foreground">No transactions yet.</p>
          ) : (
            <div className="space-y-0">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between border-t border-border py-3">
                  <div>
                    <p className="font-sans text-sm font-medium text-foreground italic">{tx.artwork}</p>
                    <p className="font-sans text-xs text-primary mt-0.5">
                      {tx.collector} → {tx.artist}
                    </p>
                  </div>
                  <p className="font-sans text-sm font-medium text-foreground">
                    ${tx.amount?.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border border-border bg-card px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              New Users
            </p>
            <button
              onClick={() => onGoTo("users")}
              className="font-sans text-[11px] uppercase tracking-widest text-primary hover:text-foreground transition-colors"
            >
              All →
            </button>
          </div>
          {recentUsers.length === 0 ? (
            <p className="font-sans text-sm text-muted-foreground">No users yet.</p>
          ) : (
            <div className="space-y-0">
              {recentUsers.map((u) => {
                const initial = (u.name?.[0] ?? "U").toUpperCase();
                return (
                  <div key={u.id} className="flex items-center justify-between border-t border-border py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
                        {initial}
                      </div>
                      <div>
                        <p className="font-sans text-sm text-foreground leading-tight">{u.name}</p>
                        <p className="font-sans text-[11px] text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                    <RoleBadge role={u.role} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminOverviewSection;