"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"

const activeChallenges = [
  {
    id: 1,
    title: "Zero Waste Week",
    description: "Produce no landfill waste for an entire week",
    category: "Waste",
    difficulty: "Medium",
    progress: 60,
    points: 500,
    daysLeft: 3,
    tasks: [
      { name: "Use reusable shopping bags", completed: true },
      { name: "Avoid single-use plastics", completed: true },
      { name: "Compost food scraps", completed: false },
      { name: "Buy package-free products", completed: true },
      { name: "Repair instead of replace", completed: false },
    ],
  },
  {
    id: 2,
    title: "Bike to Work",
    description: "Use a bicycle for your commute 3 times this week",
    category: "Transportation",
    difficulty: "Easy",
    progress: 33,
    points: 300,
    daysLeft: 5,
    tasks: [
      { name: "Bike to work on Monday", completed: true },
      { name: "Bike to work on Wednesday", completed: false },
      { name: "Bike to work on Friday", completed: false },
    ],
  },
]

const availableChallenges = [
  {
    id: 3,
    title: "Local Food Challenge",
    description: "Eat only locally sourced food for 5 days",
    category: "Food",
    difficulty: "Hard",
    points: 400,
    duration: "5 days",
  },
  {
    id: 4,
    title: "Energy Saver",
    description: "Reduce your home energy consumption by 20%",
    category: "Energy",
    difficulty: "Medium",
    points: 350,
    duration: "2 weeks",
  },
]

const leaderboard = [
  { rank: 1, name: "Sarah Johnson", points: 2450, avatar: "/placeholder.svg" },
  { rank: 2, name: "Michael Chen", points: 2340, avatar: "/placeholder.svg" },
  { rank: 3, name: "Emma Wilson", points: 2180, avatar: "/placeholder.svg" },
  { rank: 4, name: "David Kim", points: 1950, avatar: "/placeholder.svg" },
  { rank: 5, name: "You", points: 1820, avatar: "/placeholder.svg", isUser: true },
]

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState("active")
  const { toast } = useToast()

  const handleJoinChallenge = (challengeId:number) => {
    toast({ title: "Challenge joined!", description: "You've successfully joined this challenge." })
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Eco Challenges</h1>

      <Tabs defaultValue="active" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active Challenges</TabsTrigger>
          <TabsTrigger value="available">Available Challenges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {activeChallenges.map((challenge) => (
            <Card key={challenge.id} className="p-4">
              <CardHeader>
                <CardTitle>{challenge.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{challenge.description}</p>
                <Progress value={challenge.progress} className="mt-2" />
                <p className="mt-2 text-sm">{challenge.daysLeft} days left</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="available">
          {availableChallenges.map((challenge) => (
            <Card key={challenge.id} className="p-4">
              <CardHeader>
                <CardTitle>{challenge.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{challenge.description}</p>
                <Button className="mt-2" onClick={() => handleJoinChallenge(challenge.id)}>
                  Join Challenge
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="leaderboard">
          <div className="space-y-4">
            {leaderboard.map((user) => (
              <div key={user.rank} className="flex items-center gap-4 p-2 border rounded-md">
                <Image src={user.avatar} alt={user.name} width={40} height={40} className="rounded-full" />
                <div>
                  <p className="font-bold">{user.name}</p>
                  <p className="text-sm">{user.points} points</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}