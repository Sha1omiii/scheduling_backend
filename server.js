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

const DBConfig = require('./dbConfig.js');

const pool = new Pool(DBConfig);
// const connectToDb = async () => {
//   try {
//     await client.connect();
//     console.log('successfully connected to psql database')
//     // try {
//     //   client.query("CREATE TABLE operators (
//     //     operator_id SERIAL PRIMARY KEY,
//     //     operator_name VARCHAR(255) NOT NULL,
//     //     email VARCHAR(255) UNIQUE NOT NULL,
//     //     role VARCHAR(255) NOT NULL,
//     //     startDate DATE NOT NULL,
//     //   ); ");
//     // } catch (error) {
//     //   console.log('error while running a query to add a table');
//     // }
//     try {
//       const res = await client.query("SELECT * FROM operators");
//       console.log('successfully added a test operator', res.rows[0])
//       await client.end();
//       console.log('connection successfully closed');
//     } catch (error) {
//       console.log('error encountered while adding a test operator into operators, ', error);
//     }
//   } catch (error) {
//     console.log(`error encountered while tryin to connect to psql db: ${error}`);
//   }
// }
//
// connectToDb();


//delete an operator by id 
app.delete('/operator/:id', async (req, res) => {
  const client = await pool.connect();

  try {
    const id = parseInt(req.params.id);
    const result = await client.query("DELETE FROM [ ONLY ] operators WHERE operator_id = $1", [id]);
    res.json({ deletedOperator: result.rows })
  } catch (error) {
    console.log('error encountered while deleting a user with: ', error);
  } finally {
    client.release();
  }
})

//update an operator 
app.put('/operator/:id', async (req, res) => {
  const client = await pool.connect();

  try {
    const id = parseInt(req.params.id);
    const { operator_name, email, role, startDate } = req.body;

    const result = client.query("UPDATE operators SET operator_name = $1, email = $2, role = $3, startDate = $4 WHERE operator_id = $5", [operator_name, email, role, startDate, id]);
    res.json(result.rows)
  } catch (error) {
    console.log('error encountered while updating an operator: ', error);
  } finally {
    client.release();
  }

})

//add a new user 
app.post('/operator/addOperator', async (req, res) => {
  const client = await pool.connect();
  try {
    const { operator_name, email, role, startDate } = req.body;
    const result = await client.query('INSERT INTO operators (operator_name, email, role, startDate) VALUES ($1, $2, $3, $4) RETURNING *', [operator_name, email, role, startDate]);

    res.json(result.rows[0])

  } catch (error) {
    console.log(`error encountered while adding a new operator: ${error} `);
  } finally {
    client.release();
  }
})

//get an operator by id 
// get the id and parse it into an int
// then search the database where the id = req.params.id 
app.get('/operator/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    const id = parseInt(req.params.id);
    const result = await client.query("SELECT * FROM operators WHERE operator_id = $1", [id]);

    res.json(result.rows);
  } catch (error) {
    console.log(`error encountered while looking an operator by an id of: ${id}, error --- ${error}`)
  }
  finally {
    client.release();
  }
})

// get all operators from the database 
app.get('/operator', async (_, res) => {

  const client = await pool.connect();

  try {
    console.log('connected to db');
    const result = await client.query("SELECT * FROM operators");
    res.json(result.rows);
  } catch (error) {
    res.json({ message: error.message });
  } finally {
    client.release();
  }
})

app.listen(PORT, (_, res) => {
  console.log('app listening on port, ', PORT);
})
