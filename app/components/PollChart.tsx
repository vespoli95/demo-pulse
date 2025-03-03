
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

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
}

export function PollChart({ title, labels, datasets }: PollChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title + " (Detailed Data Points with Averages)",
      },
      tooltip: {
        mode: 'index',
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
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 20
        }
      },
      y: {
        beginAtZero: false,
        min: function(context: any) {
          let min = Math.min(...context.chart.data.datasets.flatMap((d: any) => d.data)) - 5;
          return Math.max(0, min); // Don't go below 0
        },
        max: function(context: any) {
          let max = Math.max(...context.chart.data.datasets.flatMap((d: any) => d.data)) + 5;
          return Math.min(100, max); // Don't go above 100
        }
      }
    }
  };

  const data = {
    labels,
    datasets,
  };

  return <div className="w-full h-[500px]"><Line options={options} data={data} /></div>;
}
