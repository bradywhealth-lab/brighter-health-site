export default async (request, context) => {
  const response = await context.next();
  
  // Add security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Log request for "log drain" visibility
  console.log(`[Edge] Request for ${request.url} from ${context.geo?.city || 'Unknown City'}, ${context.geo?.country?.code || 'Unknown Country'}`);
  
  return response;
};
