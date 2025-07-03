"use server";

import { z } from "zod";
import { categorizeComplaint } from "@/ai/flows/categorize-complaints";
import { revalidatePath } from "next/cache";

const complaintSchema = z.object({
  complaintText: z.string().min(10, { message: "Complaint must be at least 10 characters long." }),
});

export type ComplaintState = {
  errors?: {
    complaintText?: string[];
  };
  message?: string | null;
  data?: {
    category: string;
    urgency: string;
    summary: string;
  }
};

export async function submitComplaint(prevState: ComplaintState, formData: FormData): Promise<ComplaintState> {
  const validatedFields = complaintSchema.safeParse({
    complaintText: formData.get("complaintText"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid complaint text.",
    };
  }

  try {
    const aiResponse = await categorizeComplaint({ complaintText: validatedFields.data.complaintText });
    
    // In a real application, you would save the complaint and the AI response to a database.
    // For this demo, we'll just return the AI response to show on the client.
    console.log("Complaint Categorized:", aiResponse);
    
    revalidatePath("/admin/complaints");

    return { message: "Complaint submitted and categorized successfully!", data: aiResponse };
  } catch (error) {
    console.error("Error categorizing complaint:", error);
    return { message: "An error occurred while submitting your complaint. Please try again." };
  }
}
