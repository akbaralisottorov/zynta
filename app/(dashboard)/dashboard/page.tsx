import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { ArrowRight, FileText, Sparkles } from "lucide-react"
import Link from "next/link"
import { UserNotFound } from "@/components/user-not-found"

export default async function DashboardPage() {
    const session = await getServerSession()

    if (!session?.user?.email) return null

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            _count: {
                select: { generationLogs: true }
            },
            generationLogs: {
                take: 3,
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!user) {
        return <UserNotFound />
    }

    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <Link
                    href="/create"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md inline-flex items-center justify-center text-sm font-medium transition-colors"
                >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Yangi Post
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Jami Postlar
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{user._count.generationLogs}</div>
                        <p className="text-xs text-muted-foreground">
                            +0% o'tgan oyga nisbatan
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Kreditlar
                        </CardTitle>
                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">∞</div>
                        <p className="text-xs text-muted-foreground">
                            Cheksiz reja
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Oxirgi Faoliyat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {user.generationLogs.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Hozircha hech qanday post yaratilmagan.</p>
                            ) : (
                                user.generationLogs.map((log) => (
                                    <div key={log.id} className="flex items-center">
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none line-clamp-1">{log.prompt}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(log.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium">
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Completed</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {user.generationLogs.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                                <Link href="/library" className="text-sm text-blue-600 hover:underline flex items-center">
                                    Barchasini ko'rish <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
