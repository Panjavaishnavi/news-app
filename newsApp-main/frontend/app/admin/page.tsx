"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BarChart3, FileText, PlusCircle, Settings, Users, Trash2, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PrivateRoute from "@/components/private-route"
import { newsApi, categoryApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface User {
  name: string
  email: string
  role: string
}

interface NewsItem {
  id: number
  title: string
  created_at: string
}

interface Category {
  id: number
  title: string
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [recentNews, setRecentNews] = useState<NewsItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [newsCount, setNewsCount] = useState(0)
  const [categoryCount, setCategoryCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch all news
        const allNews = await newsApi.getAllNews()
        setNewsCount(allNews.length)
        setRecentNews(allNews.slice(0, 5)) // Get 5 most recent news

        // Fetch all categories
        const allCategories = await categoryApi.getAllCategories()
        setCategoryCount(allCategories.length)
        setCategories(allCategories.slice(0, 6)) // Get 5 categories
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  const handleDeleteNews = async (id: number) => {
    try {
      await newsApi.deleteNews(id.toString())

      // Update the news list
      setRecentNews(recentNews.filter((news) => news.id !== id))
      setNewsCount((prev) => prev - 1)

      toast({
        title: "Success",
        description: "News article deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete news article",
        variant: "destructive",
      })
    }
  }

  return (
    <PrivateRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name || "Admin"}</p>
          </div>
          <Button asChild>
            <Link href="/admin/create-news">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create News Article
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newsCount}</div>
              <p className="text-xs text-muted-foreground">From your news database</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,231</div>
              <p className="text-xs text-muted-foreground">Analytics data (example)</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categoryCount}</div>
              <p className="text-xs text-muted-foreground">Available for classification</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,891</div>
              <p className="text-xs text-muted-foreground">Newsletter subscribers (example)</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Articles</CardTitle>
              <CardDescription>Your most recently published articles</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 bg-muted animate-pulse rounded"></div>
                  ))}
                </div>
              ) : recentNews.length > 0 ? (
                <div className="space-y-4">
                  {recentNews.map((news) => (
                    <div key={news.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{news.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Published on {new Date(news.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/edit-news/${news.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the article.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteNews(news.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">No articles found</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Available news categories</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-12 bg-muted animate-pulse rounded"></div>
                  ))}
                </div>
              ) : categories.length > 0 ? (
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{category.title}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/category/${category.id}`}>View</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">No categories found</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PrivateRoute>
  )
}
