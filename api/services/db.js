const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "db_name",
  password: "postgres",
  port: 5432,
});

const connectToDB = async () => {
  try {
    await pool.connect();
    console.log("connecte to db");
  } catch (err) {
    console.log(err);
  }
};

connectToDB();

module.exports = {
  pool,
};
