"use client";

import React from "react";

const row1 = [
  {
    id: 1,
    quote:
      "Creative geniuses who listen, understand, and craft captivating visuals - an agency that truly understands our needs.",
    name: "Gabrielle Williams",
    role: "CEO and Co-founder of ABC Company",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    quote:
      "Exceeded our expectations with innovative designs that brought our vision to life - a truly remarkable creative agency.",
    name: "Samantha Johnson",
    role: "CEO and Co-founder of ABC Company",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    quote:
      "Their ability to capture our brand essence in every project is unparalleled - an invaluable creative collaborator.",
    name: "Isabella Rodriguez",
    role: "CEO and Co-founder of ABC Company",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    quote:
      "Transformative results right from day one. Their attention to detail and user experience is top tier.",
    name: "David Chen",
    role: "Product Lead at TechScale",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
];

const row2 = [
  {
    id: 5,
    quote:
      "Their team's artistic flair and strategic approach resulted in remarkable campaigns - a reliable creative partner.",
    name: "John Peter",
    role: "CEO and Co-founder of ABC Company",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    quote:
      "From concept to execution, their creativity knows no bounds - a game-changer for our brand's success.",
    name: "Natalie Martinez",
    role: "CEO and Co-founder of ABC Company",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 7,
    quote:
      "A refreshing and imaginative agency that consistently delivers exceptional results - highly recommended for any project.",
    name: "Victoria Thompson",
    role: "CEO and Co-founder of ABC Company",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 8,
    quote:
      "Working with them was the best decision we made this year. Flawless communication and quality delivery.",
    name: "Marcus Vance",
    role: "Founder of CinemaFlow",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
  },
];

function TestimonialCard({ testimonial }) {
  return (
    <div className="w-[380px] shrink-0 rounded-3xl bg-[#f7f8fa] p-8 border border-gray-100/80 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md">
      <div>
        {/* Blue Quote Mark */}
        <div className="mb-4 text-4xl font-serif text-blue-600 select-none">
          “
        </div>
        <p className="text-[15px] leading-relaxed text-zinc-700 font-medium">
          {testimonial.quote}
        </p>
      </div>

      <div className="mt-8 flex items-center gap-3.5">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="h-11 w-11 rounded-full object-cover border border-white shadow-sm"
        />
        <div>
          <h4 className="text-sm font-bold text-zinc-900 leading-snug">
            {testimonial.name}
          </h4>
          <p className="text-xs font-medium text-zinc-400">
            {testimonial.role}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 px-4">
      {/* Top Rating Badge */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2 text-xs font-semibold text-white shadow-lg">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px]">
            ★
          </span>
          <span>Rated 4/5 by over 1 Lakh users</span>
        </div>
      </div>

      {/* Heading */}
      <div className="mx-auto max-w-3xl text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 leading-tight">
          Words of praise from others <br className="hidden sm:block" />
          about our presence.
        </h2>
      </div>

      {/* Testimonials Container with Fade Edges */}
      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 overflow-hidden py-4">
        {/* Left & Right Gradient Overlays for smooth edge fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent" />

        {/* TOP ROW: Moves to the RIGHT */}
        <div className="flex w-max animate-marquee-right gap-6 hover:[animation-play-state:paused]">
          {/* Double array ensures seamless looping */}
          {[...row1, ...row1].map((item, index) => (
            <TestimonialCard key={`row1-${item.id}-${index}`} testimonial={item} />
          ))}
        </div>

        {/* BOTTOM ROW: Moves to the LEFT */}
        <div className="flex w-max animate-marquee-left gap-6 hover:[animation-play-state:paused]">
          {/* Double array ensures seamless looping */}
          {[...row2, ...row2].map((item, index) => (
            <TestimonialCard key={`row2-${item.id}-${index}`} testimonial={item} />
          ))}
        </div>
      </div>

      {/* Custom Keyframe Animations */}
      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        .animate-marquee-left {
          animation: marquee-left 35s linear infinite;
        }

        .animate-marquee-right {
          animation: marquee-right 35s linear infinite;
        }
      `}</style>
    </section>
  );
}