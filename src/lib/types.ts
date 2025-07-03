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
};
