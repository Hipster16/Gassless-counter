import { createSmartAccountClient, PaymasterMode } from "@biconomy/account";
import { ethers } from "ethers";

type Datatype = {
  to: string;
  data: string;
}

export const config = {
  biconomyPaymasterApiKey: process.env.NEXT_PUBLIC_PAYMASTER_KEY,
  bundlerUrl: "https://bundler.biconomy.io/api/v2/80002/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
};

export const transact = async (tx: Datatype) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const smartWallet = await createSmartAccountClient({
    signer,
    biconomyPaymasterApiKey: config.biconomyPaymasterApiKey,
    bundlerUrl: config.bundlerUrl
  })
  const saAddress = await smartWallet.getAccountAddress();
  console.log("SA Address", saAddress);
  const userOpResponse = await smartWallet.sendTransaction(tx, {
    paymasterServiceData: { mode: PaymasterMode.SPONSORED },
  });
  const { transactionHash } = await userOpResponse.waitForTxHash();
  console.log("Transaction Hash", transactionHash);
  const userOpReceipt = await userOpResponse.wait();
  if (userOpReceipt.success == "true") {
    console.log("UserOp receipt", userOpReceipt);
    console.log("Transaction receipt", userOpReceipt.receipt);
  }
  console.log("end")
}