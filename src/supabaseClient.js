import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://lvjgsoxzxrmjggkqumwv.supabase.co"
const supabaseKey = "sb_publishable_Qbc79dYqH7Dt26oPfIDYwA_cJ-Csho7"

export const supabase = createClient(supabaseUrl, supabaseKey)