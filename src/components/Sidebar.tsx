"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const navItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Contacts', path: '/contacts' },
  { name: 'Transactions', path: '/transactions' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-gray-800 p-4">
      <h1 className="text-2xl font-bold mb-8">Solana AI Assistant</h1>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-4">
              <Link href={item.path}>
                <span className={`block p-2 rounded ${pathname === item.path ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-8">
        <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700" />
      </div>
    </div>
  );
}