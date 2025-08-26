// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import { DatabaseClient } from './database';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        db: {
            schema: "dbxoutlet"
        }
    }
);


export const supabaseDb: DatabaseClient = {

}