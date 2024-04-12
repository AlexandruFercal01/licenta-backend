require("dotenv").config();
const { TableClient } = require("@azure/data-tables");

const connectionString = process.env.STORAGE_CONN;
const plantsTableClient = TableClient.fromConnectionString(
  connectionString,
  "plants"
);
const favouritePlantsTableClient = TableClient.fromConnectionString(
  connectionString,
  "favoritePlants"
);

function removeDiacriticsRegex(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function searchInArrayOfObjectsIgnoringArrayDiacritics(
  array,
  searchTerm,
  property
) {
  searchTerm = searchTerm.toLowerCase();
  return array.filter((item) =>
    removeDiacriticsRegex(item[property].toLowerCase()).includes(searchTerm)
  );
}

function addPlant(plant) {
  const entity = {
    PartitionKey: "plants",
    RowKey: plant.id.toString(),
    ...plant,
  };
  return plantsTableClient.createEntity(entity, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

async function getPlant(name) {
  const result = [];
  const condition = new RegExp(name);
  const entities = await plantsTableClient.listEntities();
  for await (entity of entities) {
    result.push(entity);
  }

  let filteredData = searchInArrayOfObjectsIgnoringArrayDiacritics(
    result,
    name,
    "common_name"
  );
  return filteredData;
}

async function getPlantsByIds(ids) {
  const result = [];
  const entities = await plantsTableClient.listEntities();
  for await (entity of entities) {
    result.push(entity);
  }
  let res = result.filter((plant) => ids.includes(plant.id.toString()));
  return res;
}

async function getAllPlants() {
  const result = [];
  const entities = await plantsTableClient.listEntities();
  for await (entity of entities) {
    result.push(entity);
  }
  return result;
}

async function getAllFavouritePlantsIds() {
  const result = [];
  const entities = await favouritePlantsTableClient.listEntities();
  for await (entity of entities) {
    result.push(entity);
  }
  return result;
}

async function addPlantIdToFavourite(id) {
  let isFavourite = false;
  await getAllFavouritePlantsIds().then((res) =>
    res.map((favourite) => {
      if (favourite.id === id.toString()) {
        isFavourite = true;
      }
    })
  );
  if (isFavourite) {
    return { message: "Planta este deja adaugata la favorite!" };
  } else {
    const entity = {
      PartitionKey: "favoritePlants",
      RowKey: id.toString(),
      id: id,
    };
    favouritePlantsTableClient.createEntity(entity, (err) => {
      if (err) {
        console.log(err);
      }
    });
    return { message: "Planta adaugata la favorite!" };
  }
}

async function deletePlantFromFavourites(id) {
  return favouritePlantsTableClient.deleteEntity(
    "favoritePlants",
    id.toString()
  );
}

module.exports = {
  addPlant,
  getPlant,
  getPlantsByIds,
  getAllPlants,
  getAllFavouritePlantsIds,
  addPlantIdToFavourite,
  deletePlantFromFavourites,
};
