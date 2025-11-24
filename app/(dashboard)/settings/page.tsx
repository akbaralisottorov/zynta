"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Sozlamalar</h2>
                <p className="text-muted-foreground">
                    Shaxsiy ma'lumotlar va uslub sozlamalari
                </p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Shaxsiy Uslub (Tez orada)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="style">Standart Uslub</Label>
                            <Input id="style" placeholder="Masalan: Rasmiy, Hazilkash, Ilmiy..." />
                        </div>
                        <Button>Saqlash</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
