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
  Legend,
  ChartOptions,
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
  countryCode?: string;
}

export function PollChart({
  title,
  labels,
  datasets,
  countryCode,
}: PollChartProps) {
  // Early return for SSR or if data is not ready
  if (typeof window === 'undefined' || !labels || !datasets) {
    return <div className="h-[400px] w-full flex items-center justify-center">Loading chart data...</div>;
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 0,
        max: 50,
        title: {
          display: true,
          text: "Support (%)",
        },
      },
    },
  };

  return (
    <div className="h-[400px] w-full">
      <Line options={options} data={{ labels, datasets }} />
    </div>
  );
}