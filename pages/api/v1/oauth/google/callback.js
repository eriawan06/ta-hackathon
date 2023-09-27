import { NextResponse } from 'next/server'

import { setUser } from 'libs/local-storage/user'
import { setToken } from 'libs/token'

export default async function handler(req, res) {
  console.log('COOKIES : ', req.cookies)

  if (req.cookies.is_authenticated === 'true') {
    setToken(req.cookies.access_token)
    setUser(JSON.parse(req.cookies.user))
  }

  return NextResponse.rewrite(new URL('/dashboard', req.url))
}
