'use client'

// components/FancyDoughnutChart.js
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

const FancyDoughnutChart = ({ dataset }) => {
    const data = { instagram: 10000, twitter: 50000, facebook: 30000};
  const labels = Object.keys(dataset);
  const values = Object.values(dataset);

  const chartData = {
    labels,
    datasets: [
      {
        label: '',
        data: values,
        backgroundColor: [
          '#E5D053',
          '#DC1F1F',
          '#64E553',
        ],
        borderColor: [
          '#E5D053',
          '#DC1F1F',
          '#64E553',
        ],
        borderWidth: 7, // Border thickness
        hoverOffset: 3, // Fancy hover effect
        spacing: 4, // Fancy hover effect
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: '80%', // Creates a thick border effect
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
      tooltip: {
        backgroundColor: 'white', // White background for tooltip
        titleColor: 'black',      // Black title text color
        bodyColor: 'black',       // Black body text color
        borderColor: '#D8DEFF',   // Optional: add a border color for the tooltip
        borderWidth: 1,
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export default FancyDoughnutChart;
