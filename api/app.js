const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 4000;
const db = require("./crud");

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/users", db.getUsers);
app.get("/users/:id", db.getUserById);
app.post("/users", db.createUser);
app.put("/users/:id", db.updateUser);
app.delete("/users/:id", db.deleteUser);

app.get("/", (req, res) => {
  res.send("Home Route");
});
app.listen(port, () =>
  console.log(`Server running on port ${port}, http://localhost:${port}`)
);
