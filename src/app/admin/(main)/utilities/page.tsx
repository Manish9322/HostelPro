
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, RefreshCw, PlusCircle, Trash2, Pen, X, Check } from "lucide-react";
import { useGetUtilitiesQuery, useAddUtilityMutation, useUpdateUtilityMutation, useDeleteUtilityMutation } from "@/store/api";

interface Utility {
    _id: string;
    name: string;
    price: number;
}

export default function UtilitiesPage() {
    const { data: utilities = [], error, isLoading, refetch } = useGetUtilitiesQuery();
    const [addUtility] = useAddUtilityMutation();
    const [updateUtility] = useUpdateUtilityMutation();
    const [deleteUtility] = useDeleteUtilityMutation();
    const { toast } = useToast();

    const [isAdding, setIsAdding] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [newItemPrice, setNewItemPrice] = useState("");

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");
    const [editingPrice, setEditingPrice] = useState("");

    const handleAdd = async () => {
        if (!newItemName.trim() || !newItemPrice.trim()) {
            toast({ title: "Error", description: "Name and price cannot be empty.", variant: "destructive" });
            return;
        }

        try {
            await addUtility({ name: newItemName, price: parseFloat(newItemPrice) }).unwrap();
            toast({ title: "Success", description: "Utility added successfully." });
            setNewItemName("");
            setNewItemPrice("");
            setIsAdding(false);
        } catch (error: any) {
            toast({ title: "Error", description: error.data?.error || 'Failed to add utility', variant: "destructive" });
        }
    };
    
    const startEditing = (utility: Utility) => {
        setEditingId(utility._id);
        setEditingName(utility.name);
        setEditingPrice(utility.price.toString());
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingName("");
        setEditingPrice("");
    };

    const saveEdit = async (id: string) => {
         if (!editingName.trim() || !editingPrice.trim()) {
            toast({ title: "Error", description: "Name and price cannot be empty.", variant: "destructive" });
            return;
        }

        try {
            await updateUtility({ id, body: { name: editingName, price: parseFloat(editingPrice) } }).unwrap();
            toast({ title: "Success", description: "Utility updated successfully." });
            cancelEditing();
        } catch (error: any) {
            toast({ title: "Error", description: error.data?.error || 'Failed to update utility', variant: "destructive" });
        }
    };
    
    const handleDelete = async (id: string) => {
        try {
            await deleteUtility(id).unwrap();
            toast({ title: "Success", description: "Utility deleted successfully." });
        } catch (error) {
             toast({ title: "Error", description: "Failed to delete utility", variant: "destructive" });
        }
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Room Utilities</CardTitle>
                <CardDescription>Add, edit, or remove utilities and their monthly costs. These will be available when managing rooms.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                        {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
                        <h3 className="mt-4 text-lg font-semibold">Error Loading Data</h3>
                        <p className="text-muted-foreground">Failed to load utilities. Please try again.</p>
                        <Button onClick={() => refetch()} variant="outline" className="mt-4">
                            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                        </Button>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Utility Name</TableHead>
                                <TableHead className="w-[150px]">Monthly Price</TableHead>
                                <TableHead className="w-[120px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {utilities.map((utility) => (
                                <TableRow key={utility._id}>
                                    <TableCell>
                                        {editingId === utility._id ? (
                                            <Input value={editingName} onChange={e => setEditingName(e.target.value)} className="h-8"/>
                                        ) : (
                                            utility.name
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingId === utility._id ? (
                                             <Input type="number" value={editingPrice} onChange={e => setEditingPrice(e.target.value)} className="h-8"/>
                                        ) : (
                                            `₹${utility.price.toFixed(2)}`
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                       {editingId === utility._id ? (
                                           <div className="flex justify-end gap-1">
                                               <Button variant="ghost" size="icon" onClick={() => saveEdit(utility._id)}><Check className="h-4 w-4 text-green-600"/></Button>
                                               <Button variant="ghost" size="icon" onClick={cancelEditing}><X className="h-4 w-4 text-destructive"/></Button>
                                           </div>
                                       ) : (
                                           <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="icon" onClick={() => startEditing(utility)}><Pen className="h-4 w-4"/></Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(utility._id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                           </div>
                                       )}
                                    </TableCell>
                                </TableRow>
                            ))}
                             {isAdding && (
                                <TableRow>
                                    <TableCell><Input placeholder="Utility Name" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} autoFocus/></TableCell>
                                    <TableCell><Input placeholder="Price" type="number" value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value)} /></TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" onClick={handleAdd}><Check className="h-4 w-4 text-green-600"/></Button>
                                            <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)}><X className="h-4 w-4 text-destructive"/></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
                 {!isAdding && !isLoading && (
                    <Button variant="outline" className="mt-4 w-full" onClick={() => setIsAdding(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Utility
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
