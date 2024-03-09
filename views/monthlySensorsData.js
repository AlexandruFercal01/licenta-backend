require("dotenv").config();
const { TableClient } = require("@azure/data-tables");

const connectionString = process.env.STORAGE_CONN;
const tableClient = TableClient.fromConnectionString(
  connectionString,
  "monthlySensorsData"
);

function getMonthlySensorsData() {
  return tableClient.listEntities();
}

module.exports = getMonthlySensorsData;
