
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import { format } from "date-fns";
import type { Application } from "@/lib/types";

interface ViewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  onUpdateStatus: (id: string, status: "Approved" | "Rejected") => void;
}

const InfoField = ({ label, value }: { label: string, value: any }) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-medium">{value || 'N/A'}</p>
  </div>
);

const roommatePrefLabels = {
    sleepSchedule: {
        'early-bird': 'Early Bird',
        'night-owl': 'Night Owl'
    },
    studyHabits: {
        'in-room': 'Studies in room',
        'library': 'Prefers library',
        'flexible': 'Flexible'
    },
    socialHabits: {
        'introvert': 'Introverted',
        'extrovert': 'Extroverted',
        'ambivert': 'A bit of both'
    }
}


export function ViewApplicationModal({ isOpen, onClose, application, onUpdateStatus }: ViewApplicationModalProps) {
  if (!application) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
          <DialogDescription>
            Full details for applicant <span className="font-semibold text-primary">{application.name}</span>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6 max-h-[70vh] overflow-y-auto pr-4">
          {/* Personal & Academic Details */}
          <div>
            <h4 className="font-semibold mb-2 text-primary">Applicant Information</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <InfoField label="Full Name" value={application.name} />
              <InfoField label="Student ID" value={application.studentId} />
              <InfoField label="Course" value={application.course} />
              <InfoField label="Year of Study" value={application.year} />
              <InfoField label="Email" value={application.email} />
              <InfoField label="Phone" value={application.phone} />
            </div>
          </div>

          <Separator />

          {/* Application Status */}
          <div>
            <h4 className="font-semibold mb-2 text-primary">Application Status</h4>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <InfoField label="Status" value={application.status} />
                <InfoField label="Submitted On" value={format(new Date(application.submittedAt), 'PPP p')} />
            </div>
          </div>
          
          {application.roommatePreferences && (
            <>
              <Separator />
              {/* Roommate Preferences */}
              <div>
                <h4 className="font-semibold mb-2 text-primary">Roommate Preferences</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <InfoField label="Sleep Schedule" value={application.roommatePreferences.sleepSchedule ? roommatePrefLabels.sleepSchedule[application.roommatePreferences.sleepSchedule] : 'N/A'} />
                  <InfoField label="Study Habits" value={application.roommatePreferences.studyHabits ? roommatePrefLabels.studyHabits[application.roommatePreferences.studyHabits] : 'N/A'} />
                  <InfoField label="Social Habits" value={application.roommatePreferences.socialHabits ? roommatePrefLabels.socialHabits[application.roommatePreferences.socialHabits] : 'N/A'} />
                </div>
              </div>
            </>
          )}

        </div>

        <DialogFooter className="sm:justify-between pt-4 border-t">
            <div className="flex gap-2">
                <Button onClick={() => onUpdateStatus(application._id, 'Approved')} disabled={application.status === 'Approved'}>Approve</Button>
                <Button variant="destructive" onClick={() => onUpdateStatus(application._id, 'Rejected')} disabled={application.status === 'Rejected'}>Reject</Button>
            </div>
            <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
