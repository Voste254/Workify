// Shared pagination component for all Employee dashboard list pages

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  /** Optional: display style. "inline" uses plain inline styles (for style-object pages),
   *  "tailwind" uses Tailwind classes (for Tailwind pages like Blogs). Default: "inline" */
  variant?: "inline" | "tailwind";
}

export default function Pagination({ page, totalPages, onPageChange, variant = "inline" }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Build the page window: always show first, last, current ±1, with ellipsis
  const pages: (number | "…")[] = [];
  const addPage = (n: number) => {
    if (!pages.includes(n)) pages.push(n);
  };
  addPage(1);
  if (page > 3) pages.push("…");
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) addPage(i);
  if (page < totalPages - 2) pages.push("…");
  if (totalPages > 1) addPage(totalPages);

  if (variant === "tailwind") {
    return (
      <div className="flex items-center justify-center gap-1.5 mt-8 mb-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`el-${i}`} className="px-2 text-gray-400 text-sm select-none">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold border transition-colors ${
                p === page
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    );
  }

  // ── inline styles variant ─────────────────────────────────────────────────────
  const base: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 6, marginTop: 32, marginBottom: 8, fontFamily: "'DM Sans',sans-serif",
  };
  const navBtn = (disabled: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: 4,
    padding: "7px 14px", fontSize: 14, fontWeight: 600,
    border: "1.5px solid #E5E7EB", borderRadius: 8,
    background: "#fff", color: disabled ? "#D1D5DB" : "#374151",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background 0.15s",
  });
  const pgBtn = (active: boolean): React.CSSProperties => ({
    width: 36, height: 36, borderRadius: 8, fontSize: 14, fontWeight: 600,
    border: active ? "1.5px solid #111827" : "1.5px solid #E5E7EB",
    background: active ? "#111827" : "#fff",
    color: active ? "#fff" : "#374151",
    cursor: active ? "default" : "pointer",
    transition: "all 0.15s",
  });

  return (
    <div style={base}>
      <button style={navBtn(page === 1)} disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        ← Prev
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`el-${i}`} style={{ fontSize: 14, color: "#9CA3AF", padding: "0 4px", userSelect: "none" }}>…</span>
        ) : (
          <button key={p} style={pgBtn(p === page)} onClick={() => onPageChange(p as number)}>
            {p}
          </button>
        )
      )}

      <button style={navBtn(page === totalPages)} disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
        Next →
      </button>
    </div>
  );
}
