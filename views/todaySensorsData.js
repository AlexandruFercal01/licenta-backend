require("dotenv").config();
const { TableClient } = require("@azure/data-tables");

const connectionString = process.env.STORAGE_CONN;
const tableClient = TableClient.fromConnectionString(
  connectionString,
  "todaySensorsData"
);

function getTodaySensorsData() {
  return tableClient.listEntities();
}

function getLatestValue() {
  const results = getTodaySensorsData();
  results.sort((a, b) => {
    b.timestamp - a.timestamp;
  });
  return results[0];
}

module.exports = { getTodaySensorsData, getLatestValue };
