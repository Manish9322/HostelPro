
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Trash2, AlertTriangle, RefreshCw, Pen, ArrowUp, ArrowDown, X, Check, UploadCloud } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useGetSettingsQuery, useUpdateSettingsMutation, useGetGalleryImagesQuery, useAddGalleryImageMutation, useDeleteGalleryImageMutation } from "@/store/api";
import { GalleryImage } from "@/lib/types";

interface SettingsData {
  _id: string;
  roomConditions: string[];
  inventoryCategories: string[];
  inventoryConditions: string[];
  inventoryStatus: string[];
  complaintCategories: string[];
  noticeCategories: string[];
  boardMemberDesignations: string[];
  locationAddress: string;
  locationMapLink: string;
  [key: string]: any; 
}

const CategorySettingsSection = ({ 
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
    const { data: settings, error: settingsError, isLoading: settingsLoading, refetch: refetchSettings } = useGetSettingsQuery();
    const { data: galleryImages = [], error: galleryError, isLoading: galleryLoading, refetch: refetchGallery } = useGetGalleryImagesQuery();
    const [updateSettings] = useUpdateSettingsMutation();
    const [addGalleryImage] = useAddGalleryImageMutation();
    const [deleteGalleryImage] = useDeleteGalleryImageMutation();

    const { toast } = useToast();

    const handleUpdateSettings = async (updateData: Partial<SettingsData>) => {
        try {
            await updateSettings(updateData).unwrap();
            toast({ title: "Success", description: "Settings updated successfully." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to update settings.", variant: "destructive" });
        }
    };

    const handleLocationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const locationAddress = formData.get('locationAddress') as string;
        const locationMapLink = formData.get('locationMapLink') as string;
        handleUpdateSettings({ locationAddress, locationMapLink });
    };

    const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      
      try {
        await addGalleryImage(formData).unwrap();
        toast({ title: 'Success', description: 'Image uploaded successfully.'});
        (e.target as HTMLFormElement).reset();
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to upload image.', variant: 'destructive'});
      }
    };

    const handleImageDelete = async (id: string) => {
        try {
            await deleteGalleryImage(id).unwrap();
            toast({ title: 'Success', description: 'Image deleted successfully.'});
        } catch(error) {
             toast({ title: 'Error', description: 'Failed to delete image.', variant: 'destructive'});
        }
    };

    const categorySettingSections = [
        { key: 'roomConditions', title: 'Room Conditions', description: 'Manage the condition options for rooms (e.g., Excellent, Good).' },
        { key: 'inventoryCategories', title: 'Inventory Categories', description: 'Manage categories for inventory items.' },
        { key: 'inventoryConditions', title: 'Inventory Conditions', description: 'Manage condition options for inventory items.' },
        { key: 'complaintCategories', title: 'Complaint Categories', description: 'Manage categories for student complaints.' },
        { key: 'noticeCategories', title: 'Notice Categories', description: 'Manage categories for public notices.' },
    ] as const;

    const error = settingsError || galleryError;

  if (error) {
     return (
        <div className="text-center py-16">
            <div className="flex flex-col items-center gap-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
            <h3 className="text-xl font-semibold">Error Loading Settings</h3>
            <p className="text-muted-foreground">Failed to load settings data. Please try again.</p>
            <Button onClick={() => { refetchSettings(); refetchGallery(); }} variant="outline">
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
          <p className="text-muted-foreground">Manage application-wide options and public content.</p>
      </div>
     
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="designations">Designations</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
            <div className="grid gap-8 grid-cols-1 xl:grid-cols-2">
                {categorySettingSections.map(section => (
                    settings && settings[section.key] && (
                        <CategorySettingsSection 
                            key={section.key}
                            title={section.title} 
                            description={section.description}
                            items={settings[section.key]}
                            categoryKey={section.key}
                            onUpdate={(key, items) => handleUpdateSettings({ [key]: items })}
                            loading={settingsLoading}
                        />
                    )
                ))}
            </div>
        </TabsContent>

        <TabsContent value="designations" className="mt-6">
            {settings && settings.boardMemberDesignations ? (
                <CategorySettingsSection
                    title="Board Member Designations"
                    description="Manage the positions available for board members (e.g., Chairperson, Treasurer)."
                    items={settings.boardMemberDesignations}
                    categoryKey="boardMemberDesignations"
                    onUpdate={(key, items) => handleUpdateSettings({ [key]: items })}
                    loading={settingsLoading}
                />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Board Member Designations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-40 w-full" />
                    </CardContent>
                </Card>
            )}
        </TabsContent>

        <TabsContent value="gallery" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Gallery Management</CardTitle>
                    <CardDescription>Upload and manage images for the public homepage gallery.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleImageUpload} className="mb-6 p-4 border rounded-lg space-y-4">
                        <h4 className="font-medium">Upload New Image</h4>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="galleryImage">Image File</Label>
                                <Input id="galleryImage" name="image" type="file" required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="altText">Alt Text (for accessibility)</Label>
                                <Input id="altText" name="alt" placeholder="e.g., A clean and modern hostel room" required/>
                            </div>
                        </div>
                        <Button type="submit"><UploadCloud className="mr-2 h-4 w-4"/>Upload Image</Button>
                    </form>
                    <Separator/>
                    <div className="mt-6">
                        <h4 className="font-medium mb-4">Current Images</h4>
                        {galleryLoading ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Skeleton className="w-full h-32"/>
                                <Skeleton className="w-full h-32"/>
                                <Skeleton className="w-full h-32"/>
                                <Skeleton className="w-full h-32"/>
                            </div>
                        ) : galleryImages.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {galleryImages.map(image => (
                                    <div key={image._id} className="relative group">
                                        <Image src={image.url} alt={image.alt} width={200} height={200} className="rounded-md object-cover w-full aspect-square" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="destructive" size="icon" onClick={() => handleImageDelete(image._id)}>
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center py-4">No gallery images uploaded yet.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="location" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Location Details</CardTitle>
                    <CardDescription>Set the address and map link for the public homepage.</CardDescription>
                </CardHeader>
                <form onSubmit={handleLocationSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="locationAddress">Hostel Address</Label>
                            <Input id="locationAddress" name="locationAddress" placeholder="e.g., 123 University Lane, College Town, USA 12345" defaultValue={settings?.locationAddress || ''} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="locationMapLink">Google Maps Link</Label>
                            <Input id="locationMapLink" name="locationMapLink" placeholder="https://maps.google.com/..." defaultValue={settings?.locationMapLink || ''} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Save Location</Button>
                    </CardFooter>
                </form>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
