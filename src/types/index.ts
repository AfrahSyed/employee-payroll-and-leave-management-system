export type User = {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'manager';
};

export type LeaveType = 'annual' | 'sick' | 'casual';

export type LeaveRequest = {
  id: string;
  employeeId: string;
  employeeName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
};

export type LeaveBalance = {
  type: LeaveType;
  total: number;
  used: number;
  remaining: number;
};