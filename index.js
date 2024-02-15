const express = require("express");
const app = express();
const userRoutes = require("./routes/users");
const greenhouseRoute = require("./routes/greenhouse");

app.use(express.json());
app.use("/users", userRoutes);
app.use("/greenhouse", greenhouseRoute);

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});
