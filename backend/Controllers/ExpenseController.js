// controllers/ExpenseController.js
const ExpenseModel = require('../Models/Expense');
const BudgetModel = require('../Models/Budget');

// Create expense
const createExpense = async (req, res) => {
    try {
        const { title, amount, description, budgetId } = req.body;

        // Find the budget by ID
        const budget = await BudgetModel.findById(budgetId);
        if (!budget) {
            return res.status(404).json({ message: 'Budget not found', success: false });
        }

        // Calculate total and remaining budget
        const totalExpenses = await ExpenseModel.aggregate([
            { $match: { budget: budgetId } },
            { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
        ]);
        
        const totalSpent = totalExpenses[0]?.totalAmount || 0;
        const remainingBudget = budget.amount - totalSpent;

        // Create new expense
        const expense = new ExpenseModel({ title, amount, description, budget: budgetId });
        await expense.save();

        res.status(201).json({
            message: 'Expense created successfully',
            success: true,
            remainingBudget
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error while creating expense',
            success: false
        });
    }
};

const getAllExpenses = async (req, res) => {
    try {
      // Fetch all expenses and populate their related budgets
      const expenses = await ExpenseModel.find().populate("budget");
  
      // Filter out any expenses with null budget
      const validExpenses = expenses.filter(expense => expense.budget);
  
      // Calculate remaining budget for each valid expense
      const updatedExpenses = await Promise.all(
        validExpenses.map(async (expense) => {
          const totalExpenses = await ExpenseModel.aggregate([
            { $match: { budget: expense.budget._id } },
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
          ]);
  
          const totalSpent = totalExpenses[0]?.totalAmount || 0;
          const remainingBudget = expense.budget.amount - totalSpent;
  
          return {
            ...expense._doc,
            remainingBudget,
          };
        })
      );
  
      res.status(200).json({
        success: true,
        message: "Expenses fetched successfully",
        expenses: updatedExpenses,
      });
    } catch (error) {
      console.error("Error in getAllExpenses:", error);
      res.status(500).json({
        success: false,
        message: "Error while fetching expenses",
        error: error.message,
      });
    }
  };
  
  
  
  
  
const deleteExpenseController = async (req, res) => {
    try {
      const expense = await ExpenseModel.findByIdAndDelete(req.params.id);
      if (!expense) {
        return res.status(404).send({ success: false, message: "Expense not found" });
      }
      res.status(200).send({ success: true, message: "Expense deleted successfully" });
    } catch (error) {
      res.status(500).send({ success: false, message: "Error deleting expense", error });
    }
  };
  
  // UPDATE EXPENSE
  const updateExpenseController = async (req, res) => {
    try {
      const { title, amount, description } = req.body;
      const updated = await ExpenseModel.findByIdAndUpdate(
        req.params.id,
        { title, amount, description },
        { new: true }
      );
      if (!updated) {
        return res.status(404).send({ success: false, message: "Expense not found" });
      }
      res.status(200).send({ success: true, message: "Expense updated successfully", expense: updated });
    } catch (error) {
      res.status(500).send({ success: false, message: "Error updating expense", error });
    }
  };
module.exports = {
    createExpense,
    getAllExpenses,
    deleteExpenseController,
    updateExpenseController
};
