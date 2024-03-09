import { useEffect, useState } from "react";
import pbms from "../api/pbms";

export default () => {
  const [result, setResult] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);

  const defauult_accountid = "117911566377016615313";

  const getProfile = async (accountid) => {
    try {
      const result = await pbms.get("/api/profile/get/" + accountid);
      setResult(result.data);

      const wallet = await pbms.get(
        "/api/wallet/get/total-amount/" + accountid
      );
      setTotalBalance(wallet.data.totalBalance);

    } catch (error) {
      setErrorMessage(error);
    }
  };

  useEffect(() => {
    getProfile(defauult_accountid);
  }, []);

  return [getProfile, totalBalance, result, errorMessage];
};
