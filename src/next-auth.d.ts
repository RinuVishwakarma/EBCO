import NextAuth from 'next-auth/next'
import { LoginRes } from '@/interface/Auth/LoginRes'

declare module 'next-auth' {
  interface Session {
    data: LoginRes
  }
}
