import React, { useState } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface WalletPanelProps {
  onClose: () => void;
}

const WalletPanel: React.FC<WalletPanelProps> = ({ onClose }) => {
  const [balance, setBalance] = useState('0.00');
  const [address, setAddress] = useState('');

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAddress(accounts[0]);
        
        // Get balance
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest']
        });
        setBalance(parseFloat(balance) / 1e18);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button onClick={onClose} className="mr-2 p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold">Wallet</h2>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        {!address ? (
          <button
            onClick={connectWallet}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Address</label>
              <div className="flex items-center space-x-2">
                <code className="text-sm">{address.slice(0, 6)}...{address.slice(-4)}</code>
                <button 
                  onClick={() => navigator.clipboard.writeText(address)}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  Copy
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Balance</label>
              <p className="text-2xl font-bold">{balance} ETH</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WalletPanel;