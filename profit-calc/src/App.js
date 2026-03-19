import { useState, useMemo } from "react";

// ─── Brand Colors ────────────────────────────────────────────────────────────
// Extracted from precisioncontractorsolutions.com
const BRAND = {
  navy: "#0C1248",
  navyDark: "#080d35",
  red: "#C0443F",
  blue: "#2EA3F2",
  white: "#FFFFFF",
  bodyText: "#666666",
  headingText: "#333333",
  lightBg: "#f4f5f7",
  cardBg: "#FFFFFF",
  border: "#e2e5ed",
  mutedText: "#8a90a0",
};

const COLORS = ["#0C1248", "#2EA3F2", "#C0443F", "#1D6FA8", "#d47b1a", "#1a8a5e"];
const LABELS = [
  "Materials markup",
  "Estimating errors",
  "Non-productive time",
  "Employee turnover",
  "Fleet waste",
  "Cash flow cost",
];

const fmt = (v) => "$" + Math.round(v).toLocaleString();
const fmtK = (v) => {
  const rounded = Math.round(v / 1000);
  return "$" + rounded + "K";
};

function calculate(revenue, employees) {
  const fieldWorkers = Math.max(1, employees - 1);
  const materials = Math.round(revenue * 0.4 * 0.15);
  const estimating = Math.round(revenue * 0.3 * 0.1);
  const productivity = Math.round(fieldWorkers * 2080 * 0.3 * 0.33 * 50);
  const turnover = Math.round(employees * 0.45 * 8000);
  const fleet = Math.round(fieldWorkers * 15000 * 0.18);
  const cashflow = Math.round(revenue * 0.15 * 0.1);
  const values = [materials, estimating, productivity, turnover, fleet, cashflow];
  const empBased = productivity + turnover + fleet;
  const revBased = materials + estimating + cashflow;
  const total = empBased + revBased;
  return { values, empBased, revBased, total, fieldWorkers };
}

