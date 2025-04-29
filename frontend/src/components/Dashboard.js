import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaveService } from '../services/leaveService';
import { userService } from '../services/userService';
import { authService } from '../services/authService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [newLeave, setNewLeave] = useState({
    start_date: '',
    end_date: '',
    reason: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
          navigate('/login');
          return;
        }

        const userDetails = await userService.getUserDetails(storedUser.id);
        setUser(userDetails);

        if (userDetails.role === 'employee') {
          const balance = await leaveService.getLeaveBalance(userDetails.id);
          setLeaveBalance(balance);
        }

        const applications = await leaveService.getLeaveApplications();
        setLeaveApplications(applications);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      }
    };

    loadUserData();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await leaveService.applyLeave({
        ...newLeave,
        employee_id: user.id,
        status: 'pending'
      });
      setNewLeave({ start_date: '', end_date: '', reason: '' });
      // Refresh leave applications
      const applications = await leaveService.getLeaveApplications();
      setLeaveApplications(applications);
    } catch (err) {
      setError(err.message || 'Failed to submit leave application');
    }
  };

  const handleStatusUpdate = async (leaveId, status) => {
    try {
      await leaveService.updateLeaveStatus(leaveId, status);
      // Refresh leave applications
      const applications = await leaveService.getLeaveApplications();
      setLeaveApplications(applications);
    } catch (err) {
      setError(err.message || 'Failed to update leave status');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Leave Management System</h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {user.role === 'employee' && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Leave Balance</h2>
            {leaveBalance && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-100 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Available Leaves</p>
                  <p className="text-2xl font-bold">{leaveBalance.available_leaves}</p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg">
                  <p className="text-sm text-red-600">Used Leaves</p>
                  <p className="text-2xl font-bold">{leaveBalance.used_leaves}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">
            {user.role === 'employee' ? 'Apply for Leave' : 'Manage Leave Applications'}
          </h2>

          {user.role === 'employee' && (
            <form onSubmit={handleLeaveSubmit} className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={newLeave.start_date}
                    onChange={(e) => setNewLeave({ ...newLeave, start_date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={newLeave.end_date}
                    onChange={(e) => setNewLeave({ ...newLeave, end_date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reason</label>
                <textarea
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  rows="3"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Submit Leave Application
              </button>
            </form>
          )}

          <h3 className="text-lg font-medium mb-4">Leave Applications</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {user.role === 'manager' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveApplications.map((application) => (
                  <tr key={application.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {application.employee_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {application.start_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {application.end_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        application.status === 'approved' ? 'bg-green-100 text-green-800' :
                        application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.status}
                      </span>
                    </td>
                    {user.role === 'manager' && application.status === 'pending' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleStatusUpdate(application.id, 'approved')}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(application.id, 'rejected')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 