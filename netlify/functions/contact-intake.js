// Simple intake function to capture lead details from the landing form
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST' },
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';
  let payload = {};

  try {
    if (contentType.includes('application/json')) {
      payload = JSON.parse(event.body || '{}');
    } else {
      const params = new URLSearchParams(event.body || '');
      payload = Object.fromEntries(params.entries());
    }
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ message: 'Invalid request body' }) };
  }

  const { name, email, phone, profile, current_coverage, message } = payload;

  if (!name || !email || !phone) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Please provide name, email, and phone.' })
    };
  }

  const sanitized = {
    name: String(name).trim().slice(0, 120),
    email: String(email).trim().slice(0, 120),
    phone: String(phone).trim().slice(0, 50),
    profile: profile ? String(profile).trim().slice(0, 80) : 'unspecified',
    current_coverage: current_coverage ? String(current_coverage).trim().slice(0, 80) : 'unspecified',
    message: message ? String(message).trim().slice(0, 500) : ''
  };

  // In a full setup this is where we would persist to CRM/Netlify Blobs/DB.
  // For now, respond with a confirmation payload suitable for optimistic UI.
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    },
    body: JSON.stringify({
      received: true,
      next_steps: 'Brady will contact you personally to review plan options.',
      data: sanitized
    })
  };
};
