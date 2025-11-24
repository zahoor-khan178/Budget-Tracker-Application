import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
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
  const hasrun = useRef(false);


  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    if (hasrun.current) return;
    hasrun.current = true;
    const fetchData = async () => {
      const token = JSON.parse(localStorage.getItem('token'));
      const user = JSON.parse(localStorage.getItem('user'));

      if (!token || !user) {
        window.alert("Your session has expired or you are not logged in. Please log in again.");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
          localStorage.removeItem('user.email');
        localStorage.removeItem('user.name');
        navigate('/login', { state: { from: location.pathname } });
        return;
      }

      const API_URL = process.env.REACT_APP_API_URL;

      try {
        const incomeResponse = await fetch(`${API_URL}/income-sum`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${token}`
          }
        });

        // FIRST: Check for expired token
        if (incomeResponse.status === 401 || incomeResponse.status === 403) {
          alert("Your session has expired. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
            localStorage.removeItem('user.email');
        localStorage.removeItem('user.name');
          navigate("/login",{replace:true});
          return;
        }

        // THEN parse response
        const incomeData = await incomeResponse.json();

        // If backend returned other error (like 500)
        if (!incomeResponse.ok) {
          alert(incomeData.message || "An error occurred.");
          return; // stay on same page, DO NOT logout
        }

        setTotalIncome(incomeData.total ?? 0);

        //         ?? (Nullish Coalescing Operator): This operator checks the value on its left (incomeData.total).

        // If the left side is anything other than null or undefined (even if it's 0, false, or an empty string ""), the operator returns that value.

        // If the left side is null or undefined, the operator ignores it and returns the value on its right.

        // 0: This is the default fallback value.

        const expenseResponse = await fetch(`${API_URL}/expense-sum`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${token}`
          }
        });

        if (expenseResponse.status === 401 || expenseResponse.status === 403) {
          alert("Your session has expired. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
            localStorage.removeItem('user.email');
        localStorage.removeItem('user.name');
          navigate("/login",{replace:true});
          return;
        }

        const expenseData = await expenseResponse.json();

        if (!expenseResponse.ok) {
          alert(expenseData.message || "An error occurred.");
          return;
        }

        setTotalExpense(expenseData.total ?? 0);

        setTotalBalance(incomeData.total - expenseData.total);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, location.pathname]); //  added missing dependencies

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

      const currentFontSize = isMobile245
        ? mobile245FontSize
        : isMobile310
          ? mobile310FontSize
          : isMobile
            ? mobileFontSize
            : isMobile1024
              ? mobile1024FontSize
              : isMobile1440
                ? mobile1440FontSize
                : baseFontSize2560;

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
            bodyFont: { size: currentFontSize },
            titleFont: { size: currentFontSize },
            footerFont: { size: currentFontSize },
            padding: 12,
            callbacks: {
              label: (context) => {
                return `$${context.raw.toFixed()}`;
              },
            },
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
