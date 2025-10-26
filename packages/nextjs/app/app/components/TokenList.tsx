"use client";

import { useMemo, useState } from "react";

type Token = {
  id: string;
  name: string;
  symbol: string;
  product: string;
  available: number; // units available (supports 6 decimals)
  price: number; // USDT per unit (mock)
  apr: number; // projected APR mock
};

const INITIAL_TOKENS: Token[] = [
  {
    id: "TKN-WHEAT-25",
    name: "Wheat 2025 Share",
    symbol: "WH25",
    product: "Wheat Harvest",
    available: 120_000,
    price: 1.0,
    apr: 0.18,
  },
  {
    id: "TKN-HONEY-25",
    name: "Organic Honey 2025 Share",
    symbol: "HN25",
    product: "Honey Expansion",
    available: 85_500,
    price: 1.0,
    apr: 0.22,
  },
  {
    id: "TKN-CATTLE-25",
    name: "Cattle 2025 Share",
    symbol: "CT25",
    product: "Pasture-Fed Cattle",
    available: 150_250,
    price: 1.0,
    apr: 0.2,
  },
  {
    id: "TKN-BARLEY-25",
    name: "Barley 2025 Share",
    symbol: "BR25",
    product: "Barley Program",
    available: 64_800,
    price: 1.0,
    apr: 0.16,
  },
  {
    id: "TKN-CORN-25",
    name: "Corn 2025 Share",
    symbol: "CN25",
    product: "Corn Harvest",
    available: 92_300,
    price: 1.0,
    apr: 0.19,
  },
  {
    id: "TKN-DAIRY-25",
    name: "Dairy 2025 Share",
    symbol: "DY25",
    product: "Dairy Processing",
    available: 40_000,
    price: 1.0,
    apr: 0.15,
  },
  {
    id: "TKN-APPLES-25",
    name: "Apples 2025 Share",
    symbol: "AP25",
    product: "Orchard Apples",
    available: 55_250,
    price: 1.0,
    apr: 0.17,
  },
  {
    id: "TKN-POULTRY-25",
    name: "Poultry 2025 Share",
    symbol: "PL25",
    product: "Poultry Program",
    available: 71_600,
    price: 1.0,
    apr: 0.18,
  },
  {
    id: "TKN-POTATO-25",
    name: "Seed Potatoes 2025 Share",
    symbol: "SP25",
    product: "Seed Potatoes",
    available: 36_900,
    price: 1.0,
    apr: 0.14,
  },
];

const USDT_DECIMALS = 6; // mimic on-chain precision like in Wheat card
const MIN_LOT = 100; // demo min lot

