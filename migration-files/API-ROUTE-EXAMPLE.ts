// Example: Converting Express route to Next.js API route
// This shows how your server/routes.ts will convert to Next.js format

// BEFORE: server/routes.ts (Express format)
/*
app.post('/api/test-sessions', async (req, res) => {
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const session = await storage.createTestSession(userId);
    res.json(session);
  } catch (error) {
    console.error('Error creating test session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
*/

// AFTER: app/api/test-sessions/route.ts (Next.js format)
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { storage } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const testSession = await storage.createTestSession(session.user.id)
    return NextResponse.json(testSession)
  } catch (error) {
    console.error('Error creating test session:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

// Key differences:
// 1. File location: app/api/test-sessions/route.ts (instead of centralized routes.ts)
// 2. Export functions: export async function POST() (instead of app.post())
// 3. Request/Response: NextRequest/NextResponse (instead of req/res)
// 4. Return format: return NextResponse.json() (instead of res.json())
// 5. Authentication: getServerSession() (instead of req.session)

// The business logic stays exactly the same - just wrapped differently!