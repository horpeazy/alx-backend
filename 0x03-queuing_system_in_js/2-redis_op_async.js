import { createClient, print } from "redis";
import util from "util";


const client = createClient();

client.on("ready", () => {
  console.log("Redis client connected to the server");
})
client.on("error", (error) => {
  console.log("Redis client not connected to the server", error);
})

const setNewSchool = (schoolName, value) => {
  client.set(schoolName, value, print);
};

const get = util.promisify(client.get).bind(client);

async function displaySchoolValue(schoolName) {
  const res = await get(schoolName).catch((err) => {
    console.log(err);
    throw err;
  });
  console.log(res);
};


displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
