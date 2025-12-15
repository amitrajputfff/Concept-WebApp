'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute, useAuth } from '@/lib/auth-context';
import { generateChatExplanation } from '@/lib/ai';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Menu,
  Bell,
  MessageSquare,
  ChevronLeft,
  Send,
  Sparkles,
  Loader,
  CheckCircle,
  Smartphone,
  Activity,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

// Chat script
const chatScript = [
  {
    id: 1,
    sender: 'clara',
    text: "Hi Maria! Propel Intelligence detected a 'Game Day Alert' for Taco Rico. We're flagging a critical inventory risk for this Saturday.",
    delay: 500,
  },
  {
    id: 2,
    sender: 'clara',
    text: "Context: The Big Game is Saturday (Sep 18). We predict a 280% spike in wing demand. Your current inventory is only at 40%. You risk losing over $12,000 in revenue, similar to the $8,000 loss you faced last season.",
    delay: 2000,
  },
  {
    id: 3,
    sender: 'user',
    text: "Wow, I didn't realize it was that low. But honestly, I have payroll and supplier payments ($33k) hitting this week, and I only have $30k in the bank.",
    triggerLabel: "Reply: mention payroll/cash crunch",
  },
  {
    id: 4,
    sender: 'clara',
    text: "I see that. That's why I've generated a Game Day Package for you: $30,000 available now.",
    delay: 1000,
  },
  {
    id: 5,
    sender: 'clara',
    text: "This covers your supplier restock to capture that $12k upside, plus gives you a buffer for payroll. The cost is approx $2,400, which means a 400% ROI on the revenue you're protecting.",
    delay: 2500,
  },
  {
    id: 6,
    sender: 'user',
    text: "That sounds like a lifesaver. But how does the repayment work? I can't add another fixed monthly bill right now.",
    triggerLabel: "Reply: Ask about repayment",
  },
  {
    id: 7,
    sender: 'clara',
    text: "It's simple: We take 8% of your daily sales for about 12 weeks. It's auto-collected, so when sales are high (like Saturday), you pay more. When they're low, you pay less.",
    delay: 1500,
  },
  {
    id: 8,
    sender: 'user',
    text: "Okay, that works for me. Let's do it.",
    triggerLabel: "Reply: Accept Offer",
  },
  {
    id: 9,
    sender: 'clara',
    text: "Perfect. I'm processing the $30,000 instant transfer now. No forms, no waiting. You're all set for the Big Game!",
    delay: 1500,
    action: 'TRANSFER_COMPLETE',
  },
];

interface ChatMessage {
  id: number;
  sender: string;
  text: string;
  isAi?: boolean;
  triggerLabel?: string;
  delay?: number;
  action?: string;
}

