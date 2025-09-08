
"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, ShieldCheck, Users, Wifi, Info, Handshake, FileText, UploadCloud, MailCheck, HeartHandshake } from "lucide-react";

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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

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
  profilePhoto: z
    .any()
    .refine((files) => files?.length == 1, "Profile photo is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, and .png files are accepted."
    ),
  studentIdCard: z
    .any()
    .refine((files) => files?.length == 1, "Student ID card is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_DOCUMENT_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png, and .pdf files are accepted."
    ),
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

  const photoRef = form.register("profilePhoto");
  const idCardRef = form.register("studentIdCard");


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
        {/* Hero Section */}
        <section className="w-full py-16 bg-secondary/50 border-b">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter font-headline">
                        Begin Your Journey With Us
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                        Applying for your new home is simple and straightforward. Our online form makes it easy to secure your spot at HostelPro.
                    </p>
                </div>
                 <div className="mt-16 max-w-4xl mx-auto">
                    <div className="relative">
                      {/* Desktop connecting line */}
                      <div className="hidden md:block absolute top-8 left-1/2 -translate-x-1/2 w-[calc(66%-4rem)] h-0.5 border-t-2 border-dashed border-border" aria-hidden="true"></div>
                      
                      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-x-8">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center">
                          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground border-4 border-background mb-4 z-10">
                            <FileText className="w-8 h-8" />
                          </div>
                          <h3 className="text-lg font-semibold">1. Fill the Form</h3>
                          <p className="text-sm text-muted-foreground mt-1">Provide your personal, academic, and guardian details.</p>
                        </div>
                        
                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center">
                           <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground border-4 border-background mb-4 z-10">
                             <UploadCloud className="w-8 h-8" />
                          </div>
                          <h3 className="text-lg font-semibold">2. Upload Documents</h3>
                          <p className="text-sm text-muted-foreground mt-1">Attach necessary documents like your student ID and photo.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center">
                           <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground border-4 border-background mb-4 z-10">
                             <MailCheck className="w-8 h-8" />
                          </div>
                          <h3 className="text-lg font-semibold">3. Receive Confirmation</h3>
                          <p className="text-sm text-muted-foreground mt-1">Get an email once your application is processed successfully.</p>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </section>


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

                      {/* Document Upload */}
                      <div>
                        <h3 className="text-lg font-medium mb-4 text-primary">Document Upload</h3>
                        <p className="text-sm text-muted-foreground mb-6">Please upload a recent passport-sized photograph and a clear copy of your student ID card. Max file size: 5MB.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="profilePhoto"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Profile Photo</FormLabel>
                                    <FormControl>
                                        <Input type="file" accept="image/png, image/jpeg" {...photoRef} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="studentIdCard"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Student ID Card (Image or PDF)</FormLabel>
                                    <FormControl>
                                        <Input type="file" accept="image/png, image/jpeg, application/pdf" {...idCardRef} />
                                    </FormControl>
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
                        <p className="text-sm text-muted-foreground mb-6">Help us find your ideal roommate by sharing your lifestyle habits.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            control={form.control}
                            name="sleepSchedule"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sleep Schedule</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select your sleep schedule" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="early-bird">Early Bird</SelectItem>
                                    <SelectItem value="night-owl">Night Owl</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="studyHabits"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Study Habits</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select your study habits" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="in-room">I study in my room</SelectItem>
                                    <SelectItem value="library">I prefer the library</SelectItem>
                                    <SelectItem value="flexible">Flexible</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="socialHabits"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Social Habits</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select your social habits" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="introvert">I'm more introverted</SelectItem>
                                    <SelectItem value="extrovert">I'm more extroverted</SelectItem>
                                    <SelectItem value="ambivert">I'm a bit of both</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Submit Application
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-8">
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

      {/* New Section */}
      <section className="w-full py-16 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <HeartHandshake className="w-6 h-6 text-primary" />
                    <span className="text-sm font-medium text-primary tracking-widest uppercase">Our Commitment</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-headline">More Than Just a Room</h2>
                <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">We're dedicated to providing an environment that supports your success and well-being.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg shadow-sm">
                <ShieldCheck className="w-12 h-12 text-primary" />
                <h3 className="text-xl font-semibold">Your Safety, Our Priority</h3>
                <p className="text-muted-foreground">With round-the-clock security personnel, CCTV surveillance, and secure access systems, we ensure you can focus on your studies with peace of mind.</p>
              </div>
              <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg shadow-sm">
                <Users className="w-12 h-12 text-primary" />
                <h3 className="text-xl font-semibold">A Community to Belong To</h3>
                <p className="text-muted-foreground">Join a diverse and vibrant community of students. Our common areas and regular events are perfect for making new friends and lifelong connections.</p>
              </div>
              <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg shadow-sm">
                <Wifi className="w-12 h-12 text-primary" />
                <h3 className="text-xl font-semibold">Hassle-Free Living</h3>
                <p className="text-muted-foreground">All-inclusive amenities like high-speed Wi-Fi, laundry services, and maintenance support mean you have more time to focus on what matters most.</p>
              </div>
            </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
