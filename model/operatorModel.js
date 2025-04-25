const { Pool } = require('pg');
const DBConfig = require('../dbConfig.js'); // Assuming DBConfig is in the parent directory
const pool = new Pool(DBConfig);

// Get all operators
const getAllOperators = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM operators");
    return result.rows;
  } catch (error) {
    throw new Error(`Error fetching all operators: ${error.message}`);
  } finally {
    client.release();
  }
};

// Get operator by ID
const getOperatorById = async (id) => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM operators WHERE operator_id = $1", [id]);
    return result.rows;
  } catch (error) {
    throw new Error(`Error fetching operator by ID: ${error.message}`);
  } finally {
    client.release();
  }
};

// Add a new operator
const addOperator = async (operator_name, email, role, startDate) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO operators (operator_name, email, role, startDate) VALUES ($1, $2, $3, $4) RETURNING *',
      [operator_name, email, role, startDate]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error adding new operator: ${error.message}`);
  } finally {
    client.release();
  }
};

// Update an operator
const updateOperator = async (id, operator_name, email, role, startDate) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "UPDATE operators SET operator_name = $1, email = $2, role = $3, startDate = $4 WHERE operator_id = $5 RETURNING *",
      [operator_name, email, role, startDate, id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error updating operator: ${error.message}`);
  } finally {
    client.release();
  }
};

// Delete an operator
const deleteOperator = async (id) => {
  const client = await pool.connect();
  try {
    const result = await client.query("DELETE FROM operators WHERE operator_id = $1 RETURNING *", [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error deleting operator: ${error.message}`);
  } finally {
    client.release();
  }
};

module.exports = {
  getAllOperators,
  getOperatorById,
  addOperator,
  updateOperator,
  deleteOperator
};

