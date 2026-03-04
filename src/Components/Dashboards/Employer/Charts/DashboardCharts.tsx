import type { ChartData } from "chart.js/auto";
import ChartComponent from "./Charts"; // make sure path is correct

interface DashboardChartsProps {
  lineData: ChartData<"line">;
  barData: ChartData<"bar">;
}

const DashboardCharts = ({

  barData,
}: DashboardChartsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Line Chart */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Monthly Applications
        </h2>
        <ChartComponent data={barData} />
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Applications per Job
        </h2>
        <ChartComponent data={barData} />
      </div>

    </div>
  );
};

export default DashboardCharts;