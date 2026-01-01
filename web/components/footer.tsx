import Link from "next/link"
import { Compass, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"
import { CONTACT_INFO, SOCIAL_LINKS, COMPANY_INFO } from "@/lib/constants"

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
              <Compass className="h-6 w-6 text-accent" />
              <span>Travel Seven Wonders</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Discover the world's most magnificent monuments. Book your journey to the Seven Wonders with seamless
              travel planning.
            </p>
            <div className="flex items-center gap-4">
              <a href={SOCIAL_LINKS.facebook} className="text-muted-foreground hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.instagram} className="text-muted-foreground hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.twitter} className="text-muted-foreground hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="font-semibold mb-4">Destinations</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/book/great-wall" className="text-muted-foreground hover:text-accent transition-colors">
                  Great Wall of China
                </Link>
              </li>
              <li>
                <Link href="/book/petra" className="text-muted-foreground hover:text-accent transition-colors">
                  Petra, Jordan
                </Link>
              </li>
              <li>
                <Link
                  href="/book/christ-redeemer"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Christ the Redeemer
                </Link>
              </li>
              <li>
                <Link href="/book/machu-picchu" className="text-muted-foreground hover:text-accent transition-colors">
                  Machu Picchu
                </Link>
              </li>
              <li>
                <Link href="/book/chichen-itza" className="text-muted-foreground hover:text-accent transition-colors">
                  Chichen Itza
                </Link>
              </li>
              <li>
                <Link href="/book/colosseum" className="text-muted-foreground hover:text-accent transition-colors">
                  Colosseum
                </Link>
              </li>
              <li>
                <Link href="/book/taj-mahal" className="text-muted-foreground hover:text-accent transition-colors">
                  Taj Mahal
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/my-trips" className="text-muted-foreground hover:text-accent transition-colors">
                  My Trips
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-muted-foreground hover:text-accent transition-colors">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-muted-foreground hover:text-accent transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{CONTACT_INFO.general.email}</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{CONTACT_INFO.general.phoneDisplay}</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{CONTACT_INFO.address.full}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
