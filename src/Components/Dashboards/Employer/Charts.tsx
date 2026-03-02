import { useEffect, useRef } from "react";
import type {
  ChartData,
  ChartOptions,
  ChartTypeRegistry,
} from "chart.js/auto";
import {Chart} from"chart.js/auto"
interface ChartComponentProps {
  data: ChartData<"bar">;
  options?: ChartOptions<"bar">;
}

const ChartComponent = ({ data, options }: ChartComponentProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart<keyof ChartTypeRegistry> | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 🔥 Destroy existing chart before creating a new one
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        ...options,
      },
    });

    // 🔥 Cleanup on unmount (React Strict Mode safe)
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [data, options]);

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ChartComponent;