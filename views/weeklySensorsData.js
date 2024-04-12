require("dotenv").config();
const { TableClient } = require("@azure/data-tables");

const connectionString = process.env.STORAGE_CONN;
const tableClient = TableClient.fromConnectionString(
  connectionString,
  "weeklySensorsData"
);

async function getWeeklySensorsData() {
  const result = [];
  const entities = await tableClient.listEntities();
  for await (entity of entities) {
    result.push(entity);
  }
  return result;
}

module.exports = getWeeklySensorsData;
