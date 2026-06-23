'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Play, Square, Terminal, User, Calendar, Mail, 
    CreditCard, MapPin, KeyRound, AlertCircle, Send, Settings, Phone, Clock, FileText, HelpCircle, Activity, Search
} from 'lucide-react';

export default function DpsScheduler() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        email: '',
        last4ssn: '',
        phoneNumber: '',
        typeId: 81,
        cityName: '',
        zipCode: '',
        miles: 25,
        preferredDays: '0,1,2,3,4,5,6',
        daysAroundStartDate: '',
        daysAroundStart: 0,
        daysAroundEnd: 10,
        timesAroundStart: 6,
        timesAroundEnd: 18,
        interval: 5000,
        maxRetry: 15,
        sameDay: false,
        cancelIfExist: true,
        authToken: '',
    });

    const [activeTab, setActiveTab] = useState<'personal' | 'settings'>('personal');
    const [isRunning, setIsRunning] = useState(false);
    const [jobId, setJobId] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [showCaptchaPrompt, setShowCaptchaPrompt] = useState(false);
    const [captchaToken, setCaptchaToken] = useState('');
    const [showTypeInfo, setShowTypeInfo] = useState(false);
    
    const logsEndRef = useRef<HTMLDivElement>(null);
    const eventSourceRef = useRef<EventSource | null>(null);

    const getBaseUrl = () => {
        if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
            return process.env.NEXT_PUBLIC_BACKEND_URL_RENDER || 'https://dps-scheduler-api.onrender.com';
        }
        return 'http://localhost:3001';
    };
    const baseUrl = getBaseUrl();

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData(prev => ({ ...prev, [e.target.name]: value }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: Number(e.target.value) }));
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

        const preferredDaysArr = formData.preferredDays 
            ? formData.preferredDays.split(',').map(d => parseInt(d.trim())).filter(d => !isNaN(d))
            : [0, 1, 2, 3, 4, 5, 6];

        const payload = {
            personalInfo: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                dob: formData.dob,
                email: formData.email,
                lastFourSSN: formData.last4ssn,
                phoneNumber: formData.phoneNumber || undefined,
                typeId: formData.typeId || undefined,
            },
            location: {
                cityName: formData.cityName ? formData.cityName.split(',').map(s => s.trim()) : undefined,
                zipCode: formData.zipCode ? formData.zipCode.split(',').map(s => s.trim()) : undefined,
                miles: formData.miles,
                preferredDays: preferredDaysArr,
                sameDay: formData.sameDay,
                daysAround: {
                    startDate: formData.daysAroundStartDate || new Date().toISOString().split('T')[0],
                    start: formData.daysAroundStart,
                    end: formData.daysAroundEnd
                },
                timesAround: {
                    start: formData.timesAroundStart * 100, // format to HHMM if backend expects it or just use start value
                    end: formData.timesAroundEnd * 100
                }
            },
            appSettings: {
                authToken: formData.authToken || undefined,
                cancelIfExist: formData.cancelIfExist,
                interval: formData.interval,
                webserver: false,
                headersTimeout: 50000,
                maxRetry: formData.maxRetry,
                captcha: { strategy: 'browser' },
                maxExecutionTime: 30 * 60 * 1000,
                pushNotifcation: { enabled: false }
            }
        };

        // For timesAround, the default backend uses 6 and 18 but in config validation it might expect 600 to 1800 if format is HHMM.
        // But the user sample config says "start: 6, end: 18". I will pass exactly what is in the form.
        payload.location.timesAround.start = formData.timesAroundStart;
        payload.location.timesAround.end = formData.timesAroundEnd;

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
            const res = await fetch(`${baseUrl}/api/schedule/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId, token: captchaToken })
            });
            if (!res.ok) throw new Error('Failed to submit token');
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
        let errorCount = 0;
        const eventSource = new EventSource(`${baseUrl}/api/schedule/logs/${id}`);
        eventSourceRef.current = eventSource;
        
        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'AUTH_REQUIRED') {
                    setShowCaptchaPrompt(true);
                    setLogs(prev => [...prev, '⚠️ ACTION REQUIRED: Captcha solver token needed to proceed.']);
                } else if (data.type === 'FINISHED') {
                    setLogs(prev => [...prev, data.message || 'Automation finished.']);
                    if (eventSourceRef.current) {
                        eventSourceRef.current.close();
                        eventSourceRef.current = null;
                    }
                    setIsRunning(false);
                    setJobId(null);
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
            errorCount++;
            if (errorCount > 10) {
                setLogs(prev => [...prev, 'Connection lost permanently. Stopping automation.']);
                if (eventSourceRef.current) {
                    eventSourceRef.current.close();
                    eventSourceRef.current = null;
                }
                setIsRunning(false);
                setJobId(null);
            } else {
                console.warn('EventSource encountered an error. Relying on auto-reconnect...');
                setLogs(prev => [...prev, `Connection to log stream interrupted. Attempting to reconnect... (${errorCount}/10)`]);
            }
        };
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
            {/* Left Column: Configuration Form */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-5 flex flex-col space-y-6"
            >
                <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                    
                    {/* Tabs */}
                    <div className="flex space-x-1 bg-zinc-900 p-1 rounded-xl mb-6">
                        <button 
                            onClick={() => setActiveTab('personal')}
                            className={`flex-1 flex items-center justify-center py-2 px-3 text-sm font-medium rounded-lg transition-all ${activeTab === 'personal' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <User className="w-4 h-4 mr-2" />
                            Personal
                        </button>
                        <button 
                            onClick={() => setActiveTab('settings')}
                            className={`flex-1 flex items-center justify-center py-2 px-3 text-sm font-medium rounded-lg transition-all ${activeTab === 'settings' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'personal' && (
                            <motion.div 
                                key="personal"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">First Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-4 w-4 text-zinc-600" />
                                            </div>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className="block w-full pl-9 pr-3 py-2.5 border border-zinc-800 rounded-xl bg-zinc-900/50 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-all text-sm"
                                                placeholder="John"
                                                disabled={isRunning}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Last Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-4 w-4 text-zinc-600" />
                                            </div>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className="block w-full pl-9 pr-3 py-2.5 border border-zinc-800 rounded-xl bg-zinc-900/50 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-all text-sm"
                                                placeholder="Doe"
                                                disabled={isRunning}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Date of Birth</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Calendar className="h-4 w-4 text-zinc-600" />
                                            </div>
                                            <input
                                                type="text"
                                                name="dob"
                                                value={formData.dob}
                                                onChange={handleInputChange}
                                                className="block w-full pl-9 pr-3 py-2.5 border border-zinc-800 rounded-xl bg-zinc-900/50 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-all text-sm"
                                                placeholder="MM/DD/YYYY"
                                                disabled={isRunning}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Last 4 SSN</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <CreditCard className="h-4 w-4 text-zinc-600" />
                                            </div>
                                            <input
                                                type="text"
                                                name="last4ssn"
                                                value={formData.last4ssn}
                                                onChange={handleInputChange}
                                                className="block w-full pl-9 pr-3 py-2.5 border border-zinc-800 rounded-xl bg-zinc-900/50 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-all text-sm"
                                                placeholder="1234"
                                                maxLength={4}
                                                disabled={isRunning}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Email</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-4 w-4 text-zinc-600" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="block w-full pl-9 pr-3 py-2.5 border border-zinc-800 rounded-xl bg-zinc-900/50 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-all text-sm"
                                                placeholder="john@example.com"
                                                disabled={isRunning}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Phone</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Phone className="h-4 w-4 text-zinc-600" />
                                            </div>
                                            <input
                                                type="tel"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleInputChange}
                                                className="block w-full pl-9 pr-3 py-2.5 border border-zinc-800 rounded-xl bg-zinc-900/50 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-all text-sm"
                                                placeholder="5551234567"
                                                disabled={isRunning}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider">Service Type ID</label>
                                        <button 
                                            type="button" 
                                            onClick={() => setShowTypeInfo(!showTypeInfo)}
                                            className="text-emerald-500 hover:text-emerald-400 focus:outline-none"
                                        >
                                            <HelpCircle className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <AnimatePresence>
                                        {showTypeInfo && (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="text-xs text-zinc-400 bg-zinc-900/50 p-3 rounded-lg mb-2"
                                            >
                                                Default is 81 (Texas DL). For other services, check the <a href="https://github.com/phamleduy04/texas-dps-scheduler/wiki/TypeId-list" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">Wiki TypeId list</a>.
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FileText className="h-4 w-4 text-zinc-600" />
                                        </div>
                                        <input
                                            type="number"
                                            name="typeId"
                                            value={formData.typeId}
                                            onChange={handleNumberChange}
                                            className="block w-full pl-9 pr-3 py-2.5 border border-zinc-800 rounded-xl bg-zinc-900/50 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-all text-sm"
                                            placeholder="81"
                                            disabled={isRunning}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'settings' && (
                            <motion.div 
                                key="settings"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2 p-3 bg-emerald-900/10 rounded-xl border border-emerald-900/30 mb-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="block text-xs font-medium text-emerald-500 uppercase tracking-wider">Auth Token (Optional)</label>
                                            <a href="https://github.com/phamleduy04/texas-dps-scheduler/wiki/How-to-get-Auth-Token" target="_blank" rel="noreferrer" className="text-emerald-500 hover:text-emerald-400 focus:outline-none flex items-center text-[10px]">
                                                <HelpCircle className="h-3 w-3 mr-1" /> How to generate
                                            </a>
                                        </div>
                                        <div className="relative mt-2">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <KeyRound className="h-4 w-4 text-emerald-600/50" />
                                            </div>
                                            <input
                                                type="text"
                                                name="authToken"
                                                value={formData.authToken}
                                                onChange={handleInputChange}
                                                className="block w-full pl-9 pr-3 py-2.5 border border-emerald-900/50 rounded-xl bg-zinc-900/50 text-emerald-100 placeholder-emerald-800/50 focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 transition-all text-sm font-mono"
                                                placeholder="Paste your auth token if you want to skip browser fetch..."
                                                disabled={isRunning}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">City Name(s)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Search className="h-4 w-4 text-zinc-600" />
                                            </div>
                                            <input
                                                type="text"
                                                name="cityName"
                                                value={formData.cityName}
                                                onChange={handleInputChange}
                                                className="block w-full pl-9 pr-3 py-2.5 border border-zinc-800 rounded-xl bg-zinc-900/50 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-all text-sm"
                                                placeholder="Plano, Dallas"
                                                disabled={isRunning}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Zip Code(s)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <MapPin className="h-4 w-4 text-zinc-600" />
                                            </div>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                className="block w-full pl-9 pr-3 py-2.5 border border-zinc-800 rounded-xl bg-zinc-900/50 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-all text-sm"
                                                placeholder="78701"
                                                disabled={isRunning}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Radius (Miles)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Activity className="h-4 w-4 text-zinc-600" />
                                            </div>
                                            <input
                                                type="number"
                                                name="miles"
                                                value={formData.miles}
                                                onChange={handleNumberChange}
                                                className="block w-full pl-9 pr-3 py-2.5 border border-zinc-800 rounded-xl bg-zinc-900/50 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-all text-sm"
                                                disabled={isRunning}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Preferred Days</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Calendar className="h-4 w-4 text-zinc-600" />
                                            </div>
                                            <input
                                                type="text"
                                                name="preferredDays"
                                                value={formData.preferredDays}
                                                onChange={handleInputChange}
                                                className="block w-full pl-9 pr-3 py-2.5 border border-zinc-800 rounded-xl bg-zinc-900/50 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-all text-sm"
                                                placeholder="0,1,2,3,4,5,6"
                                                disabled={isRunning}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
                                    <span className="block text-xs font-medium text-zinc-500 mb-3 uppercase tracking-wider">Days Around (Range)</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-[10px] text-zinc-600 mb-1 uppercase">Start Date (MM/DD/YYYY)</label>
                                            <input
                                                type="text"
                                                name="daysAroundStartDate"
                                                value={formData.daysAroundStartDate}
                                                onChange={handleInputChange}
                                                placeholder="Blank = Today"
                                                className="block w-full px-3 py-2 border border-zinc-800 rounded-lg bg-zinc-900/50 text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600"
                                                disabled={isRunning}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-zinc-600 mb-1 uppercase">Start (Days from Date)</label>
                                            <input
                                                type="number"
                                                name="daysAroundStart"
                                                value={formData.daysAroundStart}
                                                onChange={handleNumberChange}
                                                className="block w-full px-3 py-2 border border-zinc-800 rounded-lg bg-zinc-900/50 text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600"
                                                disabled={isRunning}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-zinc-600 mb-1 uppercase">End (Days from Date)</label>
                                            <input
                                                type="number"
                                                name="daysAroundEnd"
                                                value={formData.daysAroundEnd}
                                                onChange={handleNumberChange}
                                                className="block w-full px-3 py-2 border border-zinc-800 rounded-lg bg-zinc-900/50 text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600"
                                                disabled={isRunning}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
                                    <span className="block text-xs font-medium text-zinc-500 mb-3 uppercase tracking-wider">Times Around (24h)</span>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] text-zinc-600 mb-1 uppercase">Start Time (Hour)</label>
                                            <input
                                                type="number"
                                                name="timesAroundStart"
                                                value={formData.timesAroundStart}
                                                onChange={handleNumberChange}
                                                className="block w-full px-3 py-2 border border-zinc-800 rounded-lg bg-zinc-900/50 text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600"
                                                disabled={isRunning}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-zinc-600 mb-1 uppercase">End Time (Hour)</label>
                                            <input
                                                type="number"
                                                name="timesAroundEnd"
                                                value={formData.timesAroundEnd}
                                                onChange={handleNumberChange}
                                                className="block w-full px-3 py-2 border border-zinc-800 rounded-lg bg-zinc-900/50 text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600"
                                                disabled={isRunning}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Retry Interval (ms)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Clock className="h-4 w-4 text-zinc-600" />
                                            </div>
                                            <input
                                                type="number"
                                                name="interval"
                                                value={formData.interval}
                                                onChange={handleNumberChange}
                                                className="block w-full pl-9 pr-3 py-2.5 border border-zinc-800 rounded-xl bg-zinc-900/50 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-all text-sm"
                                                disabled={isRunning}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Max Retries</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Activity className="h-4 w-4 text-zinc-600" />
                                            </div>
                                            <input
                                                type="number"
                                                name="maxRetry"
                                                value={formData.maxRetry}
                                                onChange={handleNumberChange}
                                                className="block w-full pl-9 pr-3 py-2.5 border border-zinc-800 rounded-xl bg-zinc-900/50 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-all text-sm"
                                                disabled={isRunning}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-3 pt-2">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="sameDay"
                                            checked={formData.sameDay}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 bg-zinc-900 border-zinc-700 rounded text-emerald-500 focus:ring-emerald-500 focus:ring-offset-[#111111]"
                                            disabled={isRunning}
                                        />
                                        <span className="text-sm font-medium text-zinc-300">Allow Same Day Appointments</span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="cancelIfExist"
                                            checked={formData.cancelIfExist}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 bg-zinc-900 border-zinc-700 rounded text-emerald-500 focus:ring-emerald-500 focus:ring-offset-[#111111]"
                                            disabled={isRunning}
                                        />
                                        <span className="text-sm font-medium text-zinc-300">Cancel Existing Appointments</span>
                                    </label>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="pt-6 mt-6 border-t border-zinc-800/50">
                        {isRunning ? (
                            <button
                                onClick={stopScheduler}
                                className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-medium text-white bg-rose-600/90 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#111111] focus:ring-rose-500 transition-all"
                            >
                                <Square className="mr-2 h-4 w-4" /> Stop Scheduler
                            </button>
                        ) : (
                            <button
                                onClick={startScheduler}
                                className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-medium text-[#111] bg-emerald-400 hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#111111] focus:ring-emerald-400 transition-all shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                            >
                                <Play className="mr-2 h-4 w-4 fill-current" /> Start Automation
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Right Column: Console output and interactions */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-7 flex flex-col space-y-6"
            >
                <AnimatePresence>
                    {showCaptchaPrompt && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0, scale: 0.95 }}
                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                            className="bg-amber-950/20 border border-amber-900/50 rounded-2xl p-5"
                        >
                            <h3 className="text-sm font-medium text-amber-500 flex items-center mb-2 uppercase tracking-wide">
                                <AlertCircle className="mr-2 h-4 w-4" /> Action Required: Captcha
                            </h3>
                            <p className="text-amber-200/60 text-sm mb-4">
                                The DPS scheduling system requires verification. Please complete a manual captcha token generation and paste it below.
                            </p>
                            <div className="flex space-x-3">
                                <div className="relative flex-grow">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <KeyRound className="h-4 w-4 text-amber-600/50" />
                                    </div>
                                    <input
                                        type="text"
                                        value={captchaToken}
                                        onChange={(e) => setCaptchaToken(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-amber-900/50 rounded-xl bg-[#111] text-amber-100 placeholder-amber-800/50 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700 transition-all text-sm"
                                        placeholder="Paste captcha token here..."
                                    />
                                </div>
                                <button
                                    onClick={submitCaptcha}
                                    disabled={!captchaToken}
                                    className="flex items-center justify-center py-2 px-5 rounded-xl text-sm font-medium text-amber-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <Send className="h-4 w-4 md:mr-2" />
                                    <span className="hidden md:inline">Submit</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl shadow-xl flex-grow flex flex-col min-h-[400px] lg:max-h-[800px] overflow-hidden relative">
                    <div className="px-5 py-3 border-b border-zinc-800/50 flex items-center justify-between bg-[#111]">
                        <div className="flex items-center space-x-2">
                            <Terminal className="h-4 w-4 text-zinc-500" />
                            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Operation Logs</span>
                        </div>
                        <div className="flex space-x-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
                            <div className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-800'}`}></div>
                        </div>
                    </div>
                    <div className="p-5 flex-grow overflow-y-auto font-mono text-[13px] leading-relaxed custom-scrollbar">
                        {logs.length === 0 ? (
                            <div className="text-zinc-600 flex items-center justify-center h-full">
                                Ready to automate. Start the scheduler to view activity.
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                {logs.map((log, i) => (
                                    <div key={i} className="text-zinc-400 break-words pl-2 border-l-2 border-zinc-800/50">
                                        <span className="text-emerald-500/70 mr-3">›</span> {log}
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
