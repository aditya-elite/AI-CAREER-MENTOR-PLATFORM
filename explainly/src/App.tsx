import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  MicOff, 
  User, 
  BookOpen, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  RefreshCw,
  Star
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Markdown from 'react-markdown';
import { UserProfile, AppState, Assessment } from './types';
import { generateAssessment, askDoubt } from './services/geminiService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const initialParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const returnUrl = initialParams?.get('return_url') || '';
  const incomingTopic = initialParams?.get('topic') || '';
  const [state, setState] = useState<AppState>('topic-selection');
  const [profile, setProfile] = useState<UserProfile>({ name: '', standard: '', board: '' });
  const [topic, setTopic] = useState(incomingTopic);
  const [transcript, setTranscript] = useState('');
  const [doubtTranscript, setDoubtTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [doubts, setDoubts] = useState<string[]>([]);
  const [currentDoubt, setCurrentDoubt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [doubtCount, setDoubtCount] = useState(0);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const MAX_DOUBTS = 2;

  const recognitionRef = useRef<any>(null);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if HTTPS is required for speech recognition
      if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        setSpeechError("Speech recognition requires HTTPS. Please use a secure connection or localhost.");
        return;
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setSpeechError("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        
        if (finalTranscript) {
          if (stateRef.current === 'teaching') {
            setTranscript(prev => (prev + ' ' + finalTranscript).trim());
          } else if (stateRef.current === 'doubts') {
            setDoubtTranscript(prev => (prev + ' ' + finalTranscript).trim());
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        
        switch (event.error) {
          case 'not-allowed':
          case 'service-not-allowed':
            setSpeechError("Microphone access denied. Please check your browser permissions and allow microphone access.");
            break;
          case 'network':
            setSpeechError("Network error occurred during speech recognition. Please check your internet connection.");
            break;
          case 'no-speech':
            setSpeechError("No speech detected. Please try speaking clearly.");
            break;
          case 'audio-capture':
            setSpeechError("Microphone not found or is being used by another application.");
            break;
          case 'aborted':
            setSpeechError("Speech recognition was aborted.");
            break;
          default:
            setSpeechError(`Speech recognition error: ${event.error}. Please try again.`);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onstart = () => {
        setSpeechError(null);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error('Error stopping recognition:', e);
        }
      }
    };
  }, []);

  const toggleRecording = () => {
    setSpeechError(null);
    if (!recognitionRef.current) {
      setSpeechError("Speech recognition is not initialized. Please refresh the page.");
      return;
    }

    if (isRecording) {
      try {
        recognitionRef.current.stop();
        setIsRecording(false);
      } catch (e) {
        console.error('Error stopping recognition:', e);
        setIsRecording(false);
      }
    } else {
      try {
        // Check if already running
        if (recognitionRef.current.readyState === 'recording') {
          setIsRecording(true);
          return;
        }
        
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e: any) {
        console.error("Failed to start recognition", e);
        if (e.message.includes('already started') || e.message.includes('already recording')) {
          setIsRecording(true);
        } else {
          setSpeechError("Could not start microphone. Please check microphone permissions and try again.");
        }
      }
    }
  };

  
  const startTeaching = () => {
    if (topic.trim()) {
      setState('teaching');
    }
  };

  const finishTeaching = async () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }
    setIsLoading(true);
    try {
      const doubt = await askDoubt(profile, topic, transcript, []);
      setDoubts([doubt]);
      setCurrentDoubt(doubt);
      setDoubtCount(1);
      setState('doubts');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextDoubtOrFinish = async () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    if (doubtCount < MAX_DOUBTS) {
      setIsLoading(true);
      try {
        const doubt = await askDoubt(profile, topic, transcript + doubtTranscript, doubts);
        setDoubts(prev => [...prev, doubt]);
        setCurrentDoubt(doubt);
        setDoubtCount(prev => prev + 1);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      try {
        const result = await generateAssessment(profile, topic, transcript, doubtTranscript);
        setAssessment(result);
        setState('assessment');
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const reset = () => {
    setTopic('');
    setTranscript('');
    setDoubtTranscript('');
    setAssessment(null);
    setDoubts([]);
    setCurrentDoubt(null);
    setDoubtCount(0);
    setState('topic-selection');
  };

  const returnToApp = () => {
    if (!assessment || !returnUrl) return;
    try {
      const u = new URL(returnUrl);
      u.searchParams.set('verify_score', String(assessment.rating));
      window.location.assign(u.toString());
    } catch {
      // If malformed return URL, stay on Explainly.
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1a1a1a] font-serif selection:bg-[#5A5A40] selection:text-white">
      <header className="p-6 flex justify-between items-center border-b border-[#1a1a1a]/10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#5A5A40] flex items-center justify-center text-white font-bold text-xl font-sans">
            E
          </div>
          <h1 className="text-xl font-bold tracking-tight">Explainly</h1>
        </div>
        {profile.name && (
          <div className="flex items-center gap-2 text-sm opacity-60 italic">
            <User size={16} />
            <span>Teacher {profile.name}</span>
          </div>
        )}
      </header>

      <main className="max-w-3xl mx-auto p-6 pt-12">
        <AnimatePresence mode="wait">
          
          {state === 'topic-selection' && (
            <motion.div
              key="topic"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="text-center"
            >
              <h2 className="text-4xl font-bold mb-4">What will you teach today?</h2>
              <p className="text-[#5A5A40] italic mb-12">I'm ready to learn. Pick a topic you're passionate about.</p>
              
              <div className="relative max-w-xl mx-auto">
                <input 
                  type="text"
                  className="w-full bg-white rounded-2xl p-6 pr-16 shadow-lg text-2xl outline-none focus:ring-4 ring-[#5A5A40]/10 border border-[#1a1a1a]/5"
                  placeholder="e.g. Photosynthesis, Newton's Laws..."
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && startTeaching()}
                />
                <button 
                  onClick={startTeaching}
                  disabled={!topic.trim()}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#5A5A40] text-white rounded-xl flex items-center justify-center disabled:opacity-30 transition-all active:scale-95"
                >
                  <ArrowRight size={24} />
                </button>
              </div>
            </motion.div>
          )}

          {state === 'teaching' && (
            <motion.div
              key="teaching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs uppercase tracking-widest font-sans font-bold text-[#5A5A40]">Currently Teaching</span>
                  <h2 className="text-3xl font-bold">{topic}</h2>
                </div>
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-sans font-bold transition-colors",
                  isRecording ? "bg-red-100 text-red-600 animate-pulse" : "bg-gray-100 text-gray-500"
                )}>
                  <div className={cn("w-2 h-2 rounded-full", isRecording ? "bg-red-600" : "bg-gray-400")} />
                  {isRecording ? "Listening..." : "Paused"}
                </div>
              </div>

              <div className="bg-white rounded-[32px] p-8 min-h-[300px] shadow-xl border border-[#1a1a1a]/5 relative group">
                {speechError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-2 text-sm">
                    <AlertCircle size={16} />
                    {speechError}
                  </div>
                )}
                {isRecording && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-600 rounded-xl flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Listening... Speak clearly into your microphone
                  </div>
                )}
                {!transcript && !isRecording && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 opacity-40 italic">
                    <Mic size={48} className="mb-4" />
                    <p>Click the microphone and start explaining the concept as if you were teaching a student.</p>
                  </div>
                )}
                <div className="text-xl leading-relaxed whitespace-pre-wrap">
                  {transcript}
                  {isRecording && <span className="inline-block w-1 h-6 bg-[#5A5A40] ml-1 animate-blink" />}
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={toggleRecording}
                  className={cn(
                    "flex-1 rounded-full py-4 font-sans font-bold flex items-center justify-center gap-3 transition-all active:scale-95",
                    isRecording 
                      ? "bg-red-600 text-white hover:bg-red-700" 
                      : "bg-[#5A5A40] text-white hover:bg-[#4a4a35]"
                  )}
                >
                  {isRecording ? <><MicOff size={20} /> Stop Listening</> : <><Mic size={20} /> Start Teaching</>}
                </button>
                <button 
                  onClick={finishTeaching}
                  disabled={!transcript || isRecording || isLoading}
                  className="px-8 bg-white border-2 border-[#5A5A40] text-[#5A5A40] rounded-full font-sans font-bold hover:bg-[#5A5A40] hover:text-white transition-all disabled:opacity-30 flex items-center gap-2"
                >
                  {isLoading ? <RefreshCw size={20} className="animate-spin" /> : "Finish Lesson"}
                </button>
              </div>
            </motion.div>
          )}

          {state === 'doubts' && currentDoubt && (
            <motion.div
              key="doubts"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <div className="bg-[#5A5A40] text-white px-4 py-1 rounded-full text-xs font-sans font-bold uppercase tracking-widest">
                  Question {doubtCount} of {MAX_DOUBTS}
                </div>
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-sans font-bold transition-colors",
                  isRecording ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                )}>
                  {isRecording ? "Recording Answer..." : "Mic Off"}
                </div>
              </div>

              <div className="bg-white rounded-[40px] p-10 shadow-2xl border-4 border-[#5A5A40]/10 relative">
                {speechError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-2 text-sm">
                    <AlertCircle size={16} />
                    {speechError}
                  </div>
                )}
                {isRecording && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-600 rounded-xl flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Recording your answer... Speak clearly
                  </div>
                )}
                <div className="text-2xl leading-relaxed font-medium italic mb-6">
                  <Markdown>{currentDoubt}</Markdown>
                </div>
                
                <div className="mt-8 pt-8 border-t border-[#1a1a1a]/5">
                  <label className="block text-xs uppercase tracking-widest font-sans font-bold mb-4 opacity-40">Your Answer</label>
                  <div className="min-h-[100px] text-lg leading-relaxed text-[#5A5A40]">
                    {doubtTranscript || (isRecording ? "" : "Click the mic to start explaining...")}
                    {isRecording && <span className="inline-block w-1 h-5 bg-[#5A5A40] ml-1 animate-blink" />}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={toggleRecording}
                  className={cn(
                    "flex-1 rounded-full py-4 font-sans font-bold flex items-center justify-center gap-3 transition-all active:scale-95",
                    isRecording 
                      ? "bg-red-600 text-white hover:bg-red-700" 
                      : "bg-[#5A5A40] text-white hover:bg-[#4a4a35]"
                  )}
                >
                  {isRecording ? <><MicOff size={20} /> Stop Recording</> : <><Mic size={20} /> Answer with Voice</>}
                </button>
                <button 
                  onClick={nextDoubtOrFinish}
                  disabled={!doubtTranscript || isRecording || isLoading}
                  className="px-10 bg-white border-2 border-[#5A5A40] text-[#5A5A40] rounded-full font-sans font-bold hover:bg-[#5A5A40] hover:text-white transition-all disabled:opacity-30 flex items-center gap-2"
                >
                  {isLoading ? <RefreshCw size={20} className="animate-spin" /> : (doubtCount < MAX_DOUBTS ? "Next Question" : "Get Final Rating")}
                </button>
              </div>
            </motion.div>
          )}

          {state === 'assessment' && assessment && (
            <motion.div
              key="assessment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#5A5A40] text-white text-4xl font-bold mb-4 shadow-lg ring-8 ring-[#5A5A40]/10">
                  {assessment.rating}
                </div>
                <h2 className="text-3xl font-bold">Final Evaluation</h2>
                <p className="text-[#5A5A40] italic">Based on your lesson and doubt session.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-8 shadow-md border border-[#1a1a1a]/5">
                  <h3 className="flex items-center gap-2 text-xs uppercase tracking-widest font-sans font-bold mb-4 opacity-50">
                    <MessageSquare size={16} /> Overall Feedback
                  </h3>
                  <p className="text-lg leading-relaxed italic">"{assessment.feedback}"</p>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-md border border-[#1a1a1a]/5">
                  <h3 className="flex items-center gap-2 text-xs uppercase tracking-widest font-sans font-bold mb-4 opacity-50 text-amber-600">
                    <AlertCircle size={16} /> Remaining Gaps
                  </h3>
                  <ul className="space-y-3">
                    {assessment.missingPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        {point}
                      </li>
                    ))}
                    {assessment.missingPoints.length === 0 && (
                      <li className="text-sm opacity-50 italic">None! You cleared all doubts and covered everything perfectly.</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {returnUrl && (
                  <button 
                    onClick={returnToApp}
                    className="w-full bg-[#1e40af] text-white rounded-full py-4 font-sans font-bold flex items-center justify-center gap-2 hover:bg-[#1d4ed8] transition-colors shadow-lg"
                  >
                    Return to App
                  </button>
                )}
                <button 
                  onClick={reset}
                  className="w-full bg-[#5A5A40] text-white rounded-full py-4 font-sans font-bold flex items-center justify-center gap-2 hover:bg-[#4a4a35] transition-colors shadow-lg"
                >
                  Teach Another Topic
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}} />
    </div>
  );
}
