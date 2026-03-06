import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  title: string;
  description: string;
  duration: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
}

export function ServiceCard({
  title,
  description,
  duration,
  price,
  imageSrc,
  imageAlt,
}: ServiceCardProps) {
  return (
    <Card className="group glass border border-white/30 rounded-3xl p-2 shadow-sm shadow-slate-200/50 hover:shadow-xl hover:shadow-[#17a2b8]/10 transition-all duration-300 hover:-translate-y-4">
      {/* Image */}
      <div className="aspect-video overflow-hidden rounded-2xl relative">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={600}
          height={338}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Cyan glow on hover */}
        <div className="absolute inset-0 ring-2 ring-[#17a2b8]/0 group-hover:ring-[#17a2b8]/40 rounded-2xl transition-all duration-300 pointer-events-none" />
        <div className="absolute inset-0 bg-[#17a2b8]/0 group-hover:bg-[#17a2b8]/8 rounded-2xl transition-all duration-300 pointer-events-none" />
      </div>

      {/* Content */}
      <CardContent className="p-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#64748B]">
            {duration}
          </span>
          <span className="bg-[#17a2b8]/10 text-[#17a2b8] text-xs font-bold px-3 py-1 rounded-full">
            From {price}
          </span>
        </div>

        <h3 className="text-[#0F172A] font-bold text-lg leading-snug">
          {title}
        </h3>

        <p className="text-sm text-[#64748B] leading-relaxed line-clamp-2">
          {description}
        </p>

        <Button
          asChild
          className="mt-2 w-full bg-[#ef3825] hover:bg-[#17a2b8] text-white font-semibold transition-colors duration-300 rounded-xl shadow-sm shadow-[#ef3825]/20 hover:shadow-[#17a2b8]/20"
        >
          <Link href="/book">Book Now</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
