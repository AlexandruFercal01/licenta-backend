require("dotenv").config();
const { TableClient } = require("@azure/data-tables");

const connectionString = process.env.STORAGE_CONN;
const tableClient = TableClient.fromConnectionString(
  connectionString,
  "todaySensorsData"
);

async function getAllSensorsData() {
  const result = [];
  const entities = await tableClient.listEntities();
  let lastKnownValues = {
    temperature: 0,
    humidity: 0,
    soil_humidity: 0,
    light: 0,
  };

  for await (entity of entities) {
    const correctEntity = {
      ...entity,
      temperature: Number.parseFloat(entity.temperature),
      humidity: Number.parseFloat(entity.humidity),
      soil_humidity: Number.parseFloat(entity.soil_humidity),
      light: Number.parseFloat(entity.light),
    };

    // Check if a property is missing or its value is not available
    for (let property in lastKnownValues) {
      if (!isNaN(correctEntity[property])) {
        lastKnownValues[property] = correctEntity[property];
      } else {
        correctEntity[property] = lastKnownValues[property];
      }
    }

    result.push(correctEntity);
  }

  return result;
}

async function getTodaySensorsData() {
  const result = [];
  const entities = await tableClient.listEntities();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set hours to beginning of the day
  const todayTimestamp = today.getTime();

  for await (entity of entities) {
    const correctEntity = {
      ...entity,
      temperature: Number.parseFloat(entity.temperature),
      humidity: Number.parseFloat(entity.humidity),
      soil_humidity: Number.parseFloat(entity.soil_humidity),
      light: Number.parseFloat(entity.light),
    };

    const entityTimestamp = Number.parseInt(entity.rowKey);

    if (entityTimestamp >= todayTimestamp) {
      result.push(correctEntity);
    }
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

  let latestData = {};

  const properties = ["temperature", "humidity", "soil_humidity", "light"];
  for (let property of properties) {
    for (let result of results) {
      if (result[property] !== undefined) {
        latestData[property] = Number.parseFloat(result[property]) || 0;
        break;
      }
    }
    if (latestData[property] === undefined) {
      latestData[property] = undefined;
    }
  }

  return {
    ...results[0],
    ...latestData,
  };
}

module.exports = { getTodaySensorsData, getLatestValue, getAllSensorsData };
