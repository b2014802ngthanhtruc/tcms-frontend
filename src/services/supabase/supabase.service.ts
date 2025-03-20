import type { CreateProfile } from '@/types/supabase.type'
import { SupabaseClient, createClient } from '@supabase/supabase-js'

class SupabaseService {
  private readonly supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  private readonly supabaseKey = import.meta.env.VITE_SUPABASE_KEY

  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey)
  }

  async signUp(email: string, password: string) {
    const response = await this.supabase.auth.signUp({
      email,
      password,
      options: { data: { userId: 'uuid' } }
    })
    return response
  }

  async signIn(email: string, password: string) {
    const response = await this.supabase.auth.signInWithPassword({ email, password })
    return response
  }

  async createProfile(data: CreateProfile) {
    const response = await this.supabase.from('profiles').insert(data)
    return response
  }

  async getInstance(): Promise<SupabaseClient> {
    return await this.supabase
  }
}

export default SupabaseService
