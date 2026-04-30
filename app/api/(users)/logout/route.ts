// app/api/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set('nextauthprjfaceplate-token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  return response;
}