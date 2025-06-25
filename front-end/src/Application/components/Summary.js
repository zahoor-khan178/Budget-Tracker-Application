import React, { useState, useEffect } from 'react';
import '../Css/Summary.css';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Summary = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomeResponse = await fetch('http://localhost:11000/income-sum');
        const incomeData = await incomeResponse.json();
        setTotalIncome(incomeData.totalIncome);

        const expenseResponse = await fetch('http://localhost:11000/expense-sum');
        const expenseData = await expenseResponse.json();
        setTotalExpense(expenseData.totalExpense);

        setTotalBalance(incomeData.totalIncome - expenseData.totalExpense);

        setLoading(false);
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const updateChartOptions = () => {
      const baseFontSize2560 = 28;
      const mobile1440FontSize = 16;
      const mobile1024FontSize = 10;
      const mobileFontSize = 8;
      const mobile310FontSize = 6;
      const mobile245FontSize = 3;
      const isMobile1440 = window.innerWidth <= 1440;
      const isMobile1024 = window.innerWidth <= 1024;
      const isMobile = window.innerWidth <= 450;
      const isMobile310 = window.innerWidth <= 310;
      const isMobile245 = window.innerWidth <= 245;

      const currentFontSize = isMobile245 ? mobile245FontSize : (isMobile310 ? mobile310FontSize : (isMobile ? mobileFontSize : (isMobile1024 ? mobile1024FontSize : (isMobile1440 ? mobile1440FontSize : baseFontSize2560 )) ));

      const newOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Financial Summary',
            font: {
              size: currentFontSize,
            },
          },
          tooltip: {
            
            bodyFont: {
              size: currentFontSize,
            },
            titleFont: {
              size: currentFontSize,
            },
            footerFont: {
              size: currentFontSize,
            },
            padding: 12,
            callbacks: {
              label: (context) => {
                const label = `$${context.raw.toFixed()}`;
                return label;
              },
            },
            labelFont: {
              size: currentFontSize,
            }
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `$${value.toFixed()}`,
              font: {
                size: currentFontSize,
              },
            },
          },
          x: {
            ticks: {
              font: {
                size: currentFontSize,
              },
            },
          },
        },
      };
      setChartOptions(newOptions);
    };

    updateChartOptions();
    window.addEventListener('resize', updateChartOptions);

    return () => {
      window.removeEventListener('resize', updateChartOptions);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const data = {
    labels: ['Total\nIncome', 'Total\nExpense', 'Total\nBalance'],
    datasets: [
      {
        label: 'Amount ($)',
        data: [totalIncome, totalExpense, totalBalance],
        backgroundColor: ['#4caf50', '#f44336', '#2196f3'],
        borderColor: ['#388e3c', '#d32f2f', '#1976d2'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="financial-summary-container">
      <div className="chart-container">
        <Bar data={data} options={chartOptions} />
      </div>
      <div className="summary-items-container">
        <div className="summary-item income">
          <h3>Total Income</h3>
          <p>${totalIncome.toFixed(2)}</p>
        </div>
        <div className="summary-item expense">
          <h3>Total Expense</h3>
          <p>${totalExpense.toFixed(2)}</p>
        </div>
        <div className="summary-item balance">
          <h3>Total Balance</h3>
          <p>${totalBalance.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Summary;