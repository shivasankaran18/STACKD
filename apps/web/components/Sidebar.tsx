'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home,
  GitFork,
  Github,
  ChevronFirst,
  ChevronLast,
  FolderGit2,
  Menu
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { icon: Home, label: "Home", href: "/home" },
    { icon: FolderGit2, label: "Local Repositories", href: "/local-repos" },
    { icon: GitFork, label: "Remote Repositories", href: "/commit" },
    { icon: Github, label: "GitHub Summary", href: "/user" },
  ];

  return (
      <motion.div
        animate={{ width: isOpen ? 280 : 72 }}
        transition={{ duration: 0.3 }}
        className="relative text-neutral-400 h-screen bg-[#1e1e1e] border-r-4 border-cyan-800"
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          {isOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg font-semibold text-neutral-200"
            >
              Dashboard
            </motion.span>
          )}
          <button
            onClick={toggleSidebar}
            className="absolute right-2 p-2 hover:bg-cyan-800 rounded-lg transition-colors"
          >
            {isOpen ? (
              <ChevronFirst className="h-5 w-5" />
            ) : (
              <ChevronLast className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="space-y-1 py-4">
        {menuItems.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ x: 4 }}
            className={`flex items-center cursor-pointer
              ${isOpen ? 'px-4' : 'justify-center px-2'}
              py-3 mx-2 rounded-lg hover:bg-neutral-800 hover:text-cyan-500
              transition-colors group relative`}
            onClick={() => router.push(item.href)}
          >
            <item.icon className="h-5 w-5 min-w-[20px]" />
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="ml-4 text-sm"
              >
                {item.label}
              </motion.span>
            )}
            {!isOpen && (
              <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-neutral-900 text-neutral-200 text-sm
                invisible opacity-0 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
                {item.label}
              </div>
            )}
          </motion.div>
        ))}
      </div>

        
      <div className="absolute bottom-0 w-full border-t border-neutral-800 p-4">
        <div className={`flex items-center ${isOpen ? '' : 'justify-center'}`}>
          <Menu className="h-5 w-5 min-w-[20px]" />
          {isOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="ml-4 text-sm"
            >
              Toggle Menu
            </motion.span>
          )}
        </div>
      </div>
      </motion.div>
  );
};