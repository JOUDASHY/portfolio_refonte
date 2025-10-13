import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo purposes
// In production, this would be replaced with a database
const ratings = new Map<number, { score: number; ip_address: string }[]>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project_id, score } = body;

    // Validate input
    if (!project_id || typeof project_id !== 'number') {
      return NextResponse.json(
        { error: 'project_id is required and must be a number' },
        { status: 400 }
      );
    }

    if (!score || typeof score !== 'number' || score < 1 || score > 5) {
      return NextResponse.json(
        { error: 'score is required and must be a number between 1 and 5' },
        { status: 400 }
      );
    }

    // Get client IP address
    const ip_address = request.ip || 
      request.headers.get('x-forwarded-for') || 
      request.headers.get('x-real-ip') || 
      'unknown';

    // Store the rating
    if (!ratings.has(project_id)) {
      ratings.set(project_id, []);
    }
    
    const projectRatings = ratings.get(project_id)!;
    projectRatings.push({ score, ip_address });

    return NextResponse.json({
      message: 'Rating submitted successfully',
      score,
      ip_address
    });

  } catch (error) {
    console.error('Error in rating POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
