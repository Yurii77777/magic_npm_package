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
