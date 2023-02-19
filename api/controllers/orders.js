const pool = require("../services/db").pool;

const getOrders = (request, response) => {
  const { minCost, maxCost } = request.query;
  const searchQArray = [];

  let searchQ = "";

  if (minCost) {
    searchQArray.push(` cost > ${minCost} `);
  }
  if (maxCost) {
    searchQArray.push(` cost < ${maxCost} `);
  }
  if (searchQArray.length > 0) {
    searchQ = ` WHERE ${searchQArray.join("AND")}`;
  }

  pool.query(
    `SELECT orders.id, cost, orders.name, user_id,email, users.name user_name ,users.phones 
    FROM orders 
    JOIN users ON (users.id = orders.user_id) 
    ${searchQ} 
    ORDER BY id ASC`,
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getOrderAvg = (request, response) => {
  pool.query("SELECT avg(cost) FROM orders", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getOrderById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM orders WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createOrder = (request, response) => {
  const { userId, cost, name } = request.body;

  pool.query(
    "INSERT INTO orders (name, user_id, cost) VALUES ($1, $2, $3) RETURNING *",
    [name, userId, cost],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`Order added with ID: ${results.rows[0].id}`);
    }
  );
};

const updateOrder = (request, response) => {
  const id = parseInt(request.params.id);
  const { userId, cost, name } = request.body;
  pool.query(
    "UPDATE orders SET name = $1, cost = $2, user_id = $3 WHERE id = $4",
    [name, cost, userId, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Order modified with ID: ${id}`);
    }
  );
};

const deleteOrder = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM orders WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

module.exports = {
  getOrders,
  getOrderById,
  getOrderAvg,
  createOrder,
  updateOrder,
  deleteOrder,
};
