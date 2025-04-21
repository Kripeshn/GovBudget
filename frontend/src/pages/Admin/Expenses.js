import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { APIUrl, handleError, handleSuccess } from '../../utils';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';


export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const [visible, setVisible] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [updatedExpense, setUpdatedExpense] = useState({
    title: '',
    amount: '',
    description: '',
  });

  const getAllBudgets = async () => {
    try {
      const { data } = await axios.get(`${APIUrl}/admin/get-budgets`);
      if (data?.success) {
        setBudgets(data.budgets);
      }
    } catch (error) {
      handleError('Failed to load budgets');
    }
  };

  const getAllExpenses = async () => {
    try {
      const res = await fetch(`${APIUrl}/admin/get-expenses`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (data?.success) {
        setExpenses(data.expenses);
      }
    } catch (error) {
      handleError('Failed to load expenses');
    }
  };

  useEffect(() => {
    getAllBudgets();
    getAllExpenses();
  }, []);

  const getRemainingBudget = (budgetId) => {
    const budget = budgets.find((b) => b._id === budgetId);
    const totalSpent = expenses
      .filter((e) => e.budget._id === budgetId)
      .reduce((sum, e) => sum + Number(e.amount), 0);
    return budget ? budget.amount - totalSpent : 0;
  };

  const handleCreateExpense = async (e) => {
    e.preventDefault();

    const remaining = getRemainingBudget(selectedBudget._id);
    if (Number(amount) > remaining) {
      return handleError(`Expense amount exceeds remaining budget (Rs. ${remaining})`);
    }

    try {
      const { data } = await axios.post(
        `${APIUrl}/admin/create-expense`,
        {
          budgetId: selectedBudget._id,
          title,
          amount,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (data?.success) {
        handleSuccess('Expense created successfully');
        getAllExpenses();
        setTitle('');
        setAmount('');
        setDescription('');
        setSelectedBudget(null);
      } else {
        handleError(data.message);
      }
    } catch (error) {
      handleError('Error while creating expense');
    }
  };

  const handleDeleteExpense = async (eId) => {
    try {
      const { data } = await axios.delete(
        `${APIUrl}/admin/delete-expense/${eId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (data.success) {
        handleSuccess('Expense deleted successfully');
        getAllExpenses();
      } else {
        handleError(data.message);
      }
    } catch (error) {
      handleError('Error while deleting expense');
    }
  };

  const handleUpdateExpense = async (e) => {
    e.preventDefault();

    const oldExpense = expenses.find((ex) => ex._id === selectedExpenseId);
    const remaining = getRemainingBudget(oldExpense.budget._id) + Number(oldExpense.amount);
    if (Number(updatedExpense.amount) > remaining) {
      return handleError(`Updated amount exceeds remaining budget (Rs. ${remaining})`);
    }

    try {
      const { data } = await axios.put(
        `${APIUrl}/admin/update-expense/${selectedExpenseId}`,
        updatedExpense,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (data.success) {
        handleSuccess('Expense updated successfully');
        getAllExpenses();
        setVisible(false);
        setSelectedExpenseId(null);
        setUpdatedExpense({ title: '', amount: '', description: '' });
      } else {
        handleError(data.message);
      }
    } catch (error) {
      handleError('Error while updating expense');
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Expense Management</h1>

        {/* Create Expense Form */}
        <form onSubmit={handleCreateExpense} className="bg-white p-4 rounded shadow mb-6 max-w-md">
          <h2 className="text-xl font-semibold mb-3">Create Expense</h2>

          <select
            value={selectedBudget ? selectedBudget._id : ''}
            onChange={(e) => {
              const selected = budgets.find((b) => b._id === e.target.value);
              setSelectedBudget(selected);
            }}
            className="w-full p-2 mb-2 border rounded"
            required
          >
            <option value="">Select Budget</option>
            {budgets.map((budget) => (
              <option key={budget._id} value={budget._id}>
                {budget.title} - Rs. {budget.amount}
              </option>
            ))}
          </select>

          {selectedBudget && (
            <p className="mb-2 text-sm text-gray-600">
              Remaining Budget: Rs. {getRemainingBudget(selectedBudget._id)}
            </p>
          )}

          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="number"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            required
            className="w-full p-2 mb-2 border rounded"
          />
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows="3"
            required
            className="w-full p-2 mb-2 border rounded"
          ></textarea>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>

        {/* Expense List */}
        <h2 className="text-xl font-semibold mb-3">Existing Expenses</h2>
        <div className="bg-white rounded shadow p-4">
          {expenses.length === 0 ? (
            <p className="text-gray-600">No expenses yet.</p>
          ) : (
            <ul className="space-y-3">
              {expenses.map((expense) => (
                <li key={expense._id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-semibold">{expense.title}</p>
                    <p>{expense.description}</p>
                    <p>Amount: Rs. {expense.amount}</p>
                    <p>Budget Title: {expense.budget.title}</p>
                    <p>Budget: Rs. {expense.budget.amount}</p>
                    <p>
                      Remaining Budget: Rs. {getRemainingBudget(expense.budget._id)}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setUpdatedExpense({
                          title: expense.title,
                          amount: expense.amount,
                          description: expense.description,
                        });
                        setSelectedExpenseId(expense._id);
                        setVisible(true);
                      }}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Update Expense Form */}
        {visible && (
          <form onSubmit={handleUpdateExpense} className="bg-white p-4 rounded shadow mt-6 max-w-md">
            <h2 className="text-xl font-semibold mb-3">Update Expense</h2>
            <input
              type="text"
              name="title"
              value={updatedExpense.title}
              onChange={(e) =>
                setUpdatedExpense({ ...updatedExpense, title: e.target.value })
              }
              placeholder="Title"
              required
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="number"
              name="amount"
              value={updatedExpense.amount}
              onChange={(e) =>
                setUpdatedExpense({ ...updatedExpense, amount: e.target.value })
              }
              placeholder="Amount"
              required
              className="w-full p-2 mb-2 border rounded"
            />
            <textarea
              name="description"
              value={updatedExpense.description}
              onChange={(e) =>
                setUpdatedExpense({ ...updatedExpense, description: e.target.value })
              }
              placeholder="Description"
              rows="3"
              required
              className="w-full p-2 mb-2 border rounded"
            ></textarea>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => {
                  setVisible(false);
                  setUpdatedExpense({ title: '', amount: '', description: '' });
                  setSelectedExpenseId(null);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
                  <ToastContainer />
      
    </div>
  );
}
