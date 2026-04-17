# Projects Access Setup (Cloudflare + Supabase)

This project includes a password-gated Projects section that calls the Cloudflare Worker endpoint `/api/project-access` and redirects valid clients to their project URL.

## Critical First Step: Rotate Leaked Key

If a service role key is shared in chat, logs, screenshots, or commits, treat it as compromised.

1. In Supabase dashboard, open Project Settings -> API.
2. Rotate the service role key immediately.
3. Use the new value everywhere below.

## 1) Create Supabase Table

1. Open Supabase SQL Editor.
2. Paste and run `scripts/supabase-project-access.sql`.
3. Confirm `public.project_access` exists in Table Editor.

## 2) Add Client Entries

Generate hash locally:

```bash
npm run hash:project-password -- "CLIENT_PASSWORD_HERE"
```

Insert one row per client:

```sql
insert into public.project_access (password_hash, project_url, is_active)
values (
  '$2a$12$REPLACE_WITH_BCRYPT_HASH',
  'https://your-client-project-url.com',
  true
);
```

Rules:
- Store hashes only, never plaintext passwords.
- `project_url` must use `https://`.

## 3) Configure Cloudflare Worker Secrets

Use the Cloudflare dashboard or Wrangler CLI to set:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ALLOWED_REDIRECT_HOSTS` (comma-separated, optional but recommended)

Example:

```text
ALLOWED_REDIRECT_HOSTS=client-a.com,client-b.io
```

Wrangler CLI commands:

```bash
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put ALLOWED_REDIRECT_HOSTS
```

## 4) Deploy to Cloudflare

1. Ensure `wrangler.json` contains `main: "worker.js"` and assets directory `./dist`.
2. Build site: `npm run build`.
3. Deploy worker + assets from repo using your Cloudflare workflow.

If deploying with Wrangler directly:

```bash
wrangler deploy
```

## 5) Verify End-to-End

1. Open deployed site.
2. In Projects section, submit a valid client password.
3. Confirm redirect to client project URL.
4. Submit invalid password and confirm generic error only.

## Day-to-Day Operations

Add client:
1. `npm run hash:project-password -- "NEW_PASSWORD"`
2. Insert row in `public.project_access`.

Disable client:

```sql
update public.project_access
set is_active = false
where id = YOUR_CLIENT_ROW_ID;
```

Rotate client password:

```sql
update public.project_access
set password_hash = '$2a$12$NEW_HASH'
where id = YOUR_CLIENT_ROW_ID;
```
