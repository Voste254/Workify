import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface LineDataPoint {
  name: string;
  applications: number;
}

interface BarDataPoint {
  name: string;
  applications: number;
}

interface PieDataPoint {
  name: string;
  value: number;
}

interface DashboardChartsProps {
  lineData: LineDataPoint[];
  barData: BarDataPoint[];
  pieData: PieDataPoint[];
}

const COLORS = ["#111827", "#7C3AED", "#10B981", "#F59E0B", "#EF4444"];

const cardStyle = {
  background: "#fff",
  border: "1.5px solid #E5E7EB",
  borderRadius: 10,
  padding: 24,
  fontFamily: "'DM Sans', sans-serif",
  display: "flex",
  flexDirection: "column" as const,
};

const titleStyle = {
  margin: "0 0 24px",
  fontSize: 13,
  fontWeight: 700,
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  color: "#9CA3AF"
};

export default function DashboardCharts({ lineData, barData, pieData }: DashboardChartsProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, marginTop: 24, fontFamily: "'DM Sans', sans-serif" }}>

      {/* Top Row: Area & Bar Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        
        {/* Area Chart: Applications Over Time */}
        <div style={cardStyle}>
          <h3 style={titleStyle}>Applications Over Time</h3>
          <div style={{ height: 280, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#111827" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontFamily: "'DM Mono', monospace" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontFamily: "'DM Mono', monospace" }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1.5px solid #E5E7EB', boxShadow: 'none', fontFamily: "'DM Sans', sans-serif" }}
                />
                <Area type="monotone" dataKey="applications" stroke="#111827" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Top Performing Jobs */}
        <div style={cardStyle}>
          <h3 style={titleStyle}>Applications by Job</h3>
          <div style={{ height: 280, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontFamily: "'DM Mono', monospace" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontFamily: "'DM Mono', monospace" }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1.5px solid #E5E7EB', boxShadow: 'none', fontFamily: "'DM Sans', sans-serif" }}
                  cursor={{ fill: '#F3F4F6' }}
                />
                <Bar dataKey="applications" fill="#111827" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Pie Chart: Application Status Funnel */}
      <div style={cardStyle}>
        <h3 style={titleStyle}>Hiring Funnel Status</h3>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 32, height: "auto", minHeight: 280, width: "100%" }}>
          <div style={{ height: 250, width: 250, flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1.5px solid #E5E7EB', boxShadow: 'none', fontFamily: "'DM Sans', sans-serif" }}
                  itemStyle={{ color: '#111827', fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Custom Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, justifyContent: "center" }}>
            {pieData.map((entry, i) => (
              <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: COLORS[i % COLORS.length] }}></span>
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#111827" }}>{entry.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#6B7280", fontFamily: "'DM Mono', monospace" }}>{entry.value} Candidates</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}