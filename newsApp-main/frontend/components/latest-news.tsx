"use client"

import { useEffect, useState } from "react"
import { NewsCard } from "@/components/news-card"
import { newsApi } from "@/lib/api"

interface NewsItem {
  id: number
  title: string
  description: string
  image: string
  category_id: number
  category_title: string
  created_at: string
}

export function LatestNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsData = await newsApi.getAllNews()
        setNews(newsData.slice(0, 3)) // Get first 3 news items
        setIsLoading(false)
      } catch (err) {
        setError("Failed to load news")
        setIsLoading(false)
        console.error(err)
      }
    }

    fetchNews()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[350px] bg-muted animate-pulse rounded-lg"></div>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((item) => (
        <NewsCard
          key={item.id}
          id={item.id.toString()}
          title={item.title}
          excerpt={item.description.substring(0, 120) + "..."}
          category={item.category_title}
          image={item.image || "/placeholder.svg?height=200&width=400"}
          date={item.created_at}
        />
      ))}
    </div>
  )
}
