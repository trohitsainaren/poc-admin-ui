/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Fragment, useEffect, useRef, useState } from 'react';

import Cookies from 'js-cookie';

import { BrainCircuit, Bug, ChevronDown, DatabaseZap, LayoutDashboard, Users2 } from 'lucide-react';
import Admin from './Admin';
import BugReports from './BugReports';
import Users from './Users';
import Cache from './Cache';
const App = () => {
  const [selectedOption, setSelectedOption] = useState('Seed Questions'); // Default to "admin"
  const [isAuthorized, setIsAuthorized] = useState(false);


  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { key: 'admin', label: 'Seed Questions' ,icon: BrainCircuit},
    { key: 'users', label: 'Users', icon: Users2 },
    { key: 'cache', label: 'Cache',  icon: DatabaseZap },
    { key: 'bug_reports', label: 'Bugs', icon: Bug },
  ];
  const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref for dropdown menu
  const buttonRef = useRef<HTMLButtonElement | null>(null); // Ref for the button
  useEffect(() => {
    const isGenAiAdmin = Cookies.get('x-lacp-gen-ai-admin') || '';
    if (isGenAiAdmin !== 'true') {
      setIsAuthorized(true);
  // Faster redirection
    } else {
      setIsAuthorized(true); // Only allow rendering if authorized
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isAuthorized) {
    return null;
  }

  return (
    <>
 <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-gray-800 border-b-4 border-indigo-500 shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <LayoutDashboard className="w-8 h-8 text-indigo-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Admin Portal
            </h1>
          </div>
          
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Section Header with fancy border */}
        <div className="relative mb-12">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-between items-center">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pr-4">
              <h2 className="text-4xl font-extrabold from-gray-900 to-gray-700 dark:text-white">
                Manage
                <span className="block h-1 w-12 bg-indigo-500 mt-2"></span>
              </h2>
            </div>
            
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pl-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                ref={buttonRef}
                className="flex items-center space-x-3 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group"
              >
                <span className="text-gray-700 dark:text-gray-200 font-semibold">{selectedOption}</span>
                <ChevronDown className={`w-5 h-5 text-indigo-500 transition-transform duration-200 group-hover:text-indigo-600 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div  ref={dropdownRef} className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border-2 border-gray-600 z-50 overflow-hidden">
                  {options.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.key}
                        className="flex items-center w-full px-6 py-4 text-left hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700 last:border-0"
                        onClick={() => {
                          setSelectedOption(option.label);
                          setIsOpen(false);
                        }}
                      >
                        <Icon className="w-6 h-6 mr-4 text-indigo-500" />
                        <span className="text-gray-700 dark:text-gray-200 font-medium">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area with fancy border */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-15"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="grid">
              {selectedOption === 'Seed Questions' && (
                <div className="text-gray-600 dark:text-gray-300 min-h-[400px]">
                  <Admin />
                </div>
              )}
              {selectedOption === 'Users' && (
                <div className="text-gray-600 dark:text-gray-300 min-h-[400px]">
                    <Users />
                </div>
              )}
              {selectedOption === 'Cache' && (
                <div className="text-gray-600 dark:text-gray-300 min-h-[400px]">
                  <Cache />
                </div>
              )}
              {selectedOption === 'Bugs' && (
                <div className="text-gray-600 dark:text-gray-300 min-h-[400px]">
                  <BugReports />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default App;