import * as cron from 'cron';
import user from '../models/user.model';
import { sendBirthDayEmail } from '../utils/sent-birthday-email.util';
import failedEmailLog from '../models/failed-email-log.model';

// cron for sending email to birthday user (runs every hour)
const birthdayJob = new cron.CronJob('0 * * * *', async () => {
  const currentDate: Date = new Date();
  const users = await user.find({ isSentEmail: false });
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
});

// cron for retrying failed email sent (runs every hour)
const failedRetry = new cron.CronJob('0 * * * *', async () => {
  const currentDate: Date = new Date();
  const failedEmail = await failedEmailLog.find({ time: { $gte: currentDate, $lte: currentDate } });
  for (const i of failedEmail) {
    const data = await user.findById(i.userId);
    const success = await sendBirthDayEmail(String(data._id), data.firstName, data.lastName);
    if (success) {
      // if succes update the isSentEmail and delete the failedEmailLog
      await user.updateOne({ _id: data._id }, { isSentEmail: true });
      await failedEmailLog.deleteOne({ _id: i._id });
    }
  }
});

birthdayJob.start();
failedRetry.start();