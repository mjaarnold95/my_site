import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bjhzhqumedwjnvtwgtsu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqaHpocXVtZWR3am52dHdndHN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MzUzMDgsImV4cCI6MjA2OTQxMTMwOH0._nh3LKIXwvFBjBA0MCsB-n00nJauGRMBdLg2ghufecE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);