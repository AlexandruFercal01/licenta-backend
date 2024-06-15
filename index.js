// Assume this file is named server.js
const express = require("express");
const http = require("http");
const socketInit = require("./views/socket");
const cors = require("cors");
const userRoutes = require("./routes/users");
const greenhouseRoute = require("./routes/greenhouse");
const plantsRoute = require("./routes/plants");
const favouritesRoute = require("./routes/favourites");
const { getLatestValue } = require("./views/todaySensorsData");

const app = express();
const server = http.createServer(app);

// Initialize Socket.io and attach it to the HTTP server
const io = socketInit.init(server);
io.on('connection', (socket) => {
  console.log('New WebSocket connection');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const sendNotification = async () =>{
  const io = socketInit.getIO();
  const sensorsValue = await getLatestValue();
  if(Number.parseFloat(sensorsValue?.temperature) > 30){
    io.emit('sensorAlert', {
      title: 'Temperatura ridicata',
      message: `Se recomanda pornirea ventilatoarelor sau deschiderea panoului lateral pentru temperaturi care depasesc ${sensorsValue.temperature} de grade Celsius.`,
    });
  }
  if(sensorsValue?.soil_humidity < 20){
    io.emit('sensorAlert', {
      title: 'Umiditate in sol scazuta',
      message: 'Se recomanda pornirea pompei de apa.',
    });
  }
}

setInterval(()=>{
 sendNotification();
}, 5000);

app.use(cors());
app.use(express.json());
app.use("/", userRoutes);
app.use("/greenhouse", greenhouseRoute);
app.use("/plants", plantsRoute);
app.use("/favourites", favouritesRoute);

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});
