import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

// Creating a handler to a GET request to route /auth/confirm
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)   //to access query parameters
  const token_hash = searchParams.get('token_hash')  //Retrieves the value of the token_hash
  const type = searchParams.get('type') as EmailOtpType | null
  const next = '/account'

  // Create redirect link without the secret token
  const redirectTo = request.nextUrl.clone()   //This allows modifying the URL without altering the original request URL
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')  //Removes the token_hash query parameter
  redirectTo.searchParams.delete('type')

  if (token_hash && type) {
    const supabase = createClient()


    //Calls the verifyOtp method of the Supabase client’s authentication module to 
    //verify the OTP (one-time password). The method returns an error if verification fails.
    const { error } = await supabase.auth.verifyOtp({  
      type,
      token_hash,
    })
    if (!error) {
      redirectTo.searchParams.delete('next')
      return NextResponse.redirect(redirectTo)
    }
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = '/error'
  return NextResponse.redirect(redirectTo)
}

//this code handles OTP confirmation for email verification by 
//checking query parameters, verifying the OTP with Supabase, 
//and redirecting the user based on the verification result. 
//If verification is successful, the user is redirected to their account page; 
//otherwise, they are redirected to an error page