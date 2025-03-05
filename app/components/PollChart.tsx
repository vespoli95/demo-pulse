import React from "react";
import { Line } from "react-chartjs-2";
import type { ParsedPollData } from "../services/wikipediaService";

// Create a proper React component
export function PollChart({ data }: { data?: ParsedPollData[] }) {
  const [chartLoaded, setChartLoaded] = React.useState(false);

  React.useEffect(() => {
    async function loadChartModules() {
      if (typeof window !== 'undefined') {
        const chart = await import('chart.js');
        const ChartJS = chart.Chart;
        const CategoryScale = chart.CategoryScale;
        const LinearScale = chart.LinearScale;
        const PointElement = chart.PointElement;
        const LineElement = chart.LineElement;
        const Title = chart.Title;
        const Tooltip = chart.Tooltip;
        const Legend = chart.Legend;

        ChartJS.register(
          CategoryScale,
          LinearScale,
          PointElement,
          LineElement,
          Title,
          Tooltip,
          Legend
        );

        setChartLoaded(true);
      }
    }

    loadChartModules();
  }, []);

  if (!data || !chartLoaded) {
    return <div className="text-center my-8">Preparing chart data...</div>;
  }

  // Sample data structure for the chart
  const chartData = {
    labels: data.map(poll => poll.date),
    datasets: [
      {
        label: 'Liberal',
        data: data.map(poll => poll.liberal || 0),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Conservative',
        data: data.map(poll => poll.conservative || 0),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'NDP',
        data: data.map(poll => poll.ndp || 0),
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
      },
      // Add other parties as needed
    ],
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="h-80">
        {chartLoaded && <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />}
      </div>
    </div>
  );
}