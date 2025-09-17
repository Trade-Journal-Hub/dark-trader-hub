import { 
  Brain, 
  Heart, 
  Target, 
  TrendingUp, 
  AlertCircle, 
  BarChart3, 
  Zap,
  Clock,
  Star,
  CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const psychologyFeatures = [
  {
    title: "Emotional Analysis",
    icon: Heart,
    description: "Track emotional states during trading sessions and identify patterns that affect performance.",
    features: ["Mood Tracking", "Stress Indicators", "Confidence Levels", "Emotional Triggers"],
    status: "Development",
    progress: 75
  },
  {
    title: "Behavioral Patterns",
    icon: Target,
    description: "Analyze trading behaviors and decision-making patterns to improve consistency.",
    features: ["Decision Analysis", "Pattern Recognition", "Habit Tracking", "Bias Detection"],
    status: "Planning",
    progress: 45
  },
  {
    title: "Risk Psychology",
    icon: AlertCircle,
    description: "Understand your risk tolerance and how psychological factors influence risk decisions.",
    features: ["Risk Appetite", "Fear & Greed Index", "Loss Aversion", "Risk Perception"],
    status: "Research",
    progress: 30
  },
  {
    title: "Performance Psychology",
    icon: TrendingUp,
    description: "Correlate psychological states with trading performance to optimize mindset.",
    features: ["Performance Correlation", "Mindset Optimization", "Focus Analysis", "Stress Impact"],
    status: "Planning",
    progress: 60
  }
];

const upcomingFeatures = [
  "AI-powered emotion detection from trading patterns",
  "Personalized psychology coaching recommendations",
  "Mindfulness and meditation integration",
  "Stress management tools and techniques",
  "Psychology journal with guided prompts",
  "Behavioral finance education modules"
];

export default function DashboardPsychology() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary" />
          Trading Psychology
        </h1>
        <p className="text-muted-foreground mt-2">
          Master your mindset and emotional intelligence for better trading decisions
        </p>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg p-6 border border-primary/20">
        <div className="flex items-center gap-3 mb-3">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Coming Soon</h2>
          <Badge variant="secondary" className="ml-auto">Q2 2024</Badge>
        </div>
        <p className="text-muted-foreground">
          Our psychology module is currently in development. This comprehensive suite will help you understand 
          and improve the psychological aspects of your trading performance.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {psychologyFeatures.map((feature, index) => (
          <Card key={feature.title} className="hover-scale group cursor-pointer hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-3">
                  <feature.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-200" />
                  {feature.title}
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {feature.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {feature.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Development Progress</span>
                  <span className="font-medium">{feature.progress}%</span>
                </div>
                <Progress value={feature.progress} className="h-2" />
              </div>
              <ul className="space-y-2">
                {feature.features.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-primary/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Features */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Star className="w-5 h-5 text-primary" />
            Planned Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Zap className="w-4 h-4 text-primary/70 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Research Foundation */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Research Foundation</h3>
        </div>
        <p className="text-muted-foreground mb-4">
          Our psychology module is based on established research in behavioral finance and trading psychology, 
          incorporating insights from leading experts in the field.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Behavioral Finance</Badge>
          <Badge variant="outline">Cognitive Biases</Badge>
          <Badge variant="outline">Emotional Intelligence</Badge>
          <Badge variant="outline">Risk Psychology</Badge>
          <Badge variant="outline">Performance Optimization</Badge>
        </div>
      </div>
    </div>
  );
}