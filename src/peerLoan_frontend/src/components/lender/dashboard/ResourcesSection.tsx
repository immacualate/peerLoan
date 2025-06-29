
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, ExternalLink, BookOpen, TrendingUp, Shield, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const ResourcesSection: React.FC = () => {
  const [selectedResource, setSelectedResource] = useState<any>(null);
  
  const resources = [
    {
      id: 'risk-assessment',
      title: 'Risk Assessment & Due Diligence',
      description: 'Master the fundamentals of evaluating borrower profiles and building a diversified lending portfolio.',
      videoUrl: 'https://www.youtube.com/embed/dPWTOAm_8tQ',
      duration: '12:45',
      level: 'Beginner',
      topics: ['Credit Score Analysis', 'Income Verification', 'Risk Diversification', 'Portfolio Balance'],
      icon: Shield,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'impact-investing',
      title: 'Impact Investing in Education',
      description: 'Learn how your investments create measurable social impact while generating competitive returns.',
      videoUrl: 'https://www.youtube.com/embed/6bEG0pr8tQQ',
      duration: '18:30',
      level: 'Intermediate',
      topics: ['Social Impact Metrics', 'ESG Principles', 'Student Success Tracking', 'Community Development'],
      icon: Users,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'tax-optimization',
      title: 'Tax Benefits & Legal Considerations',
      description: 'Understand tax advantages, regulatory compliance, and legal protections in peer-to-peer lending.',
      videoUrl: 'https://www.youtube.com/embed/kVzc-CpGhNY',
      duration: '15:20',
      level: 'Advanced',
      topics: ['Tax Deductions', 'Regulatory Compliance', 'Legal Protections', 'Documentation Requirements'],
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'platform-guide',
      title: 'Platform Features & Best Practices',
      description: 'Complete walkthrough of peerLoan features and proven strategies for successful lending.',
      videoUrl: 'https://www.youtube.com/embed/M7FIvfx5J10',
      duration: '22:15',
      level: 'Beginner',
      topics: ['Dashboard Navigation', 'Loan Selection', 'Portfolio Management', 'Performance Tracking'],
      icon: BookOpen,
      color: 'bg-orange-100 text-orange-800'
    }
  ];
  
  const additionalResources = [
    {
      title: 'Student Loan Market Analysis 2024',
      url: 'https://www.brookings.edu/articles/student-loans-the-fiscal-outlook-for-federal-direct-lending/',
      type: 'Research Report'
    },
    {
      title: 'Peer-to-Peer Lending Best Practices',
      url: 'https://www.investopedia.com/terms/p/peer-to-peer-lending.asp',
      type: 'Article'
    },
    {
      title: 'Education Finance Innovation Hub',
      url: 'https://www.luminafoundation.org/',
      type: 'Resource Center'
    }
  ];
  
  const openVideoModal = (resource: any) => {
    setSelectedResource(resource);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lender Education Center</CardTitle>
        <CardDescription>
          Comprehensive resources to help you become a successful impact investor in education
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {resources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${resource.color.replace('text-', 'bg-').replace('800', '200')}`}>
                      <resource.icon className={`h-5 w-5 ${resource.color.replace('bg-', 'text-').replace('100', '600')}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{resource.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={resource.color}>
                          {resource.level}
                        </Badge>
                        <Badge variant="outline">
                          {resource.duration}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm pb-3">
                <p className="text-muted-foreground mb-3">{resource.description}</p>
                <div className="space-y-1">
                  <p className="font-medium text-xs text-muted-foreground">Key Topics:</p>
                  <div className="flex flex-wrap gap-1">
                    {resource.topics.map((topic, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full" 
                      onClick={() => openVideoModal(resource)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Watch Video
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>{resource.title}</DialogTitle>
                      <DialogDescription>
                        {resource.description}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="aspect-video">
                      <iframe
                        width="100%"
                        height="100%"
                        src={resource.videoUrl}
                        title={resource.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-lg"
                      ></iframe>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">What you'll learn:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {resource.topics.map((topic, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            {topic}
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="border-t pt-6">
          <h4 className="font-medium mb-4 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Additional Reading & Resources
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {additionalResources.map((resource, index) => (
              <Card key={index} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{resource.title}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {resource.type}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourcesSection;
