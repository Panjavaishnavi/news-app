"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { NewsCard } from "@/components/news-card"
import { newsApi, categoryApi } from "@/lib/api"

interface NewsItem {
  id: number
  title: string
  description: string
  image: string
  category_id: number
  category_title: string
  created_at: string
}

interface Category {
  id: number
  title: string
}

export default function CategoryPage() {
  const params = useParams()
  const categoryId = params.id as string

  const [category, setCategory] = useState<Category | null>(null)
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategoryAndNews = async () => {
      try {
        // First get all categories to find the one we need
        const categories = await categoryApi.getAllCategories()
        const currentCategory = categories.find(
          (cat: Category) => cat.id.toString() === categoryId || cat.title.toLowerCase() === categoryId.toLowerCase(),
        )

        if (currentCategory) {
          setCategory(currentCategory)

          // Now fetch news for this category
          const categoryNews = await newsApi.getNewsByCategory(currentCategory.id.toString())
          setNewsItems(categoryNews)
        } else {
          setError("Category not found")
        }

        setIsLoading(false)
      } catch (err) {
        setError("Failed to load category data")
        setIsLoading(false)
        console.error(err)
      }
    }

    fetchCategoryAndNews()
  }, [categoryId])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-6 w-24 bg-muted animate-pulse mb-2 rounded"></div>
          <div className="h-10 w-64 bg-muted animate-pulse mb-2 rounded"></div>
          <div className="h-6 w-96 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[350px] bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p>{error || "Category not found"}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Badge className="mb-2">{category.title}</Badge>
        <h1 className="text-3xl md:text-4xl font-bold">{category.title} News</h1>
        <p className="text-muted-foreground mt-2">
          The latest news and updates from the world of {category.title.toLowerCase()}.
        </p>
      </div>

      {newsItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((news) => (
            <NewsCard
              key={news.id}
              id={news.id.toString()}
              title={news.title}
              excerpt={news.description.substring(0, 120) + "..."}
              category={news.category_title || category.title}
              image={news.image || "/placeholder.svg?height=200&width=400"}
              date={news.created_at}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No news articles found in this category.</p>
        </div>
      )}
    </div>
  )
}
