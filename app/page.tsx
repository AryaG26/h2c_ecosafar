import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, BarChart3, Leaf, MapPin, QrCode, Trophy, Users } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EcoSafar</span>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Track Your Carbon Footprint
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Understand your environmental impact and take action to reduce your carbon footprint with our
                    comprehensive tracking tools.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="group">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] animate-scale-in rounded-full bg-gradient-to-b from-primary/20 to-primary/5 p-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-background p-8">
                      <Leaf className="h-24 w-24 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full bg-muted py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our comprehensive toolkit helps you understand and reduce your environmental impact.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card className="transition-all hover:shadow-lg">
                <CardHeader>
                  <MapPin className="h-10 w-10 text-primary" />
                  <CardTitle>Travel Tracking</CardTitle>
                  <CardDescription>
                    Automatically track your travel history and calculate CO₂ emissions from your journeys.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="transition-all hover:shadow-lg">
                <CardHeader>
                  <QrCode className="h-10 w-10 text-primary" />
                  <CardTitle>Product Scanner</CardTitle>
                  <CardDescription>Scan product barcodes to get instant carbon impact information.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="transition-all hover:shadow-lg">
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-primary" />
                  <CardTitle>Detailed Analytics</CardTitle>
                  <CardDescription>
                    View your daily, weekly, and monthly carbon footprint with detailed breakdowns.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="transition-all hover:shadow-lg">
                <CardHeader>
                  <Leaf className="h-10 w-10 text-primary" />
                  <CardTitle>Personalized Tips</CardTitle>
                  <CardDescription>
                    Get customized recommendations to reduce your carbon footprint based on your habits.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="transition-all hover:shadow-lg">
                <CardHeader>
                  <Trophy className="h-10 w-10 text-primary" />
                  <CardTitle>Eco Challenges</CardTitle>
                  <CardDescription>
                    Complete eco-friendly challenges, earn points, and climb the leaderboard.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="transition-all hover:shadow-lg">
                <CardHeader>
                  <Users className="h-10 w-10 text-primary" />
                  <CardTitle>Community</CardTitle>
                  <CardDescription>
                    Join sustainability events and share your progress with the community.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Join Our Community</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Connect with like-minded individuals, participate in challenges, and make a positive impact on the
                    environment.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg">Sign Up Now</Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <Card className="w-full max-w-sm">
                  <CardHeader>
                    <CardTitle>Community Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-xl font-bold">10,000+</p>
                        <p className="text-sm text-muted-foreground">Active Users</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Leaf className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-xl font-bold">500,000+</p>
                        <p className="text-sm text-muted-foreground">kg CO₂ Saved</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Trophy className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-xl font-bold">25,000+</p>
                        <p className="text-sm text-muted-foreground">Challenges Completed</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-muted-foreground">Join us in making a difference!</p>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">EcoSafar</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} EcoSafar. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

