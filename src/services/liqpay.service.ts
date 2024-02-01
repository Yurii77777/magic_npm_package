const crypto = require('crypto');

import { format } from 'date-fns';

import { PaymentStatus, SubscriptionPaymentFormParams } from '../types';

export class LiqpayService {
  createSubscriptionPaymentForm(options: SubscriptionPaymentFormParams): string {
    const { action, subscribePeriodicity, price, currency, description, orderId, buttonTitle } = options;

    const startPaymentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    const jsonString = JSON.stringify({
      version: 3,
      public_key: process.env.PUBLIC_LIQPAY_KEY,
      action,
      subscribe_date_start: startPaymentDate,
      subscribe_periodicity: subscribePeriodicity,
      amount: price,
      currency,
      description,
      order_id: orderId,
      server_url: process.env.LIQPAY_WEBHOOK_URL + '/api/liqpay-subscription/payment-status',
    });

    const data = Buffer.from(jsonString).toString('base64');

    const crypto = require('crypto');
    const hash = crypto.createHash('sha1');

    const signature = hash
      .update(process.env.PRIVAT_LIQPAY_KEY + data + process.env.PRIVAT_LIQPAY_KEY)
      .digest('base64');

    const htmlForm = `
    <form method="POST" action="https://www.liqpay.ua/api/3/checkout" style="display: flex;flex-direction: column;justify-content: center;align-items: center;margin: 0;"
      accept-charset="utf-8" target="_blank">
      <input type="hidden" name="data" value="${data}"/>
      <input type="hidden" name="signature" value="${signature}"/>
      <input type="submit" style="min-width: 150px;background-color: #a056fc;border: none;outline: none;line-height: 2.5rem;color: #fff;cursor: pointer;font-size: 1rem;border-radius: 10px;padding: 0 10px;" value="${buttonTitle}">
      </form>
    `;

    return htmlForm;
  }

  handlePaymentStatus(options) {
    const { data, signature } = options;
    let result = {
      status: false,
      orderId: null,
      amount: null,
    };

    // Verify the authenticity of the request
    const hash = crypto.createHash('sha1');
    const correctSignature = hash
      .update(process.env.PRIVAT_LIQPAY_KEY + data + process.env.PRIVAT_LIQPAY_KEY)
      .digest('base64');

    const isValidSignature = correctSignature === signature;

    if (!isValidSignature) {
      return result;
    }

    // JSON object contains decoded data
    const decodedData = JSON.parse(Buffer.from(data, 'base64').toString());
    const { status, order_id, amount } = decodedData;

    // Payment was rejected
    if (status !== PaymentStatus.Subscribed) {
      return result;
    }

    result['status'] = true;
    result['orderId'] = order_id;
    result['amount'] = amount;

    return result;
  }

  //   async onUnsubscribe();
}
