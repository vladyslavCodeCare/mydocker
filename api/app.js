const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 4000;
const users = require("./controllers/users");
const orders = require("./controllers/orders");

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/users", users.getUsers);
app.get("/users/:id", users.getUserById);
app.post("/users", users.createUser);
app.put("/users/:id", users.updateUser);
app.delete("/users/:id", users.deleteUser);

app.get("/orders", orders.getOrders);
app.get("/orders-avg", orders.getOrderAvg);
app.get("/orders/:id", orders.getOrderById);
app.post("/orders", orders.createOrder);
app.put("/orders/:id", orders.updateOrder);
app.delete("/orders/:id", orders.deleteOrder);

app.get("/", (req, res) => {
  res.send("Home Route");
});
app.listen(port, () =>
  console.log(`Server running on port ${port}, http://localhost:${port}`)
);
