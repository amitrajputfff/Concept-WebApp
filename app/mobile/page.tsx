'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute, useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Menu,
  CheckCircle,
  Smartphone,
  Activity,
  Zap,
  User,
  LogOut,
  TrendingUp,
  Phone,
  PhoneOff,
  Mic,
  Lock,
  Sparkles,
  Loader,
} from 'lucide-react';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { toast } from 'sonner';

// Voice Script - Natural Conversation Flow
const voiceScript = [
  {
    id: 1,
    speaker: 'lia',
    text: "Hey Maria, it's Lia from Propel. Do you have a quick minute? I noticed a massive opportunity for this weekend that I wanted to flag for you.",
    duration: 3000
  },
  {
    id: 2,
    speaker: 'user',
    text: "Oh, hey Lia. Yeah, I'm just doing prep work. What's up?",
    triggerLabel: "Say: \"Hey Lia, what's up?\""
  },
  {
    id: 3,
    speaker: 'lia',
    text: "So, Saturday is the big ASU versus Oregon game. Based on neighborhood foot traffic, we're projecting a 280% surge in demand. But I'm looking at your inventory, and your wings are only at 40%.",
    duration: 5000
  },
  {
    id: 4,
    speaker: 'lia',
    text: "If you don't stock up, my models show you might miss out on about $12,000 in revenue. I want to help you capture that.",
    duration: 4000
  },
  {
    id: 5,
    speaker: 'user',
    text: "Wow, $12k? I knew it would be busy, but I skipped my order because payroll is due. I'm tight on cash right now.",
    triggerLabel: "Say: \"I'm tight on cash right now.\""
  },
  {
    id: 6,
    speaker: 'lia',
    text: "I completely understand. That's why I've already approved a $30,000 'Game Day Package' for you. It covers the restock and gives you a buffer for payroll. Funds can be there instantly.",
    duration: 5000
  },
  {
    id: 7,
    speaker: 'user',
    text: "That sounds amazing, but I can't take on a fixed monthly bill. How do I pay it back?",
    triggerLabel: "Say: \"How do I pay it back?\""
  },
  {
    id: 8,
    speaker: 'lia',
    text: "No fixed bill. We just take 8% of your daily sales. So on a huge Saturday, you pay more. On a slow Tuesday, you pay almost nothing. It flexes with your business.",
    duration: 5000
  },
  {
    id: 9,
    speaker: 'user',
    text: "Okay, that actually makes sense. Let's do it.",
    triggerLabel: "Say: \"Let's do it.\""
  },
  {
    id: 10,
    speaker: 'lia',
    text: "Done. I've initiated the transfer to your Chase account. I've also queued the order with Southwest Food Distributors for Thursday delivery. You're all set to crush it this weekend!",
    duration: 4000,
    action: 'TRANSFER_COMPLETE'
  }
];

