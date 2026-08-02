'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Code2, 
  TerminalSquare, 
  Database, 
  FileSpreadsheet, 
  FileText, 
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] selection:bg-indigo-500/30 text-slate-50 font-sans overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-indigo-500/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-violet-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-soft-light" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            DevPortal
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link href="#training" className="hover:text-white transition-colors">Training</Link>
          <Link href="#utilities" className="hover:text-white transition-colors">Utilities</Link>
        </div>
        <Link 
          href="/react-training"
          className="px-5 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium backdrop-blur-md"
        >
          Mock Interview
        </Link>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-24 pb-32 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Interview Prep</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              Master Engineering <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400">
                Interviews Faster.
              </span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Your ultimate portal for technical interview prep and developer utilities. Practice React, Node.js, and System Design, or automate daily tasks with our suite of tools.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link 
                href="/react-training"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Start Free Training
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="#utilities"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all flex items-center justify-center"
              >
                Explore Utilities
              </Link>
            </motion.div>
            
            <motion.div variants={fadeIn} className="mt-12 flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400"/> AI Mock Interviews</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400"/> Interactive Quizzes</div>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div 
            className="flex-1 w-full max-w-lg lg:max-w-none relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 p-2">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-violet-500/10 pointer-events-none" />
              <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="p-6 space-y-4 relative">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 border border-white/10">
                    <p className="text-sm text-slate-300">Explain the difference between useMemo and useCallback.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Code2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="bg-emerald-500/10 rounded-2xl rounded-tr-none p-4 border border-emerald-500/20">
                    <p className="text-sm text-emerald-100">Both are for performance optimization, but useMemo memoizes a computed value, while useCallback memoizes the function definition itself to prevent unnecessary re-renders of child components.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Training Section */}
        <section id="training" className="py-24 px-6 relative border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="mb-16 text-center"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Technical <span className="text-indigo-400">Training</span></h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">Level up your skills with interactive tutorials, mock interviews, and deep dives into core engineering concepts.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'React.js Portal', desc: 'Hooks, React 19, Patterns & AI Mock Interviews.', icon: Code2, href: '/react-training', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
                { title: 'Node.js Internals', desc: 'Event Loop, Streams, and Backend Architecture.', icon: TerminalSquare, href: '/nodejs', color: 'text-green-400', bg: 'bg-green-400/10' },
                { title: 'System Design', desc: 'Scale, Databases, Caching, and Microservices.', icon: Database, href: '/system-design', color: 'text-blue-400', bg: 'bg-blue-400/10' },
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={item.href} className="group block h-full bg-white/5 hover:bg-white/[0.07] border border-white/10 hover:border-white/20 rounded-3xl p-8 transition-all hover:-translate-y-1">
                    <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-6`}>
                      <item.icon className={`w-7 h-7 ${item.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Utilities Section */}
        <section id="utilities" className="py-24 px-6 relative border-t border-white/5 bg-slate-950/50">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="mb-16 text-center"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Developer <span className="text-violet-400">Utilities</span></h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">Automate tedious tasks and manage your files securely right in your browser.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                { title: 'CSV Merger Tool', desc: 'Upload, manage columns, and intelligently merge multiple CSV files securely in your browser.', icon: FileSpreadsheet, href: '/csv-tools', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                { title: 'PDF Suite', desc: 'Merge, compress, and manipulate PDF documents without sending your data to external servers.', icon: FileText, href: '/pdf-tools', color: 'text-rose-400', bg: 'bg-rose-400/10' },
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={item.href} className="group block h-full bg-white/5 hover:bg-white/[0.07] border border-white/10 hover:border-white/20 rounded-3xl p-8 transition-all hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center`}>
                        <item.icon className={`w-7 h-7 ${item.color}`} />
                      </div>
                      <ArrowRight className="w-6 h-6 text-slate-600 group-hover:text-white transition-colors group-hover:translate-x-1 duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="border-t border-white/5 py-12 px-6 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} DevPortal. All systems operational.</p>
        </footer>
      </main>
    </div>
  );
}
