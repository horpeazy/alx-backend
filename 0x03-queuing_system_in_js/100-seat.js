const express = require("express");
const { createQueue } = require("kue");
const { createClient } = require("redis");
const { promisify } = require("util");


const redisClient = createClient();

const reserveSeat = (number) => {
  redisClient.set("available_seats", number);  
};

const getCurrentAvailableSeats = () => {
  return promisify(redisClient.get).bind(redisClient)("available_seats");
}

const app = express();
const port = 1245;
let reservationEnabled;
const queue = createQueue({ name: "reserve_seat" });

app.get("/available_seats", async (req, res) => {
  const availableSeats = await getCurrentAvailableSeats();
  return res.status(200).json({"numberOfAvailableSeats": availableSeats});
})

app.get("/reserve_seat", (req, res) => {
  if(!reservationEnabled) {
    return res.status(200).json({"status": "Reservation are blocked"});
  }
  const job = queue.create("reserve_seat");
  job.on("complete", () => {
    console.log(`Seat reservation job ${job.id} completed`);
  })
  job.on("failed", (err) => {
    console.log(`Seat reservation job ${job.id} failed: ${err.message || err.toString()}`);
  })
  job.save((err) => {
    if(err) {
      return res.status(200).json({"status": "Reservation failed"});
    } else {
      return res.status(200).json({"status": "Reservation in process"});
    }
  });
})

app.get("/process", async (req, res) => {
  queue.process("reserve_seat", async (job, done) => {
    let availableSeats = await getCurrentAvailableSeats();
    availableSeats = availableSeats - 1;
    if(availableSeats === 0) {
      reservationEnabled = false;
    }
    if(availableSeats >= 0) {
      reserveSeat(availableSeats);
      done();
    } else {
      done(new Error("Not enough seats available"));
    }
  })
  res.status(200).json({"status": "Queue processing"});
})


app.listen(port, () => {
  reserveSeat(50);
  reservationEnabled = true;
  console.log(`Server running on port ${port}`);
})
