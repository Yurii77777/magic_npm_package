import { format } from 'date-fns';

import { SubscriptionPaymentFormParams } from '../types';

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

  //   async onUnsubscribe();

  //   handleLiqPayPaymentStatus();
}
