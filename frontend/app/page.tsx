"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import Link from "next/link"
import { Factory, Shield, Truck, Phone, Mail, MapPin, Award, Users, Clock } from "lucide-react"

export default function HomePage() {
  const categories = [
    { name: "Aluminium Doors & Windows Gasket", count: "100+ Products", description: "High-quality sealing solutions for aluminium frames" },
    { name: "UPVC Door & Window Gasket", count: "25+ Products", description: "Durable gaskets for UPVC applications" },
    { name: "Container Gasket", count: "15+ Products", description: "Industrial-grade container sealing solutions" },
    { name: "Facade Rubber Gasket", count: "20+ Products", description: "Weather-resistant facade sealing systems" },
    { name: "Railing Rubber Gasket", count: "50+ Products", description: "Safety and aesthetic railing gaskets" },
    { name: "Sliding & Folding Gasket", count: "10+ Products", description: "Smooth operation sealing solutions" }
  ]

  return (
    <div className="min-h-screen flex flex-col text-foreground relative overflow-hidden">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-32 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 animated-bg" />
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          
          {/* Subtle Floating Elements */}
          <div className="absolute top-20 left-10 w-32 h-32 floating-light rounded-full animate-float blur-xl opacity-30" />
          <div className="absolute bottom-20 right-10 w-24 h-24 floating-dark rounded-full animate-float-reverse blur-xl opacity-40" />
          
          <div className="container mx-auto px-4 text-center relative z-10">
            {/* Split Title Structure */}
            <div className="mb-12">
              <h1 className="text-6xl md:text-8xl font-extrabold mb-4 tracking-tight animate-fade-in-up neon-text">
                Shypram Rubber
              </h1>
              <h2 className="text-2xl md:text-3xl font-light text-foreground/80 mb-8 animate-fade-in-up animate-delay-200">
                Profile Pvt. Ltd.
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-8 animate-scale-in animate-delay-300 shadow-lg shadow-primary/30" />
            </div>
            
            <p className="text-xl md:text-2xl text-foreground/70 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animate-delay-400">
              Premium industrial rubber solutions engineered for precision, durability, and excellence across automotive, construction, and manufacturing sectors.
            </p>
            
            {/* Large CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up animate-delay-500">
              <Link href="/catalogue">
                <Button size="lg" className="w-full sm:w-auto px-12 py-6 text-xl font-semibold magnetic hover-lift shadow-xl hover:shadow-2xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
                  Explore Products
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-12 py-6 text-xl font-semibold magnetic hover-lift border-2 border-accent hover:bg-accent/10 hover:border-accent/80 glass-panel">
                  Get Quote
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <CategoriesSection categories={categories} />
        <AboutSection />
        <WhyChooseUsSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  )
}

function AboutSection() {
  const [ref, isVisible] = useIntersectionObserver()
  
  return (
    <section ref={ref} className={`py-24 relative overflow-hidden fade-in-section ${isVisible ? 'visible' : ''}`}>
      {/* Clean Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 neon-text">
            About Our Company
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-12 animate-scale-in animate-delay-200 shadow-lg shadow-primary/30" />
          <p className="text-2xl text-muted-foreground mb-16 leading-relaxed max-w-5xl mx-auto">
            With over 25 years of industrial excellence, Shypram Rubber Profile Pvt. Ltd. stands as India's premier manufacturer of precision rubber gaskets and sealing solutions, serving automotive, construction, and manufacturing industries worldwide.
          </p>
          
          {/* Premium Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            {[
              { icon: Award, title: "25+ Years", desc: "Industry Leadership", delay: "animate-delay-100" },
              { icon: Users, title: "1000+", desc: "Global Partners", delay: "animate-delay-200" },
              { icon: Factory, title: "200+", desc: "Product Solutions", delay: "animate-delay-300" }
            ].map((item, i) => (
              <div key={i} className={`glass-panel p-8 text-center animate-rotate-in ${item.delay} group hover-lift border-0 shadow-xl`}>
                <div className="w-24 h-24 bg-gradient-to-br from-primary/15 to-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-8 hover-glow group-hover:scale-110 transition-all duration-500">
                  <item.icon className="h-12 w-12 text-primary group-hover:text-accent transition-colors" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-foreground group-hover:text-accent transition-colors">{item.title}</h3>
                <p className="text-muted-foreground text-xl font-medium">{item.desc}</p>
                <div className="mt-6 h-1 w-0 bg-gradient-to-r from-primary to-accent mx-auto group-hover:w-20 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CategoriesSection({ categories }: { categories: any[] }) {
  const [ref, isVisible] = useIntersectionObserver()
  
  return (
    <section ref={ref} className={`py-24 relative overflow-hidden fade-in-section ${isVisible ? 'visible' : ''}`}>
      {/* Gradient Section Background */}
      <div className="absolute inset-0 gradient-section" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 neon-text">
            Product Categories
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-8 animate-scale-in animate-delay-200 shadow-lg shadow-primary/30" />
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Precision-engineered rubber solutions designed for demanding industrial applications across multiple sectors.
          </p>
        </div>
        
        {/* Responsive Grid with Animated Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Card key={index} className={`glass-card interactive-card hover-glow animate-fade-in-up group border-0 shadow-xl transform transition-all duration-500 hover:scale-105`} style={{animationDelay: `${index * 150}ms`}}>
              <CardContent className="p-8 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/15 to-accent/10 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 hover-glow animate-pulse-glow">
                    <Shield className="h-10 w-10 text-primary group-hover:text-accent transition-colors duration-300" />
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-2 font-semibold group-hover:bg-accent/10 group-hover:text-accent group-hover:border-accent/20 transition-all duration-300">{category.count}</Badge>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-accent transition-colors duration-300 relative z-10">{category.name}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg relative z-10">{category.description}</p>
                
                {/* Animated Progress Bar */}
                <div className="mt-6 h-1 bg-muted rounded-full overflow-hidden relative">
                  <div className="h-full w-0 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-700 shadow-sm rounded-full" />
                </div>
                
                {/* Floating Particles */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-primary/20 rounded-full animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{animationDelay: '0.5s'}} />
                <div className="absolute bottom-8 left-8 w-1 h-1 bg-accent/30 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{animationDelay: '1s'}} />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-20">
          <Link href="/catalogue">
            <Button variant="outline" size="lg" className="magnetic hover-lift px-10 py-4 text-lg border-2 border-primary hover:bg-primary/10 hover:border-primary/80 glass-card font-semibold">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

function WhyChooseUsSection() {
  const [ref, isVisible] = useIntersectionObserver()
  
  const features = [
    { icon: Factory, title: "Manufacturing Excellence", desc: "State-of-the-art facilities with strict quality control processes ensuring consistent product quality." },
    { icon: Shield, title: "Premium Materials", desc: "High-grade EPDM, NBR, and silicone rubber materials sourced from trusted suppliers." },
    { icon: Truck, title: "Fast Delivery", desc: "Quick turnaround times with reliable shipping network covering all major cities." },
    { icon: Award, title: "Quality Assurance", desc: "Rigorous testing procedures and quality certifications meeting international standards." },
    { icon: Users, title: "Expert Support", desc: "Dedicated technical support team to help you choose the right products." },
    { icon: Clock, title: "Custom Solutions", desc: "Tailored manufacturing solutions to meet unique specifications and requirements." }
  ]
  
  return (
    <section ref={ref} className={`py-24 relative overflow-hidden fade-in-section ${isVisible ? 'visible' : ''}`}>
      {/* Premium Section Background */}
      <div className="absolute inset-0 bg-secondary/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 neon-text">
            Why Choose Shypram Rubber?
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-8 animate-scale-in animate-delay-200 shadow-lg shadow-primary/30" />
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Decades of engineering excellence combined with cutting-edge manufacturing technology to deliver uncompromising quality and reliability.
          </p>
        </div>
        
        {/* Premium Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className={`glass-card p-8 text-center group hover-glow animate-slide-in-${index % 2 === 0 ? 'left' : 'right'} animate-delay-${(index % 3 + 1) * 100} border-0 shadow-xl`}>
              <div className="w-24 h-24 bg-gradient-to-br from-primary/15 to-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-500 hover-glow">
                <feature.icon className="h-12 w-12 text-primary group-hover:text-accent transition-colors" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-foreground group-hover:text-accent transition-colors">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">{feature.desc}</p>
              <div className="mt-6 h-1 w-0 bg-gradient-to-r from-primary to-accent mx-auto group-hover:w-20 transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  const [ref, isVisible] = useIntersectionObserver()
  
  return (
    <section ref={ref} className={`py-24 relative overflow-hidden fade-in-section ${isVisible ? 'visible' : ''}`}>
      {/* Premium Contact Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 neon-text">
            Get In Touch
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-8 animate-scale-in animate-delay-200 shadow-lg shadow-primary/30" />
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Partner with industry leaders. Our engineering team is ready to deliver custom rubber solutions tailored to your specific requirements.
          </p>
        </div>
        
        {/* Premium Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { icon: Phone, title: "Phone", info: ["+91 70169 63340", ""], delay: "animate-delay-100" },
            { icon: Mail, title: "Email", info: ["shypramrubber@gmail.com", ""], delay: "animate-delay-200" },
            { icon: MapPin, title: "Address", info: ["Plot No.13, Milan Estate, Opp. Shah Foils Company", "Santej-Khatraj Road - 382721 Dist - Gandhinagar - Gujarat"], delay: "animate-delay-300" }
          ].map((contact, i) => (
            <Card key={i} className={`text-center glass-card interactive-card hover-glow animate-bounce-in ${contact.delay} group border-0 shadow-xl`}>
              <CardContent className="p-10">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/15 to-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-8 hover-glow group-hover:scale-110 transition-all duration-300">
                  <contact.icon className="h-10 w-10 text-primary group-hover:text-accent transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-foreground group-hover:text-accent transition-colors">{contact.title}</h3>
                <div className="space-y-3">
                  {contact.info.map((info, j) => (
                    <p key={j} className="text-muted-foreground leading-relaxed text-lg">{info}</p>
                  ))}
                </div>
                <div className="mt-6 h-1 w-0 bg-gradient-to-r from-primary to-accent mx-auto group-hover:w-20 transition-all duration-500" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-20">
          <Link href="/contact">
            <Button size="lg" className="magnetic hover-lift px-12 py-6 text-xl font-semibold shadow-xl hover:shadow-2xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
              Contact Us Today
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
