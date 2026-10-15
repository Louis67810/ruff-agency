alter table public.saas_analytics_events
  drop constraint if exists saas_analytics_events_event_type_check;

alter table public.saas_analytics_events
  add constraint saas_analytics_events_event_type_check
  check (event_type in (
    'page_view', 'section_view', 'section_time', 'cta_click', 'vote',
    'before_after_interaction', 'ticker_interaction', 'integration_interaction',
    'faq_question', 'faq_answer', 'conversion', 'site_navigation', 'session_end',
    'scroll_depth', 'scroll_zone', 'heartbeat'
  ));
