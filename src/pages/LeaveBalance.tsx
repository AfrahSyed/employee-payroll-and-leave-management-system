import React from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import type { LeaveBalance as LeaveBalanceType } from '../types';

const LeaveBalance = () => {
  // Mock data
  const leaveBalances: LeaveBalanceType[] = [
    {
      type: 'annual',
      total: 20,
      used: 5,
      remaining: 15,
    },
    {
      type: 'sick',
      total: 10,
      used: 2,
      remaining: 8,
    },
    {
      type: 'casual',
      total: 5,
      used: 1,
      remaining: 4,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'annual':
        return <Calendar className="h-6 w-6" />;
      case 'sick':
        return <AlertCircle className="h-6 w-6" />;
      default:
        return <Clock className="h-6 w-6" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Leave Balance</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leaveBalances.map((balance) => (
          <div
            key={balance.type}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold capitalize text-gray-900 dark:text-white">
                {balance.type} Leave
              </h3>
              <div className="text-primary-500">
                {getIcon(balance.type)}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {balance.total} days
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Used</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {balance.used} days
                </span>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Remaining
                  </span>
                  <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                    {balance.remaining} days
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveBalance;