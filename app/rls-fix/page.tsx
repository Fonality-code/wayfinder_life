import { RlsFixPanel } from "@/components/admin/rls-fix-panel"

export default function RlsFixPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-2">Database Issue Detected</h1>
        <p className="text-slate-600">
          Infinite recursion detected in policy for relation "profiles"
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        <RlsFixPanel />
      </div>

      <div className="bg-slate-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Manual Fix Instructions</h2>
        <div className="space-y-3 text-sm">
          <p>If you prefer to fix this manually, follow these steps:</p>
          <ol className="list-decimal list-inside space-y-2 text-slate-700">
            <li>Log into your Supabase dashboard</li>
            <li>Navigate to SQL Editor</li>
            <li>Execute the following SQL commands in order:</li>
          </ol>

          <div className="bg-slate-800 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto mt-4">
            <div className="space-y-2">
              <div>-- Step 1: Temporarily disable RLS</div>
              <div>ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;</div>
              <div></div>
              <div>-- Step 2: Drop problematic policies</div>
              <div>DROP POLICY IF EXISTS "Users can view own profile" ON profiles;</div>
              <div>DROP POLICY IF EXISTS "Users can update own profile" ON profiles;</div>
              <div>DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;</div>
              <div></div>
              <div>-- Step 3: Create simple policies</div>
              <div>CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);</div>
              <div>CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);</div>
              <div></div>
              <div>-- Step 4: Re-enable RLS</div>
              <div>ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
