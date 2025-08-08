"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

// Update the current user's profile (full_name only).
export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()

  if (userErr || !user) {
    return { ok: false, error: userErr?.message || "Unauthorized" }
  }

  const fullName = String(formData.get("full_name") ?? "").trim()

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName || null })
    .eq("id", user.id)

  if (error) {
    return { ok: false, error: error.message }
  }

  revalidatePath("/dashboard/profile")
  return { ok: true }
}
