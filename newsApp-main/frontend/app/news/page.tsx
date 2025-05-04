// app/news/page.tsx
import { NewsCard } from "@/components/news-card"

const API_BASE_URL = "http://localhost:5000/api"

async function getAllNews() {
    const res = await fetch(`${API_BASE_URL}/news`, {
        next: { revalidate: 0 }, // disable caching (optional)
    })

    if (!res.ok) throw new Error("Failed to fetch news")

    return res.json()
}

export default async function AllNewsPage() {
    const newsList = await getAllNews()

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">All News</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsList.map((newsItem: any) => (
                    <NewsCard
                        key={newsItem.id}
                        id={newsItem.id}
                        title={newsItem.title}
                        excerpt={newsItem.description.slice(0, 100)} // assuming `description` exists
                        category={newsItem.category?.title || "Uncategorized"}
                        image={newsItem.image}
                        date={newsItem.created_at}
                    />
                ))}
            </div>
        </div>
    )
}