function MobileContent() {
  const [activeScreen, setActiveScreen] = useState<'home' | 'chat'>('home');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showTransferSuccess, setShowTransferSuccess] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  // Handle auto-advancing the script for Clara's lines
  useEffect(() => {
    if (activeScreen === 'chat' && currentStep < chatScript.length) {
      const stepData = chatScript[currentStep];

      if (stepData.sender === 'clara') {
        setIsTyping(true);
        const timer = setTimeout(() => {
          setIsTyping(false);
          setChatHistory((prev) => [...prev, stepData]);

          if (stepData.action === 'TRANSFER_COMPLETE') {
            setTimeout(() => setShowTransferSuccess(true), 1500);
          }

          setCurrentStep((prev) => prev + 1);
        }, stepData.delay);
        return () => clearTimeout(timer);
      }
    }
  }, [activeScreen, currentStep]);

  const handleUserReply = () => {
    const stepData = chatScript[currentStep];
    setChatHistory((prev) => [...prev, stepData]);
    setCurrentStep((prev) => prev + 1);
  };

  const handleAskClara = async () => {
    setIsExplaining(true);
    setIsTyping(true);
    toast.info('Clara is thinking...');

    try {
      const aiResponse = await generateChatExplanation('8% daily sales deduction terms');
      setIsTyping(false);
      setIsExplaining(false);

      setChatHistory((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'clara',
          text: aiResponse,
          isAi: true,
        },
      ]);
      toast.success('Clara responded');
    } catch (error) {
      setIsTyping(false);
      setIsExplaining(false);
      toast.error('Failed to get response');
      console.error(error);
    }
  };

  const handleReset = () => {
    setShowTransferSuccess(false);
    setActiveScreen('home');
    setChatHistory([]);
    setCurrentStep(0);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Phone Frame - Responsive: Full screen on mobile, frame on desktop */}
      <div className="w-full h-full sm:w-[390px] sm:h-[844px] sm:max-h-[90vh] bg-black sm:rounded-[3rem] shadow-2xl relative sm:border-[12px] border-slate-900">
        {/* Dynamic Island / Notch - Only on desktop */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20"></div>

        {/* Screen Content */}
        <div className="w-full h-full bg-white sm:rounded-[2rem] overflow-hidden relative">
          {activeScreen === 'home' ? (
            <div className="h-full bg-slate-50 flex flex-col">
              {/* Header */}
              <div className="bg-teal-600 p-6 pb-12 rounded-b-[2.5rem] shadow-lg">
                <div className="flex justify-between items-center text-white mb-6">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-teal-700"
                    onClick={logout}
                  >
                    <Menu size={24} />
                  </Button>
                  <div className="relative cursor-pointer">
                    <Bell size={24} />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full border-2 border-teal-600"></span>
                  </div>
                </div>
                <h2 className="text-3xl font-light text-white">Good Morning,</h2>
                <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
                <div className="text-teal-100 text-sm mt-1">
                  {user?.business} • {user?.location}
                </div>
              </div>

              {/* Main Content */}
              <div className="px-6 -mt-8 flex-1">
                {/* Notification Card */}
                <Card
                  onClick={() => setActiveScreen('chat')}
                  className="mb-6 active:scale-95 transition-transform cursor-pointer shadow-xl shadow-slate-200 border-teal-50 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
                  <CardContent className="pt-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                        <span className="font-bold text-teal-700">C</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800">Clara (Propel)</div>
                        <div className="text-xs text-slate-500">Just now • Game Day Alert</div>
                      </div>
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-1">Stockout Risk Detected</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      <span className="font-bold text-red-500">High Risk:</span> Potential $12,000+ lost
                      revenue this Saturday.
                    </p>
                    <div className="w-full py-2 bg-teal-50 text-teal-700 font-semibold rounded-lg text-sm flex items-center justify-center gap-2">
                      <MessageSquare size={16} /> View Game Day Package
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-xs text-slate-400 mb-1">Bank Balance</div>
                      <div className="text-xl font-bold text-slate-800">$30,000</div>
                      <div className="text-xs text-red-500 flex items-center gap-1 mt-1">
                        Obligations: $33k
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-xs text-slate-400 mb-1">Inventory (Wings)</div>
                      <div className="text-xl font-bold text-slate-800">40%</div>
                      <div className="text-xs text-red-500 mt-1">Stockout imminent</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="mt-auto bg-white border-t border-slate-100 p-4 flex justify-around text-slate-400">
                <button 
                  onClick={() => router.push('/mobile')}
                  className="flex flex-col items-center gap-1 text-teal-600"
                >
                  <Smartphone size={24} />
                  <span className="text-[10px] font-medium">Home</span>
                </button>
                <button 
                  onClick={() => router.push('/mobile/activity')}
                  className="flex flex-col items-center gap-1 hover:text-teal-600 transition-colors"
                >
                  <Activity size={24} />
                  <span className="text-[10px] font-medium">Activity</span>
                </button>
                <button 
                  onClick={() => router.push('/mobile/growth')}
                  className="flex flex-col items-center gap-1 hover:text-teal-600 transition-colors"
                >
                  <Zap size={24} />
                  <span className="text-[10px] font-medium">Growth</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-50 flex flex-col">
              {/* Chat Header */}
              <div className="bg-white p-4 border-b border-slate-200 flex items-center gap-3 shadow-sm z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveScreen('home')}
                  className="text-slate-500 hover:text-slate-800"
                >
                  <ChevronLeft size={24} />
                </Button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold shadow-md">
                  C
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">Clara</div>
                  <div className="text-xs text-teal-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span> Propel CFO Agent
                  </div>
                </div>
              </div>

              {/* Chat Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  <div className="text-center text-xs text-slate-400 my-4">Wed, Sep 15 • 9:15 AM</div>

                  {chatHistory.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                          msg.sender === 'user'
                            ? 'bg-teal-600 text-white rounded-br-none'
                            : msg.isAi
                            ? 'bg-teal-50 border border-teal-100 text-teal-800 rounded-bl-none shadow-teal-100'
                            : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                        }`}
                      >
                        {msg.isAi && (
                          <div className="text-[10px] font-bold text-teal-500 mb-1 flex items-center gap-1">
                            <Sparkles size={10} /> AI ASSISTANT
                          </div>
                        )}
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-1 items-center">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Success Modal */}
              <Dialog open={showTransferSuccess} onOpenChange={setShowTransferSuccess}>
                <DialogContent className="w-[90%] mx-auto rounded-3xl bg-white">
                  <DialogHeader>
                    <DialogTitle className="sr-only">Transfer Complete</DialogTitle>
                  </DialogHeader>
                  <div className="text-center py-4">
                    <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={40} className="text-teal-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Approval Sent!</h2>
                    <p className="text-slate-500 mb-6">
                      Your loan request for $30,000 has been submitted. Pending lender approval.
                    </p>
                    <Card className="bg-slate-50 mb-6">
                      <CardContent className="pt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-500">Incremental Gain</span>
                          <span className="font-bold text-emerald-600">+$7,500</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Daily Rate</span>
                          <span className="font-bold text-teal-600">8% of Sales</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Button onClick={handleReset} className="w-full" size="lg">
                      Done
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Interaction Area */}
              <div className="bg-white p-4 border-t border-slate-200">
                {chatScript[currentStep]?.sender === 'user' && !isTyping ? (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAskClara}
                      disabled={isExplaining}
                      variant="outline"
                      size="icon"
                      className="bg-teal-50 hover:bg-teal-100 text-teal-600 border-teal-100"
                    >
                      {isExplaining ? <Loader size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    </Button>

                    <Button onClick={handleUserReply} className="flex-1 animate-pulse" size="lg">
                      {chatScript[currentStep].triggerLabel} <Send size={18} className="ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="h-12 bg-slate-50 rounded-xl border border-slate-200 flex items-center px-4 text-slate-400 text-sm">
                    {isExplaining ? 'Clara is thinking...' : 'Type a message...'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop controls - Hidden on mobile */}
      <div className="hidden md:flex absolute top-4 right-4 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.location.href = '/'}
          className="bg-white/90 backdrop-blur"
        >
          Home
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={logout}
          className="bg-white/90 backdrop-blur"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

export default function MobilePage() {
  return (
    <ProtectedRoute allowedRoles={['merchant']}>
      <MobileContent />
    </ProtectedRoute>
  );
}

