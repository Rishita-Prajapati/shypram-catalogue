import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get in touch with our team for inquiries, quotes, or support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Get In Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <a 
                  href="tel:+917016963340"
                  className="flex items-center gap-4 hover:bg-muted/50 p-3 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Phone</p>
                    <p className="text-muted-foreground">+91 7016963340</p>
                  </div>
                </a>
                
                <a 
                  href="mailto:shypramrubber@gmail.com"
                  className="flex items-center gap-4 hover:bg-muted/50 p-3 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <p className="text-muted-foreground">shypramrubber@gmail.com</p>
                  </div>
                </a>
                
                <a 
                  href="https://maps.google.com/?q=Plot No.13, Milan Estate, Opp. Shah Foils Company, Santej-Khatraj Road - 382721 Dist - Gandhinagar - Gujarat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 hover:bg-muted/50 p-3 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Address</p>
                    <p className="text-muted-foreground leading-relaxed">
                      Plot No.13, Milan Estate, Opp. Shah Foils Company<br />
                      Santej-Khatraj Road - 382721<br />
                      Dist - Gandhinagar - Gujarat
                    </p>
                  </div>
                </a>
                
                <div className="flex items-start gap-4 p-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Business Hours</p>
                    <p className="text-muted-foreground leading-relaxed">
                      Mon - Fri: 9:00 AM - 6:00 PM<br />
                      Sat: 9:00 AM - 2:00 PM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Your Name" />
                  <Input placeholder="Your Email" type="email" />
                </div>
                <Input placeholder="Subject" />
                <Textarea placeholder="Your Message" rows={5} />
                <Button className="w-full">Send Message</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}