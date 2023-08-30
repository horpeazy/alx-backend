import { createClient, print } from "redis";


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

const displaySchoolValue = (schoolName) => {
  client.get(schoolName, (err, res) => {
    if(err) {
      print(`Redis Error: ${err}`);
    } else {
      print(res);
    }
  });
};


displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
