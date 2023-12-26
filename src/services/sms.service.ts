const axios = require('axios');

import { SendSMSresult, SendSMSturbosms } from '../types';

import { SMS_SERVICE_API } from '../constants/smsServiceAPI';

export class SmsService {
  async sendSMSturbosms(options: SendSMSturbosms) {
    const { recipients, message, token, sender } = options;

    let result: SendSMSresult = {
      status: null,
      message: null,
    };

    const URL = SMS_SERVICE_API.SEND_SMS_TURBOSMS;
    let headers = {};

    headers['Authorization'] = token;

    let payload = {
      sender,
      recipients,
      text: message,
      sms: {},
    };

    try {
      const { data } = await axios({
        method: 'post',
        headers,
        url: URL,
        data: payload,
      });

      const { response_result, response_status } = data;

      if (!response_result) {
        result['status'] = 400;
        result['message'] = `Message was not sent. Service responded respond with ${response_status}`;

        return result;
      }

      const { response_code } = response_result[0];

      if (response_code === 0) {
        result['status'] = 200;
        result['message'] = 'Success!';
        result['data'] = response_result;
      }
    } catch (error) {
      console.log('Error send SMS :::' + error);

      result['status'] = 400;
      result['message'] = 'Message was not sent!';
      result['error'] = error?.message;
    }

    return result;
  }
}
