const kue = require("kue");


const data = {
  phoneNumber: "09153547755",
  message: "Account created successfully",
};

const queue = kue.createQueue({ name: "push_notification_code" });
const job = queue.create("push_notification_code", data).save((err) => {
  if (!err) console.log(`Notification job created: ${job.id}`);
});

job.on("complete", () => {
  console.log("Notification job compeleted");
})

job.on("failed attempt", () => {
  console.log("Notification job failed");
});
