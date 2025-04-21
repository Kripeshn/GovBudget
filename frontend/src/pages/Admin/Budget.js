import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { APIUrl, handleError, handleSuccess } from '../../utils';
import axios from "axios";
import { ToastContainer } from 'react-toastify';

export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [title, setTitle] = useState("");
  const [fiscalYear, setFiscalYear] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(false);
  const [updatedBudget, setUpdatedBudget] = useState({
    title: "",
    fiscalYear: "",
    amount: "",
    description: "",
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${APIUrl}/admin/create-budget`,
        { title, fiscalYear, amount, description },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              
        }
      );
      if (data?.success) {
        handleSuccess("Budget created successfully");
        getAllBudgets();
        setTitle("");
        setFiscalYear("");
        setAmount("");
        setDescription("");
      } else {
        handleError(data.message);
      }
    } catch (error) {
      handleError("Error while creating budget");
    }
  };

  const getAllBudgets = async () => {
    try {
      const { data } = await axios.get(`${APIUrl}/admin/get-budgets`);
      if (data?.success) {
        setBudgets(data.budgets);
      }
    } catch (error) {
      handleError("Failed to load budgets");
    }
  };

  useEffect(() => {
    getAllBudgets();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${APIUrl}/admin/update-budget/${selected._id}`,
        updatedBudget,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              
        }
      );
      if (data?.success) {
        handleSuccess("Budget updated successfully");
        getAllBudgets();
        setSelected(null);
        setVisible(false);
        setUpdatedBudget({
          title: "",
          fiscalYear: "",
          amount: "",
          description: "",
        });
      } else {
        handleError(data.message);
      }
    } catch (error) {
      handleError("Error while updating budget");
    }
  };

  const handleDelete = async (bId) => {
    try {
      const { data } = await axios.delete(
        `${APIUrl}/admin/delete-budget/${bId}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              
        }
      );
      if (data.success) {
        handleSuccess("Budget deleted successfully");
        getAllBudgets();
      } else {
        handleError(data.message);
      }
    } catch (error) {
      handleError("Error while deleting budget");
    }
  };

    return (
        <div className="flex">
  <Sidebar />
  <div className="flex-1 p-6 bg-gray-100 min-h-screen">
    <h1 className="text-2xl font-bold mb-4">Budget Management</h1>

    {/* Create Budget Form */}
    <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-6 max-w-md">
      <h2 className="text-xl font-semibold mb-3">Create Budget</h2>

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
      <input
        type="text"
        name="fiscalYear"
        value={fiscalYear}
        onChange={(e) => setFiscalYear(e.target.value)}
        placeholder="Fiscal Year (e.g. 2080/81)"
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

    {/* Budget List */}
    <h2 className="text-xl font-semibold mb-3">Existing Budgets</h2>
    <div className="bg-white rounded shadow p-4">
      {budgets.length === 0 ? (
        <p className="text-gray-600">No budgets yet.</p>
      ) : (
        <ul className="space-y-3">
          {budgets.map((budget) => (
            <li key={budget._id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-semibold">{budget.title}</p>
                <p>Amount: Rs. {budget.amount}</p>
                <p>Fiscal Year: {budget.fiscalYear}</p>
                <p className="text-gray-600 text-sm">{budget.description}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setSelected(budget);
                    setUpdatedBudget({
                      title: budget.title,
                      fiscalYear: budget.fiscalYear,
                      amount: budget.amount,
                      description: budget.description,
                    });
                    setVisible(true);
                  }}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(budget._id)}
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

    {/* Update Form */}
    {visible && (
      <form onSubmit={handleUpdate} className="bg-white p-4 rounded shadow mt-6 max-w-md">
        <h2 className="text-xl font-semibold mb-3">Update Budget</h2>

        <input
          type="text"
          name="title"
          value={updatedBudget.title}
          onChange={(e) => setUpdatedBudget({ ...updatedBudget, title: e.target.value })}
          placeholder="Title"
          required
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="number"
          name="amount"
          value={updatedBudget.amount}
          onChange={(e) => setUpdatedBudget({ ...updatedBudget, amount: e.target.value })}
          placeholder="Amount"
          required
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          name="fiscalYear"
          value={updatedBudget.fiscalYear}
          onChange={(e) => setUpdatedBudget({ ...updatedBudget, fiscalYear: e.target.value })}
          placeholder="Fiscal Year"
          required
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          name="description"
          value={updatedBudget.description}
          onChange={(e) => setUpdatedBudget({ ...updatedBudget, description: e.target.value })}
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
              setSelected(null);
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    )}
  </div>
  <ToastContainer/>
</div>

    );
}


