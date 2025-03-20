"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { Battery, Car, Leaf, ShoppingBag, Utensils, Trophy } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

// Mock data for the dashboard
const carbonData = {
  daily: {
    total: 12.4,
    target: 15,
    breakdown: [
      { category: "Travel", value: 5.2, icon: Car, color: "text-blue-500" },
      { category: "Food", value: 3.8, icon: Utensils, color: "text-orange-500" },
      { category: "Energy", value: 2.1, icon: Battery, color: "text-yellow-500" },
      { category: "Shopping", value: 1.3, icon: ShoppingBag, color: "text-purple-500" },
    ],
  },
  weekly: {
    total: 78.5,
    target: 105,
    breakdown: [
      { category: "Travel", value: 32.4, icon: Car, color: "text-blue-500" },
      { category: "Food", value: 24.6, icon: Utensils, color: "text-orange-500" },
      { category: "Energy", value: 14.2, icon: Battery, color: "text-yellow-500" },
      { category: "Shopping", value: 7.3, icon: ShoppingBag, color: "text-purple-500" },
    ],
  },
  monthly: {
    total: 310.2,
    target: 450,
    breakdown: [
      { category: "Travel", value: 142.8, icon: Car, color: "text-blue-500" },
      { category: "Food", value: 98.4, icon: Utensils, color: "text-orange-500" },
      { category: "Energy", value: 45.6, icon: Battery, color: "text-yellow-500" },
      { category: "Shopping", value: 23.4, icon: ShoppingBag, color: "text-purple-500" },
    ],
  },
}

const tips = [
  {
    title: "Use public transportation",
    description: "Taking the bus or train can reduce your carbon footprint by up to 70% compared to driving alone.",
    savings: 2.3,
  },
  {
    title: "Reduce meat consumption",
    description: "Try having one meat-free day per week to reduce your food-related emissions.",
    savings: 1.5,
  },
  {
    title: "Optimize home energy use",
    description: "Lower your thermostat by 1°C to save up to 10% on your heating bill and reduce emissions.",
    savings: 0.8,
  },
]

const challenges = [
  {
    title: "Zero Waste Week",
    description: "Produce no landfill waste for an entire week",
    progress: 60,
    points: 500,
  },
  {
    title: "Bike to Work",
    description: "Use a bicycle for your commute 3 times this week",
    progress: 33,
    points: 300,
  },
  {
    title: "Local Food Challenge",
    description: "Eat only locally sourced food for 5 days",
    progress: 80,
    points: 400,
  },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("daily")
  const { toast } = useToast()

  const data = carbonData[activeTab as keyof typeof carbonData]
  const progressPercentage = (data.total / data.target) * 100

  const handleAcceptChallenge = () => {
    toast({
      title: "Challenge accepted!",
      description: "Good luck with your new eco-challenge!",
    })
  }

  const handleApplyTip = () => {
    toast({
      title: "Tip saved!",
      description: "This tip has been added to your action plan.",
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.email}</h1>
      </div>

      <Tabs defaultValue="daily" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Carbon Footprint</CardTitle>
                <Leaf className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.total} kg CO₂e</div>
                <p className="text-xs text-muted-foreground">
                  {progressPercentage < 100
                    ? `${(100 - progressPercentage).toFixed(0)}% below your daily target`
                    : `${(progressPercentage - 100).toFixed(0)}% above your daily target`}
                </p>
                <Progress
                  value={progressPercentage > 100 ? 100 : progressPercentage}
                  className="mt-2"
                  indicatorColor={progressPercentage < 100 ? "bg-primary" : "bg-destructive"}
                />
              </CardContent>
            </Card>

            {data.breakdown.map((item) => (
              <Card key={item.category}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{item.category}</CardTitle>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.value} kg CO₂e</div>
                  <p className="text-xs text-muted-foreground">
                    {((item.value / data.total) * 100).toFixed(0)}% of your footprint
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Carbon Footprint</CardTitle>
                <Leaf className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.total} kg CO₂e</div>
                <p className="text-xs text-muted-foreground">
                  {progressPercentage < 100
                    ? `${(100 - progressPercentage).toFixed(0)}% below your weekly target`
                    : `${(progressPercentage - 100).toFixed(0)}% above your weekly target`}
                </p>
                <Progress
                  value={progressPercentage > 100 ? 100 : progressPercentage}
                  className="mt-2"
                  indicatorColor={progressPercentage < 100 ? "bg-primary" : "bg-destructive"}
                />
              </CardContent>
            </Card>

            {data.breakdown.map((item) => (
              <Card key={item.category}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{item.category}</CardTitle>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.value} kg CO₂e</div>
                  <p className="text-xs text-muted-foreground">
                    {((item.value / data.total) * 100).toFixed(0)}% of your footprint
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Carbon Footprint</CardTitle>
                <Leaf className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.total} kg CO₂e</div>
                <p className="text-xs text-muted-foreground">
                  {progressPercentage < 100
                    ? `${(100 - progressPercentage).toFixed(0)}% below your monthly target`
                    : `${(progressPercentage - 100).toFixed(0)}% above your monthly target`}
                </p>
                <Progress
                  value={progressPercentage > 100 ? 100 : progressPercentage}
                  className="mt-2"
                  indicatorColor={progressPercentage < 100 ? "bg-primary" : "bg-destructive"}
                />
              </CardContent>
            </Card>

            {data.breakdown.map((item) => (
              <Card key={item.category}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{item.category}</CardTitle>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.value} kg CO₂e</div>
                  <p className="text-xs text-muted-foreground">
                    {((item.value / data.total) * 100).toFixed(0)}% of your footprint
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personalized Tips</CardTitle>
            <CardDescription>Recommendations to reduce your carbon footprint</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tips.map((tip, index) => (
              <div key={index} className="flex flex-col space-y-2 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{tip.title}</h3>
                  <span className="flex items-center text-sm text-primary">
                    <Leaf className="mr-1 h-4 w-4" />
                    Save {tip.savings} kg CO₂e/day
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
                <Button size="sm" onClick={handleApplyTip}>
                  Apply This Tip
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Challenges</CardTitle>
            <CardDescription>Complete eco-friendly challenges to earn points</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {challenges.map((challenge, index) => (
              <div key={index} className="flex flex-col space-y-2 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{challenge.title}</h3>
                  <span className="flex items-center text-sm text-primary">
                    <Trophy className="mr-1 h-4 w-4" />
                    {challenge.points} points
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{challenge.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{challenge.progress}%</span>
                  </div>
                  <Progress value={challenge.progress} />
                </div>
                {challenge.progress < 100 && (
                  <Button size="sm" variant="outline" onClick={handleAcceptChallenge}>
                    Continue Challenge
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

