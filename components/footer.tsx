import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"
import { Logo } from "@/components/logo"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/95 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Logo 
                width={32}
                height={32}
                className="hover:scale-110 transition-all duration-300"
              />
              <div>
                <h3 className="font-bold text-foreground">Shypram Rubber</h3>
                <p className="text-xs text-muted-foreground">Professional Profiles</p>
              </div>
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Leading manufacturer of high-quality rubber gaskets and sealing solutions for industrial, automotive, and commercial applications since 1995.
            </p>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Products</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <Link
                  href="/catalogue"
                  className="hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Aluminium Door Gaskets
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogue"
                  className="hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  UPVC Window Gaskets
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogue"
                  className="hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Container Gaskets
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogue"
                  className="hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Facade Rubber Gaskets
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogue"
                  className="hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Product Catalogue
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact Info</h4>
            <div className="space-y-3 text-sm text-foreground/70">
              <div className="flex items-center space-x-3 hover:text-primary transition-colors group">
                <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>shypramrubber@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 hover:text-primary transition-colors group">
                <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>+91 70169 63340</span>
              </div>
              <div className="flex items-start space-x-3 hover:text-primary transition-colors group">
                <MapPin className="h-4 w-4 mt-0.5 group-hover:scale-110 transition-transform" />
                <span>Plot No.13, Milan Estate, Opp. Shah Foils Company<br />Santej-Khatraj Road - 382721 Dist - Gandhinagar - Gujarat</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-8 pt-8">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          <div className="text-center text-sm text-foreground/70">
            <p>&copy; 2024 Shypram Rubber Profile Pvt. Ltd. All rights reserved.</p>
            <p className="mt-2 text-xs">Crafted with precision for industrial excellence</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
