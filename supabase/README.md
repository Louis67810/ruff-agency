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

## SaaS redesign brief responses

The SaaS redesign form saves each visit and its answers as the visitor progresses.
Run `saas-brief-responses.sql` in the same Supabase project as the analytics
table. The form and the private **Formulaires** view in Behavioural Intelligence
use the existing server-side `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
(or `SUPABASE_SECRET_KEY`) variables. The browser never receives this key.
Partial and completed responses appear in the submissions table; the insights
view counts visits and aggregates answers. In local development without those
variables, only an ignored `.data/saas-brief-responses.jsonl` preview file is
used. Production refuses to save or read brief responses without Supabase.
