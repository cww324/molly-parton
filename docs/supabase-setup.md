# Supabase Setup

## Orders table

Run this in the Supabase SQL editor:

```sql
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique,
  customer_email text not null,
  shipping_address jsonb not null,
  items jsonb not null,
  total decimal(10,2) not null,
  status text default 'pending',
  created_at timestamptz default now()
);
```

Notes:
- RLS is off by default; keep it off for now unless you add policies.
- If you enable RLS later, use the service role key for server inserts.
