import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import { FeaturedNews } from "@/components/featured-news"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { LatestNews } from "@/components/latest-news"
import { CategoryNews } from "@/components/category-news"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <Suspense fallback={<div className="h-[500px] w-full bg-muted animate-pulse rounded-lg"></div>}>
          <FeaturedNews />
        </Suspense>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Latest News</h2>
          <Button variant="outline" asChild>
            <Link href="/news">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[350px] bg-muted animate-pulse rounded-lg"></div>
              ))}
            </div>
          }
        >
          <LatestNews />
        </Suspense>
      </section>

      <section className="mb-12">
        <Suspense fallback={<div className="h-[400px] w-full bg-muted animate-pulse rounded-lg"></div>}>
          <CategoryNews />
        </Suspense>
      </section>

      <section>
        <NewsletterSignup />
      </section>
    </div>
  )
}
