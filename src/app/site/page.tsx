import InvestmentHero from "@/components/site/investmentsSection";
import Image from "next/image";
import {
  BarChart2,
  Shield,
  DollarSign,
  Users,
  ArrowRight,
  Phone,
  Mail,
  CheckCircle,
  TrendingUp,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function Home() {
  const testimonials = [
    {
      name: "Ben Armstrong",
      role: "Crypto Expert",
      comment:
        "This platform transformed how I manage my investments. The returns have been exceptional!",
      image: "/armstrong.jpg",
      portfolio: "+45% growth",
      yearsActive: "2 years",
    },
    {
      name: "Michael Chen",
      role: "Tech Professional",
      comment:
        "The automated portfolio management saved me countless hours. Highly recommended!",
      image: "/avatar/2.avif",
      portfolio: "+38% growth",
      yearsActive: "1.5 years",
    },
    {
      name: "Emma Davis",
      role: "Retired Teacher",
      comment:
        "Finally, an investment platform that's easy to understand and use. Great customer support!",
      image: "/avatar/3.avif",
      portfolio: "+32% growth",
      yearsActive: "3 years",
    },
    {
      name: "David Wilson",
      role: "Startup Founder",
      comment:
        "The best investment platform I've used. Their AI-driven insights are game-changing.",
      image: "/avatar/4.avif",
      portfolio: "+52% growth",
      yearsActive: "2.5 years",
    },
  ];

  const features = [
    {
      title: "Commission-Free Trading",
      description:
        "Trade stocks, ETFs, and cryptocurrencies without any commission fees.",
      icon: <DollarSign className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Automated Investing",
      description:
        "Let our AI-powered system manage your portfolio for optimal returns.",
      icon: <BarChart2 className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Real-Time Analytics",
      description:
        "Get instant insights and performance metrics for informed decisions.",
      icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Expert Support",
      description:
        "Access to certified financial advisors 24/7 for personalized guidance.",
      icon: <Users className="h-6 w-6 text-blue-500" />,
    },
  ];
  return (
    <>
      <section id="home" className="h-full w-full pt-10 xl:pt-36 lg:pt-36  relative flex items-center justify-center flex-col">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />

        <p className="text-center text-sm ">Leading Platform</p>
        <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
          <h1 className="text-8xl font-bold text-center md:text-[300px]"></h1>
          <h1 className="text-4xl  md:text-8xl font-bold text-center">
            One Platform <br /> Unlimited Potential
          </h1>
          <p className="text-white text-sm  text-center  ">
            {" "}
            Transform your financial future with our cutting-edge investment
            platform. <br /> Start your journey with as little as $10.
          </p>
        </div>
      </section>

    <section>
    <div id="about" className="h-full w-full p-10 xl:pt-36 lg:pt-10">
        <div className="flex md:flex-row flex-col gap-10">
        <div>
        <Image
            src="/image/pta.jpg"
            alt="image"
            width={500}
            height={500}
            className="w-[500px]"
            priority={true}
          />
        </div>
          <div className="space-y-6 max-w-2xl pb-30">
            <div className="flex items-center gap-5">
              <div className="bg-blue-600 w-1 h-8" />
              <p className="text-blue-600 font-medium uppercase tracking-wide">
                About us
              </p>
            </div>

            <h1 className="font-semibold text-4xl leading-tight">
              Pioneering the Future of Smart Investing
            </h1>

            <p className="text-gray-600 leading-relaxed">
              Founded in 2020, InvestSmart has rapidly grown to become a leading
              force in democratizing financial investments. We combine
              cutting-edge technology with financial expertise to make
              professional-grade investing accessible to everyone.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div>
                <h3 className="font-semibold text-xl mb-2">Our Mission</h3>
                <p className="text-gray-600">
                  To empower individuals to achieve financial freedom through
                  intelligent, accessible investment solutions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">Our Vision</h3>
                <p className="text-gray-600">
                  To create a world where everyone has the tools and knowledge
                  to build lasting wealth.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold">50K+</h4>
                  <p className="text-sm text-gray-600">Active Investors</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold">15+</h4>
                  <p className="text-sm text-gray-600">Industry Awards</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Learn More About Us <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    <div>

    </div>
    </section>

    <section>
      <InvestmentHero id="investment"/>
      </section>  

      {/* Features Section */}
      <section className="py-20" id="company">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the future of investing with our comprehensive suite of
              features
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <HoverCard key={index}>
                <HoverCardTrigger asChild>
                  <Card className="border-none shadow-lg hover:shadow-xl transition-all cursor-pointer">
                    <CardHeader>
                      <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">{feature.title}</h4>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="text-4xl font-bold mb-4">What Our Investors Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover why thousands of investors trust our platform
            </p>
          </div>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className=" shadow-lg mx-2  border-gray-700">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-16 h-16 object-fit rounded-full mb-4"
                        />
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-bold">{testimonial.name}</h4>
                            <p className="text-sm text-gray-600">
                              {testimonial.role}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {testimonial.portfolio}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Active for {testimonial.yearsActive}
                        </p>
                      </div>
                      <p className="text-gray-700 italic">
                        {testimonial.comment}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>


     <div className="flex items-center mb-3 justify-center">
      <Image src="/cert9.png" alt="certificate"   width={500}
            height={500}
            className="w-[200px]" />

      </div>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-8">
            Get Started Today
          </Badge>
          <h2 className="text-4xl font-bold mb-8">Ready to Start Investing?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of successful investors and start building your
            wealth today.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Create Free Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="  py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Sphera  Vault</h3>
              <p className="text-gray-400">
                Building financial futures through smart investing.
              </p>
              <div className="flex gap-4 mt-4">
                {/* Social icons would go here */}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Products</h4>
              <ul className="space-y-2 ">
                <li className="hover:text-white cursor-pointer">
                  Stocks & ETFs
                </li>
                <li className="hover:text-white cursor-pointer">
                  Cryptocurrencies
                </li>
                <li className="hover:text-white cursor-pointer">
                  Managed Portfolios
                </li>
                <li className="hover:text-white cursor-pointer">
                  Retirement Accounts
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">About Us</li>
                <li className="hover:text-white cursor-pointer">Careers</li>
                <li className="hover:text-white cursor-pointer">Press</li>
                <li className="hover:text-white cursor-pointer">Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <div className="space-y-2 text-gray-400">
                <p className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  1-800-INVEST
                </p>
                <p className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  support@spheravault.com
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 Sphera Vault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
