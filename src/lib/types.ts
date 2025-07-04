export type Student = {
  id: string;
  name: string;
  studentId: string;
  roomNumber: string;
  course: string;
  year: number;
  email: string;
  phone: string;
  avatar: string;
};

export type Complaint = {
  id: string;
  submittedAt: Date;
  complaintText: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  category: 'Maintenance' | 'Noise' | 'Safety' | 'Harassment' | 'Other' | 'Uncategorized';
  urgency: 'High' | 'Medium' | 'Low' | 'Unknown';
  summary: string;
};

export type Application = {
  id: string;
  name: string;
  studentId: string;
  course: string;
  year: number;
  email: string;
  phone: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: Date;
};

export type Notice = {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: Date;
  category: 'Maintenance' | 'Event' | 'General' | 'Urgent';
  featured?: boolean;
};

export type BoardMember = {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  joinedAt: Date;
  avatar: string;
};

export type Room = {
  id: string;
  roomNumber: string;
  capacity: number;
  occupancy: number;
  status: 'Available' | 'Occupied' | 'Under Maintenance';
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  utilities: string[];
};
