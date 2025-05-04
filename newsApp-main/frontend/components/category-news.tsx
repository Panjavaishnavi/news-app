"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Clock } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { categoryApi, newsApi } from "@/lib/api"

interface Category {
  id: number
  title: string
}

interface NewsItem {
  id: number
  title: string
  description: string
  category_id: number
  created_at: string
}

export function CategoryNews() {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryNews, setCategoryNews] = useState<Record<string, NewsItem[]>>({})
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoryApi.getAllCategories()
        setCategories(categoriesData)

        // Fetch all news for initial "all" tab
        const allNews = await newsApi.getAllNews()
        setCategoryNews({ all: allNews })

        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleTabChange = async (value: string) => {
    setActiveCategory(value)

    // If we already have the data, don't fetch again
    if (categoryNews[value]) return

    try {
      if (value === "all") {
        const allNews = await newsApi.getAllNews()
        setCategoryNews((prev) => ({ ...prev, all: allNews }))
      } else {
        const categoryId = categories.find((cat) => cat.title.toLowerCase() === value)?.id
        if (categoryId) {
          const news = await newsApi.getNewsByCategory(categoryId.toString())
          setCategoryNews((prev) => ({ ...prev, [value]: news }))
        }
      }
    } catch (error) {
      console.error(`Failed to fetch news for category ${value}:`, error)
    }
  }

  if (isLoading) {
    return <div className="h-[400px] w-full bg-muted animate-pulse rounded-lg"></div>
  }

  return (
    <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">News Categories</h2>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.slice(0, 6).map((category) => (
            <TabsTrigger key={category.id} value={category.title.toLowerCase()}>
              {category.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categoryNews.all?.slice(0, 4).map((news) => (
          <Card key={news.id}>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{news.title}</CardTitle>
              <CardDescription>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>{new Date(news.created_at).toLocaleDateString()}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm">{news.description.substring(0, 100)}...</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="link" asChild className="px-0">
                <Link href={`/news/${news.id}`}>Read More</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </TabsContent>

      {categories.slice(0, 4).map((category) => (
        <TabsContent
          key={category.id}
          value={category.title.toLowerCase()}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categoryNews[category.title.toLowerCase()]?.slice(0, 4).map((news) => (
            <Card key={news.id}>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{news.title}</CardTitle>
                <CardDescription>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{new Date(news.created_at).toLocaleDateString()}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm">{news.description.substring(0, 100)}...</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button variant="link" asChild className="px-0">
                  <Link href={`/news/${news.id}`}>Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}

          {/* Show placeholder if no news in this category */}
          {(!categoryNews[category.title.toLowerCase()] || categoryNews[category.title.toLowerCase()].length === 0) && (
            <div className="col-span-4 text-center py-8">
              <p className="text-muted-foreground">No news available in this category</p>
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}
