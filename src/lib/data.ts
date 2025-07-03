import type { Student, Complaint, Application, Notice } from './types';

export const mockStudents: Student[] = [
  { id: '1', name: 'Alice Johnson', studentId: 'STU001', roomNumber: 'A-101', course: 'Computer Science', year: 3, email: 'alice@example.com', phone: '123-456-7890', avatar: '/avatars/01.png' },
  { id: '2', name: 'Bob Williams', studentId: 'STU002', roomNumber: 'A-102', course: 'Mechanical Engineering', year: 2, email: 'bob@example.com', phone: '123-456-7891', avatar: '/avatars/02.png' },
  { id: '3', name: 'Charlie Brown', studentId: 'STU003', roomNumber: 'B-205', course: 'Physics', year: 4, email: 'charlie@example.com', phone: '123-456-7892', avatar: '/avatars/03.png' },
  { id: '4', name: 'Diana Prince', studentId: 'STU004', roomNumber: 'C-301', course: 'History', year: 1, email: 'diana@example.com', phone: '123-456-7893', avatar: '/avatars/04.png' },
  { id: '5', name: 'Ethan Hunt', studentId: 'STU005', roomNumber: 'B-201', course: 'Chemistry', year: 2, email: 'ethan@example.com', phone: '123-456-7894', avatar: '/avatars/05.png' },
];

export const mockComplaints: Complaint[] = [
  {
    id: '1',
    submittedAt: new Date('2024-05-20T10:00:00Z'),
    complaintText: 'The shower in my room is not working. The water is cold and there is no pressure.',
    status: 'Resolved',
    category: 'Maintenance',
    urgency: 'High',
    summary: 'Broken shower with no hot water.'
  },
  {
    id: '2',
    submittedAt: new Date('2024-05-21T14:30:00Z'),
    complaintText: 'My neighbors are playing loud music late at night, and I can\'t sleep.',
    status: 'In Progress',
    category: 'Noise',
    urgency: 'Medium',
    summary: 'Loud music from neighboring room at night.'
  },
  {
    id: '3',
    submittedAt: new Date('2024-05-22T09:00:00Z'),
    complaintText: 'The main entrance door lock is broken. Anyone can enter the hostel without a key.',
    status: 'Pending',
    category: 'Safety',
    urgency: 'High',
    summary: 'Broken main entrance door lock.'
  },
  {
    id: '4',
    submittedAt: new Date('2024-05-23T18:00:00Z'),
    complaintText: 'The Wi-Fi speed is extremely slow in the evenings, making it difficult to study.',
    status: 'Pending',
    category: 'Other',
    urgency: 'Low',
    summary: 'Slow Wi-Fi connectivity in the evenings.'
  },
];

export const mockApplications: Application[] = [
  { id: '1', name: 'Frank Castle', studentId: 'APP001', course: 'Law', year: 1, email: 'frank@example.com', phone: '234-567-8901', status: 'Approved', submittedAt: new Date('2024-04-15T10:00:00Z') },
  { id: '2', name: 'Gwen Stacy', studentId: 'APP002', course: 'Biotechnology', year: 1, email: 'gwen@example.com', phone: '234-567-8902', status: 'Pending', submittedAt: new Date('2024-05-10T11:30:00Z') },
  { id: '3', name: 'Hank Pym', studentId: 'APP003', course: 'Robotics', year: 1, email: 'hank@example.com', phone: '234-567-8903', status: 'Rejected', submittedAt: new Date('2024-05-01T09:00:00Z') },
  { id: '4', name: 'Ivy Pepper', studentId: 'APP004', course: 'Botany', year: 1, email: 'ivy@example.com', phone: '234-567-8904', status: 'Pending', submittedAt: new Date('2024-05-20T16:00:00Z') },
];

export const mockNotices: Notice[] = [
  { id: '1', title: 'Hostel Maintenance Schedule', content: 'The annual hostel maintenance will take place from June 1st to June 5th. Please expect some noise and disturbances during this period. We apologize for any inconvenience.', author: 'Admin', publishedAt: new Date('2024-05-15T09:00:00Z') },
  { id: '2', title: 'Upcoming Holiday: Hostel Office Closed', content: 'The hostel office will be closed on May 25th for a national holiday. For emergencies, please contact the security desk.', author: 'Admin', publishedAt: new Date('2024-05-20T11:00:00Z') },
  { id: '3', title: 'Reminder: Keep Common Areas Clean', content: 'This is a friendly reminder to all residents to help keep the common areas clean and tidy. Please dispose of your trash properly and clean up after using the kitchen facilities.', author: 'Warden', publishedAt: new Date('2024-05-22T15:00:00Z') },
];
