
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Mock data - in a real app, this would come from a database
const settingsData = {
  roomConditions: ["Excellent", "Good", "Fair", "Poor"],
  roomUtilities: ["AC", "Wi-Fi", "Attached Bathroom", "Common Bathroom"],
  inventoryCategories: ["Furniture", "Appliance", "Gym Equipment", "Safety", "Other"],
  inventoryConditions: ["New", "Good", "Used", "Damaged"],
  inventoryStatus: ["In Stock", "In Use", "Under Repair"],
  complaintCategories: ["Maintenance", "Noise", "Safety", "Harassment", "Other"],
  noticeCategories: ["General", "Maintenance", "Event", "Urgent"],
};

const SettingsSection = ({ title, description, items }: { title: string, description: string, items: string[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex gap-2 mb-4">
        <Input placeholder={`Add new ${title.slice(0, -1).toLowerCase()}...`} />
        <Button size="icon">
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
);

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage application-wide options and categories.</p>
      </div>
      <Separator />

      <div className="grid gap-8 grid-cols-1 xl:grid-cols-2">
         <SettingsSection 
            title="Room Conditions" 
            description="Manage the condition options for rooms (e.g., Excellent, Good)."
            items={settingsData.roomConditions}
        />
        <SettingsSection 
            title="Room Utilities" 
            description="Manage the available utilities for rooms (e.g., AC, Wi-Fi)."
            items={settingsData.roomUtilities}
        />
        <SettingsSection 
            title="Inventory Categories" 
            description="Manage categories for inventory items."
            items={settingsData.inventoryCategories}
        />
        <SettingsSection 
            title="Inventory Conditions" 
            description="Manage condition options for inventory items."
            items={settingsData.inventoryConditions}
        />
         <SettingsSection 
            title="Complaint Categories" 
            description="Manage categories for student complaints."
            items={settingsData.complaintCategories}
        />
         <SettingsSection 
            title="Notice Categories" 
            description="Manage categories for public notices."
            items={settingsData.noticeCategories}
        />
      </div>
    </div>
  );
}
