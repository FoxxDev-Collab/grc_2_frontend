export const unwrapResponse = (response) => {
    // If response is already unwrapped or null/undefined
    if (!response || typeof response !== 'object' || !('success' in response)) {
      return response;
    }
    
    // Check if it's a success response with data
    if (response.success && 'data' in response) {
      return response.data;
    }
    
    // If it's an error response, throw an error with the message
    if (!response.success && response.message) {
      throw new Error(response.message);
    }
    
    // Fallback: return the whole response
    return response;
  };