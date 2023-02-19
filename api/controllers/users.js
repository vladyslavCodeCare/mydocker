const pool = require("../services/db").pool;

const getUsers = (request, response) => {
  const { byName, byPhone } = request.query;
  const searchQArray = [];

  let searchQ = "";
  let unnest = "";

  if (byName) {
    searchQArray.push(` users.name LIKE '${byName}%' `);
  }
  if (byPhone) {
    unnest = ",unnest(users.phones) phone";
    searchQArray.push(` phone LIKE '${byPhone}%' `);
  }
  if (searchQArray.length > 0) {
    searchQ = ` WHERE ${searchQArray.join("AND")}`;
  }
  pool.query(
    `
    WITH o as (
      SELECT id,round(cost::numeric) AS cost , name, user_id
      FROM orders
    )
    SELECT users.id, users.name, users.phones, jsonb_agg(to_jsonb(o) - 'user_id') as orders, count(o)
    FROM users
    LEFT JOIN o ON (users.id = o.user_id)
    ${unnest} ${searchQ}
    GROUP BY users.id
    ORDER BY users.name ASC`,
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createUser = (request, response) => {
  const { email, name, phones } = request.body;

  pool.query(
    "INSERT INTO users (name, email, phones) VALUES ($1, $2, $3) RETURNING *",
    [name, email, phones],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.rows[0].id}`);
    }
  );
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3",
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
