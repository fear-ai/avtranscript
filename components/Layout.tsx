import React, { ReactNode } from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-3xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              AVTran
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</Link>
              <Link href="/find" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Find</Link>
              <Link href="/#learn" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Learn</Link>
              <Link href="/#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer id="about" className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="text-2xl font-bold text-blue-400 mb-4">AVTran</div>
              <p className="text-gray-300 mb-4">
                Professional audio video transcription service directory • Data updated regularly • 
                Built with progressive enhancement for professional creators
              </p>
              <div className="flex space-x-4">
                <Link href="/#contact" className="text-gray-500 hover:text-blue-400 transition-colors">Contact</Link>
                <Link href="/#support" className="text-gray-500 hover:text-blue-400 transition-colors">Support</Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-300 hover:text-blue-400 transition-colors">Home</Link></li>
                <li><Link href="/find" className="text-gray-300 hover:text-blue-400 transition-colors">Find Services</Link></li>
                <li><Link href="/#learn" className="text-gray-300 hover:text-blue-400 transition-colors">Learn</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-gray-300 hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="text-center text-sm text-gray-400">
              <p>&copy; 2025 AVTran. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
