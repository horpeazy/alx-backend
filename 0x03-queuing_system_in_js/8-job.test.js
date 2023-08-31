const expect = require("chai").expect;
const sinon = require("sinon");
const { createQueue } = require("kue");
const createPushNotificationsJobs = require("./8-job");


describe("createPushNotificationJobs", function() {
  const consoleSpy = sinon.spy(console, "log");
  const testQueue = createQueue();
  const jobs = [
    {
      phoneNumber: "09153547755",
      message: "Your verification code is 7755",
    },
    {
      phoneNumber: "09070454578",
      message: "Your verification code is 4578",
    }
  ];

  before(function() {
   testQueue.testMode.enter(true);
  })

  after(function() {
    testQueue.testMode.clear();
    testQueue.testMode.exit();
  })

  beforeEach(function() {
    consoleSpy.restore();
  });

  it("display a error message if jobs is not an array", function() {
    expect(createPushNotificationsJobs.bind(createPushNotificationsJobs, "string", testQueue))
      .to.throw(Error, "Jobs is not an array");
  });

  it("create two new jobs to the queue", function(done) {
    expect(testQueue.testMode.jobs.length).to.equal(0);
    createPushNotificationsJobs(jobs, testQueue);
    expect(testQueue.testMode.jobs.length).to.equal(2);
    expect(testQueue.testMode.jobs[0].data).to.eql(jobs[0]);
    expect(testQueue.testMode.jobs[0].type).to.equal("push_notification_code_3");
    //testQueue.process("push_notification_code_3", () => {
    //  expect(
    //    consoleSpy
    //	  .calledWith(`Notification job created: ${testQueue.testMode.jobs[0].id}`)
    //  ).to.be.true;
    //});
    done();
  })

})
