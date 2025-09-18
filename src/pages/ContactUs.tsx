import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock, MessageSquare, Headphones, Users } from 'lucide-react';

const ContactUs = () => {
  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      description: "Get detailed help via email",
      contact: "support@tradejournalpro.com",
      response: "Response within 4 hours"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Support",
      description: "Speak directly with our experts",
      contact: "+91 9876543210",
      response: "Mon-Fri, 9 AM - 7 PM IST"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Live Chat",
      description: "Instant help when you need it",
      contact: "Available in app",
      response: "24/7 automated + human support"
    }
  ];

  const supportTopics = [
    {
      icon: <Headphones className="h-8 w-8" />,
      title: "Technical Support",
      description: "App issues, broker connections, data sync problems"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Account & Billing",
      description: "Subscription plans, payments, refunds, account settings"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Feature Requests",
      description: "New broker support, feature suggestions, integrations"
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <Badge className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-sm">
              💬 WE'RE HERE TO HELP
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Get in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                Touch
              </span>{' '}
              With Us
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Have questions about TradeJournal Pro? Our expert support team is ready to help you succeed. 
              <strong className="text-cyan-400"> Average response time: 2 hours</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Choose Your Preferred 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Contact Method
            </span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-elegant hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-4">
                  {method.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{method.title}</h3>
                <p className="text-gray-300 mb-4">{method.description}</p>
                <p className="font-semibold text-cyan-400 mb-2">{method.contact}</p>
                <p className="text-sm text-gray-400">{method.response}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-elegant">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-white">Send Us a Message</h2>
              <p className="text-gray-300">
                Fill out the form below and we'll get back to you within 4 hours
              </p>
            </div>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Full Name</label>
                  <Input placeholder="Enter your full name" className="border-border focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <Input type="email" placeholder="Enter your email" className="border-border focus:border-primary" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input placeholder="Enter your phone number" className="border-border focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <select className="w-full p-3 rounded-md border border-border bg-background focus:border-primary focus:outline-none">
                    <option>Technical Support</option>
                    <option>Billing & Account</option>
                    <option>Feature Request</option>
                    <option>General Inquiry</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea 
                  placeholder="Describe your issue or question in detail..."
                  rows={6}
                  className="border-border focus:border-primary resize-none"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input type="checkbox" id="updates" className="rounded" />
                <label htmlFor="updates" className="text-sm text-muted-foreground">
                  I'd like to receive product updates and trading tips via email
                </label>
              </div>
              
              <Button size="lg" className="w-full bg-gradient-primary hover:shadow-glow">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Support Topics */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            What Can We Help You 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              With?
            </span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {supportTopics.map((topic, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-elegant animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-4">
                  {topic.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{topic.title}</h3>
                <p className="text-gray-300">{topic.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need Quick Answers?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Check out our comprehensive FAQ section for instant solutions to common questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-primary hover:shadow-glow">
              Browse FAQ
            </Button>
            <Button size="lg" variant="outline">
              Video Tutorials
            </Button>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-card rounded-2xl p-8 border border-border">
            <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Business Hours</h3>
            <div className="grid sm:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
              <div>
                <h4 className="font-semibold mb-2">Phone & Live Chat</h4>
                <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 7:00 PM IST</p>
                <p className="text-muted-foreground">Saturday: 10:00 AM - 4:00 PM IST</p>
                <p className="text-muted-foreground">Sunday: Closed</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Email Support</h4>
                <p className="text-muted-foreground">24/7 - We respond within 4 hours</p>
                <p className="text-muted-foreground">Urgent issues: Within 1 hour</p>
                <p className="text-muted-foreground">General inquiries: Within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;