"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, Twitter, Instagram, Video, Youtube, Mail, Send, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function PostDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [post, setPost] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPost()
    }, [])

    const fetchPost = async () => {
        try {
            const res = await fetch(`/api/logs/${params.id}`)
            const data = await res.json()
            if (data.content) {
                data.parsedContent = JSON.parse(data.content)
            }
            setPost(data)
        } catch (error) {
            console.error("Failed to fetch post:", error)
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        alert("Nusxalandi!")
    }

    if (loading) {
        return (
            <div className="p-4 md:p-8">
                <p>Yuklanmoqda...</p>
            </div>
        )
    }

    if (!post) {
        return (
            <div className="p-4 md:p-8">
                <p>Post topilmadi</p>
                <Button onClick={() => router.push("/library")} className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kutubxonaga qaytish
                </Button>
            </div>
        )
    }

    const result = post.parsedContent

    if (!result) {
        return (
            <div className="p-4 md:p-8 space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push("/library")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{post.prompt}</h1>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {post.createdAt ? (
                                formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
                            ) : (
                                <span>Sana mavjud emas</span>
                            )}
                        </div>
                    </div>
                </div>
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        Ushbu post uchun to'liq ma'lumot saqlanmagan (eski versiya).
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push("/library")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{post.prompt}</h1>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </div>
                </div>
            </div>

            {/* Analysis Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-blue-600">CONTENT SUMMARY</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{result.analysis.summary}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-pink-600">TONE DETECTED</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{result.analysis.tone}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-green-600">KEYWORDS</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {result.analysis.keywords.map((k: string, i: number) => (
                                <Badge key={i} variant="secondary" className="text-[10px]">#{k}</Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="twitter" className="w-full">
                <TabsList className="w-full justify-start h-12 bg-white dark:bg-gray-800 border-b rounded-none p-0 space-x-6 overflow-x-auto">
                    <TabsTrigger value="twitter" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-full px-0 bg-transparent">
                        <Twitter className="h-4 w-4 mr-2" /> Twitter
                    </TabsTrigger>
                    <TabsTrigger value="instagram" className="data-[state=active]:border-b-2 data-[state=active]:border-pink-500 rounded-none h-full px-0 bg-transparent">
                        <Instagram className="h-4 w-4 mr-2" /> Instagram
                    </TabsTrigger>
                    <TabsTrigger value="tiktok" className="data-[state=active]:border-b-2 data-[state=active]:border-black dark:data-[state=active]:border-white rounded-none h-full px-0 bg-transparent">
                        <Video className="h-4 w-4 mr-2" /> TikTok
                    </TabsTrigger>
                    <TabsTrigger value="youtube" className="data-[state=active]:border-b-2 data-[state=active]:border-red-500 rounded-none h-full px-0 bg-transparent">
                        <Youtube className="h-4 w-4 mr-2" /> Youtube
                    </TabsTrigger>
                    <TabsTrigger value="substack" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none h-full px-0 bg-transparent">
                        <Mail className="h-4 w-4 mr-2" /> Substack
                    </TabsTrigger>
                    <TabsTrigger value="telegram" className="data-[state=active]:border-b-2 data-[state=active]:border-sky-500 rounded-none h-full px-0 bg-transparent">
                        <Send className="h-4 w-4 mr-2" /> Telegram
                    </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="twitter">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between py-4">
                                <h3 className="font-semibold">Twitter Thread</h3>
                                <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.content.twitter)}>
                                    <Copy className="h-4 w-4 mr-2" /> Nusxalash
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <pre className="whitespace-pre-wrap font-sans text-sm">{result.content.twitter}</pre>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="instagram">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between py-4">
                                <h3 className="font-semibold">Instagram Post</h3>
                                <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.content.instagram.reels_caption)}>
                                    <Copy className="h-4 w-4 mr-2" /> Nusxalash
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <pre className="whitespace-pre-wrap font-sans text-sm">{result.content.instagram.reels_caption}</pre>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="tiktok">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between py-4">
                                <h3 className="font-semibold">TikTok Script</h3>
                                <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.content.tiktok)}>
                                    <Copy className="h-4 w-4 mr-2" /> Nusxalash
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <pre className="whitespace-pre-wrap font-sans text-sm">{result.content.tiktok}</pre>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="youtube">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between py-4">
                                <h3 className="font-semibold">YouTube Description</h3>
                                <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.content.youtube)}>
                                    <Copy className="h-4 w-4 mr-2" /> Nusxalash
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <pre className="whitespace-pre-wrap font-sans text-sm">{result.content.youtube}</pre>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="substack">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between py-4">
                                <h3 className="font-semibold">Substack Article</h3>
                                <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.content.substack)}>
                                    <Copy className="h-4 w-4 mr-2" /> Nusxalash
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div dangerouslySetInnerHTML={{ __html: result.content.substack }} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="telegram">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between py-4">
                                <h3 className="font-semibold">Telegram Post</h3>
                                <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.content.telegram.long)}>
                                    <Copy className="h-4 w-4 mr-2" /> Nusxalash
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <pre className="whitespace-pre-wrap font-sans text-sm">{result.content.telegram.long}</pre>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
