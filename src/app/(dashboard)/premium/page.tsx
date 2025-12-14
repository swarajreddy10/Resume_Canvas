'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Star } from 'lucide-react';

export default function PremiumPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        '3 resumes',
        'Basic templates',
        'PDF export',
        'Basic AI assistance',
        'Community support',
      ],
      current: true,
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: 'month',
      features: [
        'Unlimited resumes',
        'Premium templates',
        'Advanced AI features',
        'Job matching',
        'Priority support',
        'Analytics dashboard',
        'Custom branding',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$29.99',
      period: 'month',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'API access',
        'Custom integrations',
        'Dedicated support',
        'Advanced analytics',
        'White-label solution',
      ],
    },
  ];

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Upgrade to Premium
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Unlock advanced features and take your career to the next level
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                <Star className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {plan.name === 'Free' && (
                  <Zap className="h-8 w-8 text-gray-500" />
                )}
                {plan.name === 'Pro' && (
                  <Crown className="h-8 w-8 text-blue-500" />
                )}
                {plan.name === 'Enterprise' && (
                  <Star className="h-8 w-8 text-purple-500" />
                )}
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold text-gray-900">
                {plan.price}
                <span className="text-lg font-normal text-gray-600">
                  /{plan.period}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${plan.current ? 'bg-gray-400' : plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                disabled={plan.current}
              >
                {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Why Choose Premium?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Advanced AI</h3>
            <p className="text-gray-600">
              Get personalized job recommendations and salary insights
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Premium Templates</h3>
            <p className="text-gray-600">
              Access exclusive, professionally designed resume templates
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Priority Support</h3>
            <p className="text-gray-600">
              Get help when you need it with dedicated support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
