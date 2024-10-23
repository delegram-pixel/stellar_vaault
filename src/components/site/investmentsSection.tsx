import { ArrowRight, BarChart2, Shield, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function InvestmentHero() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16 mt-10 pt-20">
        {/* Main Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Invest Smarter, Grow Faster</h1>
          <p className="text-xl mb-8">Transform your financial future with our cutting-edge investment platform. 
            Start your journey with as little as $10.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full 
            flex items-center mx-auto">
            Start Investing <ArrowRight className="ml-2" />
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <BarChart2 className="h-8 w-8 mb-4 text-blue-500" />
              <CardTitle>Smart Portfolio Management</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>• Professionally curated strategies</li>
                <li>• Real-time rebalancing</li>
                <li>• Risk-adjusted optimization</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Shield className="h-8 w-8 mb-4 text-blue-500" />
              <CardTitle>Security First</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>• Bank-grade encryption</li>
                <li>• SIPC-protected investments</li>
                <li>• Two-factor authentication</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <DollarSign className="h-8 w-8 mb-4 text-blue-500" />
              <CardTitle>Diverse Investment Options</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>• Stocks & ETFs</li>
                <li>• Cryptocurrencies</li>
                <li>• REITs & Bonds</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-3xl font-bold text-blue-500">$2B+</h3>
            <p className="text-gray-400">Assets Managed</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-500">4.8/5</h3>
            <p className="text-gray-400">User Rating</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-500">99.9%</h3>
            <p className="text-gray-400">Platform Uptime</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-500">24/7</h3>
            <p className="text-gray-400">Customer Support</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 text-center mt-16">
          Capital at risk. Investments can go up and down. Past performance is not indicative of future results.
        </p>
      </div>
    </div>
  );
}