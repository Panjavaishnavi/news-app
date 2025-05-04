import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">NewsNow</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Delivering the latest and most important news from around the world.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/politics" className="text-muted-foreground hover:text-foreground">
                  Politics
                </Link>
              </li>
              <li>
                <Link href="/category/technology" className="text-muted-foreground hover:text-foreground">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/category/health" className="text-muted-foreground hover:text-foreground">
                  Health
                </Link>
              </li>
              <li>
                <Link href="/category/sports" className="text-muted-foreground hover:text-foreground">
                  Sports
                </Link>
              </li>
              <li>
                <Link href="/category/entertainment" className="text-muted-foreground hover:text-foreground">
                  Entertainment
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} NewsNow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
