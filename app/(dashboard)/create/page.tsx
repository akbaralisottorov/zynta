"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Mic, Upload, LayoutGrid, Copy, Image as ImageIcon, FileText, Activity, Tag, Twitter, Instagram, Video, Youtube, Mail, Send } from "lucide-react"

export default function CreatePage() {
    const [prompt, setPrompt] = useState("")
    const [style, setStyle] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)

    const handleGenerate = async () => {
        if (!prompt) return

        setLoading(true)
        setResult(null)

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, style }),
            })

            const data = await res.json()
            if (res.ok) {
                setResult(data)
            } else {
                alert(data.error || "Xatolik yuz berdi")
            }
        } catch (error) {
            console.error(error)
            alert("Xatolik yuz berdi")
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        alert("Nusxalandi!")
    }

    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6 md:space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Post Yaratish</h1>
                    <p className="text-muted-foreground mt-1">Barcha ijtimoiy tarmoqlar uchun optimal kontent yarating.</p>
                </div>
                <Button variant="outline" className="gap-2">
                    Qoralamalar
                </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
                {/* Left Column: Input */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="border-gray-200 dark:border-gray-800 shadow-sm h-full">
                        <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                            <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                <LayoutGrid className="h-5 w-5 text-gray-500" />
                                Input & Konfiguratsiya
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-3">
                                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Post nima haqida?
                                </Label>
                                <div className="relative">
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Masalan: Yangi qahva brendimizning ochilish marosimi haqida..."
                                        className="w-full min-h-[200px] p-4 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    />
                                    <button className="absolute bottom-3 right-3 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                        <Mic className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Kontekst (Rasm/Audio)
                                </Label>
                                <div className="border border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3 text-gray-500 group-hover:text-gray-700 dark:text-gray-400">
                                        <Upload className="h-5 w-5" />
                                        <span className="text-sm">Fayllarni yuklash</span>
                                    </div>
                                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-medium">Optional</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Uslub va Ohang
                                    </Label>
                                    <button className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium">
                                        <Sparkles className="h-3 w-3" />
                                        Tahlil qilish
                                    </button>
                                </div>
                                <div className="relative">
                                    <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        value={style}
                                        onChange={(e) => setStyle(e.target.value)}
                                        placeholder="Masalan: Rasmiy, samimiy, emojilar bilan..."
                                        className="pl-9 h-11 rounded-xl border-gray-200 dark:border-gray-700"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleGenerate}
                                disabled={loading || !prompt}
                                className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Yaratilmoqda...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        Post Yaratish
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Results & AI Visual */}
                <div className="lg:col-span-7 space-y-6">

                    {/* AI Visual Proposal */}
                    <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
                        <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                            <CardTitle className="flex items-center gap-2 text-base font-semibold text-blue-600">
                                <ImageIcon className="h-5 w-5" />
                                AI VIZUAL TAKLIFI (PROMPT & RASM)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex gap-6 flex-col md:flex-row">
                                <div className="w-full md:w-1/3 aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center border border-gray-200 dark:border-gray-700 overflow-hidden relative group">
                                    {result && result.image_prompt ? (
                                        <>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={`https://image.pollinations.ai/prompt/${encodeURIComponent(result.image_prompt)}?width=1024&height=1024&nologo=true`}
                                                alt="AI Generated"
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                        </>
                                    ) : (
                                        <ImageIcon className="h-12 w-12 text-gray-300" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Image Prompt (Ingliz tilida)</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">
                                            {result ? `"${result.image_prompt}"` : "Hozircha prompt yo'q. Post yarating va bu yerda rasm uchun g'oya paydo bo'ladi."}
                                        </p>
                                    </div>
                                    {result && (
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="gap-2" onClick={() => copyToClipboard(result.image_prompt)}>
                                                <Copy className="h-4 w-4" />
                                                Promptni nusxalash
                                            </Button>
                                            <Button size="sm" className="gap-2" onClick={() => window.open(`https://image.pollinations.ai/prompt/${encodeURIComponent(result.image_prompt)}`, '_blank')}>
                                                <ImageIcon className="h-4 w-4" />
                                                Rasmni yuklab olish
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Analysis Cards */}
                    {result && (
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                                        <FileText className="h-4 w-4" />
                                        CONTENT SUMMARY
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-6">
                                        {result.analysis.summary}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-sm font-semibold text-pink-600">
                                        <Activity className="h-4 w-4" />
                                        TONE DETECTED
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Professional, Engaging</p>
                                        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-pink-500 w-3/4"></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-sm font-semibold text-green-600">
                                        <Tag className="h-4 w-4" />
                                        KEYWORDS
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {result.analysis.keywords.map((k: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="text-[10px] bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                                                #{k}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Results Tabs */}
                    {result && (
                        <Tabs defaultValue="twitter" className="w-full">
                            <TabsList className="w-full justify-start h-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-none p-0 space-x-6 overflow-x-auto">
                                <TabsTrigger value="twitter" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none h-full px-0 bg-transparent">
                                    <Twitter className="h-4 w-4 mr-2" /> Twitter
                                </TabsTrigger>
                                <TabsTrigger value="instagram" className="data-[state=active]:border-b-2 data-[state=active]:border-pink-500 data-[state=active]:text-pink-600 rounded-none h-full px-0 bg-transparent">
                                    <Instagram className="h-4 w-4 mr-2" /> Instagram
                                </TabsTrigger>
                                <TabsTrigger value="tiktok" className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black dark:data-[state=active]:border-white dark:data-[state=active]:text-white rounded-none h-full px-0 bg-transparent">
                                    <Video className="h-4 w-4 mr-2" /> TikTok
                                </TabsTrigger>
                                <TabsTrigger value="youtube" className="data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-red-600 rounded-none h-full px-0 bg-transparent">
                                    <Youtube className="h-4 w-4 mr-2" /> Youtube
                                </TabsTrigger>
                                <TabsTrigger value="substack" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 rounded-none h-full px-0 bg-transparent">
                                    <Mail className="h-4 w-4 mr-2" /> Substack
                                </TabsTrigger>
                                <TabsTrigger value="telegram" className="data-[state=active]:border-b-2 data-[state=active]:border-sky-500 data-[state=active]:text-sky-600 rounded-none h-full px-0 bg-transparent">
                                    <Send className="h-4 w-4 mr-2" /> Telegram
                                </TabsTrigger>
                            </TabsList>

                            <div className="mt-6">
                                <TabsContent value="twitter" className="space-y-4">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <Twitter className="h-5 w-5 text-blue-500" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">Twitter Thread</h3>
                                                    <p className="text-xs text-muted-foreground">Optimized for engagement</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" className="gap-2" onClick={() => copyToClipboard(result.content.twitter)}>
                                                <Copy className="h-4 w-4" />
                                                Nusxalash
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                                            <pre className="whitespace-pre-wrap font-sans text-sm">{result.content.twitter}</pre>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="instagram" className="space-y-4">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                                                    <Instagram className="h-5 w-5 text-pink-500" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">Instagram Post</h3>
                                                    <p className="text-xs text-muted-foreground">Caption & Hashtags</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" className="gap-2" onClick={() => copyToClipboard(result.content.instagram.reels_caption)}>
                                                <Copy className="h-4 w-4" />
                                                Nusxalash
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                                            <pre className="whitespace-pre-wrap font-sans text-sm">{result.content.instagram.reels_caption}</pre>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="tiktok" className="space-y-4">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <Video className="h-5 w-5 text-black" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">TikTok Script</h3>
                                                    <p className="text-xs text-muted-foreground">Viral structure</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" className="gap-2" onClick={() => copyToClipboard(result.content.tiktok)}>
                                                <Copy className="h-4 w-4" />
                                                Nusxalash
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                                            <pre className="whitespace-pre-wrap font-sans text-sm">{result.content.tiktok}</pre>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="youtube" className="space-y-4">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                                    <Youtube className="h-5 w-5 text-red-500" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">YouTube Description</h3>
                                                    <p className="text-xs text-muted-foreground">SEO Optimized</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" className="gap-2" onClick={() => copyToClipboard(result.content.youtube)}>
                                                <Copy className="h-4 w-4" />
                                                Nusxalash
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                                            <pre className="whitespace-pre-wrap font-sans text-sm">{result.content.youtube}</pre>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="substack" className="space-y-4">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                                    <Mail className="h-5 w-5 text-orange-500" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">Substack Article</h3>
                                                    <p className="text-xs text-muted-foreground">Long-form content</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" className="gap-2" onClick={() => copyToClipboard(result.content.substack)}>
                                                <Copy className="h-4 w-4" />
                                                Nusxalash
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                                            <div dangerouslySetInnerHTML={{ __html: result.content.substack }} />
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="telegram" className="space-y-4">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center">
                                                    <Send className="h-5 w-5 text-sky-500" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">Telegram Post</h3>
                                                    <p className="text-xs text-muted-foreground">Formatted for reading</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" className="gap-2" onClick={() => copyToClipboard(result.content.telegram.long)}>
                                                <Copy className="h-4 w-4" />
                                                Nusxalash
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                                            <pre className="whitespace-pre-wrap font-sans text-sm">{result.content.telegram.long}</pre>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </div>
                        </Tabs>
                    )}
                </div>
            </div>
        </div>
    )
}
