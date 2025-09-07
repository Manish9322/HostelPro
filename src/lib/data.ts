
import type { Student, Complaint, Application, Notice, BoardMember, Room, FeePayment, InventoryItem } from './types';

export const mockStudents: Student[] = [
  { id: '1', name: 'Alice Johnson', studentId: 'STU001', roomNumber: 'A-101', course: 'Computer Science', year: 3, email: 'alice@example.com', phone: '123-456-7890', avatar: 'https://placehold.co/40x40.png' },
  { id: '2', name: 'Bob Williams', studentId: 'STU002', roomNumber: 'A-102', course: 'Mechanical Engineering', year: 2, email: 'bob@example.com', phone: '123-456-7891', avatar: 'https://placehold.co/40x40.png' },
  { id: '3', name: 'Charlie Brown', studentId: 'STU003', roomNumber: 'B-205', course: 'Physics', year: 4, email: 'charlie@example.com', phone: '123-456-7892', avatar: 'https://placehold.co/40x40.png' },
  { id: '4', name: 'Diana Prince', studentId: 'STU004', roomNumber: 'C-301', course: 'History', year: 1, email: 'diana@example.com', phone: '123-456-7893', avatar: 'https://placehold.co/40x40.png' },
  { id: '5', name: 'Ethan Hunt', studentId: 'STU005', roomNumber: 'B-201', course: 'Chemistry', year: 2, email: 'ethan@example.com', phone: '123-456-7894', avatar: 'https://placehold.co/40x40.png' },
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
  { id: '1', name: 'Frank Castle', studentId: 'APP001', course: 'Law', year: 1, email: 'frank@example.com', phone: '234-567-8901', status: 'Approved', submittedAt: new Date('2024-04-15T10:00:00Z'), roommatePreferences: { sleepSchedule: 'night-owl', studyHabits: 'library', socialHabits: 'introvert' } },
  { id: '2', name: 'Gwen Stacy', studentId: 'APP002', course: 'Biotechnology', year: 1, email: 'gwen@example.com', phone: '234-567-8902', status: 'Pending', submittedAt: new Date('2024-05-10T11:30:00Z'), roommatePreferences: { sleepSchedule: 'early-bird', studyHabits: 'in-room', socialHabits: 'ambivert' } },
  { id: '3', name: 'Hank Pym', studentId: 'APP003', course: 'Robotics', year: 1, email: 'hank@example.com', phone: '234-567-8903', status: 'Rejected', submittedAt: new Date('2024-05-01T09:00:00Z') },
  { id: '4', name: 'Ivy Pepper', studentId: 'APP004', course: 'Botany', year: 1, email: 'ivy@example.com', phone: '234-567-8904', status: 'Pending', submittedAt: new Date('2024-05-20T16:00:00Z') },
];

export const mockNotices: Notice[] = [
    { id: '1', title: 'Hostel Maintenance Schedule', content: 'The annual hostel maintenance will take place from June 1st to June 5th. Please expect some noise and disturbances during this period. We apologize for any inconvenience.', author: 'Admin', publishedAt: new Date('2024-05-28T09:00:00Z'), category: 'Maintenance', featured: true },
    { id: '2', title: 'Upcoming Holiday: Hostel Office Closed', content: 'The hostel office will be closed on May 25th for a national holiday. For emergencies, please contact the security desk.', author: 'Admin', publishedAt: new Date('2024-05-20T11:00:00Z'), category: 'General' },
    { id: '3', title: 'Reminder: Keep Common Areas Clean', content: 'This is a friendly reminder to all residents to help keep the common areas clean and tidy. Please dispose of your trash properly and clean up after using the kitchen facilities.', author: 'Warden', publishedAt: new Date('2024-05-22T15:00:00Z'), category: 'General' },
    { id: '4', title: 'Movie Night in Common Room!', content: 'Join us for a movie night this Friday at 8 PM in the main common room. Popcorn and drinks will be provided. We will be watching a blockbuster hit!', author: 'Student Council', publishedAt: new Date('2024-05-26T18:00:00Z'), category: 'Event' },
    { id: '5', title: 'Urgent: Water Supply Disruption', content: 'Due to an emergency repair, the water supply to all floors will be temporarily suspended on May 27th from 10 AM to 1 PM. Please store water in advance.', author: 'Admin', publishedAt: new Date('2024-05-26T10:00:00Z'), category: 'Urgent' },
    { id: '6', title: 'Fire Drill Announcement', content: 'A mandatory fire drill will be conducted on Wednesday, May 29th at 3 PM. All residents are required to participate and follow the instructions of the safety officers.', author: 'Warden', publishedAt: new Date('2024-05-24T14:00:00Z'), category: 'Maintenance' },
    { id: '7', title: 'Guest Speaker: Career in Tech', content: 'We are excited to host a guest speaker from a leading tech company on June 2nd. The session will cover career opportunities and resume building tips. Venue: Conference Hall.', author: 'Student Council', publishedAt: new Date('2024-05-23T12:00:00Z'), category: 'Event' },
];

