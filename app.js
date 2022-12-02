const express = require('express');
//const Queue = require('bull');
//const { QueueMQ } = require('bullmq');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const luxon = require('luxon');
const {
  Queue
} = require('bullmq');

//Create some queues

const QUEUE_NAME = 'someQueueName';

const connectionDetails = {
  host: 'redis',
  port: 6379
};

const someQueue = new Queue(QUEUE_NAME, {
  connection: connectionDetails
});

//{
//  redis: { port: 6379, host: '127.0.0.1', password: 'foobared' },
//}); // if you have a special connection to redis.

const someOtherQueue = new Queue('someOtherQueueName',{
  connection: connectionDetails
});

//const someOtherQueueToo = new Queue('someOtherQueueToo');

//const queueMQ = new QueueMQ('queueMQName');

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  //queues: [new BullAdapter(someQueue), new BullAdapter(someOtherQueue), new BullMQAdapter(queueMQ)],
  queues: [new BullAdapter(someQueue), new BullAdapter(someOtherQueue)],
  serverAdapter: serverAdapter
});

//define some data to post into queues
const queueData = { test: 123,
  name: 'Tina',
  reason: 'just a demo'
}

const queueData1 = { test: 143,
  name: 'Turner',
  reason: 'new job repeats'
}
//define a job name
//uuid4
const jobName = luxon.DateTime.now().toFormat('yyyy-MM-dd-mm-ss');

//post the data into a queue
someQueue.add(jobName, queueData,   {
  repeat: {
    every: 10000,
    limit: 10,
  },
  //removeOnComplete: true //toggle this field and see what happens
  //jobId: trxResult._id,
},);

//const jobName1 = luxon.DateTime.now().toFormat('yyyy-MM-dd-mm-ss');

someOtherQueue.add(jobName, queueData1,   {
  repeat: {
    every: 20000,
    limit: 10,
  },
  //removeOnComplete: true //toggle this field and see what happens
  //jobId: trxResult._id,
},);
//process the job in the queue
/**
const processJobsWorker = new Worker(QUEUE_NAME, async (job) => {
  try {
    console.log('new job..................+++++++++++++++++++++++++++');
    console.log('job received',job);

  } catch (error) {
    console.log(error);
  }}, {
    connectionDetails
});
*/

const app = express();

app.use('/admin/queues', serverAdapter.getRouter());

// other configurations of your server
app.listen(3000, () => {
  console.log('Running on 3000...');
  console.log('For the UI, open http://localhost:3000/admin/queues');
  console.log('Make sure Redis is running on port 6379 by default');
});