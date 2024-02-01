export interface SendSMSturbosms {
  recipients: Array<string>;
  message: string;
  token: string;
  sender: string;
}

export interface SendSMSresult {
  status: null | number;
  message: null | string;
  error?: string;
  data?: any;
}

export enum PaymentAction {
  Subscribe = 'subscribe',
  Unsubscribe = 'unsubscribe',
}

export enum PaymentPeriodicity {
  Month = 'month',
  Year = 'year',
}

export enum Currency {
  UAH = 'UAH',
  USD = 'USD',
  EUR = 'EUR',
}

export enum PaymentStatus {
  Subscribed = 'subscribed',
}

export interface SubscriptionPaymentFormParams {
  action: PaymentAction;
  subscribePeriodicity: PaymentPeriodicity;
  price: number;
  currency: Currency;
  description: string;
  orderId: string;
  buttonTitle: string;
}
