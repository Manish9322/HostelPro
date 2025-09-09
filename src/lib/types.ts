

export type Student = {
  _id: string;
  id: string;
  name: string;
  studentId: string;
  password?: string;
  roomNumber: string;
  course: string;
  year: number;
  email: string;
  phone: string;
  avatar: string;
  dob?: string;
  gender?: string;
  address?: string;
  guardianName?: string;
  guardianPhone?: string;
};

export type Complaint = {
  _id: string;
  id: string;
  studentId: string;
  studentName: string;
  submittedAt: Date;
  complaintSubject: string;
  complaintText: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  category: 'Maintenance' | 'Noise' | 'Safety' | 'Harassment' | 'Other' | 'Uncategorized';
  urgency: 'High' | 'Medium' | 'Low' | 'Unknown';
  summary: string;
};

export type Application = {
  _id: string;
  id: string;
  name: string;
  studentId: string;
  course: string;
  year: number;
  email: string;
  phone: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: Date;
  profilePhoto?: string;
  studentIdCard?: string;
  roommatePreferences?: {
    sleepSchedule?: 'early-bird' | 'night-owl';
    studyHabits?: 'in-room' | 'library' | 'flexible';
    socialHabits?: 'introvert' | 'extrovert' | 'ambivert';
  }
};

export type Notice = {
  _id: string;
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: Date;
  category: 'Maintenance' | 'Event' | 'General' | 'Urgent';
  featured?: boolean;
};

export type BoardMember = {
  _id: string;
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  joinedAt: Date;
  avatar: string;
};

export type Room = {
  _id: string;
  id: string;
  roomNumber: string;
  capacity: number;
  occupancy: number;
  status: 'Available' | 'Occupied' | 'Under Maintenance';
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  utilities: string[];
};

export type FeePayment = {
    _id: string;
    id: string;
    studentName: string;
    studentId: string;
    month: string;
    amount: number;
    dueDate: Date;
    status: 'Paid' | 'Pending' | 'Overdue';
};

export type InventoryItem = {
    _id: string;
    id: string;
    name: string;
    category: 'Furniture' | 'Appliance' | 'Gym Equipment' | 'Safety' | 'Other';
    location: string;
    condition: 'New' | 'Good' | 'Used' | 'Damaged';
    status: 'In Stock' | 'In Use' | 'Under Repair';
};

export type ReportData = {
    title: string;
    headers: string[];
    rows: (string | number)[][];
};
