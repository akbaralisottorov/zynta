"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function UserNotFound() {
    return (
        <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-2xl font-bold text-red-600">Xatolik!</h2>
            <p className="text-muted-foreground">
                Foydalanuvchi bazadan topilmadi. Iltimos, qaytadan tizimga kiring.
            </p>
            <Button
                variant="destructive"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="gap-2"
            >
                <LogOut className="h-4 w-4" />
                Chiqish va Qaytadan Kirish
            </Button>
        </div>
    )
}
