"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium">
                  Home
                </Link>
                <Link href="/news" className="text-sm font-medium">
                  news
                </Link>
                <Link href="/category/Business" className="text-lg font-medium">
                  Business
                </Link>
                <Link href="/category/Politics" className="text-lg font-medium">
                  Politics
                </Link>
                <Link href="/category/technology" className="text-lg font-medium">
                  Technology
                </Link>
                <Link href="/category/Science" className="text-lg font-medium">
                  Science
                </Link>
                <Link href="/category/Sports" className="text-lg font-medium">
                  Sports
                </Link>
                <Link href="/category/Entertainment" className="text-lg font-medium">
                  Entertainment
                </Link>
                <Link href="/news" className="text-sm font-medium">
                  news
                </Link>
                <Link href="/contact" className="text-lg font-medium">
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">NewsNow</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link href="/news" className="text-sm font-medium">
              news
            </Link>
            <Link href="/category/Business" className="text-sm font-medium">
              Business
            </Link>
            <Link href="/category/Politics" className="text-sm font-medium">
              Politics
            </Link>
            <Link href="/category/technology" className="text-sm font-medium">
              Technology
            </Link>
            <Link href="/category/Science" className="text-sm font-medium">
              Science
            </Link>
            <Link href="/category/Sports" className="text-sm font-medium">
              Sports
            </Link>
            <Link href="/category/Entertainment" className="text-sm font-medium">
              Entertainment
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {isSearchOpen ? (
            <div className="flex items-center">
              <Input type="search" placeholder="Search..." className="w-[200px] md:w-[300px]" autoFocus />
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close search</span>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}
          <ThemeToggle />
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
