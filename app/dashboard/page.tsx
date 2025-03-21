"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/auth-provider";
import { Battery, Car, Leaf, Utensils, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const fetchTravelSummary = async () => {
  try {
    const response = await fetch("/api/summary");
    if (!response.ok) throw new Error("Failed to fetch travel data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching travel summary:", error);
    return { totalDistance: 0, totalEmissions: 0 };
  }
};

const fetchFoodEmissions = async () => {
  try {
    const response = await fetch("/api/foodEmissions");
    if (!response.ok) throw new Error("Failed to fetch food emissions");
    const data = await response.json();
    return data.totalEmissions;
  } catch (error) {
    console.error("Error fetching food emissions:", error);
    return 0;
  }
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("daily");
  const [travelData, setTravelData] = useState({ totalDistance: 0, totalEmissions: 0 });
  const [foodEmissions, setFoodEmissions] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const travelSummary = await fetchTravelSummary();
      setTravelData(travelSummary);

      const foodEmissionData = await fetchFoodEmissions();
      setFoodEmissions(foodEmissionData);
    };
    fetchData();
  }, []);

  const carbonData = {
    daily: {
      total: travelData.totalEmissions + foodEmissions + 6.59,
      target: 15,
      breakdown: [
        { category: "Travel", value: travelData.totalEmissions, icon: Car, color: "text-blue-500" },
        { category: "Food", value: foodEmissions, icon: Utensils, color: "text-orange-500" },
        { category: "Energy", value: 2.1, icon: Battery, color: "text-yellow-500" },
      ],
    },
  };

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
  ];

  const challenges = [
    {
      title: "Zero Waste Week",
      description: "Produce no landfill waste for an entire week",
      progress: 60,
      points: 500,
    },
  ];

  const data = carbonData[activeTab as keyof typeof carbonData];
  const progressPercentage = (data.total / data.target) * 100;

  const handleAcceptChallenge = () => {
    toast({
      title: "Challenge accepted!",
      description: "Good luck with your new eco-challenge!",
    });
  };

  const handleApplyTip = () => {
    toast({
      title: "Tip saved!",
      description: "This tip has been added to your action plan.",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Welcome back {user?.email}</h1>

      <Tabs defaultValue="daily" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
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
                    ? `${(100 - progressPercentage).toFixed(0)}% below your target`
                    : `${(progressPercentage - 100).toFixed(0)}% above your target`}
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
                <h3 className="font-semibold">{tip.title}</h3>
                <p className="text-sm">{tip.description}</p>
                <Button size="sm" onClick={handleApplyTip}>Apply This Tip</Button>
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
                <h3 className="font-semibold">{challenge.title}</h3>
                <p className="text-sm">{challenge.description}</p>
                <Button size="sm" variant="outline" onClick={handleAcceptChallenge}>
                  Continue Challenge
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
