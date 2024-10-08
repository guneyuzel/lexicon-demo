"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconHome, IconUsers, IconHistory, IconBrain } from '@tabler/icons-react';
import Image from 'next/image';

const navItems = [
  { name: 'Dashboard', path: '/', icon: IconHome },
  { name: 'Contacts', path: '/contacts', icon: IconUsers },
  { name: 'Transactions', path: '/transactions', icon: IconHistory },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-black p-6 flex flex-col border-r border-white/10">
      <div className="flex items-center justify-center mb-8">
        <Image
          src="/lexicon.png"
          alt="Lexicon AI"
          width={32}
          height={32}
          className="mr-2"
        />
        <h1 className="text-2xl font-bold text-white">Lexicon AI</h1>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <span className={`flex items-center p-3 rounded-lg transition-colors ${
                  pathname === item.path ? 'bg-white text-black' : 'text-white hover:bg-white/10'
                }`}>
                  <item.icon className="mr-3" size={20} />
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}