export const mockBoardMembers: BoardMember[] = [
  { id: 'bm1', name: 'Dr. Evelyn Reed', position: 'Chairperson', email: 'e.reed@hostelpro.com', phone: '555-0101', joinedAt: new Date('2020-01-15'), avatar: 'https://placehold.co/40x40.png' },
  { id: 'bm2', name: 'Mr. Samuel Chen', position: 'Treasurer', email: 's.chen@hostelpro.com', phone: '555-0102', joinedAt: new Date('2021-06-01'), avatar: 'https://placehold.co/40x40.png' },
  { id: 'bm3', name: 'Ms. Olivia Garcia', position: 'Secretary', email: 'o.garcia@hostelpro.com', phone: '555-0103', joinedAt: new Date('2022-03-10'), avatar: 'https://placehold.co/40x40.png' },
  { id: 'bm4', name: 'Prof. Benjamin Carter', position: 'Member', email: 'b.carter@hostelpro.com', phone: '555-0104', joinedAt: new Date('2023-08-20'), avatar: 'https://placehold.co/40x40.png' },
];

export const mockRooms: Room[] = [
  { id: 'r1', roomNumber: 'A-101', capacity: 1, occupancy: 1, status: 'Occupied', condition: 'Excellent', utilities: ['AC', 'Wi-Fi', 'Attached Bathroom'] },
  { id: 'r2', roomNumber: 'A-102', capacity: 1, occupancy: 1, status: 'Occupied', condition: 'Good', utilities: ['AC', 'Wi-Fi', 'Attached Bathroom'] },
  { id: 'r3', roomNumber: 'A-103', capacity: 1, occupancy: 0, status: 'Available', condition: 'Excellent', utilities: ['AC', 'Wi-Fi', 'Attached Bathroom'] },
  { id: 'r4', roomNumber: 'B-201', capacity: 2, occupancy: 1, status: 'Occupied', condition: 'Good', utilities: ['Wi-Fi', 'Common Bathroom'] },
  { id: 'r5', roomNumber: 'B-205', capacity: 2, occupancy: 1, status: 'Occupied', condition: 'Fair', utilities: ['Wi-Fi', 'Common Bathroom'] },
  { id: 'r6', roomNumber: 'C-301', capacity: 2, occupancy: 2, status: 'Occupied', condition: 'Excellent', utilities: ['Wi-Fi', 'AC', 'Common Bathroom'] },
  { id: 'r7', roomNumber: 'C-302', capacity: 2, occupancy: 0, status: 'Under Maintenance', condition: 'Poor', utilities: ['Wi-Fi', 'AC', 'Common Bathroom'] },
];

export const mockFeePayments: FeePayment[] = [
  { id: 'fee1', studentName: 'Alice Johnson', studentId: 'STU001', month: 'May 2024', amount: 500, dueDate: new Date('2024-05-05'), status: 'Paid' },
  { id: 'fee2', studentName: 'Bob Williams', studentId: 'STU002', month: 'May 2024', amount: 450, dueDate: new Date('2024-05-05'), status: 'Paid' },
  { id: 'fee3', studentName: 'Charlie Brown', studentId: 'STU003', month: 'May 2024', amount: 450, dueDate: new Date('2024-05-05'), status: 'Overdue' },
  { id: 'fee4', studentName: 'Diana Prince', studentId: 'STU004', month: 'May 2024', amount: 450, dueDate: new Date('2024-05-05'), status: 'Paid' },
  { id: 'fee5', studentName: 'Ethan Hunt', studentId: 'STU005', month: 'May 2024', amount: 450, dueDate: new Date('2024-05-05'), status: 'Pending' },
];

export const mockInventory: InventoryItem[] = [
  { id: 'inv1', name: 'Desk Chair', category: 'Furniture', location: 'A-101', condition: 'Good', status: 'In Use' },
  { id: 'inv2', name: 'Microwave', category: 'Appliance', location: 'Common Kitchen', condition: 'New', status: 'In Stock' },
  { id: 'inv3', name: 'Bed Frame', category: 'Furniture', location: 'C-302', condition: 'Damaged', status: 'Under Repair' },
  { id: 'inv4', name: 'Treadmill', category: 'Gym Equipment', location: 'Gymnasium', condition: 'Good', status: 'In Use' },
  { id: 'inv5', name: 'Fire Extinguisher', category: 'Safety', location: 'Hallway B', condition: 'Good', status: 'In Use' },
  { id: 'inv6', name: 'Mattress', category: 'Furniture', location: 'Storage', condition: 'New', status: 'In Stock' },
];
