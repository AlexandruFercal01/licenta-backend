require("dotenv").config();
const { TableClient } = require("@azure/data-tables");

const connectionString = process.env.STORAGE_CONN;
const tableClient = TableClient.fromConnectionString(connectionString, "users");

function registerUser(email, password) {
  const entity = {
    PartitionKey: "users",
    RowKey: email,
    email: email,
    password: password,
  };
  return tableClient.createEntity(entity, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

async function getUser(email) {
  try {
    const res = await tableClient.getEntity("users", email);
    return res;
  } catch (err) {
    return err;
  }
}

module.exports = { registerUser, getUser };
