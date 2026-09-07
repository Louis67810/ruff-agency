# SaaS landing analytics

1. Run `saas-analytics.sql` in the Supabase SQL editor.
2. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the server environment.
3. Add a long `SAAS_ANALYTICS_PASSWORD` and an independent
   `SAAS_ANALYTICS_COOKIE_SECRET`.

The service-role key is read only by the Next.js server routes. The public
table has RLS enabled and grants no browser role direct access. When these
variables are absent during local development, events are stored in the
ignored `.data/saas-analytics.jsonl` preview file. Production deliberately
refuses to persist events until Supabase is configured.
