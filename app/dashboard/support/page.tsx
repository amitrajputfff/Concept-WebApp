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
  LifeBuoy,
  MessageSquare,
  FileText,
  Video,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

const supportTopics = [
  { id: 'technical', label: 'Technical Issue', icon: <LifeBuoy size={20} /> },
  { id: 'account', label: 'Account Management', icon: <FileText size={20} /> },
  { id: 'billing', label: 'Billing & Payments', icon: <CheckCircle2 size={20} /> },
  { id: 'integration', label: 'Integration Support', icon: <ExternalLink size={20} /> },
];

const faqs = [
  {
    question: 'How do I connect my POS system?',
    answer: 'Navigate to Settings > Integrations and select your POS provider. Follow the authentication flow to securely connect your account.',
  },
  {
    question: 'What is the Propel Score?',
    answer: 'The Propel Score is an AI-powered risk assessment that evaluates merchant creditworthiness based on real-time transaction data, cash flow patterns, and market trends.',
  },
  {
    question: 'How quickly can I get funding?',
    answer: 'Once approved, funds are typically transferred within 24 hours to your connected business bank account.',
  },
  {
    question: 'What are the repayment terms?',
    answer: 'Repayment is based on a percentage of daily sales (typically 8-12%), automatically collected over 12-16 weeks. You pay more when sales are high, less when they\'re low.',
  },
];

function SupportContent() {
  const [ticketForm, setTicketForm] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@propelcapital.com',
    subject: '',
    category: '',
    priority: 'medium',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Support ticket created! Our team will respond within 2 hours.');
    setTicketForm({
      ...ticketForm,
      subject: '',
      category: '',
      description: '',
    });
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Support Center</h1>
        <p className="text-slate-500 mt-2">Get help from our team or explore resources</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Contact Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-teal-100">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <MessageSquare className="text-teal-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Live Chat</h3>
                  <p className="text-xs text-slate-500 mt-1">Average response: 2 min</p>
                  <Badge variant="outline" className="mt-2 bg-emerald-50 text-emerald-700 border-emerald-200">
                    Available Now
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Email Support</h3>
                  <p className="text-xs text-slate-500 mt-1">support@propelcapital.com</p>
                  <Badge variant="outline" className="mt-2">
                    Response in 4h
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Phone className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Phone</h3>
                  <p className="text-xs text-slate-500 mt-1">1-800-PROPEL-1</p>
                  <Badge variant="outline" className="mt-2">
                    Mon-Fri 8AM-8PM
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Video className="text-orange-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Video Call</h3>
                  <p className="text-xs text-slate-500 mt-1">Schedule a session</p>
                  <Badge variant="outline" className="mt-2">
                    Book Now
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Ticket Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LifeBuoy className="text-teal-600" size={24} />
              Create Support Ticket
            </CardTitle>
            <CardDescription>
              Submit a ticket and our team will get back to you within 2 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={ticketForm.name}
                    onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={ticketForm.email}
                    onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your issue"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={ticketForm.category}
                    onValueChange={(value) => setTicketForm({ ...ticketForm, category: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {supportTopics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id}>
                          {topic.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={ticketForm.priority}
                    onValueChange={(value) => setTicketForm({ ...ticketForm, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide detailed information about your issue..."
                  rows={6}
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="text-teal-600" size={24} />
              Common Questions
            </CardTitle>
            <CardDescription>Quick answers to frequent inquiries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-slate-100 pb-4 last:border-0">
                <h4 className="font-semibold text-sm text-slate-900 mb-2">{faq.question}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="border-emerald-200 bg-emerald-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <div>
                <h3 className="font-semibold text-emerald-900">All Systems Operational</h3>
                <p className="text-xs text-emerald-700">Last checked: {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-700 hover:bg-emerald-100">
              <ExternalLink size={14} className="mr-2" />
              Status Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SupportPage() {
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
              <SupportContent />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

