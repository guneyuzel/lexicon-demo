"use client";

import { FC } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { useConnection } from '@solana/wallet-adapter-react';

interface ClusterToggleProps {
    network: WalletAdapterNetwork;
    onToggle: () => void;
}

export const ClusterToggle: FC<ClusterToggleProps> = ({ network, onToggle }) => {
    const { connection } = useConnection();

    return (
        <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <span className="text-sm font-medium text-white">
                {network === WalletAdapterNetwork.Devnet ? 'Devnet' : 'Mainnet'}
            </span>
            <button
                onClick={onToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    network === WalletAdapterNetwork.Mainnet ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        network === WalletAdapterNetwork.Mainnet ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );
};