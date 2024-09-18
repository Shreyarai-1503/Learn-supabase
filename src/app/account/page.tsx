import AccountForm from './account-form'
import { createClient } from '@/utils/supabase/server'

export default async function Account() {
  const supabase = createClient()

  //extracts the data property from the result object. 
  //Inside data, it further extracts the user property.
  const { data: { user } } = await supabase.auth.getUser()

  return <AccountForm user={user} />
}