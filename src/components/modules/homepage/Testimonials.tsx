import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Aisha Rahman",
    role: "University Student",
    content:
      "Booking a ride to campus is effortless. Safety features and verified drivers give me peace of mind.",
    initials: "AR",
  },
  {
    name: "Tanvir Ahmed",
    role: "Software Engineer",
    content:
      "I save time and money on daily commutes. The experience feels polished and reliable.",
    initials: "TA",
  },
  {
    name: "Nusrat Jahan",
    role: "Operations Manager",
    content:
      "Our team uses it for office transport—transparent pricing, punctual drivers, and great support.",
    initials: "NJ",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Loved by Riders</h2>
          <p className="mt-2 text-muted-foreground">
            Real stories from people who rely on our ride booking every day
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card key={t.name} className="h-full">
              <CardContent className="p-6 flex flex-col gap-4">
                <p className="text-foreground/90 leading-relaxed">“{t.content}”</p>
                <div className="flex items-center gap-3 mt-auto">
                  <Avatar>
                    <AvatarFallback>{t.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold leading-tight">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}


