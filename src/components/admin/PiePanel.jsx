import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PiePanel = ({ labels, data, title = 'Events by Category' }) => {
  const palette = ['#8b5cf6','#f472b6','#60a5fa','#34d399','#f59e0b','#ef4444','#10b981'];
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: labels.map((_, i) => palette[i % palette.length]),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: { display: true, text: title },
      legend: { position: 'right' },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-slate-200">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PiePanel;