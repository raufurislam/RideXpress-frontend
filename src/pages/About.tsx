// import { Card, CardContent } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Users, Car, ShieldCheck, Target } from "lucide-react";

// export default function About() {
//   return (
//     <section className="w-full py-16">
//       <div className="max-w-6xl mx-auto px-6 lg:px-12">
//         {/* Heading */}
//         <div className="text-center mb-12">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
//             About Our Ride Management Platform
//           </h2>
//           <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
//             We’re on a mission to make urban transportation safer, faster, and
//             more reliable for everyone – riders, drivers, and administrators
//             alike.
//           </p>
//         </div>

//         {/* Mission & Vision */}
//         <div className="grid md:grid-cols-2 gap-8 mb-16">
//           <Card className="rounded-2xl shadow-md border ">
//             <CardContent className="p-6">
//               <div className="flex items-center gap-3 mb-4">
//                 <Target className="h-6 w-6 text-primary" />
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//                   Our Mission
//                 </h3>
//               </div>
//               <p className="text-gray-600 dark:text-gray-300">
//                 To connect riders and drivers seamlessly through technology,
//                 ensuring affordable and secure rides while empowering drivers
//                 with flexible earning opportunities.
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="rounded-2xl shadow-md border">
//             <CardContent className="p-6">
//               <div className="flex items-center gap-3 mb-4">
//                 <ShieldCheck className="h-6 w-6 text-primary" />
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//                   Our Vision
//                 </h3>
//               </div>
//               <p className="text-gray-600 dark:text-gray-300">
//                 To redefine mobility in every city we serve, creating a safe and
//                 sustainable ride ecosystem where technology enhances everyday
//                 journeys.
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         <Separator className="my-12" />

//         {/* Team & Values */}
//         <div className="grid md:grid-cols-3 gap-8">
//           <Card className="rounded-2xl shadow-md border hover:shadow-lg transition">
//             <CardContent className="p-6 text-center">
//               <Users className="h-10 w-10 mx-auto text-primary mb-4" />
//               <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
//                 Our Team
//               </h4>
//               <p className="text-gray-600 dark:text-gray-300">
//                 A diverse group of engineers, designers, and innovators
//                 passionate about solving real-world mobility challenges.
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="rounded-2xl shadow-md border hover:shadow-lg transition">
//             <CardContent className="p-6 text-center">
//               <Car className="h-10 w-10 mx-auto text-primary mb-4" />
//               <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
//                 Rider & Driver First
//               </h4>
//               <p className="text-gray-600 dark:text-gray-300">
//                 Every feature is designed to create value and convenience for
//                 riders and drivers, putting them at the heart of our system.
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="rounded-2xl shadow-md border hover:shadow-lg transition">
//             <CardContent className="p-6 text-center">
//               <ShieldCheck className="h-10 w-10 mx-auto text-primary mb-4" />
//               <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
//                 Safety & Trust
//               </h4>
//               <p className="text-gray-600 dark:text-gray-300">
//                 From SOS features to driver verification, safety and trust are
//                 built into every ride, every interaction, every time.
//               </p>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </section>
//   );
// }

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Users, Car, ShieldCheck, Target } from "lucide-react";

export default function About() {
  return (
    <section className="w-full py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            About Our Ride Management Platform
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We’re on a mission to make urban transportation safer, faster, and
            more reliable for everyone – riders, drivers, and administrators
            alike.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <Card className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-5">
                <Target className="h-7 w-7 text-primary" />
                <h3 className="text-xl font-semibold tracking-tight text-card-foreground">
                  Our Mission
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To connect riders and drivers seamlessly through technology,
                ensuring affordable and secure rides while empowering drivers
                with flexible earning opportunities.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-5">
                <ShieldCheck className="h-7 w-7 text-primary" />
                <h3 className="text-xl font-semibold tracking-tight text-card-foreground">
                  Our Vision
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To redefine mobility in every city we serve, creating a safe and
                sustainable ride ecosystem where technology enhances everyday
                journeys.
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-16" />

        {/* Team & Values */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Users className="h-10 w-10 mx-auto text-primary mb-5" />
              <h4 className="text-lg font-semibold text-card-foreground mb-3 tracking-tight">
                Our Team
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                A diverse group of engineers, designers, and innovators
                passionate about solving real-world mobility challenges.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Car className="h-10 w-10 mx-auto text-primary mb-5" />
              <h4 className="text-lg font-semibold text-card-foreground mb-3 tracking-tight">
                Rider & Driver First
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                Every feature is designed to create value and convenience for
                riders and drivers, putting them at the heart of our system.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <ShieldCheck className="h-10 w-10 mx-auto text-primary mb-5" />
              <h4 className="text-lg font-semibold text-card-foreground mb-3 tracking-tight">
                Safety & Trust
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                From SOS features to driver verification, safety and trust are
                built into every ride, every interaction, every time.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
