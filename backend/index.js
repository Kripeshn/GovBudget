const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const BudgetRouter = require('./Routes/BudgetRouter');
const ExpenseRouter = require('./Routes/ExpenseRouter');
const FeedbackRouter = require('./Routes/FeedbackRouter');

require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use('/admin', BudgetRouter)
app.use('/auth', AuthRouter);
app.use('/admin', ExpenseRouter);
app.use('/user', FeedbackRouter );

app.post('/admin/create-budget', (req, res) => {
    console.log('Request Body:', req.body);
  });
  

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})