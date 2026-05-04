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

const cardClass = "bg-white border-[1.5px] border-gray-200 rounded-[10px] p-6 font-sans flex flex-col";
const titleClass = "mb-6 text-[13px] font-bold uppercase tracking-[0.1em] text-gray-400";

export default function DashboardCharts({ lineData, barData, pieData }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 mt-6 font-sans">

      {/* Top Row: Area & Bar Charts */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
        
        {/* Area Chart: Applications Over Time */}
        <div className={cardClass}>
          <h3 className={titleClass}>Applications Over Time</h3>
          <div className="h-[280px] w-full">
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
        <div className={cardClass}>
          <h3 className={titleClass}>Applications by Job</h3>
          <div className="h-[280px] w-full">
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
      <div className={cardClass}>
        <h3 className={titleClass}>Hiring Funnel Status</h3>
        <div className="flex flex-wrap items-center justify-center gap-8 h-auto min-h-[280px] w-full">
          <div className="h-[250px] w-[250px] shrink-0">
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
          <div className="flex flex-col gap-4 justify-center">
            {pieData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                <div>
                  <p className="m-0 mb-1 text-sm font-bold text-gray-900">{entry.name}</p>
                  <p className="m-0 text-xs text-gray-500 font-mono">{entry.value} Candidates</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}