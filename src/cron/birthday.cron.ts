import * as cron from 'cron';
import user from '../models/user.model';
import { sendBirthDayEmail } from '../utils/sent-birthday-email.util';
import failedEmailLog from '../models/failed-email-log.model';

// cron for sending email to birthday user (runs every hour)
const birthdayJob = new cron.CronJob('0 * * * *', async () => {
  const currentDate: Date = new Date();
  let lastId: any = null;
  while (true) {
    let users;
    if (!lastId) {
      users = await user.find({ isSentEmail: false }).sort({ _id: 1 }).limit(500);
    } else {
      users = await user.find({ _id: { $gt: lastId }, isSentEmail: false })
    }
    if (users.length === 0) {
      break;
    }
    for (const i of users) {
      const userBirthday: Date = new Date(i.birthday);
      if (currentDate.getMonth() == userBirthday.getMonth() && currentDate.getDate() == userBirthday.getDate()) {
        const timezone = i.location;
        const localTime = new Date(currentDate.toLocaleString('en-US', { timeZone: timezone }));
        if (localTime.getHours() === 9 && localTime.getMinutes() === 0) {
          const success = await sendBirthDayEmail(String(i._id), i.firstName, i.lastName);
          // update the user isSentEmail to true
          if (success) {
            await user.updateOne({ _id: i._id }, { isSentEmail: true });
          }
        }
      }
    }
    lastId = users[users.length - 1]._id;
  }
});

// cron for retrying failed email sent (runs every hour)
const failedRetry = new cron.CronJob('0 * * * *', async () => {
  const currentDate: Date = new Date();
  let lastId: any = null
  while(true) {
    let failedEmail;
    if (!lastId) {
      failedEmail = await failedEmailLog.find({ time: { $lte: currentDate } }).limit(500).sort({ _id: 1 });
    } else {
      failedEmail = await failedEmailLog.find({ _id: { $gt: lastId }, time: { $lte: currentDate }});
    }
    for (const i of failedEmail) {
      const data = await user.findById(i.userId);
      const success = await sendBirthDayEmail(String(data._id), data.firstName, data.lastName);
      if (success) {
        // if succes update the isSentEmail and delete the failedEmailLog
        await user.updateOne({ _id: data._id }, { isSentEmail: true });
        await failedEmailLog.deleteOne({ _id: i._id });
      }
    }
    lastId = failedEmail[failedEmail.length - 1]._id;
  }
});

// cron for resetting all the isSentEmail flag to false (runs every 1st of January)
const resetNewYearData = new cron.CronJob('0 0 1 1 *', async () => {
  await user.updateMany({ isSentEmail: true }, { isSentEmail: false });
});

birthdayJob.start();
failedRetry.start();
resetNewYearData.start();