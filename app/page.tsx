import React from 'react'
import LoginPage from './admin/login/page'
import { AuthProvider } from '@/contexts/auth-context'

const page = () => {
  return (
    <>
    <AuthProvider>
        <LoginPage />
    </AuthProvider>
    </>
  )
}

export default page