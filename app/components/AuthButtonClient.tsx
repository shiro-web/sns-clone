"use client"

import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const AuthButtonClient = ({session}:{session:Session | null}) => {
  const router = useRouter();
  const supabase = createClientComponentClient();


    const handleSignIn = async() => {
        await supabase.auth.signInWithOAuth({
            provider:"github",
            options:{
                redirectTo:"http://localhost:3000/auth/callback",
            },
        });
       
    }

    const handleSignOut = async() => {
        await supabase.auth.signOut();
        router.refresh();
    }
  
  return (
    <>
    {session ? (
      <button onClick={handleSignOut}>ログアウト</button>
      ): (
      <button onClick={handleSignIn}>サインイン</button>
    )}
      
    </>
  )
}

export default AuthButtonClient