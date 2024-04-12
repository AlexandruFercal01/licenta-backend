const express = require("express");
const app = express();
const userRoutes = require("./routes/users");
const greenhouseRoute = require("./routes/greenhouse");
const plantsRoute = require("./routes/plants");
const favouritesRoute = require("./routes/favourites");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/", userRoutes);
app.use("/greenhouse", greenhouseRoute);
app.use("/plants", plantsRoute);
app.use("/favourites", favouritesRoute);

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});
