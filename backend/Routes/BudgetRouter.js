const express = require('express');
const { requireSignIn, isAdmin } = require('../Middlewares/Auth');
const {
    createBudgetController,
    updateBudgetController,
    getAllBudgetsController,
    getSingleBudgetController,
    deleteBudgetController,
}  = require('../Controllers/BudgetController');
const router = express.Router();

// Create Budget
router.post(
    "/create-budget",
    requireSignIn,
    isAdmin,
    createBudgetController
);

// Update Budget
router.put(
    "/update-budget/:id",
    requireSignIn,
    isAdmin,
    updateBudgetController
);

// Get All Budgets
router.get("/get-budgets", getAllBudgetsController);

// Get Single Budget
router.get("/get-budget/:id", getSingleBudgetController);

// Delete Budget
router.delete(
    "/delete-budget/:id",
    requireSignIn,
    isAdmin,
    deleteBudgetController
);

module.exports = router;
