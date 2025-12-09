# Netlify Log Drains – How to enable for this site

This repository cannot enable Log Drains on its own because the feature is configured in the Netlify UI/API by a Team Owner on an Enterprise plan. Use the steps below when you have provider credentials ready.

## Prerequisites
- Netlify account with Team Owner access and Enterprise Log Drains enabled for the site `healthwithbrady`.
- Destination log service credentials (API key/token or S3 bucket + policy, depending on provider).
- Optional: decision on whether to exclude traffic PII (`client_ip`, `user_agent`).

## Quick setup (any provider)
1) In Netlify, open **Site settings → Logs → Log drains → Enable a log drain**.
2) Choose a provider (Datadog, New Relic, Axiom, Azure Monitor, Sumo Logic, Splunk O11y, Logflare, Amazon S3, or **General HTTP endpoint**).
3) Select log types to export (traffic, functions, edge functions, deploy, WAF if available).
4) If desired, toggle **Exclude personally identifiable information (PII)** for traffic logs.
5) Enter the provider-specific credentials/URL, then **Connect**. Logs begin flowing within ~5 minutes.

## Suggested targets
- **Datadog**: paste API key, pick region; consider tag `env=prod` and service name `healthwithbrady`.
- **New Relic**: paste `INGEST-LICENSE` key; optional tags for `environment` and `service`.
- **Amazon S3**: supply bucket region/name/path (e.g., `your-bucket/logs/netlify/`), verify token Netlify provides.
- **General HTTP endpoint**: paste full HTTPS endpoint including auth (querystring or Authorization header). Choose JSON or NDJSON format.

## Operational tips
- Changes or deletions are managed in the same **Logs → Log drains** screen; edits take up to ~5 minutes to apply.
- Keep provider credentials in Netlify team secrets, not committed here.
- If using a general HTTP endpoint, prefer NDJSON for streaming-friendly ingestion and include an `environment` tag in the URL to separate preview vs production.
- After enabling, confirm receipt in the provider (Datadog Live Tail, New Relic Logs, S3 object arrival, etc.) and set alerts for 4xx/5xx spikes.
