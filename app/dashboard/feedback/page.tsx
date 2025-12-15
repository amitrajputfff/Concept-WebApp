'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/lib/auth-context';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ThumbsUp,
  ThumbsDown,
  Star,
  MessageSquare,
  Lightbulb,
  Bug,
  Sparkles,
  TrendingUp,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

const feedbackCategories = [
  { id: 'feature', label: 'Feature Request', icon: <Lightbulb size={20} className="text-amber-500" /> },
  { id: 'bug', label: 'Bug Report', icon: <Bug size={20} className="text-red-500" /> },
  { id: 'improvement', label: 'Improvement', icon: <TrendingUp size={20} className="text-blue-500" /> },
  { id: 'general', label: 'General Feedback', icon: <MessageSquare size={20} className="text-slate-500" /> },
];

const recentFeedback = [
  {
    id: 1,
    user: 'Sarah M.',
    category: 'Feature Request',
    title: 'Add export to CSV for loan reports',
    status: 'In Progress',
    votes: 24,
    date: '2 days ago',
  },
  {
    id: 2,
    user: 'Mike P.',
    category: 'Improvement',
    title: 'Faster AI memo generation',
    status: 'Completed',
    votes: 18,
    date: '1 week ago',
  },
  {
    id: 3,
    user: 'Linda K.',
    category: 'Feature Request',
    title: 'Mobile app for lenders',
    status: 'Under Review',
    votes: 42,
    date: '3 days ago',
  },
];

function FeedbackContent() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedbackForm, setFeedbackForm] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@propelcapital.com',
    category: '',
    title: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Thank you for your feedback! We\'ll review it and get back to you.');
    setFeedbackForm({
      ...feedbackForm,
      category: '',
      title: '',
      description: '',
    });
    setRating(0);
    setIsSubmitting(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Under Review':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Feedback & Ideas</h1>
        <p className="text-slate-500 mt-2">Help us improve Propel Capital with your suggestions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-teal-100 bg-teal-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-teal-600 font-medium mb-1">Ideas Submitted</p>
                  <h3 className="text-3xl font-bold text-teal-900">248</h3>
                  <p className="text-xs text-teal-600 mt-1">+12 this month</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-teal-200 flex items-center justify-center">
                  <Lightbulb className="text-teal-700" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 bg-emerald-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-600 font-medium mb-1">Implemented</p>
                  <h3 className="text-3xl font-bold text-emerald-900">87</h3>
                  <p className="text-xs text-emerald-600 mt-1">35% completion</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-200 flex items-center justify-center">
                  <CheckCircle2 className="text-emerald-700" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 font-medium mb-1">Avg Response Time</p>
                  <h3 className="text-3xl font-bold text-blue-900">2.4d</h3>
                  <p className="text-xs text-blue-600 mt-1">Fast replies</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                  <MessageSquare className="text-blue-700" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100 bg-purple-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-600 font-medium mb-1">Contributors</p>
                  <h3 className="text-3xl font-bold text-purple-900">156</h3>
                  <p className="text-xs text-purple-600 mt-1">Active users</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center">
                  <Users className="text-purple-700" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-teal-600" size={24} />
              Share Your Feedback
            </CardTitle>
            <CardDescription>
              Your input drives our product roadmap
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Rating */}
              <div>
                <Label>Overall Experience Rating</Label>
                <div className="flex items-center gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={`${
                          star <= (hoveredRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-sm text-slate-600 font-medium">
                      {rating === 5 ? 'Excellent!' : rating === 4 ? 'Good' : rating === 3 ? 'Okay' : rating === 2 ? 'Poor' : 'Very Poor'}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={feedbackForm.name}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={feedbackForm.email}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Feedback Type</Label>
                <Select
                  value={feedbackForm.category}
                  onValueChange={(value) => setFeedbackForm({ ...feedbackForm, category: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {feedbackCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center gap-2">
                          {cat.icon}
                          {cat.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Brief summary of your feedback"
                  value={feedbackForm.title}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Details</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide detailed feedback, suggestions, or report issues..."
                  rows={6}
                  value={feedbackForm.description}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, description: e.target.value })}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-teal-600" size={24} />
              Popular Ideas
            </CardTitle>
            <CardDescription>Top-voted by community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentFeedback.map((item) => (
              <Card key={item.id} className="border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <ThumbsUp size={14} className="text-teal-600" />
                      <span className="text-xs font-semibold text-slate-700">{item.votes}</span>
                    </div>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900 mb-1">{item.title}</h4>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{item.user}</span>
                    <span>{item.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="border-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center">
                <Sparkles className="text-white" size={32} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Your Voice Matters</h3>
                <p className="text-sm text-slate-600">Join our Product Advisory Board for exclusive early access</p>
              </div>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <ProtectedRoute allowedRoles={['lender']}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <FeedbackContent />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

