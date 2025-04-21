const Budget = require("../Models/Budget");

// Create Budget
const createBudgetController = async (req, res) => {
    try {
        const { title, fiscalYear, amount, description } = req.body;

        if (!title || !fiscalYear || !amount) {
            return res.status(400).send({
                success: false,
                message: "Title, Fiscal Year, and Amount are required",
            });
        }

        const budget = new Budget({ title, fiscalYear, amount, description });
        await budget.save();

        res.status(201).send({
            success: true,
            message: "New budget created successfully",
            budget,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while creating budget",
            error,
        });
    }
};

// Update Budget
const updateBudgetController = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, fiscalYear, amount, description } = req.body;

        const updatedBudget = await Budget.findByIdAndUpdate(
            id,
            { title, fiscalYear, amount, description },
            { new: true }
        );

        res.status(200).send({
            success: true,
            message: "Budget updated successfully",
            budget: updatedBudget,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while updating budget",
            error,
        });
    }
};

// Get All Budgets
const getAllBudgetsController = async (req, res) => {
    try {
        const budgets = await Budget.find({});
        res.status(200).send({
            success: true,
            message: "All budget records retrieved",
            budgets,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting budgets",
            error,
        });
    }
};

// Get Single Budget by ID
const getSingleBudgetController = async (req, res) => {
    try {
        const { id } = req.params;
        const budget = await Budget.findById(id);

        if (!budget) {
            return res.status(404).send({
                success: false,
                message: "Budget not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "Budget fetched successfully",
            budget,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting single budget",
            error,
        });
    }
};

// Delete Budget
const deleteBudgetController = async (req, res) => {
    try {
        const { id } = req.params;
        await Budget.findByIdAndDelete(id);

        res.status(200).send({
            success: true,
            message: "Budget deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while deleting budget",
            error,
        });
    }
};

module.exports = {
    createBudgetController,
    updateBudgetController,
    getAllBudgetsController,
    getSingleBudgetController,
    deleteBudgetController,
};
