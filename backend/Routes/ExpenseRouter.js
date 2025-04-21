
const express = require('express');
const { createExpense, getAllExpenses, deleteExpenseController,
    updateExpenseController } = require('../Controllers/ExpenseController');
const { requireSignIn, isAdmin } = require('../Middlewares/Auth');

const router = express.Router();

// Protected routes for admin
router.post('/create-expense', requireSignIn, isAdmin, createExpense);

router.get('/get-expenses', requireSignIn, getAllExpenses);

// DELETE EXPENSE
router.delete("/delete-expense/:id", requireSignIn, isAdmin, deleteExpenseController);

// UPDATE EXPENSE
router.put("/update-expense/:id", requireSignIn, isAdmin, updateExpenseController);

module.exports = router;
