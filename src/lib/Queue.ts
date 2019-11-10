import Bee from 'bee-queue';
import EnrollMail from '../app/jobs/EnrollMail';
import HelpOrderAnswerMail from '../app/jobs/HelpOrderAnswerMail';
import { redisConfig } from '../config/redis';

const jobs = [EnrollMail, HelpOrderAnswerMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init(): void {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add<T>(queue, job: T) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue(): void {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err): void {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
