import axios from "axios"
import { ConfigService } from "../config/env.config"
import failedEmailLog from "../models/failed-email-log.model";

export const sendBirthDayEmail = async (id: string, firstName: string, lastName: string) => {
  try {
    await axios({
      method: 'POST',
      url: `${ConfigService.emailUrl}/send-email`,
      data: {
        email: 'noreply@email.com',
        message: `Hey, ${firstName} ${lastName} it's your birthday!`,
      }
    });
    return true;
  } catch (error) {
    console.log(error)
    // if error then write it in database
    await failedEmailLog.create({
      userId: id,
      time: new Date(),
    });
    return false;
  }
}