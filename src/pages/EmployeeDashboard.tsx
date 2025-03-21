import React from 'react';
import { Calendar, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmployeeDashboard = () => {
  // Mock data
  const leaveBalance = {
    annual: { total: 20, used: 5, remaining: 15 },
    sick: { total: 10, used: 2, remaining: 8 },
    casual: { total: 5, used: 1, remaining: 4 },
  };

  const payrollSummary = {
    baseSalary: 5000,
    bonuses: 500,
    deductions: 300,
    netSalary: 5200,
    lastUpdated: 'March 2025',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employee Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(leaveBalance).map(([type, data]) => (
          <div key={type} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold capitalize text-gray-900 dark:text-white">
                {type} Leave
              </h3>
              {type === 'annual' ? (
                <Calendar className="h-6 w-6 text-primary-500" />
              ) : (
                <Clock className="h-6 w-6 text-primary-500" />
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total: {data.total} days
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Used: {data.used} days
              </p>
              <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                Remaining: {data.remaining} days
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Payroll Summary Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Payroll Summary</h2>
          <DollarSign className="h-6 w-6 text-primary-500" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Base Salary: ${payrollSummary.baseSalary}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Bonuses: +${payrollSummary.bonuses}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Deductions: -${payrollSummary.deductions}</p>
        <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">Net Salary: ${payrollSummary.netSalary}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Last Updated: {payrollSummary.lastUpdated}</p>
      </div>

      {/* Leave Application Link */}
      <div className="mt-6 text-center">
        <Link to="/leave-application" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Apply for Leave
        </Link>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
