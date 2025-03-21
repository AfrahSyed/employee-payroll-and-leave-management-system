import React, { useState } from 'react';

import { CheckCircle, XCircle, Settings, History, FileText, Calculator, Clock, Sliders } from 'lucide-react';
import type { LeaveRequest } from '../types';

const ManagerDashboard = () => {
  // Mock data for pending leave requests
  const pendingRequests: LeaveRequest[] = [
    {
      id: '1',
      employeeId: '101',
      employeeName: 'John Doe',
      type: 'annual',
      startDate: '2024-03-20',
      endDate: '2024-03-22',
      status: 'pending',
      reason: 'Family vacation',
    },
    {
      id: '2',
      employeeId: '102',
      employeeName: 'Jane Smith',
      type: 'sick',
      startDate: '2024-03-25',
      endDate: '2024-03-26',
      status: 'pending',
      reason: 'Medical appointment',
    },
  ];

  // Mock data for leave history
  const leaveHistory = [
    {
      employeeName: 'John Doe',
      type: 'annual',
      startDate: '2023-12-15',
      endDate: '2023-12-20',
    },
    {
      employeeName: 'Jane Smith',
      type: 'casual',
      startDate: '2023-11-10',
      endDate: '2023-11-11',
    },
  ];

  // Mock leave policy settings
  const [leaveLimits, setLeaveLimits] = useState({
    annual: 20,
    sick: 10,
    casual: 5,
  });

  const handleApprove = (id: string) => {
    console.log('Approved request:', id);
  };
  const [salaryStructures, setSalaryStructures] = useState({
    'Software Engineer': 5000,
    'Project Manager': 5500,
    'HR Manager': 4800,
  });

  const updateSalaryStructure = (role: string, newSalary: number) => {
    setSalaryStructures({ ...salaryStructures, [role]: newSalary });
  };
  const handleReject = (id: string) => {
    console.log('Rejected request:', id);
  };
  const [payroll, setPayroll] = useState([
    { employeeName: 'John Doe', baseSalary: 5000, overtime: 200, deductions: 300, netSalary: 4900 },
    { employeeName: 'Jane Smith', baseSalary: 5500, overtime: 150, deductions: 350, netSalary: 5300 },
  ]);

  const processPayroll = () => {
    console.log('Payroll processed for employees.');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manager Dashboard</h1>
      
      {/* Pending Leave Requests Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Pending Leave Requests</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {pendingRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{request.employeeName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white capitalize">{request.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{request.startDate} to {request.endDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{request.reason}</td>
                    <td className="px-6 py-4 text-sm font-medium flex space-x-2">
                      <button onClick={() => handleApprove(request.id)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleReject(request.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        <XCircle className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Leave History Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <History className="h-5 w-5 mr-2" /> Leave History
        </h2>
        <ul>
          {leaveHistory.map((history, index) => (
            <li key={index} className="text-gray-900 dark:text-white">
              {history.employeeName} took {history.type} leave from {history.startDate} to {history.endDate}
            </li>
          ))}
        </ul>
      </div>

      {/* Leave Policy Configuration Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2" /> Configure Leave Policies
        </h2>
        <div className="space-y-4">
          {Object.entries(leaveLimits).map(([type, limit]) => (
            <div key={type} className="flex justify-between">
              <span className="capitalize text-gray-900 dark:text-white">{type} Leave Limit</span>
              <input
                type="number"
                value={limit}
                onChange={(e) => setLeaveLimits({ ...leaveLimits, [type]: parseInt(e.target.value) })}
                className="w-20 p-1 border rounded-md text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700"
              />
            </div>
          ))}
        </div>
      </div>
       {/* Payroll Processing Section */}
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Calculator className="h-5 w-5 mr-2" /> Process Monthly Payroll
        </h2>
        <button onClick={processPayroll} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Run Payroll
        </button>
      </div>
 {/* Salary Structure Management */}
 <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Sliders className="h-5 w-5 mr-2" /> Manage Salary Structures
        </h2>
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Base Salary</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(salaryStructures).map(([role, salary]) => (
              <tr key={role}>
                <td className="px-4 py-2 border text-gray-900 dark:text-white">{role}</td>
                <td className="px-4 py-2 border text-gray-900 dark:text-white">${salary}</td>
                <td className="px-4 py-2 border">
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => updateSalaryStructure(role, parseInt(e.target.value))}
                    className="w-20 p-1 border rounded-md text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Payroll Report Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2" /> Payroll Report
        </h2>
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="px-4 py-2 border">Employee</th>
              <th className="px-4 py-2 border">Base Salary</th>
              <th className="px-4 py-2 border">Overtime</th>
              <th className="px-4 py-2 border">Deductions</th>
              <th className="px-4 py-2 border">Net Salary</th>
            </tr>
          </thead>
          <tbody>
            {payroll.map((record, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border text-gray-900 dark:text-white">{record.employeeName}</td>
                <td className="px-4 py-2 border text-gray-900 dark:text-white">${record.baseSalary}</td>
                <td className="px-4 py-2 border text-gray-900 dark:text-white">${record.overtime}</td>
                <td className="px-4 py-2 border text-gray-900 dark:text-white">-${record.deductions}</td>
                <td className="px-4 py-2 border text-gray-900 dark:text-white">${record.netSalary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerDashboard;
