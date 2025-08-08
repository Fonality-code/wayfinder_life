# How to Get Your Supabase Service Role Key

## Steps:

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/uvffkjlrdhqjyqeuyufq

2. Navigate to **Settings** → **API**

3. Look for the **Project API keys** section

4. Copy the **service_role** key (it's a very long JWT token starting with `eyJ...`)

5. Replace `YOUR_SERVICE_ROLE_KEY_HERE` in your `.env.local` file with this key

⚠️ **IMPORTANT**: The service role key bypasses Row Level Security and should NEVER be exposed to the client. Keep it secret and only use it on the server side.

## Example:
```bash
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2ZmZramxyZGhxanlxZXV5dWZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3MTY0Njg0MSwiZXhwIjoyMDE3MjIyODQxfQ.VERY_LONG_JWT_TOKEN_HERE"
```

Once you have the service role key, your Supabase configuration will be complete!
