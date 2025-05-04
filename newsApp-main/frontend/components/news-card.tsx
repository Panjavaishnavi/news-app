import Link from "next/link"
import Image from "next/image"
import { Clock } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"

interface NewsCardProps {
  id: string
  title: string
  excerpt: string
  category: string
  image: string
  date: string
}

export function NewsCard({ id, title, excerpt, category, image, date }: NewsCardProps) {
  return (
    <Card className="overflow-hidden">
      <Link href={`/news/${id}`}>
        <div className="relative h-48 w-full">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          <Badge className="absolute top-2 right-2">{category}</Badge>
        </div>
      </Link>
      <CardHeader className="p-4">
        <Link href={`/news/${id}`} className="hover:underline">
          <h3 className="text-xl font-bold line-clamp-2">{title}</h3>
        </Link>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3">{excerpt}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          <span>{formatDate(date)}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
