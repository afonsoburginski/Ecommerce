// app/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const isPublicPath = req.nextUrl.pathname.startsWith('/login');
  const isPrivatePath = !isPublicPath;

  if (!token && isPrivatePath) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/(private)/:path*',
    '/login',
  ],
};
