import { BadgeCheck, Clock3, MapPin, Phone, StoreIcon } from "lucide-react";

import { Reveal } from "@/components/home/reveal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type MenuDetailVendorCardProps = {
  shopName: string;
  ownerName: string | null;
  image?: string | null;
  location?: string;
  phone?: string;
  hours?: string | null;
};

export function MenuDetailVendorCard({
  shopName,
  ownerName,
  image,
  location,
  phone,
  hours,
}: MenuDetailVendorCardProps) {
  return (
    <Reveal delay={0.1}>
      <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/8 via-accent/25 to-transparent p-5 dark:from-primary/5 dark:via-accent/10">
        <div
          aria-hidden="true"
          className="absolute -top-16 -right-12 size-40 rounded-full bg-primary/10 blur-2xl"
        />

        <div className="relative flex items-center gap-3">
          <Avatar className="size-12 shrink-0 rounded-2xl">
            {image ? <AvatarImage src={image} alt={shopName} /> : null}
            <AvatarFallback className="rounded-2xl bg-primary text-primary-foreground">
              <StoreIcon className="size-6" aria-hidden />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Sold by
            </p>
            <p className="truncate text-lg font-semibold">{shopName}</p>
            {ownerName ? (
              <p className="truncate text-xs text-muted-foreground">
                By {ownerName}
              </p>
            ) : null}
          </div>
          <Badge variant="secondary" className="shrink-0 gap-1.5">
            <BadgeCheck className="size-3.5" />
            Verified
          </Badge>
        </div>

        {location || phone || hours ? (
          <div className="relative mt-4 grid gap-2.5 border-t border-border/70 pt-4 text-sm">
            {location ? (
              <p className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4 shrink-0 text-primary" aria-hidden />
                <span className="truncate">{location}</span>
              </p>
            ) : null}
            {phone ? (
              <p className="flex items-center gap-2 text-muted-foreground">
                <Phone className="size-4 shrink-0 text-primary" aria-hidden />
                <span>{phone}</span>
              </p>
            ) : null}
            {hours ? (
              <p className="flex items-center gap-2 text-muted-foreground">
                <Clock3 className="size-4 shrink-0 text-primary" aria-hidden />
                <span>Open {hours}</span>
              </p>
            ) : null}
          </div>
        ) : null}
      </Card>
    </Reveal>
  );
}