function MobileContent() {
  // Initialize screen state based on immediate check
  const getInitialScreen = (): 'lock' | 'dashboard' | 'voice' | 'success' | 'loading' => {
    if (typeof window === 'undefined') return 'loading';
    
    const onboardingComplete = localStorage.getItem('propel_onboarding_complete_merchant');
    
    if (onboardingComplete === 'true') {
      // After onboarding, lock screen is always the default
      return 'lock';
    } else {
      return 'loading'; // Will redirect in useEffect
    }
  };

  const [screen, setScreen] = useState<'lock' | 'dashboard' | 'voice' | 'success' | 'loading'>(getInitialScreen);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLiaSpeaking, setIsLiaSpeaking] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechConfig, setSpeechConfig] = useState<{ key: string; region: string; voiceName: string } | null>(null);
  const [isLoadingSpeech, setIsLoadingSpeech] = useState(false);
  const synthesizerRef = useRef<sdk.SpeechSynthesizer | null>(null);
  const recognizerRef = useRef<sdk.SpeechRecognizer | null>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  // Load Azure Speech configuration
  useEffect(() => {
    const loadSpeechConfig = async () => {
      try {
        const response = await fetch('/api/azure-speech');
        const data = await response.json();
        
        if (data.configured && data.region) {
          // Get the key from environment (we'll need to pass it from server)
          // For now, we'll fetch it from a secure endpoint or use a token
          const keyResponse = await fetch('/api/azure-speech/key');
          const keyData = await keyResponse.json();
          
          if (keyData.key) {
            setSpeechConfig({
              key: keyData.key,
              region: data.region,
              voiceName: data.voiceName || 'en-US-JennyNeural', // Best quality English voice
            });
          }
        }
      } catch (error) {
        console.error('Failed to load Azure Speech config:', error);
        // Continue without Azure Speech (fallback to text-based)
      }
    };

    loadSpeechConfig();
  }, []);

  // Check onboarding status and handle redirects
  useEffect(() => {
    const onboardingComplete = localStorage.getItem('propel_onboarding_complete_merchant');
    const justCompleted = sessionStorage.getItem('propel_just_completed_onboarding');
    
    if (onboardingComplete === 'true') {
      // After onboarding, lock screen is always the default
      if (screen === 'loading') {
        setScreen('lock');
      }
      // Clear the just completed flag if it exists (for first time after onboarding)
      if (justCompleted === 'true') {
        setTimeout(() => {
          sessionStorage.removeItem('propel_just_completed_onboarding');
        }, 500);
      }
    } else {
      // Not onboarded, redirect to onboarding
      if (screen === 'loading') {
        router.push('/mobile/onboarding');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Trigger notification on lock screen
  useEffect(() => {
    if (screen === 'lock') {
      const timer = setTimeout(() => setShowNotification(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // Handle Voice Flow with Azure TTS
  useEffect(() => {
    if (screen === 'voice' && currentStep < voiceScript.length) {
      const step = voiceScript[currentStep];
      if (step.speaker === 'lia' && speechConfig) {
        // Use Azure TTS to speak
        speakWithAzureTTS(step.text, step.action === 'TRANSFER_COMPLETE');
      } else if (step.speaker === 'lia' && !speechConfig) {
        // Fallback to timer-based if Azure Speech not configured
        setIsLiaSpeaking(true);
        const timer = setTimeout(() => {
          setIsLiaSpeaking(false);
          if (step.action === 'TRANSFER_COMPLETE') {
            setTimeout(() => setScreen('success'), 1000);
          } else {
            setCurrentStep(prev => prev + 1);
          }
        }, step.duration);
        return () => clearTimeout(timer);
      }
    }
  }, [screen, currentStep, speechConfig]);

  // Speak text using Azure TTS
  const speakWithAzureTTS = async (text: string, isLastMessage: boolean) => {
    if (!speechConfig) return;

    try {
      setIsLiaSpeaking(true);
      setIsLoadingSpeech(true);

      // Create speech config
      const speechConfigObj = sdk.SpeechConfig.fromSubscription(
        speechConfig.key,
        speechConfig.region
      );
      // Explicitly set to English (US) only for TTS
      speechConfigObj.speechSynthesisLanguage = 'en-US';
      speechConfigObj.speechSynthesisVoiceName = speechConfig.voiceName || 'en-US-JennyNeural';

      // Create audio config
      const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();

      // Create synthesizer
      const synthesizer = new sdk.SpeechSynthesizer(speechConfigObj, audioConfig);
      synthesizerRef.current = synthesizer;

      // Speak the text
      synthesizer.speakTextAsync(
        text,
        (result) => {
          setIsLiaSpeaking(false);
          setIsLoadingSpeech(false);
          synthesizer.close();
          synthesizerRef.current = null;

          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            if (isLastMessage) {
              setTimeout(() => setScreen('success'), 1000);
            } else {
              setCurrentStep(prev => prev + 1);
            }
          } else {
            console.error('Speech synthesis failed:', result.reason);
            // Fallback: continue to next step
            if (isLastMessage) {
              setTimeout(() => setScreen('success'), 1000);
            } else {
              setCurrentStep(prev => prev + 1);
            }
          }
        },
        (error) => {
          console.error('Speech synthesis error:', error);
          setIsLiaSpeaking(false);
          setIsLoadingSpeech(false);
          synthesizer.close();
          synthesizerRef.current = null;
          toast.error('Speech synthesis failed. Continuing...');
          // Fallback: continue to next step
          if (isLastMessage) {
            setTimeout(() => setScreen('success'), 1000);
          } else {
            setCurrentStep(prev => prev + 1);
          }
        }
      );
    } catch (error) {
      console.error('Azure TTS error:', error);
      setIsLiaSpeaking(false);
      setIsLoadingSpeech(false);
      toast.error('Failed to initialize speech. Continuing...');
      // Fallback: continue to next step
      if (isLastMessage) {
        setTimeout(() => setScreen('success'), 1000);
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  // Handle user speech input with Azure STT
  const handleUserSpeak = async () => {
    if (!speechConfig) {
      // Fallback: just advance step
      setCurrentStep(prev => prev + 1);
      return;
    }

    try {
      setIsListening(true);
      setIsLoadingSpeech(true);

      // Create speech config - English only
      const speechConfigObj = sdk.SpeechConfig.fromSubscription(
        speechConfig.key,
        speechConfig.region
      );
      // Explicitly set to English (US) only - no other languages will be recognized
      speechConfigObj.speechRecognitionLanguage = 'en-US';

      // Create audio config (use default microphone)
      const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();

      // Create recognizer - will only recognize English (en-US)
      const recognizer = new sdk.SpeechRecognizer(speechConfigObj, audioConfig);
      recognizerRef.current = recognizer;

      // Recognize speech
      recognizer.recognizeOnceAsync(
        (result) => {
          setIsListening(false);
          setIsLoadingSpeech(false);
          recognizer.close();
          recognizerRef.current = null;

          if (result.reason === sdk.ResultReason.RecognizedSpeech) {
            const recognizedText = result.text.trim();
            console.log('Recognized:', recognizedText);
            toast.success('Speech recognized!');
            // Advance to next step
            setCurrentStep(prev => prev + 1);
          } else if (result.reason === sdk.ResultReason.NoMatch) {
            toast.error('No speech detected. Please try again.');
            setIsListening(false);
            setIsLoadingSpeech(false);
          } else {
            toast.error('Speech recognition failed. Please try again.');
            setIsListening(false);
            setIsLoadingSpeech(false);
          }
        },
        (error) => {
          console.error('Speech recognition error:', error);
          setIsListening(false);
          setIsLoadingSpeech(false);
          recognizer.close();
          recognizerRef.current = null;
          toast.error('Speech recognition failed. Please try again.');
        }
      );
    } catch (error) {
      console.error('Azure STT error:', error);
      setIsListening(false);
      setIsLoadingSpeech(false);
      toast.error('Failed to initialize speech recognition. Continuing...');
      // Fallback: just advance step
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleEndCall = () => {
    // Clean up speech resources
    if (synthesizerRef.current) {
      synthesizerRef.current.close();
      synthesizerRef.current = null;
    }
    if (recognizerRef.current) {
      recognizerRef.current.close();
      recognizerRef.current = null;
    }
    
    // Reset voice state and return to dashboard
    setCurrentStep(0);
    setIsLiaSpeaking(false);
    setIsListening(false);
    setIsLoadingSpeech(false);
    setScreen('dashboard');
  };

  // --- SCREENS ---

  const LockScreen = () => (
    <div 
      className="h-full bg-[url('https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center relative flex flex-col items-center pt-20 cursor-pointer"
      onClick={() => setScreen('dashboard')}
    >
      <div className="text-6xl font-thin text-white mb-2">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
      <div className="text-lg text-white font-medium mb-10">{new Date().toLocaleDateString([], {weekday: 'long', month: 'long', day: 'numeric'})}</div>
     
      {showNotification && (
        <div
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering parent click
            setScreen('dashboard');
          }}
          className="w-[90%] bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl animate-in slide-in-from-top-4 cursor-pointer active:scale-95 transition-transform"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-teal-600 rounded flex items-center justify-center text-[10px] text-white font-bold">P</div>
              <span className="text-xs font-bold text-slate-700 uppercase">Propel Capital • Now</span>
            </div>
          </div>
          <div className="font-semibold text-slate-900 text-sm">Game Day Opportunity Detected 🏈</div>
          <div className="text-slate-600 text-xs mt-1">Projected 280% demand surge for ASU vs Oregon. Tap to view insights.</div>
        </div>
      )}
     
      <div className="mt-auto mb-8 flex justify-center w-full">
         <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white">
            <Lock size={20} />
         </div>
      </div>
    </div>
  );

  const DashboardScreen = () => (
    <div className="h-full bg-slate-50 flex flex-col font-sans">
       <div className="bg-white p-6 pb-4 shadow-sm z-10">
          <div className="flex justify-between items-center mb-6">
             <Button 
               variant="ghost" 
               size="icon" 
               className="text-slate-400 hover:text-slate-800"
               onClick={() => setMenuOpen(true)}
             >
               <Menu size={24} />
             </Button>
             <span className="font-bold text-slate-900">Propel</span>
             <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-xs">
               {user?.name?.charAt(0) || 'M'}
             </div>
          </div>
          <h2 className="text-2xl font-light text-slate-600">Hello, <span className="font-bold text-slate-900">{user?.name || 'Maria'}</span></h2>
       </div>

       <div className="p-6 space-y-6 overflow-y-auto">
          {/* Hero Insight Card */}
          <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl p-6 text-white shadow-lg shadow-teal-200">
             <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-yellow-300 animate-pulse"/>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Opportunity Alert</span>
             </div>
             <h3 className="text-xl font-bold mb-2">280% Demand Surge Predicted</h3>
             <p className="text-teal-100 text-sm mb-6 leading-relaxed">
                ASU vs Oregon (Saturday). Your current inventory won't meet this demand.
             </p>
             <button
               onClick={() => setScreen('voice')}
               className="w-full bg-white text-teal-800 font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-teal-50 transition-colors"
             >
                <Phone size={18} /> Speak with Lia
             </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="text-slate-400 text-xs mb-1">Projected Sales</div>
                <div className="text-xl font-bold text-slate-800">$15,000</div>
                <div className="text-xs text-emerald-500 mt-1 flex items-center gap-1"><TrendingUp size={12}/> +280%</div>
             </div>
             <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="text-slate-400 text-xs mb-1">Inventory Gap</div>
                <div className="text-xl font-bold text-red-500">-158 lbs</div>
                <div className="text-xs text-slate-400 mt-1">Wings needed</div>
             </div>
          </div>
       </div>
    </div>
  );

  const VoiceScreen = () => {
    const step = voiceScript[currentStep];
    const isUserTurn = step?.speaker === 'user';

    return (
      <div className="h-full bg-slate-900 flex flex-col relative overflow-hidden">
         {/* Background Animation */}
         <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className={`w-64 h-64 bg-teal-500 rounded-full blur-3xl transition-all duration-700 ${isLiaSpeaking ? 'scale-125 opacity-50' : 'scale-100'}`}></div>
         </div>

         <div className="relative z-10 flex-1 flex flex-col items-center pt-20 px-6">
            <div className="text-teal-400 text-sm font-bold uppercase tracking-widest mb-8">LiaPlus AI</div>
           
            {/* Visualizer */}
            <div className="flex items-center gap-1 h-12 mb-12">
               {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-2 bg-white rounded-full transition-all duration-300 ${isLiaSpeaking ? 'animate-bounce' : 'h-2'}`} style={{animationDelay: `${i * 0.1}s`, height: isLiaSpeaking ? '48px' : '8px'}}></div>
               ))}
            </div>

            {/* Captions */}
            <div className="w-full max-w-xs text-center space-y-4">
               {isLiaSpeaking || isLoadingSpeech ? (
                  <div className="space-y-2">
                     <p className="text-white text-lg font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-2">
                        "{step.text}"
                     </p>
                     {isLoadingSpeech && (
                        <div className="flex items-center justify-center gap-2 text-teal-400">
                           <Loader size={16} className="animate-spin" />
                           <span className="text-sm">Processing speech...</span>
                        </div>
                     )}
                  </div>
               ) : isListening ? (
                  <div className="space-y-2">
                     <p className="text-slate-500 italic">Listening...</p>
                     <div className="flex items-center justify-center gap-2 text-teal-400">
                        <Mic size={16} className="animate-pulse" />
                        <span className="text-sm">Speak now</span>
                     </div>
                  </div>
               ) : (
                  <p className="text-slate-500 italic">Ready...</p>
               )}
            </div>
         </div>

         {/* User Controls */}
         <div className="relative z-10 bg-slate-800 p-8 rounded-t-3xl border-t border-slate-700">
            {isUserTurn ? (
               <div className="space-y-3">
                  <button
                    onClick={handleUserSpeak}
                    disabled={isListening || isLoadingSpeech}
                    className={`w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-teal-900/50 flex items-center justify-center gap-3 transition-all transform active:scale-95 ${
                      isListening || isLoadingSpeech ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                     {isListening ? (
                        <>
                           <Loader size={24} className="animate-spin" />
                           Listening...
                        </>
                     ) : (
                        <>
                           <Mic size={24} /> {step.triggerLabel}
                        </>
                     )}
                  </button>
                  <button
                    onClick={handleEndCall}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-95"
                  >
                     <PhoneOff size={20} /> End Call
                  </button>
               </div>
            ) : (
               <button
                 onClick={handleEndCall}
                 className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-95"
               >
                  <PhoneOff size={20} /> End Call
               </button>
            )}
         </div>
      </div>
    );
  };

  const SuccessScreen = () => (
    <div className="h-full bg-white flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300">
       <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle size={48} className="text-teal-600" />
       </div>
       <h2 className="text-3xl font-bold text-slate-900 mb-2">All Set, {user?.name || 'Maria'}!</h2>
       <p className="text-slate-500 mb-8">Funds sent. Order placed. You're ready for Game Day.</p>
      
       <div className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
          <div className="flex justify-between items-center">
             <span className="text-sm text-slate-500">Transfer Amount</span>
             <span className="font-bold text-slate-900">$30,000</span>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-sm text-slate-500">Order Status</span>
             <span className="font-bold text-teal-600">Confirmed</span>
          </div>
       </div>
      
       <button onClick={() => setScreen('dashboard')} className="mt-8 text-teal-600 font-semibold text-sm">Close</button>
    </div>
  );

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Phone Frame - Responsive: Full screen on mobile, frame on desktop */}
      <div className="w-full h-full sm:w-[390px] sm:h-[844px] sm:max-h-[90vh] bg-black sm:rounded-[3rem] shadow-2xl relative sm:border-[12px] border-slate-900">
        {/* Dynamic Island / Notch - Only on desktop */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20"></div>

        {/* Screen Content */}
        <div className="w-full h-full bg-white sm:rounded-[2rem] overflow-hidden relative sm:pt-10">
          {screen === 'loading' && (
            <div className="h-full flex items-center justify-center bg-slate-50">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600 text-sm">Loading...</p>
              </div>
            </div>
          )}
          {screen === 'lock' && <LockScreen />}
          {screen === 'dashboard' && <DashboardScreen />}
          {screen === 'voice' && <VoiceScreen />}
          {screen === 'success' && <SuccessScreen />}
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetHeader className="p-6 border-b bg-teal-600 text-white">
            <SheetTitle className="text-white">Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-12"
                onClick={() => {
                  setScreen('dashboard');
                  setMenuOpen(false);
                }}
              >
                <Smartphone size={20} />
                <span>Home</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-12"
                onClick={() => {
                  router.push('/mobile/activity');
                  setMenuOpen(false);
                }}
              >
                <Activity size={20} />
                <span>Activity</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-12"
                onClick={() => {
                  router.push('/mobile/growth');
                  setMenuOpen(false);
                }}
              >
                <Zap size={20} />
                <span>Growth</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-12"
                onClick={() => {
                  router.push('/mobile/account');
                  setMenuOpen(false);
                }}
              >
                <User size={20} />
                <span>Account</span>
              </Button>
            </div>
            <div className="p-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

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
