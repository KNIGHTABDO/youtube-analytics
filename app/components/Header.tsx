import Link from 'next/link';
import { FaYoutube } from 'react-icons/fa';
import AuthButton from './AuthButton';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 text-primary">
            <FaYoutube className="h-8 w-8" />
            <span className="font-bold text-xl">YouTube Analytics</span>
          </Link>
          
          <nav className="hidden md:flex space-x-10">
            <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-primary">
              Home
            </Link>
            <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary">
              Dashboard
            </Link>
            <Link href="/search" className="text-gray-600 dark:text-gray-300 hover:text-primary">
              Search
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
} 