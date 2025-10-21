import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Phone, Mail, MapPin, Factory, Award, Users, Globe } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">About Shypram Rubber Profile Pvt. Ltd.</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            India's leading manufacturer of premium rubber gaskets and profiles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Company Overview */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Company Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Shypram Rubber Profile Pvt. Ltd. is a premier manufacturer and supplier of high-quality rubber gaskets, 
                profiles, and sealing solutions. With years of expertise in the rubber industry, we specialize in 
                producing precision-engineered products for aluminum doors and windows, UPVC applications, facades, 
                railings, and industrial containers. Our commitment to quality and innovation has made us a trusted 
                partner for businesses across various industries.
              </p>
            </CardContent>
          </Card>

          {/* Product Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Factory className="h-5 w-5 text-primary" />
                Product Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="secondary" className="mr-2 mb-2">Aluminum Door & Window Gaskets</Badge>
              <Badge variant="secondary" className="mr-2 mb-2">UPVC Door & Window Gaskets</Badge>
              <Badge variant="secondary" className="mr-2 mb-2">Facade Rubber Gaskets</Badge>
              <Badge variant="secondary" className="mr-2 mb-2">Railing Rubber Gaskets</Badge>
              <Badge variant="secondary" className="mr-2 mb-2">Container Gaskets</Badge>
              <Badge variant="secondary" className="mr-2 mb-2">Sliding & Folding Gaskets</Badge>
              <Badge variant="secondary" className="mr-2 mb-2">U-Clamp & C-Clamp Profiles</Badge>
            </CardContent>
          </Card>

          {/* Key Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Why Choose Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Premium quality EPDM & Silicon rubber materials</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Precision manufacturing with strict quality control</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Custom solutions for specific requirements</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Weather-resistant and durable products</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Competitive pricing with timely delivery</span>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Get In Touch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">+91 XXX XXX XXXX</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">info@shypram.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">Manufacturing Unit<br />India</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Showcase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Our Product Range
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="text-2xl mb-2">🚪</div>
                <h4 className="font-medium mb-1">Door & Window</h4>
                <p className="text-xs text-muted-foreground">115+ Products</p>
              </div>
              <div className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="text-2xl mb-2">🏢</div>
                <h4 className="font-medium mb-1">Facade Systems</h4>
                <p className="text-xs text-muted-foreground">10+ Products</p>
              </div>
              <div className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="text-2xl mb-2">🛡️</div>
                <h4 className="font-medium mb-1">Railing Solutions</h4>
                <p className="text-xs text-muted-foreground">40+ Products</p>
              </div>
              <div className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="text-2xl mb-2">📦</div>
                <h4 className="font-medium mb-1">Container Gaskets</h4>
                <p className="text-xs text-muted-foreground">10+ Products</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Explore our complete catalogue of 200+ premium rubber gaskets and profiles
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a 
                  href="/catalogue" 
                  className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  View Full Catalogue
                </a>
                <a 
                  href="/" 
                  className="inline-flex items-center justify-center px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                >
                  Back to Home
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}