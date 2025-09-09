
import _db from "@/utils/db";
import RoomModel from "@/models/room.model";
import StudentModel from "@/models/student.model";
import ApplicationModel from "@/models/application.model";
import { NextResponse } from "next/server";

export async function POST(request) {
  await _db();
  const { priority, matchGender, matchPreferences } = await request.json();

  try {
    let unallocatedStudents = await StudentModel.find({ roomNumber: 'Unassigned' }).lean();
    
    // Fetch corresponding applications
    const studentIds = unallocatedStudents.map(s => s.studentId);
    const applications = await ApplicationModel.find({ studentId: { $in: studentIds } }).lean();
    const applicationMap = new Map(applications.map(app => [app.studentId, app]));

    // Augment students with application data
    unallocatedStudents = unallocatedStudents.map(student => ({
      ...student,
      application: applicationMap.get(student.studentId) || {},
    }));
    
    // Sort students based on priority
    if (priority === 'application-date') {
      unallocatedStudents.sort((a, b) => new Date(a.application.submittedAt) - new Date(b.application.submittedAt));
    } else if (priority === 'year-of-study') {
      unallocatedStudents.sort((a, b) => b.year - a.year);
    }
    
    const availableRooms = await RoomModel.find({ status: 'Available' });

    let allocatedCount = 0;
    let waitingListCount = 0;

    for (const student of unallocatedStudents) {
      let assigned = false;
      for (const room of availableRooms) {
        const occupants = await StudentModel.find({ roomNumber: room.roomNumber });
        if (occupants.length < room.capacity) {
          
          let canAssign = true;
          // Check gender constraint
          if (matchGender && occupants.length > 0) {
            if (occupants[0].gender !== student.gender) {
              canAssign = false;
            }
          }
          
          if(canAssign) {
            await StudentModel.findByIdAndUpdate(student._id, { $set: { roomNumber: room.roomNumber }});
            
            const newOccupancy = occupants.length + 1;
            room.occupancy = newOccupancy;
            if (newOccupancy >= room.capacity) {
              room.status = 'Occupied';
            }
            await room.save();
            
            allocatedCount++;
            assigned = true;
            break; 
          }
        }
      }
      if (!assigned) {
        waitingListCount++;
      }
    }
    return NextResponse.json({ 
      message: 'Allocation complete', 
      allocatedCount,
      waitingListCount,
    });
  } catch (error) {
    console.error('Allocation Error:', error);
    return NextResponse.json({ error: 'Failed to run allocation process', details: error.message }, { status: 500 });
  }
}
