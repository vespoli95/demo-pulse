import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
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
  wikipediaPage?: string;
}

export function PollChart({
  title,
  labels,
  datasets,
  wikipediaPage,
}: PollChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: title + " (Detailed Data Points with Averages)",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    elements: {
      point: {
        radius: 1,
        hoverRadius: 5,
      },
      line: {
        tension: 0.3, // Add slight curve to lines
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 20,
        },
      },
      y: {
        beginAtZero: false,
        min: function (context: any) {
          let min =
            Math.min(
              ...context.chart.data.datasets.flatMap((d: any) => d.data)
            ) - 5;
          return Math.max(0, min); // Don't go below 0
        },
        max: function (context: any) {
          let max =
            Math.max(
              ...context.chart.data.datasets.flatMap((d: any) => d.data)
            ) + 5;
          return Math.min(100, max); // Don't go above 100
        },
      },
    },
  };

  const data = {
    labels,
    datasets,
  };

  return (
    <div className="flex flex-col">
      <div className="w-full h-[500px]">
        <Line options={options} data={data} />
      </div>
      {wikipediaPage && (
        <div className="mt-2 text-right">
          <a
            href={`https://en.wikipedia.org/wiki/${wikipediaPage.replace(
              / /g,
              "_"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 text-sm hover:underline flex items-center justify-end"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            View data on Wikipedia
          </a>
        </div>
      )}
    </div>
  );
}
