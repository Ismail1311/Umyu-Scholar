// ai/config.js
// AI API Configuration

// Cloud Function URL (after deployment)
// Format: https://REGION-PROJECT_ID.cloudfunctions.net/FUNCTION_NAME
export const AI_API_URL = 'https://us-central1-umyusholar.cloudfunctions.net/chat';

// Local development URL (if testing locally with server.js)
// export const AI_API_URL = 'http://localhost:3000/api/chat';

// Export for use in other files
export default { AI_API_URL };