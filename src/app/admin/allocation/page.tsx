import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KeyRound } from "lucide-react";

export default function RoomAllocationPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Automated Room Allocation</CardTitle>
        <CardDescription>
          Assign rooms to students based on preferences and availability.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64 border-2 border-dashed rounded-lg">
            <KeyRound className="w-16 h-16 mb-4" />
            <h3 className="text-lg font-semibold">Room Allocation Module</h3>
            <p>This section is under construction. An automated allocation tool will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
