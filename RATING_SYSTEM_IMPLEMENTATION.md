# Dynamic Rating System Implementation

## Overview
A complete dynamic rating system has been implemented for the portfolio projects, allowing users to rate projects on a 1-5 star scale.

## API Endpoints

### POST `/api/rating/`
- **Purpose**: Submit a new rating for a project
- **Request Body**: 
  ```json
  {
    "project_id": number,
    "score": number (1-5)
  }
  ```
- **Response**: 
  ```json
  {
    "message": string,
    "score": number,
    "ip_address": string
  }
  ```

### GET `/api/rating/[project_id]/`
- **Purpose**: Get rating summary for a specific project
- **Response**: 
  ```json
  {
    "project_id": number,
    "average_score": number,
    "ratings_count": number,
    "ratings_details": [
      {
        "score": number,
        "ip_address": string
      }
    ]
  }
  ```

## Implementation Details

### Files Created/Modified

1. **API Routes**:
   - `app/api/rating/route.ts` - POST endpoint for creating ratings
   - `app/api/rating/[project_id]/route.ts` - GET endpoint for retrieving rating data

2. **Types**:
   - `app/types/backoffice/rating.ts` - TypeScript interfaces for rating data

3. **Services**:
   - `app/services/backoffice/ratingService.ts` - API service functions

4. **Components**:
   - `app/ux/Projects.tsx` - Updated to use real rating system with average_score from projects API

5. **Translations**:
   - `app/i18n/en.ts` - English translations for rating system
   - `app/i18n/fr.ts` - French translations for rating system

### Data Flow

1. **Display**: Uses `average_score` from `/api/projets/` API endpoint
2. **Submission**: Uses `/api/rating/` API endpoint for new ratings
3. **Real-time Updates**: Local state updates optimistically after successful rating submission

### Key Features

1. **Real-time Rating**: Users can click on star buttons (1-5) to rate projects
2. **Visual Feedback**: Stars are highlighted based on current average rating
3. **Error Handling**: Proper error messages for failed API calls
4. **Loading States**: Visual feedback during API operations
5. **IP Tracking**: Each rating is associated with the user's IP address
6. **Responsive Design**: Rating buttons adapt to different screen sizes
7. **Internationalization**: Full support for English and French languages

### Technical Implementation

- **In-memory Storage**: Currently uses Map-based storage for demo purposes
- **IP Address Detection**: Extracts client IP from request headers
- **Type Safety**: Full TypeScript support with proper interfaces
- **Error Boundaries**: Comprehensive error handling throughout the system
- **Auto-fetching**: Ratings are automatically loaded when components mount

### Usage

1. **For Users**: Click on the star buttons (1-5) to rate any project
2. **For Developers**: The rating system is integrated directly into the Projects component using the existing projects API

### Future Enhancements

- Replace in-memory storage with a proper database (PostgreSQL, MongoDB, etc.)
- Add user authentication to prevent duplicate ratings
- Implement rating analytics and reporting
- Add rating moderation features
- Implement rating notifications

## Testing

A test script (`test-rating-api.js`) has been provided to verify the API endpoints work correctly. Run it with Node.js after starting the development server.

## Database Migration (Future)

When moving to a production database, consider this schema:

```sql
CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  ip_address VARCHAR(45) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ratings_project_id ON ratings(project_id);
```