export default function TokenList() {
  const [tokens, setTokens] = useState<Token[]>(INITIAL_TOKENS);
  const [active, setActive] = useState<Token | null>(null);
  const [tab, setTab] = useState<"overview" | "metrics" | "purchases" | "finalize">("overview");

  const totalAvailable = useMemo(() => tokens.reduce((a, b) => a + b.available, 0), [tokens]);

  return (
    <div>
      <div className="mb-3 text-sm text-muted-foreground">
        Still available supply: {totalAvailable.toLocaleString()} units
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tokens.map(t => (
          <div key={t.id} className="p-5 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">{t.product}</div>
                <div className="text-lg font-semibold text-foreground">
                  {t.name} · {t.symbol}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">APR</div>
                <div className="text-primary font-semibold">{Math.round(t.apr * 100)}%</div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Price</div>
                <div className="font-medium text-foreground">{t.price.toFixed(2)} USDT</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Available</div>
                <div className="font-medium text-foreground">{t.available.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Min. Lot</div>
                <div className="font-medium text-foreground">{MIN_LOT}</div>
              </div>
            </div>
            <div className="mt-4">
              <button
                className="w-full px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10"
                onClick={() => {
                  setActive(t);
                  setTab("overview");
                }}
              >
                Details & Purchase
              </button>
            </div>
          </div>
        ))}
      </div>

      {active && (
        <Modal onClose={() => setActive(null)}>
          <div className="p-1">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white">
              <div>
                <div className="text-xs text-muted-foreground">{active.product}</div>
                <div className="text-lg font-semibold text-foreground">
                  {active.name} · {active.symbol}
                </div>
              </div>
              <button className="text-sm text-muted-foreground hover:text-foreground" onClick={() => setActive(null)}>
                ✕
              </button>
            </div>

            <div className="px-4 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <TabButton label="Overview" active={tab === "overview"} onClick={() => setTab("overview")} />
                <TabButton label="Metrics" active={tab === "metrics"} onClick={() => setTab("metrics")} />
                <TabButton label="Purchases" active={tab === "purchases"} onClick={() => setTab("purchases")} />
                <TabButton label="Finalize/Burn" active={tab === "finalize"} onClick={() => setTab("finalize")} />
              </div>

              {tab === "overview" && (
                <div className="mt-4 grid md:grid-cols-3 gap-4">
                  <Kpi title="Unit Price" value={`${active.price.toFixed(2)} USDT`} />
                  <Kpi title="APR" value={`${Math.round(active.apr * 100)}%`} />
                  <Kpi title="Available" value={active.available.toLocaleString()} />
                  <div className="md:col-span-3 text-sm text-muted-foreground">
                    This token represents a pro-rata share of real agro-business production revenue. Supply and returns
                    are illustrative for demo purposes.
                  </div>
                </div>
              )}

              {tab === "metrics" && (
                <div className="mt-4">
                  <MiniLineChart />
                  <div className="mt-2 text-xs text-muted-foreground">Mock performance over last 12 months</div>
                </div>
              )}

              {tab === "purchases" && (
                <PurchaseForm
                  token={active}
                  onPurchased={qty => {
                    setTokens(prev =>
                      prev.map(tk =>
                        tk.id === active.id ? { ...tk, available: Math.max(0, tk.available - qty) } : tk,
                      ),
                    );
                    setActive(prev => (prev ? { ...prev, available: Math.max(0, prev.available - qty) } : prev));
                  }}
                />
              )}

              {tab === "finalize" && <FinalizeSection token={active} />}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-white text-foreground border border-border rounded-xl shadow-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      className={`px-3 py-1.5 rounded-md border text-sm ${
        active ? "border-primary text-foreground bg-primary/10" : "border-border text-muted-foreground hover:bg-muted"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function Kpi({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-4 rounded-lg border border-border bg-background">
      <div className="text-xs uppercase text-muted-foreground">{title}</div>
      <div className="mt-1 text-xl font-semibold text-foreground">{value}</div>
    </div>
  );
}

function FinalizeSection({ token }: { token: Token }) {
  const [scenario, setScenario] = useState<0 | 1 | 2>(1); // 1=success,2=failure,0=not funded
  const [qty, setQty] = useState<string>("");
  const qtyNum = useMemo(() => Number(qty || 0), [qty]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");

  function setQtyPrecise(next: string) {
    const clean = sanitizeNumberInput(next);
    const clamped = clampToPrecision(clean, USDT_DECIMALS);
    setQty(clamped);
    if (Number(clamped) <= 0) setError("Enter a positive amount");
    else setError("");
  }

  return (
    <div className="mt-4 p-4 rounded-lg border border-border bg-background">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-3">
          <div className="text-xs text-muted-foreground mb-2">Select scenario</div>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1.5 rounded-full border text-sm ${scenario === 1 ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-border hover:bg-muted"}`}
              onClick={() => setScenario(1)}
            >
              Success payout
            </button>
            <button
              className={`px-3 py-1.5 rounded-full border text-sm ${scenario === 2 ? "border-amber-300 bg-amber-50 text-amber-700" : "border-border hover:bg-muted"}`}
              onClick={() => setScenario(2)}
            >
              Failure refund
            </button>
            <button
              className={`px-3 py-1.5 rounded-full border text-sm ${scenario === 0 ? "border-rose-300 bg-rose-50 text-rose-700" : "border-border hover:bg-muted"}`}
              onClick={() => setScenario(0)}
            >
              Not funded (cancel)
            </button>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-muted-foreground mb-2">Burn quantity (units)</label>
          <input
            type="text"
            inputMode="decimal"
            value={qty}
            onChange={e => setQtyPrecise(e.target.value)}
            placeholder={`e.g. 10.000000`}
            className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {error && <div className="mt-2 text-xs text-rose-600">{error}</div>}
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Scenario</div>
          <div className="text-foreground font-semibold">
            {scenario === 1 ? "Success payout" : scenario === 2 ? "Failure refund" : "Not funded"}
          </div>
          <div className="text-xs text-muted-foreground mt-2">Precision</div>
          <div className="text-foreground">{USDT_DECIMALS} decimals</div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end gap-3">
        <button className="px-4 py-2 rounded-lg border border-border hover:bg-muted" onClick={() => setQty("")}>
          Clear
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          disabled={busy || !qty || !!error}
          onClick={async () => {
            try {
              setBusy(true);
              await new Promise(r => setTimeout(r, 700));
              alert(
                `Finalize (mock): ${scenario === 1 ? "success" : scenario === 2 ? "failure" : "not funded"} — burned ${Number(qty).toFixed(USDT_DECIMALS)} ${token.symbol}`,
              );
              setQty("");
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Processing..." : "Finalize (Burn)"}
        </button>
      </div>
    </div>
  );
}

function MiniLineChart() {
  const series = [12, 14, 13, 16, 18, 17, 20, 21, 22, 23, 25, 28];
  const max = Math.max(...series);
  const pts = series
    .map((v, i) => {
      const x = 20 + i * (300 / (series.length - 1));
      const y = 120 - (v / max) * 100;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 340 140" className="w-full h-36">
      <polyline fill="none" stroke="#64BF43" strokeWidth="3" points={pts} />
      {series.map((v, i) => {
        const x = 20 + i * (300 / (series.length - 1));
        const y = 120 - (v / max) * 100;
        return <circle key={i} cx={x} cy={y} r="2.5" fill="#64BF43" />;
      })}
      <line x1="20" y1="120" x2="320" y2="120" stroke="#E5E7EB" />
    </svg>
  );
}

function clampToPrecision(n: string, decimals: number) {
  if (!n) return n;
  if (!n.includes(".")) return n;
  const [i, f] = n.split(".");
  return `${i}.${f.slice(0, decimals)}`;
}

function sanitizeNumberInput(raw: string) {
  // allow only digits and one dot
  let v = raw.replace(/[^0-9.]/g, "");
  const parts = v.split(".");
  if (parts.length > 2) {
    v = `${parts[0]}.${parts.slice(1).join("")}`;
  }
  return v;
}

function PurchaseForm({ token, onPurchased }: { token: Token; onPurchased: (qty: number) => void }) {
  const [qty, setQty] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");

  const qtyNum = useMemo(() => Number(qty || 0), [qty]);
  const total = useMemo(() => (isFinite(qtyNum) ? qtyNum * token.price : 0), [qtyNum, token.price]);

  function setQtyPrecise(next: string) {
    const clean = sanitizeNumberInput(next);
    const clamped = clampToPrecision(clean, USDT_DECIMALS);
    setQty(clamped);
    if (Number(clamped) > token.available) setError("Quantity exceeds available supply");
    else if (Number(clamped) > 0 && Number(clamped) < MIN_LOT) setError(`Minimum lot is ${MIN_LOT}`);
    else setError("");
  }

  return (
    <div className="mt-4 p-4 rounded-lg border border-border bg-background">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-muted-foreground mb-2">Quantity (units)</label>
          <div className="flex items-stretch gap-2">
            <button
              className="px-3 rounded-lg border border-border hover:bg-muted"
              onClick={() => setQtyPrecise(`${Math.max(0, qtyNum - 1).toFixed(USDT_DECIMALS)}`)}
            >
              −
            </button>
            <input
              type="text"
              inputMode="decimal"
              value={qty}
              onChange={e => setQtyPrecise(e.target.value)}
              placeholder={`e.g. ${MIN_LOT}.000000`}
              className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              className="px-3 rounded-lg border border-border hover:bg-muted"
              onClick={() => setQtyPrecise(`${(qtyNum + 1).toFixed(USDT_DECIMALS)}`)}
            >
              +
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <button className="underline" onClick={() => setQtyPrecise(String(MIN_LOT))}>
              Min lot
            </button>
            <span>•</span>
            <button className="underline" onClick={() => setQtyPrecise(String(token.available))}>
              Max
            </button>
            <span>•</span>
            <span>USDT precision: {USDT_DECIMALS} decimals</span>
          </div>
          {error && <div className="mt-2 text-xs text-rose-600">{error}</div>}
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Price per unit</div>
          <div className="text-foreground font-semibold">{token.price.toFixed(2)} USDT</div>
          <div className="text-xs text-muted-foreground mt-2">Total</div>
          <div className="text-primary font-bold">{total.toFixed(2)} USDT</div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="text-xs text-muted-foreground">Available: {token.available.toLocaleString()} units</div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg border border-border hover:bg-muted" onClick={() => setQty("")}>
            Clear
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            disabled={busy || !qty || Number(qty) <= 0 || !!error}
            onClick={async () => {
              try {
                setBusy(true);
                await new Promise(r => setTimeout(r, 700));
                onPurchased(Number(qty));
                alert(`Purchased ${Number(qty).toFixed(USDT_DECIMALS)} ${token.symbol} (mock)`);
                setQty("");
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Processing..." : "Purchase"}
          </button>
        </div>
      </div>
    </div>
  );
}
