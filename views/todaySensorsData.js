require("dotenv").config();
const { TableClient } = require("@azure/data-tables");

const connectionString = process.env.STORAGE_CONN;
const tableClient = TableClient.fromConnectionString(
  connectionString,
  "todaySensorsData"
);

async function getTodaySensorsData() {
  const result = [];
  const entities = await tableClient.listEntities();
  for await (entity of entities) {
    result.push(entity);
  }
  return result;
}

async function getLatestValue() {
  const results = await getTodaySensorsData();
  results.sort((a, b) => {
    let dateA = new Date(a.timestamp);
    let dateB = new Date(b.timestamp);
    return dateB - dateA;
  });
  return results[0];
}

module.exports = { getTodaySensorsData, getLatestValue };
