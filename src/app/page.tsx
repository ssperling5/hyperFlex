"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

const Home: NextPage = () => {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal({ cacheProvider: false });
      const connection = await web3Modal.connect();
      
      // Use BrowserProvider in ethers v6
      const provider = new ethers.BrowserProvider(connection);
      const network = await provider.getNetwork();

      if (network.chainId !== 999n) {
        try {
          await connection.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x3e7' }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await connection.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x3e7',
                chainName: 'Hyperliquid EVM',
                rpcUrls: ['https://rpc.hyperliquid.xyz/evm'],
                nativeCurrency: {
                  name: 'HYPE',
                  symbol: 'HYPE',
                  decimals: 18,
                },
              }],
            });
          } else {
            console.error('Failed to switch network', switchError);
            return;
          }
        }
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  const disconnectWallet = async () => {
    try {
      const web3Modal = new Web3Modal({ cacheProvider: false });
      await web3Modal.clearCachedProvider();
      setAccount(null);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const abbreviateAddress = (address: string): string =>
    `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

  return (
    <div className="min-h-screen flex flex-col bg-teal-900">
      {/* Navbar */}
      <nav className="w-full h-16 bg-gray-800 flex items-center justify-between px-6 text-white">
        <div className="flex space-x-4">
          <a href="#" className="italic font-bold hover:underline">DUEL</a>
          <a href="#" className="hover:underline">Leaderboard</a>
          <a href="#" className="hover:underline">Profile</a>
        </div>
        <div>
          {account ? (
            <div className="flex items-center space-x-4">
              <p className="font-semibold">Connected: {abbreviateAddress(account)}</p>
              <button
                onClick={disconnectWallet}
                className="bg-gradient-to-r from-teal-900 via-teal-700 to-teal-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-gradient-to-r from-teal-900 via-teal-700 to-teal-500 text-white py-2 px-4 rounded-full shadow-md transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Page content here */}
      </main>
    </div>
  );
};

export default Home;
