import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

interface ContactProps {
  title?: string;
  description?: string;
  phone?: string;
  email?: string;
  web?: { label: string; url: string };
}

export default function Contact({
  title = "Contact Us",
  description = "We are available for questions, feedback, or collaboration opportunities. Let us know how we can help!",
  phone = "(123) 34567890",
  email = "email@example.com",
  web = { label: "shadcnblocks.com", url: "https://shadcnblocks.com" },
}: ContactProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading("Sending your message...");

    setTimeout(() => {
      setLoading(false);
      toast.dismiss(loadingToast);
      toast.success(
        "Your message has been successfully sent! Our team will review it and get back to you shortly."
      );
    }, 1000);
  };

  return (
    <section className="py-8 px-4 container mx-auto">
      <Toaster position="top-right" />
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* Left Info */}
        <div className="flex-1 flex flex-col justify-between gap-10">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl">
              {description}
            </p>
          </div>
          <div className="bg-card rounded-xl shadow-lg p-8 flex flex-col gap-6">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Contact Details
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <span className="font-semibold">Phone:</span> {phone}
              </li>
              <li>
                <span className="font-semibold">Email:</span>{" "}
                <a
                  href={`mailto:${email}`}
                  className="underline hover:text-primary"
                >
                  {email}
                </a>
              </li>
              <li>
                <span className="font-semibold">Web:</span>{" "}
                <a
                  href={web.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  {web.label}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-card bubun rounded-xl shadow-lg p-8 flex flex-col gap-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex flex-col gap-1.5">
              <Label htmlFor="firstname">First Name</Label>
              <Input
                type="text"
                id="firstname"
                placeholder="First Name"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <Label htmlFor="lastname">Last Name</Label>
              <Input
                type="text"
                id="lastname"
                placeholder="Last Name"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="Email" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="subject">Subject</Label>
            <Input type="text" id="subject" placeholder="Subject" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              rows={5}
              required
            />
          </div>

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </section>
  );
}