// ─── Bar Component ────────────────────────────────────────────────────────────
function Bar({ value, max, color, label }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 10,
      }}
    >
      <div
        style={{
          width: 150,
          fontSize: 13,
          color: BRAND.bodyText,
          flexShrink: 0,
          textAlign: "right",
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          background: "#eef0f5",
          borderRadius: 6,
          height: 30,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.max(pct, 2)}%`,
            background: color,
            height: "100%",
            borderRadius: 6,
            transition: "width 0.35s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: 10,
          }}
        >
          {pct > 18 && (
            <span
              style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}
            >
              {fmtK(value)}
            </span>
          )}
        </div>
        {pct <= 18 && (
          <span
            style={{
              position: "absolute",
              left: `calc(${Math.max(pct, 2)}% + 10px)`,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 12,
              color: BRAND.bodyText,
              fontWeight: 600,
            }}
          >
            {fmtK(value)}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Slider Component ─────────────────────────────────────────────────────────
function SliderRow({ label, min, max, step, value, onChange, displayValue }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 18,
      }}
    >
      <label
        style={{
          fontSize: 14,
          color: BRAND.headingText,
          fontWeight: 600,
          minWidth: 130,
        }}
      >
        {label}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ flex: 1 }}
      />
      <span
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: BRAND.navy,
          minWidth: 72,
          textAlign: "right",
        }}
      >
        {displayValue}
      </span>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, labelColor, valueColor, bg }) {
  return (
    <div
      style={{
        background: bg,
        borderRadius: 12,
        padding: "18px 14px",
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: labelColor,
          fontWeight: 700,
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          color: valueColor,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [employees, setEmployees] = useState(6);
  const [revenue, setRevenue] = useState(2000000);
  const data = useMemo(() => calculate(revenue, employees), [revenue, employees]);
  const max = Math.max(...data.values);

  const breakdowns = [
    {
      color: COLORS[0],
      label: "Materials markup",
      text: `${fmt(revenue * 0.4)} in materials × 15% missed markup`,
    },
    {
      color: COLORS[1],
      label: "Estimating errors",
      text: `${fmt(revenue * 0.3)} in labor × 10% underpricing`,
    },
    {
      color: COLORS[2],
      label: "Non-productive time",
      text: `${data.fieldWorkers} field workers × 30% waste × 33% recapturable`,
    },
    {
      color: COLORS[3],
      label: "Employee turnover",
      text: `${employees} employees × 45% turnover × $8K replacement`,
    },
    {
      color: COLORS[4],
      label: "Fleet waste",
      text: `${data.fieldWorkers} vehicles × $15K/yr × 18% inefficiency`,
    },
    {
      color: COLORS[5],
      label: "Cash flow cost",
      text: `${fmt(revenue * 0.15)} avg receivables × 10% interest`,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BRAND.lightBg,
        fontFamily: '"Open Sans", Arial, sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          background: BRAND.navy,
          padding: "0 24px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            maxWidth: 780,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Logo mark */}
            <div
              style={{
                width: 38,
                height: 38,
                background: BRAND.red,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                color: "#fff",
                fontSize: 16,
                letterSpacing: "-0.5px",
                flexShrink: 0,
              }}
            >
              PCS
            </div>
            <div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  lineHeight: 1.2,
                  letterSpacing: "0.01em",
                }}
              >
                Precision Contractor Solutions
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: 11,
                  letterSpacing: "0.03em",
                }}
              >
                ProfitDriver Framework
              </div>
            </div>
          </div>
          <a
            href="https://precisioncontractorsolutions.com"
            target="_blank"
            rel="noreferrer"
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 12,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            precisioncontractorsolutions.com ↗
          </a>
        </div>
      </header>

      {/* Hero band */}
      <div
        style={{
          background: `linear-gradient(135deg, ${BRAND.navy} 0%, #1a2470 100%)`,
          padding: "32px 24px 36px",
        }}
      >
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-block",
              background: BRAND.red,
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "4px 10px",
              borderRadius: 4,
              marginBottom: 14,
            }}
          >
            Free Tool
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#fff",
              margin: "0 0 10px",
              letterSpacing: "-0.03em",
              lineHeight: 1.25,
            }}
          >
            Construction Profit Leak Calculator
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.7)",
              margin: 0,
              lineHeight: 1.6,
              maxWidth: 560,
            }}
          >
            Estimate your annual losses across 6 common profit leaks in $1M–$3M
            construction firms. Adjust the sliders to match your business.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          maxWidth: 780,
          margin: "0 auto",
          padding: "28px 20px 48px",
        }}
      >
        {/* Sliders card */}
        <div
          style={{
            background: BRAND.cardBg,
            borderRadius: 14,
            padding: "24px 28px",
            marginBottom: 20,
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            border: `1px solid ${BRAND.border}`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: BRAND.red,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: 18,
            }}
          >
            Your Business
          </div>
          <SliderRow
            label="Total Employees"
            min={4}
            max={10}
            step={1}
            value={employees}
            onChange={setEmployees}
            displayValue={employees}
          />
          <SliderRow
            label="Annual Revenue"
            min={1000000}
            max={3000000}
            step={100000}
            value={revenue}
            onChange={setRevenue}
            displayValue={`$${(revenue / 1000000).toFixed(1)}M`}
          />
        </div>

        {/* Stat cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 14,
            marginBottom: 20,
          }}
        >
          <StatCard
            label="Employee-based leaks"
            value={fmtK(data.empBased)}
            bg="#eef4fc"
            labelColor="#1a3a7a"
            valueColor={BRAND.navy}
          />
          <StatCard
            label="Revenue-based leaks"
            value={fmtK(data.revBased)}
            bg="#fef3f2"
            labelColor="#9a1f1b"
            valueColor={BRAND.red}
          />
          <StatCard
            label="Total estimated leaks"
            value={fmtK(data.total)}
            bg={BRAND.navy}
            labelColor="rgba(255,255,255,0.6)"
            valueColor="#fff"
          />
        </div>

        {/* Bar chart card */}
        <div
          style={{
            background: BRAND.cardBg,
            borderRadius: 14,
            padding: "24px 28px",
            marginBottom: 20,
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            border: `1px solid ${BRAND.border}`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: BRAND.red,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: 20,
            }}
          >
            Breakdown by Category
          </div>
          {LABELS.map((label, i) => (
            <Bar
              key={label}
              value={data.values[i]}
              max={max}
              color={COLORS[i]}
              label={label}
            />
          ))}
          {/* Legend */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px 20px",
              marginTop: 20,
              paddingTop: 16,
              borderTop: `1px solid ${BRAND.border}`,
            }}
          >
            {LABELS.map((label, i) => (
              <span
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: BRAND.bodyText,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 3,
                    background: COLORS[i],
                    flexShrink: 0,
                  }}
                />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Breakdown card */}
        <div
          style={{
            background: BRAND.cardBg,
            borderRadius: 14,
            padding: "24px 28px",
            marginBottom: 20,
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            border: `1px solid ${BRAND.border}`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: BRAND.red,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: 16,
            }}
          >
            How This Breaks Down
          </div>
          {breakdowns.map((b, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 8,
                marginBottom: i < breakdowns.length - 1 ? 10 : 0,
                fontSize: 13,
                lineHeight: 1.6,
                paddingBottom: i < breakdowns.length - 1 ? 10 : 0,
                borderBottom:
                  i < breakdowns.length - 1
                    ? `1px solid ${BRAND.border}`
                    : "none",
              }}
            >
              <span
                style={{
                  color: b.color,
                  fontWeight: 700,
                  flexShrink: 0,
                  minWidth: 150,
                }}
              >
                {b.label}:
              </span>
              <span style={{ color: BRAND.bodyText }}>
                {b.text} ={" "}
                <strong style={{ color: BRAND.headingText }}>
                  {fmt(data.values[i])}
                </strong>
              </span>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div
          style={{
            padding: "16px 20px",
            background: "#fffbeb",
            borderRadius: 10,
            border: "1px solid #fde68a",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "#92400e",
              lineHeight: 1.6,
            }}
          >
            <strong>Note:</strong> These are conservative estimates based on
            industry benchmarks for construction firms at $1M–$3M revenue.
            Actual results vary by trade, geography, and current business
            practices. Does not include tax strategy savings, lost referral
            revenue, or owner opportunity cost.
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            background: `linear-gradient(135deg, ${BRAND.navy} 0%, #1a2470 100%)`,
            borderRadius: 14,
            padding: "28px 32px",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(12,18,72,0.2)",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#fff",
              marginBottom: 8,
              letterSpacing: "-0.02em",
            }}
          >
            Ready to stop the leaks?
          </div>
          <div
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.7)",
              marginBottom: 20,
              lineHeight: 1.6,
            }}
          >
            Talk to Precision Contractor Solutions and start recovering{" "}
            <strong style={{ color: "#fff" }}>{fmtK(data.total)}</strong> per
            year.
          </div>
          <a
            href="https://precisioncontractorsolutions.com/contact"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              background: BRAND.red,
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              padding: "12px 28px",
              borderRadius: 10,
              textDecoration: "none",
              letterSpacing: "0.01em",
              boxShadow: "0 2px 10px rgba(192,68,63,0.35)",
              transition: "background 0.2s",
            }}
          >
            Schedule a Free Call →
          </a>
        </div>

        {/* Footer note */}
        <div
          style={{
            marginTop: 24,
            textAlign: "center",
            fontSize: 12,
            color: BRAND.mutedText,
          }}
        >
          Built on the ProfitDriver framework · 6 of 12 profit drivers modeled ·{" "}
          <a
            href="https://precisioncontractorsolutions.com"
            target="_blank"
            rel="noreferrer"
            style={{ color: BRAND.blue, textDecoration: "none" }}
          >
            precisioncontractorsolutions.com
          </a>
        </div>
      </div>
    </div>
  );
}
