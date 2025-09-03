import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Shield, Users } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Secure & Reliable",
      description:
        "Your data is encrypted and protected with enterprise-grade security.",
      icon: Shield,
    },
    {
      title: "Collaborative",
      description:
        "Work seamlessly with your team in real-time with shared access.",
      icon: Users,
    },
    {
      title: "User Friendly",
      description:
        "Minimal design with intuitive navigation for a better experience.",
      icon: CheckCircle2,
    },
  ];   

  return (
    <section className="py-16 px-4 container mx-auto">
      <h1 className="text-4xl font-bold text-center mb-12">Features</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <Card
            key={i}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader className="flex flex-col items-center">
              <feature.icon className="h-10 w-10 text-primary mb-3" />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              {feature.description}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
