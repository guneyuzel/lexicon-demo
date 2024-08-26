"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { IconHome, IconUsers, IconHistory } from '@tabler/icons-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: IconHome },
  { name: 'Contacts', path: '/contacts', icon: IconUsers },
  { name: 'Transactions', path: '/transactions', icon: IconHistory },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-gray-800 p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-8 text-center">Solana AI Assistant</h1>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <span className={`flex items-center p-3 rounded transition-colors ${
                  pathname === item.path ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}>
                  <item.icon className="mr-3" size={20} />
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 w-full" />
      </div>
    </div>
  );
}