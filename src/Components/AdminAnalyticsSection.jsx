"use client";

import {
  BarChart,
  Bar,
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

const CustomBarTooltip = ({ active, payload, label }) => {
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

const AdminAnalyticsSection = ({ salesOverTime, categories, stats }) => {
  const totalRevenue = stats?.revenue ?? 0;
  const totalTransactions = stats?.transactions ?? 0;
  const avgOrder =
    totalTransactions > 0
      ? Math.round(totalRevenue / totalTransactions)
      : 0;

  const metricItems = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue?.toLocaleString()}`,
      valueClass: "text-primary",
    },
    {
      label: "Total Transactions",
      value: totalTransactions,
      valueClass: "text-foreground",
    },
    {
      label: "Avg. Order Value",
      value: `$${avgOrder?.toLocaleString()}`,
      valueClass: "text-foreground",
    },
    {
      label: "Total Artists",
      value: stats?.artists ?? "—",
      valueClass: "text-foreground",
    },
  ];

  return (
    <>
      <h1 className="font-serif text-4xl text-foreground">Analytics</h1>
      <p className="mt-1.5 text-sm text-primary">
        Platform performance at a glance.
      </p>

      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 border border-border">
        {metricItems.map((item, i) => (
          <div
            key={i}
            className={`px-6 py-5 ${i < metricItems.length - 1 ? "border-r border-border" : ""}`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {item.label}
            </p>
            <p className={`mt-2 font-serif text-3xl ${item.valueClass}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="border border-border bg-card px-6 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-6">
            Revenue over time
          </p>
          {salesOverTime.length === 0 ? (
            <p className="font-sans text-sm text-muted-foreground">
              No sales data yet.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
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
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "#E8E4DA" }} />
                <Bar dataKey="revenue" fill="#B6633A" radius={0} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="border border-border bg-card px-6 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4">
            Sales by category
          </p>
          {categories.length === 0 ? (
            <p className="font-sans text-sm text-muted-foreground">
              No category data yet.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
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
                      <span className="font-sans text-[11px] text-muted-foreground">
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-0">
                {categories.map((cat, i) => {
                  const total = categories.reduce((s, c) => s + c.count, 0);
                  const pct = total > 0 ? Math.round((cat.count / total) * 100) : 0;
                  return (
                    <div
                      key={cat.name}
                      className="flex items-center gap-4 border-t border-border py-2.5"
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                        }}
                      />
                      <span className="font-sans text-sm text-foreground flex-1">
                        {cat.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-20 overflow-hidden bg-border">
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              backgroundColor:
                                CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                            }}
                          />
                        </div>
                        <span className="font-sans text-xs text-muted-foreground w-8 text-right">
                          {pct}%
                        </span>
                      </div>
                      <span className="font-sans text-sm font-medium text-foreground w-6 text-right">
                        {cat.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 border border-border bg-card px-6 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4">
          Platform summary
        </p>
        <div className="space-y-0">
          {[
            { label: "Registered users", value: stats?.users ?? "—" },
            { label: "Total artworks", value: stats?.artworks ?? "—" },
            {
              label: "Total revenue",
              value: `$${totalRevenue?.toLocaleString()}`,
            },
            { label: "Completed transactions", value: totalTransactions },
            {
              label: "Avg. order value",
              value: `$${avgOrder?.toLocaleString()}`,
            },
          ].map((row, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-t border-border py-3"
            >
              <p className="font-sans text-sm text-muted-foreground">
                {row.label}
              </p>
              <p className="font-sans text-sm font-medium text-foreground">
                {row.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminAnalyticsSection;