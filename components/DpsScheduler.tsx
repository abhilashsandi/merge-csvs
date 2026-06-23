'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, Square, Terminal, User, Calendar, Mail,
    CreditCard, MapPin, KeyRound, AlertCircle, Send, Settings, Phone,
    Clock, HelpCircle, Activity, Search, Sun, Moon, Lock,
    CheckCircle, XCircle, Wifi, WifiOff, ChevronDown, Trash2
} from 'lucide-react';

// ─── Service Type Options ────────────────────────────────────────────
const SERVICE_TYPES = [
    { id: 71, name: 'Apply for first time Texas DL/Permit' },
    { id: 72, name: 'Apply for first time Texas ID' },
    { id: 73, name: 'Apply for first time Texas CLP/CDL' },
    { id: 74, name: 'Apply for Election Identification Certificate' },
    { id: 75, name: 'Renew Texas CLP/CDL' },
    { id: 76, name: 'Upgrade Texas CDL (Class or Endorsements)' },
    { id: 77, name: 'Downgrade Texas CDL to DL' },
    { id: 78, name: 'Apply/Renew Non-Domicile CDL' },
    { id: 79, name: 'Add or Remove Restriction' },
    { id: 81, name: 'Change, replace or renew Texas DL/Permit' },
    { id: 82, name: 'Change, replace or renew Texas ID' },
    { id: 83, name: 'Change or replace Texas CLP/CDL' },
    { id: 84, name: 'Change or replace EIC' },
    { id: 85, name: 'Returning to take a computer or written test' },
    { id: 86, name: 'Driver License Address Change' },
    { id: 87, name: 'I received a correction no fee letter from DPS' },
    { id: 88, name: 'Update Medical Certificate' },
    { id: 89, name: 'ID Address Change' },
    { id: 91, name: 'Schedule a home-bound visit' },
    { id: 101, name: 'Lawful Presence Verification Complete' },
    { id: 710, name: 'Service not listed or my license is not eligible' },
];

const PASSWORD = '2026AB';

// ─── Password Gate ───────────────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
    const [value, setValue] = useState('');
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);

    const attempt = () => {
        if (value === PASSWORD) {
            try { sessionStorage.setItem('dps_auth', '1'); } catch { /* ignore */ }
            onUnlock();
        } else {
            setError(true);
            setShake(true);
            setValue('');
            setTimeout(() => setShake(false), 600);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] transition-colors">
            <motion.div
                animate={shake ? { x: [-8, 8, -8, 8, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-sm bg-white dark:bg-[#111] border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl"
            >
                <div className="flex flex-col items-center mb-6">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-3">
                        <Lock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">DPS Scheduler</h1>
                    <p className="text-sm text-gray-500 dark:text-zinc-500 mt-1">Enter password to continue</p>
                </div>
                <input
                    type="password"
                    value={value}
                    onChange={e => { setValue(e.target.value); setError(false); }}
                    onKeyDown={e => e.key === 'Enter' && attempt()}
                    className={`w-full px-4 py-3 rounded-xl border text-sm mb-3 outline-none transition-all
                        bg-gray-50 dark:bg-zinc-900/50 text-gray-900 dark:text-zinc-100
                        ${error
                            ? 'border-red-400 dark:border-red-700 ring-1 ring-red-400'
                            : 'border-gray-300 dark:border-zinc-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                        }`}
                    placeholder="Password"
                    autoFocus
                />
                {error && (
                    <p className="text-xs text-red-500 mb-3 flex items-center gap-1">
                        <XCircle className="h-3 w-3" /> Incorrect password. Try again.
                    </p>
                )}
                <button
                    onClick={attempt}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-medium text-sm transition-all"
                >
                    Unlock
                </button>
            </motion.div>
        </div>
    );
}

// ─── Backend Status Indicator ────────────────────────────────────────
function BackendStatus({ baseUrl, isDark }: { baseUrl: string; isDark: boolean }) {
    const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');

    useEffect(() => {
        let cancelled = false;
        const check = async () => {
            try {
                const res = await fetch(`${baseUrl}/api/schedule/start`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({}),
                    signal: AbortSignal.timeout(5000),
                });
                // Any response (even 400) means server is alive
                if (!cancelled) setStatus(res.status > 0 ? 'online' : 'offline');
            } catch {
                if (!cancelled) setStatus('offline');
            }
        };
        check();
        return () => { cancelled = true; };
    }, [baseUrl]);

    return (
        <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full
            ${status === 'online'
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                : status === 'offline'
                    ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                    : 'text-gray-500 dark:text-zinc-500 bg-gray-100 dark:bg-zinc-800'
            }`}>
            {status === 'online' ? <Wifi className="h-3 w-3" /> :
             status === 'offline' ? <WifiOff className="h-3 w-3" /> :
             <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin inline-block" />}
            {status === 'online' ? 'Backend online' : status === 'offline' ? 'Backend offline' : 'Connecting…'}
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────
export default function DpsScheduler() {
    // ── Auth state ──
    const [unlocked, setUnlocked] = useState(false);

    // ── Theme state ──
    const [isDark, setIsDark] = useState(true);

    // ── Form state ──
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

    // ── Validation errors ──
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // ── Scheduler state ──
    const [activeTab, setActiveTab] = useState<'personal' | 'settings'>('personal');
    const [isRunning, setIsRunning] = useState(false);
    const [jobId, setJobId] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [showCaptchaPrompt, setShowCaptchaPrompt] = useState(false);
    const [captchaToken, setCaptchaToken] = useState('');

    const logsEndRef = useRef<HTMLDivElement>(null);
    const eventSourceRef = useRef<EventSource | null>(null);

    const getBaseUrl = () => {
        if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
            return process.env.NEXT_PUBLIC_BACKEND_URL_RENDER || 'https://dps-scheduler-api.onrender.com';
        }
        return 'http://localhost:3001';
    };
    const baseUrl = getBaseUrl();

    // ── Init ──
    useEffect(() => {
        // Check session auth
        try {
            if (sessionStorage.getItem('dps_auth') === '1') setUnlocked(true);
        } catch { /* ignore */ }

        // Load saved config
        try {
            const saved = localStorage.getItem('dpsConfig');
            if (saved) setFormData(JSON.parse(saved));
        } catch { /* ignore */ }

        // Detect system dark preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(prefersDark);

        return () => {
            if (eventSourceRef.current) eventSourceRef.current.close();
        };
    }, []);

    // ── Apply dark class to html ──
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
    }, [isDark]);

    // ── Auto-scroll logs ──
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    // ── Handlers ──
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData(prev => ({ ...prev, [e.target.name]: value }));
        if (fieldErrors[e.target.name]) {
            setFieldErrors(prev => { const n = { ...prev }; delete n[e.target.name]; return n; });
        }
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: Number(e.target.value) }));
    };

    // ── Validation ──
    const validate = () => {
        const errors: Record<string, string> = {};
        if (!formData.firstName.trim()) errors.firstName = 'Required';
        if (!formData.lastName.trim()) errors.lastName = 'Required';
        if (!formData.dob.trim()) errors.dob = 'Required';
        else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.dob)) errors.dob = 'Use MM/DD/YYYY';
        if (!formData.email.trim()) errors.email = 'Required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email';
        if (!formData.last4ssn.trim()) errors.last4ssn = 'Required';
        else if (!/^\d{4}$/.test(formData.last4ssn)) errors.last4ssn = 'Must be 4 digits';
        if (!formData.cityName.trim() && !formData.zipCode.trim()) {
            errors.cityName = 'City or Zip required';
            errors.zipCode = 'City or Zip required';
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // ── Convert date input value (YYYY-MM-DD) → MM/DD/YYYY ──
    const fromDateInput = (val: string) => {
        if (!val) return '';
        const [y, m, d] = val.split('-');
        return `${m}/${d}/${y}`;
    };
    const toDateInput = (val: string) => {
        if (!val) return '';
        const parts = val.split('/');
        if (parts.length !== 3) return '';
        return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
    };

    const startScheduler = async () => {
        if (!validate()) {
            setActiveTab('personal');
            return;
        }
        try {
            localStorage.setItem('dpsConfig', JSON.stringify(formData));
        } catch { /* ignore */ }

        setLogs(['Initializing scheduler…']);
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
                    end: formData.daysAroundEnd,
                },
                timesAround: {
                    start: formData.timesAroundStart,
                    end: formData.timesAroundEnd,
                },
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
                pushNotifcation: { enabled: false },
            },
        };

        try {
            const res = await fetch(`${baseUrl}/api/schedule/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`HTTP ${res.status}: ${errText}`);
            }
            const data = await res.json();
            if (data.jobId) {
                setJobId(data.jobId);
                connectSSE(data.jobId);
                setLogs(prev => [...prev, `Scheduler started. Job ID: ${data.jobId}`]);
            } else {
                setLogs(prev => [...prev, `Error: ${JSON.stringify(data)}`]);
                setIsRunning(false);
            }
        } catch (error: any) {
            setLogs(prev => [...prev, `❌ Failed to start: ${error.message}`]);
            setIsRunning(false);
        }
    };

    const stopScheduler = async () => {
        if (jobId) {
            try {
                await fetch(`${baseUrl}/api/schedule/stop`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ jobId }),
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
                body: JSON.stringify({ jobId, token: captchaToken }),
            });
            if (!res.ok) throw new Error('Failed to submit token');
            setLogs(prev => [...prev, '✅ Captcha token submitted. Resuming…']);
            setShowCaptchaPrompt(false);
            setCaptchaToken('');
        } catch (error: any) {
            setLogs(prev => [...prev, `❌ Failed to submit token: ${error.message}`]);
        }
    };

    const connectSSE = (id: string) => {
        if (eventSourceRef.current) eventSourceRef.current.close();
        let errorCount = 0;
        const eventSource = new EventSource(`${baseUrl}/api/schedule/logs/${id}`);
        eventSourceRef.current = eventSource;

        eventSource.onmessage = (event) => {
            errorCount = 0; // reset on successful message
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'AUTH_REQUIRED') {
                    setShowCaptchaPrompt(true);
                    setLogs(prev => [...prev, '⚠️ ACTION REQUIRED: Auth token needed to proceed.']);
                } else if (data.type === 'FINISHED') {
                    setLogs(prev => [...prev, data.message || '✅ Automation finished.']);
                    eventSourceRef.current?.close();
                    eventSourceRef.current = null;
                    setIsRunning(false);
                    setJobId(null);
                } else if (data.message) {
                    setLogs(prev => [...prev, data.message]);
                } else {
                    setLogs(prev => [...prev, JSON.stringify(data)]);
                }
            } catch {
                setLogs(prev => [...prev, event.data]);
            }
        };

        eventSource.onerror = () => {
            errorCount++;
            if (errorCount > 10) {
                setLogs(prev => [...prev, '❌ Connection lost permanently. Automation stopped.']);
                eventSourceRef.current?.close();
                eventSourceRef.current = null;
                setIsRunning(false);
                setJobId(null);
            } else {
                setLogs(prev => [...prev, `⚠️ Connection interrupted. Reconnecting… (${errorCount}/10)`]);
            }
        };
    };

    // ── Shared input classes ──
    const inputCls = (name?: string) =>
        `block w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm transition-all outline-none
        bg-gray-50 dark:bg-zinc-900/50 text-gray-900 dark:text-zinc-200
        placeholder-gray-400 dark:placeholder-zinc-700
        ${fieldErrors[name || '']
            ? 'border-red-400 dark:border-red-700 focus:ring-1 focus:ring-red-400'
            : 'border-gray-300 dark:border-zinc-800 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-zinc-600 dark:focus:border-zinc-600'
        }`;

    const smallInputCls = (name?: string) =>
        `block w-full px-3 py-2 border rounded-lg text-sm outline-none transition-all
        bg-gray-50 dark:bg-zinc-900/50 text-gray-900 dark:text-zinc-200
        ${fieldErrors[name || '']
            ? 'border-red-400 dark:border-red-700'
            : 'border-gray-300 dark:border-zinc-800 focus:ring-1 focus:ring-emerald-500 dark:focus:ring-zinc-600'
        }`;

    const labelCls = 'block text-xs font-medium text-gray-500 dark:text-zinc-500 mb-1 uppercase tracking-wider';
    const iconCls = 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none';
    const iconColor = 'text-gray-400 dark:text-zinc-600';

    if (!unlocked) {
        return <PasswordGate onUnlock={() => setUnlocked(true)} />;
    }

    return (
        <div className={isDark ? 'dark' : ''}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
                {/* Left Column */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="lg:col-span-5 flex flex-col space-y-6"
                >
                    <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">

                        {/* Header row: tabs + theme toggle */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex flex-1 space-x-1 bg-gray-100 dark:bg-zinc-900 p-1 rounded-xl">
                                <button
                                    onClick={() => setActiveTab('personal')}
                                    className={`flex-1 flex items-center justify-center py-2 px-3 text-sm font-medium rounded-lg transition-all
                                        ${activeTab === 'personal'
                                            ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                                            : 'text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300'
                                        }`}
                                >
                                    <User className="w-4 h-4 mr-2" /> Personal
                                </button>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`flex-1 flex items-center justify-center py-2 px-3 text-sm font-medium rounded-lg transition-all
                                        ${activeTab === 'settings'
                                            ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                                            : 'text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300'
                                        }`}
                                >
                                    <Settings className="w-4 h-4 mr-2" /> Settings
                                </button>
                            </div>
                            <button
                                onClick={() => setIsDark(d => !d)}
                                className="p-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
                                title="Toggle theme"
                            >
                                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {/* ─── Personal Tab ─── */}
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
                                            <label className={labelCls}>First Name</label>
                                            <div className="relative">
                                                <div className={iconCls}><User className={`h-4 w-4 ${iconColor}`} /></div>
                                                <input type="text" name="firstName" value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    className={inputCls('firstName')} placeholder="John" disabled={isRunning} />
                                            </div>
                                            {fieldErrors.firstName && <p className="text-xs text-red-500 mt-1">{fieldErrors.firstName}</p>}
                                        </div>
                                        <div>
                                            <label className={labelCls}>Last Name</label>
                                            <div className="relative">
                                                <div className={iconCls}><User className={`h-4 w-4 ${iconColor}`} /></div>
                                                <input type="text" name="lastName" value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    className={inputCls('lastName')} placeholder="Doe" disabled={isRunning} />
                                            </div>
                                            {fieldErrors.lastName && <p className="text-xs text-red-500 mt-1">{fieldErrors.lastName}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelCls}>Date of Birth</label>
                                            <div className="relative">
                                                <div className={iconCls}><Calendar className={`h-4 w-4 ${iconColor}`} /></div>
                                                <input
                                                    type="date"
                                                    name="dob"
                                                    value={toDateInput(formData.dob)}
                                                    onChange={e => {
                                                        const mmddyyyy = fromDateInput(e.target.value);
                                                        setFormData(prev => ({ ...prev, dob: mmddyyyy }));
                                                        if (fieldErrors.dob) setFieldErrors(p => { const n = { ...p }; delete n.dob; return n; });
                                                    }}
                                                    className={inputCls('dob')}
                                                    disabled={isRunning}
                                                    max={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>
                                            {fieldErrors.dob && <p className="text-xs text-red-500 mt-1">{fieldErrors.dob}</p>}
                                        </div>
                                        <div>
                                            <label className={labelCls}>Last 4 SSN</label>
                                            <div className="relative">
                                                <div className={iconCls}><CreditCard className={`h-4 w-4 ${iconColor}`} /></div>
                                                <input type="password" name="last4ssn" value={formData.last4ssn}
                                                    onChange={handleInputChange} maxLength={4}
                                                    className={inputCls('last4ssn')} placeholder="••••" disabled={isRunning} />
                                            </div>
                                            {fieldErrors.last4ssn && <p className="text-xs text-red-500 mt-1">{fieldErrors.last4ssn}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelCls}>Email</label>
                                            <div className="relative">
                                                <div className={iconCls}><Mail className={`h-4 w-4 ${iconColor}`} /></div>
                                                <input type="email" name="email" value={formData.email}
                                                    onChange={handleInputChange}
                                                    className={inputCls('email')} placeholder="john@example.com" disabled={isRunning} />
                                            </div>
                                            {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
                                        </div>
                                        <div>
                                            <label className={labelCls}>Phone <span className="normal-case font-normal">(optional)</span></label>
                                            <div className="relative">
                                                <div className={iconCls}><Phone className={`h-4 w-4 ${iconColor}`} /></div>
                                                <input type="tel" name="phoneNumber" value={formData.phoneNumber}
                                                    onChange={handleInputChange}
                                                    className={inputCls()} placeholder="5551234567" disabled={isRunning} />
                                            </div>
                                            <p className="text-[10px] text-gray-400 dark:text-zinc-600 mt-1">Digits only — enables SMS confirmation</p>
                                        </div>
                                    </div>

                                    {/* Service Type */}
                                    <div>
                                        <label className={labelCls}>Service Type</label>
                                        <div className="relative">
                                            <div className={iconCls}><ChevronDown className={`h-4 w-4 ${iconColor}`} /></div>
                                            <select
                                                name="typeId"
                                                value={formData.typeId}
                                                onChange={handleNumberChange}
                                                disabled={isRunning}
                                                className={`block w-full pl-9 pr-8 py-2.5 border rounded-xl text-sm outline-none appearance-none transition-all
                                                    bg-gray-50 dark:bg-zinc-900/50 text-gray-900 dark:text-zinc-200
                                                    border-gray-300 dark:border-zinc-800 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-zinc-600 dark:focus:border-zinc-600`}
                                            >
                                                {SERVICE_TYPES.map(s => (
                                                    <option key={s.id} value={s.id}>{s.id} — {s.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ─── Settings Tab ─── */}
                            {activeTab === 'settings' && (
                                <motion.div
                                    key="settings"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-4 max-h-[460px] overflow-y-auto pr-1"
                                >
                                    {/* Auth Token */}
                                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-900/30">
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-xs font-medium text-emerald-700 dark:text-emerald-500 uppercase tracking-wider">Auth Token <span className="normal-case font-normal">(optional)</span></label>
                                            <a href="https://github.com/phamleduy04/texas-dps-scheduler/wiki/How-to-get-Auth-Token"
                                                target="_blank" rel="noreferrer"
                                                className="text-emerald-600 dark:text-emerald-500 text-[10px] flex items-center gap-1 hover:underline">
                                                <HelpCircle className="h-3 w-3" /> How to generate
                                            </a>
                                        </div>
                                        <div className="relative mt-2">
                                            <div className={iconCls}><KeyRound className="h-4 w-4 text-emerald-500/50" /></div>
                                            <input type="text" name="authToken" value={formData.authToken}
                                                onChange={handleInputChange}
                                                className="block w-full pl-9 pr-3 py-2.5 border border-emerald-200 dark:border-emerald-900/50 rounded-xl bg-white dark:bg-zinc-900/50 text-emerald-900 dark:text-emerald-100 placeholder-emerald-300 dark:placeholder-emerald-800/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm font-mono"
                                                placeholder="Paste auth token to skip browser fetch…"
                                                disabled={isRunning} />
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelCls}>City Name(s)</label>
                                            <div className="relative">
                                                <div className={iconCls}><Search className={`h-4 w-4 ${iconColor}`} /></div>
                                                <input type="text" name="cityName" value={formData.cityName}
                                                    onChange={handleInputChange}
                                                    className={inputCls('cityName')} placeholder="Plano, Dallas" disabled={isRunning} />
                                            </div>
                                            {fieldErrors.cityName && <p className="text-xs text-red-500 mt-1">{fieldErrors.cityName}</p>}
                                        </div>
                                        <div>
                                            <label className={labelCls}>Zip Code(s)</label>
                                            <div className="relative">
                                                <div className={iconCls}><MapPin className={`h-4 w-4 ${iconColor}`} /></div>
                                                <input type="text" name="zipCode" value={formData.zipCode}
                                                    onChange={handleInputChange}
                                                    className={inputCls('zipCode')} placeholder="75001" disabled={isRunning} />
                                            </div>
                                            {fieldErrors.zipCode && <p className="text-xs text-red-500 mt-1">{fieldErrors.zipCode}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelCls}>Radius (Miles)</label>
                                            <div className="relative">
                                                <div className={iconCls}><Activity className={`h-4 w-4 ${iconColor}`} /></div>
                                                <input type="number" name="miles" value={formData.miles}
                                                    onChange={handleNumberChange} min={1} max={500}
                                                    className={inputCls()} disabled={isRunning} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelCls}>Preferred Days</label>
                                            <div className="relative">
                                                <div className={iconCls}><Calendar className={`h-4 w-4 ${iconColor}`} /></div>
                                                <input type="text" name="preferredDays" value={formData.preferredDays}
                                                    onChange={handleInputChange}
                                                    className={inputCls()} placeholder="0,1,2,3,4,5,6" disabled={isRunning} />
                                            </div>
                                            <p className="text-[10px] text-gray-400 dark:text-zinc-600 mt-1">0=Sun … 6=Sat</p>
                                        </div>
                                    </div>

                                    {/* Days Around */}
                                    <div className="p-3 bg-gray-50 dark:bg-zinc-900/30 rounded-xl border border-gray-200 dark:border-zinc-800/50">
                                        <span className="block text-xs font-medium text-gray-500 dark:text-zinc-500 mb-3 uppercase tracking-wider">Date Range</span>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-[10px] text-gray-500 dark:text-zinc-600 mb-1 uppercase">Start Date</label>
                                                <input
                                                    type="date"
                                                    name="daysAroundStartDate"
                                                    value={toDateInput(formData.daysAroundStartDate)}
                                                    onChange={e => {
                                                        const mmddyyyy = fromDateInput(e.target.value);
                                                        setFormData(prev => ({ ...prev, daysAroundStartDate: mmddyyyy }));
                                                    }}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className={smallInputCls()}
                                                    disabled={isRunning}
                                                />
                                                <p className="text-[9px] text-gray-400 dark:text-zinc-600 mt-0.5">Blank = today</p>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-gray-500 dark:text-zinc-600 mb-1 uppercase">Start (days)</label>
                                                <input type="number" name="daysAroundStart" value={formData.daysAroundStart}
                                                    onChange={handleNumberChange} min={0}
                                                    className={smallInputCls()} disabled={isRunning} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-gray-500 dark:text-zinc-600 mb-1 uppercase">End (days)</label>
                                                <input type="number" name="daysAroundEnd" value={formData.daysAroundEnd}
                                                    onChange={handleNumberChange} min={1}
                                                    className={smallInputCls()} disabled={isRunning} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Times Around */}
                                    <div className="p-3 bg-gray-50 dark:bg-zinc-900/30 rounded-xl border border-gray-200 dark:border-zinc-800/50">
                                        <span className="block text-xs font-medium text-gray-500 dark:text-zinc-500 mb-3 uppercase tracking-wider">Time Window (24h)</span>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[10px] text-gray-500 dark:text-zinc-600 mb-1 uppercase">Earliest Hour</label>
                                                <input type="number" name="timesAroundStart" value={formData.timesAroundStart}
                                                    onChange={handleNumberChange} min={0} max={23}
                                                    className={smallInputCls()} disabled={isRunning} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-gray-500 dark:text-zinc-600 mb-1 uppercase">Latest Hour</label>
                                                <input type="number" name="timesAroundEnd" value={formData.timesAroundEnd}
                                                    onChange={handleNumberChange} min={0} max={24}
                                                    className={smallInputCls()} disabled={isRunning} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Interval + Retry */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelCls}>Poll Interval (ms)</label>
                                            <div className="relative">
                                                <div className={iconCls}><Clock className={`h-4 w-4 ${iconColor}`} /></div>
                                                <input type="number" name="interval" value={formData.interval}
                                                    onChange={handleNumberChange} min={1000}
                                                    className={inputCls()} disabled={isRunning} />
                                            </div>
                                            <p className="text-[10px] text-gray-400 dark:text-zinc-600 mt-1">Min 1000ms recommended</p>
                                        </div>
                                        <div>
                                            <label className={labelCls}>Max Retries</label>
                                            <div className="relative">
                                                <div className={iconCls}><Activity className={`h-4 w-4 ${iconColor}`} /></div>
                                                <input type="number" name="maxRetry" value={formData.maxRetry}
                                                    onChange={handleNumberChange} min={1}
                                                    className={inputCls()} disabled={isRunning} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Checkboxes */}
                                    <div className="flex flex-col space-y-3 pt-1">
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input type="checkbox" name="sameDay" checked={formData.sameDay}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500"
                                                disabled={isRunning} />
                                            <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Allow same-day appointments</span>
                                        </label>
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input type="checkbox" name="cancelIfExist" checked={formData.cancelIfExist}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500"
                                                disabled={isRunning} />
                                            <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Cancel existing appointment if better found</span>
                                        </label>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Validation summary */}
                        {Object.keys(fieldErrors).length > 0 && (
                            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl flex items-start gap-2">
                                <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-red-600 dark:text-red-400">Please fix the highlighted fields before starting.</p>
                            </div>
                        )}

                        {/* Action button */}
                        <div className="pt-6 mt-4 border-t border-gray-100 dark:border-zinc-800/50">
                            {isRunning ? (
                                <button onClick={stopScheduler}
                                    className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-medium text-white bg-rose-600/90 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all">
                                    <Square className="mr-2 h-4 w-4" /> Stop Scheduler
                                </button>
                            ) : (
                                <button onClick={startScheduler}
                                    className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-medium text-white dark:text-[#111] bg-emerald-600 dark:bg-emerald-400 hover:bg-emerald-500 dark:hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all shadow-[0_0_15px_rgba(52,211,153,0.25)]">
                                    <Play className="mr-2 h-4 w-4 fill-current" /> Start Automation
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Logs */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="lg:col-span-7 flex flex-col space-y-4"
                >
                    {/* Backend status + clear */}
                    <div className="flex items-center justify-between">
                        <BackendStatus baseUrl={baseUrl} isDark={isDark} />
                        {logs.length > 0 && !isRunning && (
                            <button onClick={() => setLogs([])}
                                className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors">
                                <Trash2 className="h-3.5 w-3.5" /> Clear logs
                            </button>
                        )}
                    </div>

                    {/* Captcha prompt */}
                    <AnimatePresence>
                        {showCaptchaPrompt && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, scale: 0.97 }}
                                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                exit={{ opacity: 0, height: 0, scale: 0.97 }}
                                className="bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900/50 rounded-2xl p-5"
                            >
                                <h3 className="text-sm font-medium text-amber-700 dark:text-amber-500 flex items-center mb-2 uppercase tracking-wide">
                                    <AlertCircle className="mr-2 h-4 w-4" /> Action Required: Auth Token
                                </h3>
                                <p className="text-amber-700/70 dark:text-amber-200/60 text-sm mb-4">
                                    Browser-based auth failed or timed out. Paste a manually-obtained auth token to continue.{' '}
                                    <a href="https://github.com/phamleduy04/texas-dps-scheduler/wiki/How-to-get-Auth-Token"
                                        target="_blank" rel="noreferrer" className="underline">How to get one</a>
                                </p>
                                <div className="flex space-x-3">
                                    <div className="relative flex-grow">
                                        <div className={iconCls}><KeyRound className="h-4 w-4 text-amber-500/50" /></div>
                                        <input type="text" value={captchaToken}
                                            onChange={e => setCaptchaToken(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && submitCaptcha()}
                                            className="block w-full pl-10 pr-3 py-2.5 border border-amber-300 dark:border-amber-900/50 rounded-xl bg-white dark:bg-[#111] text-amber-900 dark:text-amber-100 placeholder-amber-300 dark:placeholder-amber-800/50 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                                            placeholder="Paste auth token here…" />
                                    </div>
                                    <button onClick={submitCaptcha} disabled={!captchaToken}
                                        className="flex items-center justify-center py-2 px-5 rounded-xl text-sm font-medium text-amber-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                        <Send className="h-4 w-4 md:mr-2" />
                                        <span className="hidden md:inline">Submit</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Log console */}
                    <div className="bg-gray-950 dark:bg-[#0a0a0a] border border-gray-800 dark:border-zinc-800 rounded-2xl shadow-xl flex-grow flex flex-col min-h-[420px] lg:max-h-[740px] overflow-hidden">
                        <div className="px-5 py-3 border-b border-gray-800 dark:border-zinc-800/50 flex items-center justify-between bg-gray-900 dark:bg-[#111]">
                            <div className="flex items-center space-x-2">
                                <Terminal className="h-4 w-4 text-gray-500" />
                                <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Operation Logs</span>
                            </div>
                            <div className="flex space-x-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-gray-700" />
                                <div className="w-2.5 h-2.5 rounded-full bg-gray-700" />
                                <div className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-gray-700'}`} />
                            </div>
                        </div>
                        <div className="p-5 flex-grow overflow-y-auto font-mono text-[13px] leading-relaxed">
                            {logs.length === 0 ? (
                                <div className="text-gray-600 dark:text-zinc-600 flex items-center justify-center h-full">
                                    Ready to automate. Configure settings and press Start.
                                </div>
                            ) : (
                                <div className="space-y-1.5">
                                    {logs.map((log, i) => {
                                        const isError = log.startsWith('❌') || log.toLowerCase().includes('error') || log.toLowerCase().includes('failed');
                                        const isWarn = log.startsWith('⚠️') || log.toLowerCase().includes('warning') || log.toLowerCase().includes('warn');
                                        const isSuccess = log.startsWith('✅') || log.toLowerCase().includes('success') || log.toLowerCase().includes('booked');
                                        return (
                                            <div key={i} className={`break-words pl-2 border-l-2 ${
                                                isError ? 'border-red-700 text-red-400' :
                                                isWarn ? 'border-amber-700 text-amber-400' :
                                                isSuccess ? 'border-emerald-600 text-emerald-400' :
                                                'border-gray-800 text-gray-400'
                                            }`}>
                                                <span className={`mr-3 ${
                                                    isError ? 'text-red-600' :
                                                    isWarn ? 'text-amber-600' :
                                                    isSuccess ? 'text-emerald-500' :
                                                    'text-emerald-500/50'
                                                }`}>›</span>
                                                {log}
                                            </div>
                                        );
                                    })}
                                    <div ref={logsEndRef} />
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
