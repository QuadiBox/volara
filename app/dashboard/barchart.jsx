'use client'

// components/EarningsBarChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Define the rounded top corners for bars
const RoundedBar = {
  id: 'rounded-bar',
  beforeDraw(chart) {
    const ctx = chart.ctx;
    chart.data.datasets.forEach((dataset, index) => {
      const meta = chart.getDatasetMeta(index);
      meta.data.forEach((bar, i) => {
        const { x, y, width, height } = bar.tooltipPosition();
        const radius = 10; // Adjust this for more/less rounding
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x - width / 2, y + height);
        ctx.lineTo(x - width / 2, y + radius);
        ctx.quadraticCurveTo(x - width / 2, y, x - width / 2 + radius, y);
        ctx.lineTo(x + width / 2 - radius, y);
        ctx.quadraticCurveTo(x + width / 2, y, x + width / 2, y + radius);
        ctx.lineTo(x + width / 2, y + height);
        ctx.closePath();
        ctx.fillStyle = bar.options.backgroundColor;
        ctx.fill();
        ctx.restore();
      });
    });
  },
};

const EarningsBarChart = ({ dataset }) => {
    // const data = {
    //     january: 50000,
    //     february: 200,
    //     march: 20,
    //     april: 30000,
    //     may: 60000,
    //     june: 0,
    //     july: 15000,
    //     august: 40000,
    //     september: 5000,
    //     october: 30000,
    //     november: 25000,
    //     december: 70000,
    // };
  const labels = Object.keys(dataset);
  const values = Object.values(dataset);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Earnings',
        data: values,
        backgroundColor: '#D8DEFF',
        borderWidth: 0, // No border on the bars
        borderRadius: 50,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true, // Hides the legend
      },
      tooltip: {
        backgroundColor: 'white', // White background for tooltip
        titleColor: 'black',      // Black title text color
        bodyColor: 'black',       // Black body text color
        borderColor: '#D8DEFF',   // Optional: add a border color for the tooltip
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Removes x-axis grid lines
        },
      },
      y: {
        grid: {
          display: false, // Removes y-axis grid lines
        },
      },
    },
  };

  return (
    <Bar
      data={chartData}
      options={options}
      plugins={[RoundedBar]}
    />
  );
};

export default EarningsBarChart;
