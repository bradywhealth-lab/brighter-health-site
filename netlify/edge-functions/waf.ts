import type { Config, Context } from "@netlify/edge-functions";

const pathChecks = [
  /(?:\.\.\/|\.\.\\)/i, // directory traversal attempts
  /\/etc\/passwd/i,
  /\/\.git/i,
  /%2e%2e%2f/i,
];

const queryChecks = [
  /\bunion\b.+\bselect\b/i,
  /\bselect\b.+\bfrom\b/i,
  /\binsert\b.+\binto\b/i,
  /\bdrop\b.+\btable\b/i,
  /(?:;|--|\bexec\b|\bxp_)/i,
  /<\s*script\b/i,
  /onerror\s*=/i,
  /javascript:/i,
];

const headerChecks = [
  /<\s*script\b/i,
  /content-type:\s*application\/x-www-form-urlencoded/i,
];

const suspiciousUserAgents = [
  /sqlmap/i,
  /nmap/i,
  /nikto/i,
  /acunetix/i,
  /wpscan/i,
  /curl\/7\.[0-4][0-9]/i, // common automated scanners
];

const rateLimitPaths = new Set<string>(["/wp-login.php", "/xmlrpc.php", "/wp-admin"]);

function hasSuspiciousPath(url: URL) {
  return pathChecks.some((regex) => regex.test(url.pathname));
}

function hasSuspiciousQuery(url: URL) {
  const combined = url.searchParams.toString();
  if (!combined) return false;
  return queryChecks.some((regex) => regex.test(combined));
}

function hasSuspiciousHeaders(request: Request) {
  let found = false;
  request.headers.forEach((value, key) => {
    const headerLine = `${key}:${value}`;
    if (headerChecks.some((regex) => regex.test(headerLine))) found = true;
  });
  return found;
}

function hasSuspiciousUserAgent(request: Request) {
  const ua = request.headers.get("user-agent");
  if (!ua) return false;
  return suspiciousUserAgents.some((regex) => regex.test(ua));
}

function isAbusiveProbe(url: URL) {
  return rateLimitPaths.has(url.pathname);
}

export default async function waf(request: Request, context: Context) {
  const url = new URL(request.url);

  if (hasSuspiciousPath(url) || hasSuspiciousQuery(url) || hasSuspiciousHeaders(request) || hasSuspiciousUserAgent(request)) {
    return new Response("Request blocked by WAF", { status: 403 });
  }

  if (isAbusiveProbe(url) && request.method !== "GET") {
    return new Response("Request blocked by WAF", { status: 403 });
  }

  return context.next();
}

export const config: Config = {
  path: "/*",
  excludedPath: ["/favicon.ico", "/robots.txt", "/sitemap.xml"],
};
