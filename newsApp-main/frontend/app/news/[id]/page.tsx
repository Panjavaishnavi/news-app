"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Clock, User } from "lucide-react"
import { useParams } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"
import { newsApi } from "@/lib/api"

interface NewsItem {
  id: number
  title: string
  description: string
  image: string
  category_id: number
  user_id: number
  category_title: string
  author: string
  created_at: string
  updated_at: string
}

export default function NewsDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [article, setArticle] = useState<NewsItem | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleData = await newsApi.getNewsById(id)
        setArticle(articleData)

        // Fetch related articles from the same category
        if (articleData.category_id) {
          const categoryNews = await newsApi.getNewsByCategory(articleData.category_id.toString())
          // Filter out the current article and limit to 3
          const related = categoryNews.filter((news: NewsItem) => news.id !== articleData.id).slice(0, 3)
          setRelatedArticles(related)
        }

        setIsLoading(false)
      } catch (err) {
        setError("Failed to load article")
        setIsLoading(false)
        console.error(err)
      }
    }

    if (id) {
      fetchArticle()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 w-24 bg-muted animate-pulse mb-4 rounded"></div>
          <div className="h-12 w-full bg-muted animate-pulse mb-4 rounded"></div>
          <div className="h-6 w-48 bg-muted animate-pulse mb-6 rounded"></div>
          <div className="h-[400px] w-full bg-muted animate-pulse mb-8 rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-6 w-full bg-muted animate-pulse rounded"></div>
            <div className="h-6 w-full bg-muted animate-pulse rounded"></div>
            <div className="h-6 w-3/4 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p>{error || "Article not found"}</p>
          <Button asChild className="mt-4">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Badge className="mb-4">{article.category_title}</Badge>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{article.title}</h1>
        <div className="flex items-center text-muted-foreground mb-6">
          <div className="flex items-center mr-4">
            <User className="mr-1 h-4 w-4" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span>{formatDate(article.created_at)}</span>
          </div>
        </div>
        <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={article.image || "/placeholder.svg?height=500&width=1200"}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
          {/* Split description into paragraphs for better readability */}
          {article.description.split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {relatedArticles.length > 0 && (
          <>
            <Separator className="my-8" />
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link key={related.id} href={`/news/${related.id}`} className="group">
                    <div className="relative h-40 w-full mb-2 rounded-lg overflow-hidden">
                      <Image
                        src={related.image || "/placeholder.svg?height=200&width=400"}
                        alt={related.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-semibold group-hover:underline">{related.title}</h3>
                    <p className="text-sm text-muted-foreground">{related.description.substring(0, 100)}...</p>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex justify-between items-center">
          <Button variant="outline" asChild>
            <Link href="/news">Back to News</Link>
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Share
            </Button>
            <Button variant="outline" size="sm">
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
