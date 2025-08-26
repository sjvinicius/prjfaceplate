import { DatabaseClient } from "./database";

export async function getDb(): Promise<DatabaseClient> {
//   const provider = process.env.DB_PROVIDER || 'supabase';

  const { supabaseDb } = await import('./supabaseCliente');
  return supabaseDb;
}

