const Base_URL = "https://pbms-be-api-vqj42lqqmq-as.a.run.app";
// const Base_URL = "https://192.168.0.102:8081";

export const API = {
  AUTHEN: {
    SIGN_IN: `${Base_URL}/api/Auth/signin`
  },
  COLLABFUND: {
    GET_ALL_COLLABFUND: `${Base_URL}/api/collabfund/get/all/`,
    GET_COLLABFUND_ACTIVITIES: `${Base_URL}/api/collabfund/get/activity/`,
  },
  PROFILE: {
    GET_PROFILE: `${Base_URL}/api/profile/get/`
  },
  WALLET: {
    GET_TOTAL_BALANCE: `${Base_URL}/api/wallet/get/total-amount/`,
    GET_ALL_WALLET: `${Base_URL}/api/wallet/get/account/`,
    GET_EACH_WALLET_BALANCE: `${Base_URL}/api/wallet/get/total-amount-each-wallet/`,
    CREATE_WALLET: `${Base_URL}/api/wallet/create`
  },
  TRANSACTION: {
    GET_TRANSACTION: `${Base_URL}/api/transaction/get/`,
    GET_TRANSACTION_BY_WALLET: `${Base_URL}/api/transaction/get/wallet/`,
    GET_TRANSACTION_BY_ACCOUNT: `${Base_URL}/api/transaction/get/account/`,
    GET_RECENTLY_TRANSACTION: `${Base_URL}/api/transaction/get/recently/`,
    GET_TRANSACTION_BY_WEEK: `${Base_URL}/api/transaction/get/weekbyweek/custom/`,
    ADD_TRANSACTION_NO_INVOICE: `${Base_URL}/api/transaction/create/withoutinvoice`,
    ADD_TRANSACTION_WITH_INVOICE: `${Base_URL}/api/transaction/create`
  },
  CATEGORY: {
    GET_CATEGORIES: `${Base_URL}/api/category/get/typebytype/`,
    CREATE_CATEGORY: `${Base_URL}/api/category/create`
  },
  INVOICE: {
    SCAN: `${Base_URL}/api/invoice/scan`
  },
  FILE: {
    UPLOAD_INVOICE_OF_TRANSACTION: `${Base_URL}/api/file/upload/transaction/invoice`,
    UPLOAD_INVOICE_OF_TRANSACTION_FILE_NAME: `${Base_URL}/api/file/upload/transaction/invoice/filename`
  }
};
