import { config } from 'dotenv';
config();

import '@/ai/flows/categorize-complaints.ts';
import '@/ai/flows/process-inquiry-flow.ts';
