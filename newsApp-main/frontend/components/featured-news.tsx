"use client"

import Link from "next/link"
import Image from "next/image"
import { Clock } from "lucide-react"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { newsApi } from "@/lib/api"

interface NewsItem {
  id: number
  title: string
  description: string
  image: string
  category_title: string
  created_at: string
}

export function FeaturedNews() {
  const [featuredNews, setFeaturedNews] = useState<NewsItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedNews = async () => {
      try {
        const allNews = await newsApi.getAllNews()
        // Get the first news item as featured (in a real app, you might have a featured flag)
        if (allNews.length > 0) {
          setFeaturedNews(allNews[0])
        }
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch featured news:", error)
        setIsLoading(false)
      }
    }

    fetchFeaturedNews()
  }, [])

  if (isLoading) {
    return <div className="relative rounded-lg overflow-hidden h-[500px] bg-muted animate-pulse"></div>
  }

  if (!featuredNews) {
    return (
      <div className="relative rounded-lg overflow-hidden h-[500px] bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No featured news available</p>
      </div>
    )
  }

  return (
    <div className="relative rounded-lg overflow-hidden">
      <div className="relative h-[500px] w-full">
        <Image
          src={featuredNews.image || "/placeholder.svg?height=500&width=1200"}
          alt={featuredNews.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full md:w-2/3">
          <Badge className="mb-4">{featuredNews.category_title || "Breaking News"}</Badge>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">{featuredNews.title}</h1>
          <p className="text-white/80 mb-4 line-clamp-2 md:line-clamp-3">{featuredNews.description}</p>
          <div className="flex items-center text-white/60 text-sm mb-4">
            <Clock className="mr-1 h-4 w-4" />
            <span>{formatDate(featuredNews.created_at)}</span>
          </div>
          <Button asChild>
            <Link href={`/news/${featuredNews.id}`}>Read Full Story</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
