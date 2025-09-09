
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // In a real application, you would validate against a database.
    // Here, we're using hardcoded credentials for demonstration.
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@hostelpro.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Credentials are correct, generate a simple token.
      // In a real-world scenario, this should be a signed JWT.
      const token = uuidv4();
      
      return NextResponse.json({ success: true, token });
    } else {
      // Invalid credentials
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
