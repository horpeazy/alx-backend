import { createClient } from "redis";


const client = createClient();

client.on("ready", () => {
  console.log("Redis client connected to the server");
})

client.on("error", (error) => {
  console.log("Redis client not connected to the server", error);
})

client.subscribe("holberton school channel");

client.on("message", (channel, message) => {
  if(message === "KILL_SERVER") {
    client.unsubscribe("holberton school channel");
    client.quit();
  }
  console.log(message);
})
