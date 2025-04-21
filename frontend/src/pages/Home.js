import React, { useEffect, useState } from 'react';
// import Sidebar from '../components/Sidebar';
import UserSidebar from '../components/UserSidebar';
import { APIUrl } from '../utils';

function Dashboard() {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [budgetsRes, expensesRes] = await Promise.all([
          fetch(`${ APIUrl }/admin/get-budgets`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${ APIUrl }/admin/get-expenses`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const budgetsData = await budgetsRes.json();
        const expensesData = await expensesRes.json();

        if (budgetsData.success && expensesData.success) {
          const totalBudgetAmount = budgetsData.budgets.reduce((acc, b) => acc + b.amount, 0);
          const totalExpenseAmount = expensesData.expenses.reduce((acc, e) => acc + e.amount, 0);
          const remaining = totalBudgetAmount - totalExpenseAmount;

          setTotalBudget(totalBudgetAmount);
          setTotalExpenses(totalExpenseAmount);
          setRemainingBudget(remaining);
          setBudgets(budgetsData.budgets);
          setExpenses(expensesData.expenses);
        } else {
          console.error("Failed to load data");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ Robust function to calculate total expenses for a budget
  const getTotalExpensesForBudget = (budgetId) => {
    const budgetExpenses = expenses.filter(exp => {
      // Handles both populated object and plain string ID
      if (!exp.budget) return false;
      if (typeof exp.budget === 'string') return exp.budget === budgetId;
      return exp.budget._id === budgetId;
    });

    return budgetExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  };

  return (
    <div className="min-h-screen flex">
      <UserSidebar />
      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-semibold mb-6">Dashboard Overview</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold">Total Budget</h2>
            <p className="text-2xl text-green-600 mt-2">Rs. {totalBudget.toLocaleString()}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold">Total Expenses</h2>
            <p className="text-2xl text-red-500 mt-2">Rs. {totalExpenses.toLocaleString()}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold">Remaining Budget</h2>
            <p className="text-2xl text-blue-500 mt-2">Rs. {remainingBudget.toLocaleString()}</p>
          </div>
        </div>

        {/* Detailed Budget Overview */}
        <h2 className="text-2xl font-bold mb-4">Detailed Budget Overview</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow-md">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Fiscal Year</th>
                <th className="py-3 px-4 text-left">Total Amount</th>
                <th className="py-3 px-4 text-left">Expenses</th>
                <th className="py-3 px-4 text-left">Remaining</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map(budget => {
                const totalSpent = getTotalExpensesForBudget(budget._id);
                const remaining = budget.amount - totalSpent;
                return (
                  <tr key={budget._id} className="border-b">
                    <td className="py-3 px-4">{budget.title}</td>
                    <td className="py-3 px-4">{budget.fiscalYear || '-'}</td>
                    <td className="py-3 px-4">Rs. {budget.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-red-600">Rs. {totalSpent.toLocaleString()}</td>
                    <td className="py-3 px-4 text-blue-600">Rs. {remaining.toLocaleString()}</td>
                  </tr>
                );
              })}
              {!budgets.length && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No budget data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
