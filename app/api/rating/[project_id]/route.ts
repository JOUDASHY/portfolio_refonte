import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo purposes
// In production, this would be replaced with a database
const ratings = new Map<number, { score: number; ip_address: string }[]>();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ project_id: string }> }
) {
  try {
    const resolvedParams = await params;
    const project_id = parseInt(resolvedParams.project_id);

    if (isNaN(project_id)) {
      return NextResponse.json(
        { error: 'Invalid project_id' },
        { status: 400 }
      );
    }

    const projectRatings = ratings.get(project_id) || [];
    
    const average_score = projectRatings.length > 0 
      ? projectRatings.reduce((sum, rating) => sum + rating.score, 0) / projectRatings.length
      : 0;

    return NextResponse.json({
      project_id,
      average_score: Math.round(average_score * 100) / 100, // Round to 2 decimal places
      ratings_count: projectRatings.length,
      ratings_details: projectRatings
    });

  } catch (error) {
    console.error('Error in rating GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
