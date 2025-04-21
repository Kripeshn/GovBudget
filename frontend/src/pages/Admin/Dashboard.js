import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { handleError, handleSuccess } from '../../utils';

function Dashboard() {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [budgetsRes, expensesRes] = await Promise.all([
          fetch(`${APIUrl}/admin/get-budgets`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${APIUrl}/admin/get-expenses`, {
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
        } else {
          console.error("Failed to load budget or expenses data");
        }

        // Fetch feedbacks after budget and expense data
        await fetchFeedbacks();
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem("token");
      const feedbacksRes = await fetch(`${APIUrl}/user/get-feedbacks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (!feedbacksRes.ok) {
        throw new Error(`HTTP error! Status: ${feedbacksRes.status}`);
      }
  
      const feedbacksData = await feedbacksRes.json();
  
      if (feedbacksData.success) {
        setFeedbacks(feedbacksData.feedbacks); // Set feedbacks data
      } else {
        console.error("Failed to load feedbacks");
      }
    } catch (err) {
      console.error("Error fetching feedback data:", err);
    }
  };
  

  // Function to handle delete feedback
  const handleDeleteFeedback = async (feedbackId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${APIUrl}/user/feedback/${feedbackId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const data = await response.json();

      if (data.success) {
        handleSuccess('Feedback deleted successfully');
        setFeedbacks(feedbacks.filter(feedback => feedback._id !== feedbackId)); // Remove deleted feedback from state
      } else {
        handleError('Failed to delete feedback');
      }
    } catch (error) {
      handleError('Error deleting feedback');
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-semibold mb-6">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-medium">Total Budget</h2>
            <p className="text-2xl text-green-600 mt-2">Rs. {totalBudget.toLocaleString()}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-medium">Total Expenses</h2>
            <p className="text-2xl text-red-500 mt-2">Rs. {totalExpenses.toLocaleString()}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-medium">Remaining Budget</h2>
            <p className="text-2xl text-blue-500 mt-2">Rs. {remainingBudget.toLocaleString()}</p>
          </div>
        </div>

        {/* Feedback Section */}
        <h2 className="text-2xl font-medium mt-8 mb-4">User Feedback</h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          {feedbacks.length === 0 ? (
            <p>No feedbacks available.</p>
          ) : (
            <ul>
  {feedbacks.map(feedback => (
    <li key={feedback._id} className="flex justify-between items-center mb-4">
      <div>
        <p className="font-medium">{feedback.message}</p>
        <small className="text-gray-500">
          Submitted by {feedback.user.name} {/* Render the name of the user */}
        </small>
      </div>
      <button
        onClick={() => handleDeleteFeedback(feedback._id)}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
      >
        Delete
      </button>
    </li>
  ))}
</ul>

          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
