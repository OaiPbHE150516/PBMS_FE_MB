const Base_URL = "https://pbms-be-api-vqj42lqqmq-as.a.run.app";

export const API = {
  AUTHEN: {
    SIGN_IN: `${Base_URL}/api/Auth/signin`
  },
  PROFILE: {
    GET_PROFILE: `${Base_URL}/api/profile/get/`
  },
  WALLET: {
    GET_TOTAL_BALANCE: `${Base_URL}/api/wallet/get/total-amount/`,
    GET_WALLET: `${Base_URL}/api/wallet/get/total-amount/`,
    GET_ALL_WALLET: `${Base_URL}/api/wallet/get/account/`,
    GET_EACH_WALLET_BALANCE: `${Base_URL}/api/wallet/get/total-amount-each-wallet/`
  },
  TRANSACTION: {
    GET_TRANSACTION: `${Base_URL}/api/transaction/get/`,
    GET_TRANSACTION_BY_WALLET: `${Base_URL}/api/transaction/get/wallet/`,
    GET_TRANSACTION_BY_ACCOUNT: `${Base_URL}/api/transaction/get/account/`,
    GET_RECENTLY_TRANSACTION: `${Base_URL}/api/transaction/get/recently/`,
    GET_TRANSACTION_BY_WEEK: `${Base_URL}/api/transaction/get/weekbyweek/custom/`,
  },
  CATEGORY: {
    GET_CATEGORIES: `${Base_URL}/api/category/get/`
  }
};
