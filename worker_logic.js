const {
  Worker,
  Queue,
  Job
} = require('bullmq');

//Create some queues

const QUEUE_NAME = 'someQueueName';
const QUEUE_NAME1 = 'someOtherQueueName';

const connectionDetails = {
  host: 'redis',
  port: 6379
};

//const queue = new Queue(QUEUE_NAME,{connectionDetails});

//process the job in the queue
///**
const processJobsWorker = new Worker(QUEUE_NAME, async (job) => {
  try {
    console.log('new job for ', QUEUE_NAME ,'..................+++++++++++++++++++++++++++');
    console.log('job received',job);

  } catch (error) {
    console.log(error);
  }}, {
    connection: connectionDetails
});
//*/


// Try to remove logic below and start containers and then after put it back and see
// you should notice that once this worker comes back online all jobs in the queue will be processed

const processJobsWorker1 = new Worker(QUEUE_NAME1, async (job) => {
  try {
    console.log('new job for ', QUEUE_NAME1 ,'..................+++++++++++++++++++++++++++');
    console.log('job received',job);

  } catch (error) {
    console.log(error);
  }}, {
    connection: connectionDetails
});