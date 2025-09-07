
"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, ShieldCheck, Users, Wifi, Info, Handshake } from "lucide-react";

import { cn } from "@/lib/utils";
import PublicHeader from "@/components/public-header";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import PublicFooter from "@/components/public-footer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const applicationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  studentId: z.string().regex(/^STU\d{3,}$/, "Invalid Student ID format (e.g., STU001)."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  dob: z.date({ required_error: "Date of birth is required." }),
  gender: z.string({ required_error: "Please select a gender." }),
  address: z.string().min(10, "Address must be at least 10 characters long."),
  course: z.string().min(2, "Course name is required."),
  year: z.coerce.number().min(1).max(5, "Year must be between 1 and 5."),
  roomPreference: z.string({ required_error: "Please select a room preference." }),
  guardianName: z.string().min(2, "Guardian's name is required."),
  guardianPhone: z.string().min(10, "Guardian's phone number is required."),
  // Roommate preferences
  sleepSchedule: z.enum(["early-bird", "night-owl"]).optional(),
  studyHabits: z.enum(["in-room", "library", "flexible"]).optional(),
  socialHabits: z.enum(["introvert", "extrovert", "ambivert"]).optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export default function ApplyPage() {
  const { toast } = useToast();

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      studentId: "",
      email: "",
      phone: "",
      gender: undefined,
      course: "",
      year: 1,
      address: "",
      guardianName: "",
      guardianPhone: "",
      roomPreference: undefined,
    },
  });

  function onSubmit(data: ApplicationFormValues) {
    console.log(data);
    toast({
      title: "Application Submitted!",
      description: "We have received your application and will review it shortly.",
    });
    form.reset();
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <PublicHeader />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-3xl">Hostel Application Form</CardTitle>
                  <CardDescription>Fill out the form below to apply for a room. Please provide accurate information.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      {/* Personal Details */}
                      <div>
                        <h3 className="text-lg font-medium mb-4 text-primary">Personal Information</h3>
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField control={form.control} name="studentId" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Student ID</FormLabel>
                                  <FormControl><Input placeholder="STU123" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Address</FormLabel>
                                  <FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl><Input placeholder="123-456-7890" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="dob" render={({ field }) => (
                                <FormItem className="flex flex-col pt-2">
                                  <FormLabel>Date of Birth</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1950-01-01")} initialFocus />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField control={form.control} name="gender" render={({ field }) => (
                                <FormItem className="pt-2">
                                  <FormLabel>Gender</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select your gender" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                      <SelectItem value="Male">Male</SelectItem>
                                      <SelectItem value="Female">Female</SelectItem>
                                      <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField control={form.control} name="address" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Permanent Address</FormLabel>
                                <FormControl><Textarea placeholder="Enter your full permanent address" className="resize-none" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* Academic & Hostel Details */}
                      <div>
                        <h3 className="text-lg font-medium mb-4 text-primary">Academic & Hostel Details</h3>
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <FormField control={form.control} name="course" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Course</FormLabel>
                                  <FormControl><Input placeholder="Computer Science" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField control={form.control} name="year" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Year of Study</FormLabel>
                                  <FormControl><Input type="number" min="1" max="5" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                           <FormField control={form.control} name="roomPreference" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Room Preference</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger><SelectValue placeholder="Select a room type" /></SelectTrigger></FormControl>
                                  <SelectContent>
                                    <SelectItem value="Single">Single Occupancy</SelectItem>
                                    <SelectItem value="Shared">Shared Occupancy</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <Separator />

                      {/* Guardian Details */}
                      <div>
                        <h3 className="text-lg font-medium mb-4 text-primary">Guardian's Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <FormField control={form.control} name="guardianName" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Guardian's Full Name</FormLabel>
                                <FormControl><Input placeholder="Jane Doe" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                           <FormField control={form.control} name="guardianPhone" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Guardian's Phone Number</FormLabel>
                                <FormControl><Input placeholder="123-456-7890" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* Roommate Preferences */}
                      <div>
                        <h3 className="text-lg font-medium mb-4 text-primary">Roommate Preferences (Optional)</h3>
                        <p className="text-sm text-muted-foreground mb-6">Help us find your ideal roommate! This section is optional but highly recommended if you've selected a shared room.</p>
                        <div className="space-y-8">
                          <FormField
                            control={form.control}
                            name="sleepSchedule"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel>What's your typical sleep schedule?</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col md:flex-row gap-4"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl><RadioGroupItem value="early-bird" /></FormControl>
                                      <FormLabel className="font-normal">Early Bird (asleep by 11 PM)</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl><RadioGroupItem value="night-owl" /></FormControl>
                                      <FormLabel className="font-normal">Night Owl (up past midnight)</FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="studyHabits"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel>Where do you prefer to study?</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col md:flex-row gap-4"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl><RadioGroupItem value="in-room" /></FormControl>
                                      <FormLabel className="font-normal">Mostly in my room</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl><RadioGroupItem value="library" /></FormControl>
                                      <FormLabel className="font-normal">Library or study halls</FormLabel>
                                    </FormItem>
                                     <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl><RadioGroupItem value="flexible" /></FormControl>
                                      <FormLabel className="font-normal">I'm flexible</FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                           <FormField
                            control={form.control}
                            name="socialHabits"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel>How would you describe your social style?</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col md:flex-row gap-4"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl><RadioGroupItem value="introvert" /></FormControl>
                                      <FormLabel className="font-normal">I prefer quiet and alone time</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl><RadioGroupItem value="extrovert" /></FormControl>
                                      <FormLabel className="font-normal">I enjoy socializing and having friends over</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl><RadioGroupItem value="ambivert" /></FormControl>
                                      <FormLabel className="font-normal">A mix of both</FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>


                      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">Submit Application</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-8">
                 <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                       <Handshake className="w-6 h-6 text-primary" />
                      Find a Great Roommate
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Living with someone new is a big part of the hostel experience. By answering a few simple questions, you help us match you with someone who has a similar lifestyle, making your stay more enjoyable from day one.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Why Stay With Us?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-4">
                      <ShieldCheck className="w-10 h-10 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Safe & Secure</h4>
                        <p className="text-sm text-muted-foreground">24/7 security and controlled access for your peace of mind.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Users className="w-10 h-10 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Vibrant Community</h4>
                        <p className="text-sm text-muted-foreground">Connect with fellow students in our common areas and events.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Wifi className="w-10 h-10 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">All-Inclusive Amenities</h4>
                        <p className="text-sm text-muted-foreground">High-speed Wi-Fi, laundry, gym, and more included.</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/#faq">Read our FAQ</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-primary" />
                      Need Assistance?
                    </CardTitle>
                    <CardDescription>Our team is ready to help you.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      If you have any questions about the application process, don't hesitate to reach out.
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">admissions@hostelpro.com</p>
                      <p className="text-sm text-muted-foreground">+1 (234) 567-8900</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
