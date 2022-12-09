import { createClient } from '@supabase/supabase-js'

//const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
//const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY
const supabase = createClient('https://eldtvxgjdhenbivgrzhz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsZHR2eGdqZGhlbmJpdmdyemh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg0OTQ5NDcsImV4cCI6MTk4NDA3MDk0N30.BGFxBMsGiWQw-ryjuRogC_uR8TO6UeXvFHc8jBAEopQ')
export default supabase