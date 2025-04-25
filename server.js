const express = require('express');
const app = express();
require('dotenv').config();
const bodyparser = require('body-parser');


const { Pool } = require('pg');
const cors = require('cors');
const PORT = 3000 || process.env.PORT;

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json())
app.use(cors());

const operatorModel = require('./model/operatorModel');
const { parse } = require('dotenv');


//delete an operator by id 
app.delete('/operator/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOperator = await operatorModel.deleteOperator(parseInt(id));
    res.json({ deletedOperator });
  } catch (error) {
    console.log('error deleting an operator: ', error);
    res.status(500).json({ error: error.message });
  }
})

//update an operator 
app.put('/operator/:id', async (req, res) => {

  const { id } = req.params;
  const { operator_name, email, role, startDate } = req.body;

  try {
    const updatedOperator = await operatorModel.updateOperator(parseInt(id), operator_name, email, role, startDate);
    res.json({ updatedOperator });
  } catch (error) {
    console.log('error updating an operator: ', error);
    res.status(500).json({ error: error.message });
  }
})

//add a new user 
app.post('/operator/addOperator', async (req, res) => {
  const { operator_name, email, role, startDate } = req.body;

  try {
    const newOperator = await operatorModel.addOperator(operator_name, email, role, startDate);
  } catch (error) {
    console.log('error adding an operator: ', error);
    res.status(500).json({ error: error.message });
  }
})

//get an operator by id 
// get the id and parse it into an int
// then search the database where the id = req.params.id 
app.get('/operator/:id', async (req, res) => {
  const id = req.params;

  try {
    const operator = await operatorModel.getOperatorById(parse(id));
    res.json({ operator });
  } catch (error) {
    console.log('error getting an operator by id: ', error);
    res.status(500).json({ newOperator });
  }
})

// get all operators from the database 
app.get('/operator', async (_, res) => {
  try {
    const allOperators = await operatorModel.getAllOperators();
    res.json({ allOperators });
  } catch (error) {
    console.log('error fetching all operators from db: ', error)
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, (_, res) => {
  console.log('app listening on port, ', PORT);
})
