"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import { authClient } from "~/server/better-auth/client"

const SignOutButton = () => {
  const router = useRouter();

  const signout = async () => await authClient.signOut({
    fetchOptions: {
      onSuccess: () => router.push("/")
    }
  })

  return (
    <Button
      onClick={signout}
      className="group flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white transition-all hover:scale-105 hover:shadow-lg"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">Logout</span>
    </Button>
  )
}

export default SignOutButton
