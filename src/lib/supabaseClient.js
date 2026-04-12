import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://erqtaunqepzljmeamrrb.supabase.co'
const supabaseAnonKey = 'sb_publishable_7Ob4YrjjOA_5NSDbIalnyw_wnk7qkKz'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)