import Link from "next/link";
import {
  Mail,
  Phone,
  Pizza,
} from "lucide-react";
import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Menu", href: "/browse-menu" },
  { label: "Dashboard", href: "/dashboard" },
];

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/asgorfaiyaz", Icon: FaLinkedinIn },
  { label: "GitHub", href: "https://github.com/asgorfaiyaz", Icon: FaGithub },
  { label: "Facebook", href: "https://www.facebook.com/asgorfaiyaz", Icon: FaFacebookF },
  { label: "YouTube", href: "https://www.youtube.com/@asgorfaiyaz", Icon: FaYoutube },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface-sunken/60">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md font-heading text-lg font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Pizza className="size-5 text-primary" aria-hidden="true" />
            PizzaHub
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
            Discover neighborhood pizza shops, find your next favorite slice, and get it delivered to your door.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="text-sm font-semibold">Explore</h2>
          <ul className="mt-4 space-y-3">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold">Get in touch</h2>
          <ul className="mt-4 space-y-3">
            <li>
              <a href="mailto:asgorfaiyaz@gmail.com" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <Mail className="size-4" aria-hidden="true" />
                asgorfaiyaz@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:01889445355" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <Phone className="size-4" aria-hidden="true" />
                01889445355
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Follow along</h2>
          <p className="mt-2 text-sm text-muted-foreground">Find me on social media as asgorfaiyaz.</p>
          <ul className="mt-4 flex items-center gap-3">
            {socialLinks.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <Icon className="size-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto w-full max-w-7xl px-4 py-5 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          &copy; 2026 PizzaHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
