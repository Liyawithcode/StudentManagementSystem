import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const ResultChart = ({ dataPoints, labels }) => {
  const chartData = {
    labels: labels || ['A Grade', 'B Grade', 'C Grade', 'D Grade', 'F Grade'],
    datasets: [
      {
        label: 'Grade Percentage',
        data: dataPoints || [35, 40, 15, 7, 3],
        backgroundColor: [
          '#10b981', // green
          '#3b82f6', // blue
          '#f59e0b', // orange
          '#ef4444', // red
          '#6b7280', // grey
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { font: { family: 'Inter' } },
      },
    },
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default ResultChart;
