/**
 * queue names
 */

const QUEUE_NAME_SEND_MAIL_TEMPLE_UPDATE_EVENT = 'SendMailTempleUpdateEvent';

/**
 * job names
 */
const JOB_NAME_SEND_MAIL_TEMPLE_UPDATE_EVENT = 'SendMailTempleUpdateEventJob';

/**
 * queue module options
 */
export const QUEUE_MODULE_OPTIONS = {
  SEND_MAIL_TEMPLE_UPDATE_EVENT: {
    NAME: QUEUE_NAME_SEND_MAIL_TEMPLE_UPDATE_EVENT as TQueueName,
    JOBS: {
      SEND_MAIL: JOB_NAME_SEND_MAIL_TEMPLE_UPDATE_EVENT as TJobName,
    },
  },
};

/**
 * type queue name
 */
export type TQueueName = typeof QUEUE_NAME_SEND_MAIL_TEMPLE_UPDATE_EVENT;

/**
 * type job name
 */
export type TJobName = typeof JOB_NAME_SEND_MAIL_TEMPLE_UPDATE_EVENT;
