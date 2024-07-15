"use client"
import { useEffect, useState } from "react";
import { useMetaMask } from "./hooks/useMetamask";
import MetamaskConnect from "./components/MetamaskConnect";
import { ethers } from "ethers";
import counter from "@/Contract/Counter.json";
import { config, transact } from "@/app/utils/biconomy";
import { createSmartAccountClient, PaymasterMode } from "@biconomy/account";

export default function Home() {
  const { wallet, hasProvider, isConnecting, connectMetaMask } = useMetaMask();
  const [count, setCount] = useState<number>()
  const getCounter = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractAddress = counter.deployAddress;
    let contract = new ethers.Contract(contractAddress, counter.abi, signer)
    const transaction = await contract.c()
    setCount(Number(transaction))
  }

  async function handleIncrement(event: any) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const toaddr = counter.deployAddress;
    let contract = new ethers.Contract(toaddr, counter.abi, signer);
    const data = contract.interface.encodeFunctionData('incrementCounter');
    const tx = {
      to: toaddr,
      data,
    }
    transact(tx);
    getCounter()
  }

  async function handleReset(event: any) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const toaddr = counter.deployAddress;
    let contract = new ethers.Contract(toaddr, counter.abi, signer);
    const transaction = await contract.resetCounter();
    await transaction.wait()
    getCounter()
  }

  useEffect(() => {
    if (wallet.accounts.length == 0) {
      return
    }
    else {
      getCounter()
    }
  })

  if (wallet.accounts.length == 0) {
    return (
      <main className="w-screen h-screen bg-slate-100 flex justify-center items-center">
        <div>
          <MetamaskConnect />
        </div>
      </main>
    );
  } else {
    return (
      <main className="w-screen h-screen bg-slate-100 flex justify-center items-center">
        <div className="bg-white shadow-xl w-[600px] h-[300px] flex flex-col justify-between items-center p-10">
          <h1 className="text-black text-3xl font-semibold">Counter</h1>
          <div className=" flex w-full justify-evenly ">
            <button className="bg-red-500 py-5 w-[200px] rounded-2xl" onClick={handleReset}>Reset counter</button>
            <button className="bg-blue-500 py-5 w-[200px] rounded-2xl" onClick={handleIncrement}>Increment counter</button>
          </div>
          <p className="text-black text-xl">Count: {count}</p>
        </div>
      </main>
    );
  }
}
