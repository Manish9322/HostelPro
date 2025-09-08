
"use client";

import { useState, useEffect } from "react";
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
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Trash2, AlertTriangle, RefreshCw, Pen, ArrowUp, ArrowDown, X, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface SettingsData {
  _id: string;
  roomConditions: string[];
  roomUtilities: string[];
  inventoryCategories: string[];
  inventoryConditions: string[];
  inventoryStatus: string[];
  complaintCategories: string[];
  noticeCategories: string[];
  [key: string]: any; 
}

const SettingsSection = ({ 
    title, 
    description, 
    items,
    categoryKey,
    onUpdate,
    loading
}: { 
    title: string, 
    description: string, 
    items: string[],
    categoryKey: keyof Omit<SettingsData, '_id'>,
    onUpdate: (categoryKey: keyof Omit<SettingsData, '_id'>, newItems: string[]) => void,
    loading: boolean
}) => {
    const [newItem, setNewItem] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingValue, setEditingValue] = useState("");

    const handleAdd = () => {
        if (newItem.trim() && !items.includes(newItem.trim())) {
            const updatedItems = [...items, newItem.trim()];
            onUpdate(categoryKey, updatedItems);
            setNewItem("");
        }
    };

    const handleDelete = (itemToDelete: string) => {
        const updatedItems = items.filter(item => item !== itemToDelete);
        onUpdate(categoryKey, updatedItems);
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newItems = [...items];
        const item = newItems[index];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        newItems.splice(index, 1);
        newItems.splice(swapIndex, 0, item);
        onUpdate(categoryKey, newItems);
    };

    const startEditing = (index: number, value: string) => {
        setEditingIndex(index);
        setEditingValue(value);
    };

    const cancelEditing = () => {
        setEditingIndex(null);
        setEditingValue("");
    };

    const saveEdit = (index: number) => {
        if(editingValue.trim()){
            const newItems = [...items];
            newItems[index] = editingValue.trim();
            onUpdate(categoryKey, newItems);
            cancelEditing();
        }
    };

    return (
        <Card>
            <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="flex gap-2 mb-4">
                <Input 
                    placeholder={`Add new ${title.slice(0, -1).toLowerCase()}...`}
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)} 
                    disabled={loading}
                />
                <Button size="icon" onClick={handleAdd} disabled={loading || !newItem.trim()}>
                    <PlusCircle className="h-4 w-4" />
                </Button>
            </div>
            <div className="rounded-md border">
                <Table>
                <TableBody>
                    {loading ? Array.from({length: 3}).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-3/4"/></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto"/></TableCell>
                        </TableRow>
                    )) : items.length > 0 ? items.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium align-middle">
                          {editingIndex === index ? (
                            <div className="flex gap-2 items-center">
                              <Input 
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                className="h-8"
                                autoFocus
                              />
                            </div>
                          ) : (
                            item
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {editingIndex === index ? (
                            <div className="flex justify-end gap-1">
                               <Button variant="ghost" size="icon" onClick={() => saveEdit(index)} disabled={loading}>
                                  <Check className="h-4 w-4 text-green-600" />
                               </Button>
                               <Button variant="ghost" size="icon" onClick={cancelEditing} disabled={loading}>
                                  <X className="h-4 w-4 text-destructive" />
                               </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => handleMove(index, 'up')} disabled={index === 0 || loading}>
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleMove(index, 'down')} disabled={index === items.length - 1 || loading}>
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => startEditing(index, item)} disabled={loading}>
                                <Pen className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(item)} disabled={loading}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                    </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell className="text-center text-muted-foreground py-4">No items yet.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
            </CardContent>
        </Card>
    );
};

export default function SettingsPage() {
    const [settings, setSettings] = useState<SettingsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchSettings = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/settings');
            if (!response.ok) throw new Error("Failed to fetch settings");
            const data = await response.json();
            setSettings(data);
        } catch (error) {
            setError("Failed to load settings. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchSettings();
    }, []);

    const handleUpdateSettings = async (categoryKey: keyof Omit<SettingsData, '_id'>, newItems: string[]) => {
        if (!settings) return;
        
        const originalItems = settings[categoryKey];
        
        // Optimistic UI update
        setSettings(prev => prev ? { ...prev, [categoryKey]: newItems } : null);

        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [categoryKey]: newItems }),
            });
            if (!response.ok) throw new Error("Failed to update settings");
            toast({ title: "Success", description: "Settings updated successfully." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to update settings.", variant: "destructive" });
            // Revert on failure
            setSettings(prev => prev ? { ...prev, [categoryKey]: originalItems } : null);
        }
    };


  const settingSections = [
    { key: 'roomConditions', title: 'Room Conditions', description: 'Manage the condition options for rooms (e.g., Excellent, Good).' },
    { key: 'roomUtilities', title: 'Room Utilities', description: 'Manage the available utilities for rooms (e.g., AC, Wi-Fi).' },
    { key: 'inventoryCategories', title: 'Inventory Categories', description: 'Manage categories for inventory items.' },
    { key: 'inventoryConditions', title: 'Inventory Conditions', description: 'Manage condition options for inventory items.' },
    { key: 'complaintCategories', title: 'Complaint Categories', description: 'Manage categories for student complaints.' },
    { key: 'noticeCategories', title: 'Notice Categories', description: 'Manage categories for public notices.' },
  ] as const;

  if (error) {
     return (
        <div className="text-center py-16">
            <div className="flex flex-col items-center gap-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
            <h3 className="text-xl font-semibold">Error Loading Settings</h3>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={fetchSettings} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
            </Button>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage application-wide options and categories.</p>
      </div>
      <Separator />

      <div className="grid gap-8 grid-cols-1 xl:grid-cols-2">
         {settingSections.map(section => (
            <SettingsSection 
                key={section.key}
                title={section.title} 
                description={section.description}
                items={settings ? settings[section.key] : []}
                categoryKey={section.key}
                onUpdate={handleUpdateSettings}
                loading={loading}
            />
         ))}
      </div>
    </div>
  );
}
