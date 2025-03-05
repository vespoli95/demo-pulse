
import React, { useState, useEffect } from "react";
import { Chart } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { ChartData } from "../services/wikipediaService";

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PollChartProps {
  title: string;
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }>;
  countryCode: string;
}

export function PollChart({ title, labels, datasets, countryCode }: PollChartProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="text-center my-8">Preparing chart data...</div>;
  }

  const chartData: ChartData = {
    labels,
    datasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 50,
        ticks: {
          callback: (value: number) => `${value}%`
        }
      }
    }
  };

  return (
    <div className="h-[400px] w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}
