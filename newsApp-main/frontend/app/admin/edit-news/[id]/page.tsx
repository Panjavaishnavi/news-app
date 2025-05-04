"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import PrivateRoute from "@/components/private-route"
import { categoryApi, newsApi } from "@/lib/api"

interface Category {
  id: number
  title: string
}

interface NewsItem {
  id: number
  title: string
  description: string
  image: string
  category_id: number
}

export default function EditNewsPage() {
  const params = useParams()
  const newsId = params.id as string

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [image, setImage] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch news article
        const newsData = await newsApi.getNewsById(newsId)
        setTitle(newsData.title)
        setDescription(newsData.description)
        setCategoryId(newsData.category_id.toString())
        setImage(newsData.image || "")

        // Fetch categories
        const categoriesData = await categoryApi.getAllCategories()
        setCategories(categoriesData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load article data",
          variant: "destructive",
        })
        console.error(error)
      } finally {
        setIsFetching(false)
      }
    }

    if (newsId) {
      fetchData()
    }
  }, [newsId, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await newsApi.updateNews(newsId, {
        title,
        description,
        image: image || undefined,
        category_id: Number.parseInt(categoryId),
      })

      toast({
        title: "Success!",
        description: "News article updated successfully.",
      })

      router.push("/admin")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update news article",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <PrivateRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-10 w-64 bg-muted animate-pulse mb-2 rounded"></div>
            <div className="h-6 w-96 bg-muted animate-pulse rounded"></div>
          </div>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <div className="h-8 w-48 bg-muted animate-pulse mb-2 rounded"></div>
              <div className="h-6 w-72 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded"></div>
              ))}
            </CardContent>
          </Card>
        </div>
      </PrivateRoute>
    )
  }

  return (
    <PrivateRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit News Article</h1>
          <p className="text-muted-foreground">Update the details of your news article</p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Article Details</CardTitle>
              <CardDescription>Edit the details for your article</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter article title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Featured Image URL</Label>
                <Input
                  id="image"
                  placeholder="Enter image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Leave empty to use a placeholder image</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Content</Label>
                <Textarea
                  id="description"
                  placeholder="Write your article content here..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[300px]"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Article
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PrivateRoute>
  )
}
