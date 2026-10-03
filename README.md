# PRYV8

PRYV8 is a two-sided market-validation landing page for a private conversation marketplace for verified adults.

## Flow

1. Visitor chooses **I’m here to connect** or **I’m here to earn**.
2. They answer commercial-intent questions.
3. They provide email + WhatsApp after voting.
4. The API writes to Supabase when configured.
5. UTM/source data is captured for acquisition analysis.

## Local

```bash
npm install
npm run dev
```

## Supabase

Run `supabase/schema.sql` in the dedicated PRYV8 Supabase project, then set:

```
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
```

The public client can insert responses, but RLS prevents public reads.

## Validation metrics

Track:

- User YE / Maybe / Nah
- Creator YE / Maybe / Nah
- Contact opt-in rate
- Spend range
- Creator audience size
- Source / UTM
- Qualified creator count
