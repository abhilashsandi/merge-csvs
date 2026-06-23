'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Play, Square, Terminal, User, Calendar, Mail, 
    CreditCard, MapPin, KeyRound, AlertCircle, Send
} from 'lucide-react';

export default function DpsScheduler() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        email: '',
        last4ssn: '',
        zipCode: '',
    });

    const [isRunning, setIsRunning] = useState(false);
    const [jobId, setJobId] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [showCaptchaPrompt, setShowCaptchaPrompt] = useState(false);
    const [captchaToken, setCaptchaToken] = useState('');
    
    const logsEndRef = useRef<HTMLDivElement>(null);
    const eventSourceRef = useRef<EventSource | null>(null);

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL_RENDER || 'http://localhost:3001';

    useEffect(() => {
        try {
            const saved = localStorage.getItem('dpsConfig');
            if (saved) {
                setFormData(JSON.parse(saved));
            }
        } catch (e) {
            console.error("Failed to read/parse config from localStorage", e);
        }

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, []);

    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const startScheduler = async () => {
        try {
            localStorage.setItem('dpsConfig', JSON.stringify(formData));
        } catch (e) {
            console.warn("Failed to save config to localStorage", e);
        }
        setLogs(['Initializing scheduler...']);
        setIsRunning(true);
        setShowCaptchaPrompt(false);
        setCaptchaToken('');

        const payload = {
            personalInfo: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                dob: formData.dob,
                email: formData.email,
                lastFourSSN: formData.last4ssn
            },
            location: {
                zipCode: formData.zipCode ? [formData.zipCode] : undefined,
                miles: 100,
                preferredDays: [0, 1, 2, 3, 4, 5, 6],
                sameDay: true,
                daysAround: {
                    startDate: new Date().toISOString().split('T')[0],
                    start: 0,
                    end: 90
                },
                timesAround: {
                    start: 800,
                    end: 1800
                }
            },
            appSettings: {
                cancelIfExist: false,
                interval: 5000,
                webserver: false,
                headersTimeout: 20000,
                maxRetry: 3,
                captcha: { strategy: 'browser' },
                maxExecutionTime: 30 * 60 * 1000
            }
        };

        try {
            const res = await fetch(`${baseUrl}/api/schedule/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`HTTP ${res.status}: ${errText}`);
            }
            const data = await res.json();
            
            if (data.jobId) {
                setJobId(data.jobId);
                connectSSE(data.jobId);
                setLogs(prev => [...prev, `Scheduler started successfully. Job ID: ${data.jobId}`]);
            } else {
                setLogs(prev => [...prev, `Error: ${JSON.stringify(data)}`]);
                setIsRunning(false);
            }
        } catch (error: any) {
            setLogs(prev => [...prev, `Failed to start: ${error.message}`]);
            setIsRunning(false);
        }
    };

    const stopScheduler = async () => {
        if (jobId) {
            try {
                await fetch(`${baseUrl}/api/schedule/stop`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ jobId })
                });
                setLogs(prev => [...prev, 'Scheduler stopped by user.']);
            } catch (error: any) {
                setLogs(prev => [...prev, `Failed to stop: ${error.message}`]);
            }
        }
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        setIsRunning(false);
        setJobId(null);
    };

    const submitCaptcha = async () => {
        if (!jobId || !captchaToken) return;
        
        try {
            await fetch(`${baseUrl}/api/schedule/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId, token: captchaToken })
            });
            setLogs(prev => [...prev, 'Captcha token submitted securely. Resuming operation...']);
            setShowCaptchaPrompt(false);
            setCaptchaToken('');
        } catch (error: any) {
            setLogs(prev => [...prev, `Failed to submit token: ${error.message}`]);
        }
    };

    const connectSSE = (id: string) => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }
        const eventSource = new EventSource(`${baseUrl}/api/schedule/logs/${id}`);
        eventSourceRef.current = eventSource;
        
        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'AUTH_REQUIRED') {
                    setShowCaptchaPrompt(true);
                    setLogs(prev => [...prev, '⚠️ ACTION REQUIRED: Captcha solver token needed to proceed.']);
                } else if (data.message) {
                    setLogs(prev => [...prev, data.message]);
                } else {
                    setLogs(prev => [...prev, JSON.stringify(data)]);
                }
            } catch (e) {
                setLogs(prev => [...prev, event.data]);
            }
        };

        eventSource.onerror = () => {
            console.warn('EventSource encountered an error. Relying on auto-reconnect...');
            setLogs(prev => [...prev, 'Connection to log stream interrupted. Attempting to reconnect...']);
        };
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            {/* Left Column: Configuration Form */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                <h2 className="text-2xl font-semibold mb-6 flex items-center text-slate-100">
                    <User className="mr-3 text-blue-400" /> Personal Information
                </h2>

                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">First Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-slate-500" />
                                </div>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-xl bg-slate-950/50 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="John"
                                    disabled={isRunning}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Last Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-slate-500" />
                                </div>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-xl bg-slate-950/50 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Doe"
                                    disabled={isRunning}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Date of Birth</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-4 w-4 text-slate-500" />
                                </div>
                                <input
                                    type="text"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleInputChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-xl bg-slate-950/50 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="MM/DD/YYYY"
                                    disabled={isRunning}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Last 4 SSN</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CreditCard className="h-4 w-4 text-slate-500" />
                                </div>
                                <input
                                    type="text"
                                    name="last4ssn"
                                    value={formData.last4ssn}
                                    onChange={handleInputChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-xl bg-slate-950/50 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="1234"
                                    maxLength={4}
                                    disabled={isRunning}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-slate-500" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-xl bg-slate-950/50 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="john@example.com"
                                disabled={isRunning}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Zip Code</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin className="h-4 w-4 text-slate-500" />
                            </div>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-xl bg-slate-950/50 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="78701"
                                disabled={isRunning}
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800">
                        {isRunning ? (
                            <button
                                onClick={stopScheduler}
                                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500 transition-all duration-200"
                            >
                                <Square className="mr-2 h-5 w-5" /> Stop Scheduler
                            </button>
                        ) : (
                            <button
                                onClick={startScheduler}
                                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 transition-all duration-200"
                            >
                                <Play className="mr-2 h-5 w-5" /> Start Automation
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Right Column: Console output and interactions */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col space-y-6"
            >
                <AnimatePresence>
                    {showCaptchaPrompt && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0, scale: 0.95 }}
                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                            className="bg-amber-950/40 border border-amber-500/50 rounded-3xl p-6 shadow-lg backdrop-blur-md"
                        >
                            <h3 className="text-lg font-semibold text-amber-400 flex items-center mb-3">
                                <AlertCircle className="mr-2 h-5 w-5" /> Action Required: Captcha
                            </h3>
                            <p className="text-amber-200/80 text-sm mb-4">
                                The DPS scheduling system requires verification. Please complete a manual captcha token generation and paste it below.
                            </p>
                            <div className="flex space-x-3">
                                <div className="relative flex-grow">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <KeyRound className="h-4 w-4 text-amber-500/70" />
                                    </div>
                                    <input
                                        type="text"
                                        value={captchaToken}
                                        onChange={(e) => setCaptchaToken(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-amber-700/50 rounded-xl bg-amber-950/50 text-amber-100 placeholder-amber-700/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                        placeholder="Paste captcha token here..."
                                    />
                                </div>
                                <button
                                    onClick={submitCaptcha}
                                    disabled={!captchaToken}
                                    className="flex items-center justify-center py-2 px-4 border border-transparent rounded-xl text-sm font-bold text-amber-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-950 focus:ring-amber-500 transition-all"
                                >
                                    <Send className="h-4 w-4 md:mr-2" />
                                    <span className="hidden md:inline">Submit</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-1 shadow-2xl flex-grow flex flex-col min-h-[400px]">
                    <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 rounded-t-3xl">
                        <div className="flex items-center space-x-2">
                            <Terminal className="h-5 w-5 text-slate-400" />
                            <span className="text-sm font-medium text-slate-300">Live Operation Logs</span>
                        </div>
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                            <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-slate-700'}`}></div>
                        </div>
                    </div>
                    <div className="p-4 flex-grow overflow-y-auto max-h-[500px] font-mono text-sm">
                        {logs.length === 0 ? (
                            <div className="text-slate-600 flex items-center justify-center h-full">
                                No logs yet. Start the scheduler to view activity.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {logs.map((log, i) => (
                                    <div key={i} className="text-slate-300 break-words border-l-2 border-slate-800 pl-3 py-1 bg-slate-900/20">
                                        {log}
                                    </div>
                                ))}
                                <div ref={logsEndRef} />
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
