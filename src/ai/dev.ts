
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-futsal-news.ts';
import './flows/generate-season-flow';
import './flows/generate-blog-post-flow';
