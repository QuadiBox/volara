'use client'

// components/EngagementLineChart.js
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register required components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const EngagementLineChart = ({ dataset }) => {
  // const data = { instagram: 10000, twitter: 50000, facebook: 30000, linkedin: 20000 };
  // Prepare labels and values for the chart
  const labels = Object.keys(dataset); // Platform names (x-axis)
  const values = Object.values(dataset); // Engagement numbers (y-axis)

  // Define the data structure for Chart.js
  const chartData = {
    labels,
    datasets: [
      {
        label: '',
        data: values,
        borderColor: 'rgba(5, 61, 165, 0.7)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
        tension: 0.15, // Smooth curve effect
      },
    ],
  };

  // Define ch  art options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: false,
        text: '',
      },
      tooltip: {
        backgroundColor: 'white', // White background for tooltip
        titleColor: 'black',      // Black title text color
        bodyColor: 'black',       // Black body text color
        borderColor: 'rgba(5, 61, 165, 0.7)',   // Optional: add a border color for the tooltip
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: false,
          text: '',
        },
        grid: {
            display: false, // Removes x-axis grid lines
        },
      },
      x: {
        title: {
          display: false,
          text: 'Social Media Platforms',
        },
        grid: {
            display: false, // Removes x-axis grid lines
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default EngagementLineChart;
