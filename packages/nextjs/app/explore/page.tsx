"use client";

import Link from "next/link";

export default function ExplorePage() {
  // Mock KPIs
  const kpis = {
    successfulFees: 1248,
    successfulRefunds: 173,
    nonFees: 312,
    schedulesPackaged: 42,
  };

  // Mock data for charts
  const financeSeries = [
    { m: "Jan", fee: 24, refund: 2 },
    { m: "Feb", fee: 32, refund: 4 },
    { m: "Mar", fee: 28, refund: 3 },
    { m: "Apr", fee: 36, refund: 5 },
    { m: "May", fee: 40, refund: 6 },
    { m: "Jun", fee: 44, refund: 7 },
    { m: "Jul", fee: 38, refund: 5 },
    { m: "Aug", fee: 46, refund: 6 },
    { m: "Sep", fee: 52, refund: 8 },
    { m: "Oct", fee: 57, refund: 7 },
    { m: "Nov", fee: 61, refund: 9 },
    { m: "Dec", fee: 70, refund: 10 },
  ];

  const investorBars = [
    { seg: "Retail", v: 420 },
    { seg: "Pro", v: 210 },
    { seg: "DAO", v: 95 },
    { seg: "Family Office", v: 58 },
  ];

  const projectSegments = [
    { label: "Live", value: 48, color: "#64BF43" },
    { label: "Harvesting", value: 22, color: "#8DD36A" },
    { label: "Upcoming", value: 18, color: "#C7E9B0" },
    { label: "Closed", value: 12, color: "#E6F4E6" },
  ];

  const totalProjects = projectSegments.reduce((a, b) => a + b.value, 0);

  // Simple helpers for SVG sizing
  const financeMax = Math.max(...financeSeries.map(d => Math.max(d.fee, d.refund)));

  const schedules = [
    { id: "SCH-2025-10-01", items: 34, amount: "$128,400", status: "Scheduled" },
    { id: "SCH-2025-11-01", items: 29, amount: "$102,150", status: "Packaging" },
    { id: "SCH-2025-12-01", items: 37, amount: "$141,980", status: "Queued" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Back
            </Link>
            <div className="text-foreground font-semibold">Explore: Stats Overview</div>
          </div>
          <div className="text-sm text-muted-foreground">Mock data for demonstration</div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* KPIs */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard label="Successful Fees" value={kpis.successfulFees.toLocaleString()} />
          <KpiCard label="Successful Refunds" value={kpis.successfulRefunds.toLocaleString()} />
          <KpiCard label="Non-Fees" value={kpis.nonFees.toLocaleString()} />
          <KpiCard label="Packaged into Schedules" value={kpis.schedulesPackaged.toLocaleString()} />
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Finance: line chart */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Finance — Fees vs Refunds</h3>
              <span className="text-xs text-muted-foreground">Monthly</span>
            </div>
            <svg viewBox="0 0 600 260" className="w-full h-56">
              {/* axes */}
              <line x1="40" y1="220" x2="580" y2="220" stroke="#E5E7EB" />
              <line x1="40" y1="20" x2="40" y2="220" stroke="#E5E7EB" />
              {/* fee line (green) */}
              <polyline
                fill="none"
                stroke="#64BF43"
                strokeWidth="3"
                points={financeSeries
                  .map((d, i) => {
                    const x = 40 + i * (540 / (financeSeries.length - 1));
                    const y = 220 - (d.fee / financeMax) * 180;
                    return `${x},${y}`;
                  })
                  .join(" ")}
              />
              {/* refund line (muted green) */}
              <polyline
                fill="none"
                stroke="#A5D99A"
                strokeWidth="3"
                points={financeSeries
                  .map((d, i) => {
                    const x = 40 + i * (540 / (financeSeries.length - 1));
                    const y = 220 - (d.refund / financeMax) * 180;
                    return `${x},${y}`;
                  })
                  .join(" ")}
              />
              {/* dots */}
              {financeSeries.map((d, i) => {
                const x = 40 + i * (540 / (financeSeries.length - 1));
                const y1 = 220 - (d.fee / financeMax) * 180;
                const y2 = 220 - (d.refund / financeMax) * 180;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y1} r="3" fill="#64BF43" />
                    <circle cx={x} cy={y2} r="3" fill="#A5D99A" />
                  </g>
                );
              })}
            </svg>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <Legend color="#64BF43" label="Fees" />
              <Legend color="#A5D99A" label="Refunds" />
            </div>
          </div>

          {/* Investors: bar chart */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Investors — Active by Segment</h3>
              <span className="text-xs text-muted-foreground">Current</span>
            </div>
            <div className="h-56 flex items-end gap-4">
              {investorBars.map(b => {
                const max = Math.max(...investorBars.map(x => x.v));
                const h = Math.max(12, Math.round((b.v / max) * 200));
                return (
                  <div key={b.seg} className="flex-1 flex flex-col items-center">
                    <div className="w-full max-w-16 bg-[#64BF43]/20 rounded-t-md" style={{ height: h }}>
                      <div className="h-full w-full bg-[#64BF43] rounded-t-md opacity-80" />
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground text-center">{b.seg}</div>
                    <div className="text-sm font-medium text-foreground">{b.v}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Projects: donut chart */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Projects — Status Mix</h3>
              <span className="text-xs text-muted-foreground">Count</span>
            </div>
            <div className="flex items-center gap-6">
              <svg viewBox="0 0 160 160" className="w-40 h-40">
                <g transform="translate(80,80)">
                  {(() => {
                    const r = 70;
                    const t = projectSegments.reduce((a, b) => a + b.value, 0);
                    let start = 0;
                    return projectSegments.map((s, i) => {
                      const angle = (s.value / t) * Math.PI * 2;
                      const x1 = Math.cos(start) * r;
                      const y1 = Math.sin(start) * r;
                      const x2 = Math.cos(start + angle) * r;
                      const y2 = Math.sin(start + angle) * r;
                      const large = angle > Math.PI ? 1 : 0;
                      const d = `M 0 0 L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
                      start += angle;
                      return <path key={i} d={d} fill={s.color} opacity={0.9} />;
                    });
                  })()}
                  <circle r="40" fill="white" />
                </g>
              </svg>
              <div className="flex-1 space-y-2">
                {projectSegments.map(s => (
                  <div key={s.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: s.color }} />
                      <span className="text-muted-foreground">{s.label}</span>
                    </div>
                    <div className="text-foreground font-medium">{s.value}</div>
                  </div>
                ))}
                <div className="pt-2 text-xs text-muted-foreground">Total: {totalProjects}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Schedules */}
        <section className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Payout Schedules Packaging</h3>
            <span className="text-xs text-muted-foreground">Prepared: {kpis.schedulesPackaged}</span>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {schedules.map(s => (
              <div key={s.id} className="p-4 rounded-lg border border-border bg-background">
                <div className="text-sm text-muted-foreground">{s.id}</div>
                <div className="mt-2 text-foreground font-semibold">{s.amount}</div>
                <div className="text-sm text-muted-foreground">Items: {s.items}</div>
                <div className="mt-3 inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-[#64BF43]/10 text-[#2C7A20]">
                  <span>•</span>
                  <span>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-6 rounded-xl border border-border bg-card">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-foreground">{value}</div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
