import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Box } from "lucide-react";

export default function InventoryPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory & Asset Management</CardTitle>
        <CardDescription>
          Track hostel assets, from room furniture to gym equipment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64 border-2 border-dashed rounded-lg">
            <Box className="w-16 h-16 mb-4" />
            <h3 className="text-lg font-semibold">Inventory Module</h3>
            <p>This section is under construction. Functionality to manage assets will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
