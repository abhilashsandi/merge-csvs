import React, { useState, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Bad Architecture ---
function BadChild({ product, onFavorite, onSelect }: any) {
  // Artificial delay to simulate expensive render
  let startTime = performance.now();
  while (performance.now() - startTime < 10) {}

  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div className="relative p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden group">
      <motion.div
        key={renderCount.current}
        initial={{ opacity: 1, boxShadow: 'inset 0 0 20px rgba(239, 68, 68, 0.4), 0 0 20px rgba(239, 68, 68, 0.4)' }}
        animate={{ opacity: 0, boxShadow: 'inset 0 0 0px rgba(239, 68, 68, 0), 0 0 0px rgba(239, 68, 68, 0)' }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 rounded-xl border-2 border-red-500/50 pointer-events-none"
      />
      <div className="relative z-10 flex flex-col md:flex-row gap-3 md:gap-0 justify-between md:items-center">
        <div>
          <h5 className="font-semibold text-white/90">{product.name}</h5>
          <p className="text-sm text-white/50">${product.price}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onFavorite(product.id)} 
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              product.isFavorite 
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' 
                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
            }`}
          >
            {product.isFavorite ? '♥ Fav' : '♡ Fav'}
          </button>
          <button 
            onClick={() => onSelect(product.id)} 
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-all"
          >
            Select
          </button>
        </div>
      </div>
      <div className="absolute top-2 right-3 text-[10px] text-white/30 font-mono font-bold">
        Renders: <span className="text-red-400">{renderCount.current}</span>
      </div>
    </div>
  );
}

function BadParent() {
  const [inputValue, setInputValue] = useState('');
  const [products, setProducts] = useState([
    { id: '1', name: 'Wireless Headphones', price: 99, isFavorite: false },
    { id: '2', name: 'Mechanical Keyboard', price: 149, isFavorite: false },
    { id: '3', name: 'Ergonomic Mouse', price: 79, isFavorite: true },
  ]);

  const parentRenderCount = useRef(0);
  parentRenderCount.current += 1;

  // BAD: New function reference on every render
  const handleFavorite = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const handleSelect = (id: string) => {
    alert(`Selected product ${id}`);
  };

  return (
    <div className="flex-1 p-6 lg:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 to-orange-500" />
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-sm border border-red-500/30">✗</span>
            Bad Architecture
          </h3>
          <p className="text-white/50 text-sm max-w-sm h-14 md:h-10">
            No memoization. Every parent render re-creates functions and forces all children to re-render.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Parent Renders</div>
          <motion.div 
            key={parentRenderCount.current}
            initial={{ color: '#f87171', scale: 1.2 }}
            animate={{ color: '#9ca3af', scale: 1 }}
            className="text-2xl font-mono font-bold"
          >
            {parentRenderCount.current}
          </motion.div>
        </div>
      </div>

      <div className="mb-8 p-5 bg-black/20 rounded-2xl border border-white/5">
        <label className="block text-xs text-white/50 uppercase tracking-wider mb-3">Unrelated State Change</label>
        <input 
          type="text" 
          placeholder="Type to trigger parent render..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-white/20"
        />
      </div>

      <div className="mb-8 p-4 rounded-xl bg-black/40 border border-red-500/20 shadow-[inset_0_0_20px_rgba(239,68,68,0.05)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 px-3 py-1 bg-red-500/20 text-red-400 text-[10px] uppercase tracking-wider font-bold rounded-bl-xl border-b border-l border-red-500/20 backdrop-blur-md">Bad Practice</div>
        <pre className="text-[11px] md:text-xs font-mono text-white/80 whitespace-pre overflow-x-auto leading-relaxed">
<span className="text-red-400">{'// ❌ Re-created on every render'}</span>{'\n'}
<span className="text-purple-400">const</span> <span className="text-blue-300">handleFavorite</span> = (id) <span className="text-purple-400">{'=>'}</span> {'{'}{'\\n'}
{'  '}<span className="text-yellow-200">setProducts</span>(prev <span className="text-purple-400">{'=> '}</span> ...);{'\n'}
{'}'};{'\n'}
{'\n'}
<span className="text-red-400">{'// ❌ Re-renders even if props unchanged'}</span>{'\n'}
<span className="text-purple-400">function</span> <span className="text-blue-300">BadChild</span>({'{'}<span className="text-orange-300">product, onFavorite</span>{'}'}) {'{'}{'\\n'}
{'  '}<span className="text-white/40">{'// ...'}</span>{'\n'}
{'}'}{'\\n'}
        </pre>
      </div>

      <div className="relative flex-1">
        {/* Tree Line */}
        <div className="absolute left-[19px] top-0 bottom-8 w-[2px] bg-gradient-to-b from-white/10 via-white/5 to-transparent rounded-full" />
        
        <div className="space-y-5 pl-12 relative">
          {products.map(product => (
            <div key={product.id} className="relative">
              {/* Branch Line */}
              <div className="absolute -left-7 top-1/2 w-6 h-[2px] bg-white/10 rounded-full" />
              <BadChild product={product} onFavorite={handleFavorite} onSelect={handleSelect} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Good Architecture ---
const GoodChild = React.memo(
  function GoodChild({ product, onFavorite, onSelect }: any) {
    // Artificial delay to simulate expensive render
    let startTime = performance.now();
    while (performance.now() - startTime < 10) {}

    const renderCount = useRef(0);
    renderCount.current += 1;

    return (
      <div className="relative p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden group">
        <motion.div
          key={renderCount.current}
          initial={{ opacity: 1, boxShadow: 'inset 0 0 20px rgba(16, 185, 129, 0.4), 0 0 20px rgba(16, 185, 129, 0.4)' }}
          animate={{ opacity: 0, boxShadow: 'inset 0 0 0px rgba(16, 185, 129, 0), 0 0 0px rgba(16, 185, 129, 0)' }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 rounded-xl border-2 border-emerald-500/50 pointer-events-none"
        />
        <div className="relative z-10 flex flex-col md:flex-row gap-3 md:gap-0 justify-between md:items-center">
          <div>
            <h5 className="font-semibold text-white/90">{product.name}</h5>
            <p className="text-sm text-white/50">${product.price}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onFavorite(product.id)} 
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                product.isFavorite 
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' 
                  : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30'
              }`}
            >
              {product.isFavorite ? '♥ Fav' : '♡ Fav'}
            </button>
            <button 
              onClick={() => onSelect(product.id)} 
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-all"
            >
              Select
            </button>
          </div>
        </div>
        <div className="absolute top-2 right-3 text-[10px] text-white/30 font-mono font-bold">
          Renders: <span className="text-emerald-400">{renderCount.current}</span>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.product.id === nextProps.product.id &&
      prevProps.product.price === nextProps.product.price &&
      prevProps.product.isFavorite === nextProps.product.isFavorite &&
      prevProps.onSelect === nextProps.onSelect &&
      prevProps.onFavorite === nextProps.onFavorite
    );
  }
);

function GoodParent() {
  const [inputValue, setInputValue] = useState('');
  const [products, setProducts] = useState([
    { id: '1', name: 'Wireless Headphones', price: 99, isFavorite: false },
    { id: '2', name: 'Mechanical Keyboard', price: 149, isFavorite: false },
    { id: '3', name: 'Ergonomic Mouse', price: 79, isFavorite: true },
  ]);

  const parentRenderCount = useRef(0);
  parentRenderCount.current += 1;

  // GOOD: Stable function reference
  const handleFavorite = useCallback((id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  }, []);

  const handleSelect = useCallback((id: string) => {
    alert(`Selected product ${id}`);
  }, []);

  return (
    <div className="flex-1 p-6 lg:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500" />
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm border border-emerald-500/30">✓</span>
            Good Architecture
          </h3>
          <p className="text-white/50 text-sm max-w-sm h-14 md:h-10">
            Uses <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/70 font-mono">React.memo</code> & <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/70 font-mono">useCallback</code>. Children only re-render if their exact props change.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Parent Renders</div>
          <motion.div 
            key={parentRenderCount.current}
            initial={{ color: '#34d399', scale: 1.2 }}
            animate={{ color: '#9ca3af', scale: 1 }}
            className="text-2xl font-mono font-bold"
          >
            {parentRenderCount.current}
          </motion.div>
        </div>
      </div>

      <div className="mb-8 p-5 bg-black/20 rounded-2xl border border-white/5">
        <label className="block text-xs text-white/50 uppercase tracking-wider mb-3">Unrelated State Change</label>
        <input 
          type="text" 
          placeholder="Type to trigger parent render..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-white/20"
        />
      </div>

      <div className="mb-8 p-4 rounded-xl bg-black/40 border border-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] uppercase tracking-wider font-bold rounded-bl-xl border-b border-l border-emerald-500/20 backdrop-blur-md">Optimized</div>
        <pre className="text-[11px] md:text-xs font-mono text-white/80 whitespace-pre overflow-x-auto leading-relaxed">
<span className="text-emerald-400">{'// ✅ Stable callback reference'}</span>{'\n'}
<span className="text-purple-400">const</span> <span className="text-blue-300">handleFavorite</span> = <span className="text-yellow-200">useCallback</span>((id) <span className="text-purple-400">{'=> '}</span> {'{'}{'\\n'}
{'  '}<span className="text-yellow-200">setProducts</span>(prev <span className="text-purple-400">{'=> '}</span> ...);{'\n'}
{'}'}, []);{'\n'}
{'\n'}
<span className="text-emerald-400">{'// ✅ Skips render if props are identical'}</span>{'\n'}
<span className="text-purple-400">const</span> <span className="text-blue-300">GoodChild</span> = React.<span className="text-yellow-200">memo</span>(<span className="text-purple-400">function</span> <span className="text-blue-300">GoodChild</span>(props) {'{'}{'\\n'}
{'  '}<span className="text-white/40">{'// ...'}</span>{'\n'}
{'}'});{'\n'}
        </pre>
      </div>

      <div className="relative flex-1">
        {/* Tree Line */}
        <div className="absolute left-[19px] top-0 bottom-8 w-[2px] bg-gradient-to-b from-white/10 via-white/5 to-transparent rounded-full" />
        
        <div className="space-y-5 pl-12 relative">
          {products.map(product => (
            <div key={product.id} className="relative">
              {/* Branch Line */}
              <div className="absolute -left-7 top-1/2 w-6 h-[2px] bg-white/10 rounded-full" />
              <GoodChild product={product} onFavorite={handleFavorite} onSelect={handleSelect} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Expensive Calculation: Bad Architecture ---
function BadExpensiveCalc() {
  const [inputValue, setInputValue] = useState('');
  const [count, setCount] = useState(0);

  // Expensive calculation done on EVERY render
  const sortedItems = () => {
    let startTime = performance.now();
    while (performance.now() - startTime < 80) {} // Block thread for 80ms to simulate heavy work
    const items = Array.from({ length: 10000 }, () => Math.random());
    return items.sort();
  };
  
  const result = sortedItems();
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div className="flex-1 p-6 lg:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 to-orange-500" />
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-sm border border-red-500/30">✗</span>
            Without useMemo
          </h3>
          <p className="text-white/50 text-sm max-w-sm h-10">
            Calculation runs on every render, freezing the UI.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Renders</div>
          <motion.div 
            key={renderCount.current}
            initial={{ color: '#f87171', scale: 1.2 }}
            animate={{ color: '#9ca3af', scale: 1 }}
            className="text-2xl font-mono font-bold"
          >
            {renderCount.current}
          </motion.div>
        </div>
      </div>

      <div className="mb-6 p-5 bg-black/20 rounded-2xl border border-white/5 space-y-4">
        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Unrelated State Change</label>
          <input 
            type="text" 
            placeholder="Type here (notice the lag!)..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-white/20"
          />
        </div>
        <div>
          <button 
            onClick={() => setCount(c => c + 1)}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all w-full border border-white/10"
          >
            Trigger Calculation (Count: {count})
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-xl bg-black/40 border border-red-500/20 shadow-[inset_0_0_20px_rgba(239,68,68,0.05)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 px-3 py-1 bg-red-500/20 text-red-400 text-[10px] uppercase tracking-wider font-bold rounded-bl-xl border-b border-l border-red-500/20 backdrop-blur-md">Bad Practice</div>
        <pre className="text-[11px] md:text-xs font-mono text-white/80 whitespace-pre overflow-x-auto leading-relaxed">
<span className="text-red-400">{'// ❌ Blocks thread on EVERY render'}</span>{'\n'}
<span className="text-purple-400">const</span> <span className="text-blue-300">sortedItems</span> = () <span className="text-purple-400">{'=> '}</span> {'{'}{'\\n'}
{'  '}<span className="text-purple-400">const</span> items = Array.<span className="text-yellow-200">from</span>({'{'}<span className="text-orange-300"> length: 10000 </span>{'}'});{'\n'}
{'  '}<span className="text-purple-400">return</span> items.<span className="text-yellow-200">sort</span>();{'\n'}
{'};'}{'\n'}
{'\n'}
<span className="text-purple-400">const</span> <span className="text-blue-300">result</span> = <span className="text-yellow-200">sortedItems</span>();{'\n'}
        </pre>
      </div>

      <div className="relative flex-1 min-h-[100px] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
        <motion.div
            key={renderCount.current}
            initial={{ opacity: 1, scale: 0.95 }}
            animate={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-red-500/30 pointer-events-none"
        />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 rounded-full border-2 border-red-500/30 border-t-red-500"
          />
          <span className="text-sm font-medium text-white/70">Calculated {result.length} items</span>
        </div>
      </div>
    </div>
  );
}

// --- Expensive Calculation: Good Architecture ---
function GoodExpensiveCalc() {
  const [inputValue, setInputValue] = useState('');
  const [count, setCount] = useState(0);

  // Expensive calculation cached with useMemo
  const result = useMemo(() => {
    let startTime = performance.now();
    while (performance.now() - startTime < 80) {} // Block thread for 80ms to simulate heavy work
    const items = Array.from({ length: 10000 }, () => Math.random());
    return items.sort();
  }, [count]); // Only re-calculates when 'count' changes
  
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div className="flex-1 p-6 lg:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500" />
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm border border-emerald-500/30">✓</span>
            With useMemo
          </h3>
          <p className="text-white/50 text-sm max-w-sm h-10">
            Calculation cached. Unrelated changes stay smooth.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Renders</div>
          <motion.div 
            key={renderCount.current}
            initial={{ color: '#34d399', scale: 1.2 }}
            animate={{ color: '#9ca3af', scale: 1 }}
            className="text-2xl font-mono font-bold"
          >
            {renderCount.current}
          </motion.div>
        </div>
      </div>

      <div className="mb-6 p-5 bg-black/20 rounded-2xl border border-white/5 space-y-4">
        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Unrelated State Change</label>
          <input 
            type="text" 
            placeholder="Type here (buttery smooth!)..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-white/20"
          />
        </div>
        <div>
          <button 
            onClick={() => setCount(c => c + 1)}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all w-full border border-emerald-500/30"
          >
            Trigger Calculation (Count: {count})
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-xl bg-black/40 border border-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] uppercase tracking-wider font-bold rounded-bl-xl border-b border-l border-emerald-500/20 backdrop-blur-md">Optimized</div>
        <pre className="text-[11px] md:text-xs font-mono text-white/80 whitespace-pre overflow-x-auto leading-relaxed">
<span className="text-emerald-400">{'// ✅ Caches result, runs only when count changes'}</span>{'\n'}
<span className="text-purple-400">const</span> <span className="text-blue-300">result</span> = <span className="text-yellow-200">useMemo</span>(() <span className="text-purple-400">{'=> '}</span> {'{'}{'\\n'}
{'  '}<span className="text-purple-400">const</span> items = Array.<span className="text-yellow-200">from</span>({'{'}<span className="text-orange-300"> length: 10000 </span>{'}'});{'\n'}
{'  '}<span className="text-purple-400">return</span> items.<span className="text-yellow-200">sort</span>();{'\n'}
{'}'}, [<span className="text-orange-300">count</span>]);{'\n'}
        </pre>
      </div>

      <div className="relative flex-1 min-h-[100px] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
        <motion.div
            key={count} // Only flashes when the expensive calculation actually runs
            initial={{ opacity: 1, scale: 0.95 }}
            animate={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-emerald-500/30 pointer-events-none"
        />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500"
          />
          <span className="text-sm font-medium text-white/70">Calculated {result.length} items</span>
        </div>
      </div>
    </div>
  );
}

// ─── NEW: Custom Comparison Function Demo ───────────────────────────────────
const PriceBadge = React.memo(
  function PriceBadge({ name, price, category }: { name: string; price: number; category: string }) {
    const renderCount = useRef(0);
    renderCount.current += 1;
    return (
      <div className="relative flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
        <motion.div
          key={renderCount.current}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 bg-violet-500/25 pointer-events-none"
        />
        <div className="relative z-10">
          <p className="text-sm font-semibold text-white/90">{name}</p>
          <p className="text-xs text-white/40">{category}</p>
        </div>
        <div className="relative z-10 text-right">
          <p className="text-lg font-bold text-violet-300 font-mono">${price}</p>
          <p className="text-[10px] text-white/30 font-mono">renders: {renderCount.current}</p>
        </div>
      </div>
    );
  },
  // Custom comparator: only re-render when PRICE changes, ignore name/category changes
  (prev, next) => prev.price === next.price
);

function CustomComparatorDemo() {
  const [tick, setTick] = useState(0);
  const [priceMultiplier, setPriceMultiplier] = useState(1);

  const products = useMemo(() => [
    { name: `Widget Alpha (tick=${tick})`, price: Math.round(29.99 * priceMultiplier), category: 'Electronics' },
    { name: `Widget Beta (tick=${tick})`, price: Math.round(49.99 * priceMultiplier), category: 'Accessories' },
    { name: `Widget Gamma (tick=${tick})`, price: Math.round(19.99 * priceMultiplier), category: 'Gadgets' },
  ], [tick, priceMultiplier]);

  return (
    <div className="p-6 lg:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-500 to-purple-600" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-violet-500/5 blur-[80px] rounded-full pointer-events-none" />

      <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-sm border border-violet-500/30">⚙</span>
        Custom Comparison Function
      </h3>
      <p className="text-white/50 text-sm mb-6 max-w-xl">
        The second argument to <code className="bg-white/10 px-1.5 py-0.5 rounded text-violet-300 font-mono">React.memo</code> lets you define <em>exactly</em> when a child should re-render. 
        Here, the badge only re-renders when <strong className="text-white/80">price</strong> changes — not when name or category change.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Code Panel */}
        <div className="p-4 rounded-xl bg-black/40 border border-violet-500/20 shadow-[inset_0_0_20px_rgba(139,92,246,0.06)] relative overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-1 bg-violet-500/20 text-violet-400 text-[10px] uppercase tracking-wider font-bold rounded-bl-xl border-b border-l border-violet-500/20 backdrop-blur-md">Custom Comparator</div>
          <pre className="text-[11px] md:text-xs font-mono text-white/80 whitespace-pre overflow-x-auto leading-relaxed pt-2">
<span className="text-purple-400">const</span> <span className="text-blue-300">PriceBadge</span> = React.<span className="text-yellow-200">memo</span>({'\n'}
{'  '}<span className="text-purple-400">function</span> <span className="text-blue-300">PriceBadge</span>({'{'} name, price, category {'}'}) {'{'}{'\\n'}
{'    '}<span className="text-white/40">{'// render UI...'}</span>{'\n'}
{'  }'},{'\n'}
{'\n'}
{'  '}<span className="text-white/40">{'// 2nd arg: arePropsEqual comparator'}</span>{'\n'}
{'  '}(prev, next) <span className="text-purple-400">{'=> '}</span>prev.price === next.price{'\n'}
{'  '}<span className="text-white/40">{'// ↑ Only re-render when price changes'}</span>{'\n'}
{'  '}<span className="text-white/40">{'// name / category changes are IGNORED'}</span>{'\n'}
);
          </pre>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 justify-center">
          <div className="p-4 rounded-xl bg-black/30 border border-white/10">
            <p className="text-xs text-white/50 uppercase tracking-wider mb-3">Controls</p>
            <div className="space-y-3">
              <button
                onClick={() => setTick(t => t + 1)}
                className="w-full px-4 py-2.5 text-sm font-medium rounded-lg bg-white/10 text-white/80 hover:bg-white/15 border border-white/10 transition-all"
              >
                Change Name Only (tick: {tick})
                <span className="ml-2 text-xs text-white/40">→ should NOT re-render</span>
              </button>
              <button
                onClick={() => setPriceMultiplier(m => parseFloat((m + 0.5).toFixed(1)))}
                className="w-full px-4 py-2.5 text-sm font-medium rounded-lg bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 border border-violet-500/30 transition-all"
              >
                Change Price (×{priceMultiplier})
                <span className="ml-2 text-xs text-violet-400/60">→ WILL re-render</span>
              </button>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <span className="text-amber-400 mt-0.5 shrink-0">⚠</span>
            <p className="text-xs text-amber-300/80 leading-relaxed">
              <strong>Caution:</strong> a wrong comparator (returning <code className="bg-black/30 px-1 rounded">true</code> when props actually differ) causes stale UI bugs. Use with care.
            </p>
          </div>
        </div>
      </div>

      {/* Live Product List */}
      <div className="space-y-3">
        {products.map((p, i) => (
          <PriceBadge key={i} name={p.name} price={p.price} category={p.category} />
        ))}
      </div>
    </div>
  );
}

// ─── NEW: When NOT to use React.memo ───────────────────────────────────────
function WhenNotToMemo() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const cases = [
    {
      icon: '⚡',
      color: 'amber',
      title: 'Cheap renders',
      subtitle: 'Simple components that render fast',
      detail: 'React.memo runs a comparator function on every render regardless. For a component that just renders a <div> with a string, the memo overhead can actually be more expensive than just re-rendering it.',
      code: `// ❌ Over-memoized — this render is trivially cheap
const Label = React.memo(({ text }) => <span>{text}</span>);

// ✅ Just let it render. It costs almost nothing.
const Label = ({ text }) => <span>{text}</span>;`,
    },
    {
      icon: '🔄',
      color: 'rose',
      title: 'Props always change',
      subtitle: 'Object / array literals passed inline',
      detail: 'If the parent passes a new object or array literal on every render, React.memo\'s shallow comparison always returns false — meaning the child ALWAYS re-renders, but you paid the comparator cost for nothing.',
      code: `// ❌ New object reference every render — memo is useless
<MemoChild config={{ theme: 'dark' }} />

// ✅ Stabilize the prop first
const config = useMemo(() => ({ theme: 'dark' }), []);
<MemoChild config={config} />`,
    },
    {
      icon: '🌳',
      color: 'sky',
      title: 'Parent rarely re-renders',
      subtitle: 'Memoizing root-level or singleton components',
      detail: 'If a parent component only re-renders on genuine state changes (e.g., route transitions), its children re-render infrequently too. Adding React.memo there just bloats the codebase with no measurable gain.',
      code: `// ❌ Unnecessary — parent almost never re-renders
export const AppShell = React.memo(({ children }) => (
  <main>{children}</main>
));

// ✅ Skip memo for components at the top of the tree
export const AppShell = ({ children }) => (
  <main>{children}</main>
);`,
    },
    {
      icon: '📦',
      color: 'purple',
      title: 'Context consumers',
      subtitle: 'Components that subscribe to a context',
      detail: 'React.memo only prevents re-renders caused by parent re-renders. If the component reads from a Context, it will still re-render whenever that Context value changes — memo gives zero benefit for that re-render path.',
      code: `// ❌ memo doesn't help here — context changes still trigger renders
const ThemeIcon = React.memo(() => {
  const { theme } = useContext(ThemeCtx); // re-renders on ctx change anyway
  return <Icon name={theme} />;
});`,
    },
  ];

  const colorMap: Record<string, { border: string; bg: string; text: string; badge: string; badgeText: string; glow: string }> = {
    amber:  { border: 'border-amber-500/20',  bg: 'bg-amber-500/10',  text: 'text-amber-300',  badge: 'bg-amber-500/20',  badgeText: 'text-amber-400',  glow: 'shadow-[inset_0_0_20px_rgba(245,158,11,0.06)]'  },
    rose:   { border: 'border-rose-500/20',   bg: 'bg-rose-500/10',   text: 'text-rose-300',   badge: 'bg-rose-500/20',   badgeText: 'text-rose-400',   glow: 'shadow-[inset_0_0_20px_rgba(244,63,94,0.06)]'   },
    sky:    { border: 'border-sky-500/20',    bg: 'bg-sky-500/10',    text: 'text-sky-300',    badge: 'bg-sky-500/20',    badgeText: 'text-sky-400',    glow: 'shadow-[inset_0_0_20px_rgba(14,165,233,0.06)]'  },
    purple: { border: 'border-purple-500/20', bg: 'bg-purple-500/10', text: 'text-purple-300', badge: 'bg-purple-500/20', badgeText: 'text-purple-400', glow: 'shadow-[inset_0_0_20px_rgba(168,85,247,0.06)]' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-xl relative overflow-hidden shadow-2xl"
    >
      {/* Decorative glow */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🚫</span>
          <h3 className="text-3xl font-bold text-white">When NOT to use <code className="text-amber-300 font-mono">React.memo</code></h3>
        </div>
        <p className="text-white/50 text-base mb-8 max-w-2xl">
          Over-memoization is a real and common performance anti-pattern. Memoization has its own cost — the comparator runs on <em>every</em> render. Blindly wrapping components in <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/70 font-mono">React.memo</code> can <strong className="text-white/70">hurt</strong> performance and adds maintenance burden.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {cases.map((c, i) => {
            const col = colorMap[c.color];
            const isOpen = expanded === i;
            return (
              <motion.div
                key={i}
                layout
                className={`rounded-2xl border ${col.border} ${col.glow} bg-black/20 overflow-hidden cursor-pointer`}
                onClick={() => setExpanded(isOpen ? null : i)}
              >
                <div className={`flex items-start gap-4 p-5`}>
                  <div className={`w-10 h-10 rounded-xl ${col.bg} border ${col.border} flex items-center justify-center text-xl shrink-0 mt-0.5`}>
                    {c.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`font-semibold ${col.text}`}>{c.title}</h4>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        className="text-white/30 text-sm shrink-0"
                      >▼</motion.span>
                    </div>
                    <p className="text-xs text-white/40 mt-0.5">{c.subtitle}</p>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-4">
                        <p className="text-sm text-white/60 leading-relaxed">{c.detail}</p>
                        <div className={`p-4 rounded-xl bg-black/40 border ${col.border}`}>
                          <pre className="text-[11px] md:text-xs font-mono text-white/75 whitespace-pre overflow-x-auto leading-relaxed">{c.code}</pre>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 p-5 rounded-2xl bg-white/5 border border-white/10 flex gap-4 items-start">
          <span className="text-2xl shrink-0">💡</span>
          <div>
            <p className="text-white/80 font-semibold mb-1">Rule of thumb</p>
            <p className="text-white/50 text-sm leading-relaxed">
              Profile first, then memoize. Use the React DevTools Profiler to identify components that are <em>actually</em> causing frame drops, and apply <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/70 font-mono">React.memo</code> surgically. 
              The sweet spot: components with <strong className="text-white/70">expensive renders</strong>, <strong className="text-white/70">stable props</strong>, and <strong className="text-white/70">a parent that re-renders often</strong>.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── NEW: useMemo vs useCallback Comparison ────────────────────────────────
function UseMemoVsUseCallback() {
  const rows = [
    {
      aspect: 'What it caches',
      useMemo: 'A computed VALUE (number, array, object…)',
      useCallback: 'A FUNCTION reference',
    },
    {
      aspect: 'Return type',
      useMemo: 'The result of calling your factory function',
      useCallback: 'The factory function itself (not called)',
    },
    {
      aspect: 'Typical use-case',
      useMemo: 'Expensive derivations — sort, filter, transform',
      useCallback: 'Event handlers passed as props to memo\'d children',
    },
    {
      aspect: 'Equivalent form',
      useMemo: 'useMemo(() => fn, deps)  ←  returns fn()',
      useCallback: 'useCallback(fn, deps)  ←  returns fn',
    },
    {
      aspect: 'Without the hook',
      useMemo: 'Calculation re-runs on every render',
      useCallback: 'New function reference created on every render',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-xl relative overflow-hidden shadow-2xl"
    >
      {/* Decorative glows */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/8 blur-[100px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/8 blur-[80px] rounded-full pointer-events-none -translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">⚖️</span>
          <h3 className="text-3xl font-bold text-white">
            <code className="text-blue-300 font-mono">useMemo</code>{' '}
            <span className="text-white/40 font-normal">vs</span>{' '}
            <code className="text-emerald-300 font-mono">useCallback</code>
          </h3>
        </div>
        <p className="text-white/50 text-base mb-8 max-w-2xl">
          These two hooks are often confused. The mental model is simple: <strong className="text-white/80">useMemo caches a VALUE, useCallback caches a FUNCTION.</strong>
        </p>

        {/* One-liner */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-[inset_0_0_20px_rgba(59,130,246,0.08)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs font-bold">M</span>
              <code className="text-blue-300 font-mono text-sm font-semibold">useMemo</code>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">Runs a factory function and <em>caches its return value</em>. The factory is re-run only when dependencies change.</p>
            <div className="p-3 rounded-xl bg-black/40 border border-blue-500/20">
              <pre className="text-[11px] font-mono text-white/80 leading-relaxed whitespace-pre">
<span className="text-purple-400">const</span> <span className="text-blue-300">total</span> = <span className="text-yellow-200">useMemo</span>(() <span className="text-purple-400">{'=> '}</span>{'\n'}
{'  '}items.<span className="text-yellow-200">reduce</span>((sum, i) <span className="text-purple-400">{'=> '}</span> sum + i.price, 0){'\n'}
, [items]);{'\n'}
<span className="text-white/40">// total is a NUMBER — the computed value</span>
              </pre>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.08)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold">C</span>
              <code className="text-emerald-300 font-mono text-sm font-semibold">useCallback</code>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">Stores the <em>function itself</em> so its reference stays stable across re-renders. Essential for keeping memo'd children from re-rendering.</p>
            <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/20">
              <pre className="text-[11px] font-mono text-white/80 leading-relaxed whitespace-pre">
<span className="text-purple-400">const</span> <span className="text-blue-300">handleAdd</span> = <span className="text-yellow-200">useCallback</span>((id) <span className="text-purple-400">{'=> '}</span>{'\n'}
{'  '}dispatch({'{'} type: <span className="text-orange-300">'ADD'</span>, id {'}'}){'\n'}
, [dispatch]);{'\n'}
<span className="text-white/40">// handleAdd is a FUNCTION — stable reference</span>
              </pre>
            </div>
          </div>
        </div>

        {/* Equivalence note */}
        <div className="mb-8 p-5 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-white/60 text-sm mb-3 font-semibold text-white/80">🔑 Key Equivalence</p>
          <div className="p-4 rounded-xl bg-black/50 border border-white/10">
            <pre className="text-xs md:text-sm font-mono text-white/80 leading-relaxed whitespace-pre overflow-x-auto">
<span className="text-white/40">// These two are identical:</span>{'\n'}
<span className="text-purple-400">const</span> <span className="text-blue-300">fn</span> = <span className="text-yellow-200">useCallback</span>(myFn, deps);{'\n'}
<span className="text-purple-400">const</span> <span className="text-blue-300">fn</span> = <span className="text-yellow-200">useMemo</span>(() <span className="text-purple-400">{'=> '}</span> myFn, deps);  <span className="text-white/40">{'// useMemo returning the fn, not calling it'}</span>
            </pre>
          </div>
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left px-5 py-3 text-white/50 uppercase tracking-wider text-xs font-semibold">Aspect</th>
                <th className="text-left px-5 py-3 text-blue-400 uppercase tracking-wider text-xs font-semibold">useMemo</th>
                <th className="text-left px-5 py-3 text-emerald-400 uppercase tracking-wider text-xs font-semibold">useCallback</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                  <td className="px-5 py-3.5 text-white/40 text-xs font-mono whitespace-nowrap">{row.aspect}</td>
                  <td className="px-5 py-3.5 text-white/70 text-xs">{row.useMemo}</td>
                  <td className="px-5 py-3.5 text-white/70 text-xs">{row.useCallback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

// ─── NEW: High-Priority Interview Q&A ─────────────────────────────────────
function InterviewQA() {
  const [revealed, setRevealed] = useState<number[]>([]);
  const toggle = (i: number) =>
    setRevealed(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const qas = [
    {
      q: 'What is the difference between useMemo and useCallback?',
      tag: 'hooks',
      tagColor: 'blue',
      a: 'useMemo caches a computed VALUE. useCallback caches a FUNCTION reference.',
      detail: (
        <span>
          <code className="bg-black/40 px-1.5 py-0.5 rounded text-blue-300 font-mono">useMemo(() =&gt; computeValue(), deps)</code> — runs the factory and stores its <em>return value</em>.{' '}
          <code className="bg-black/40 px-1.5 py-0.5 rounded text-emerald-300 font-mono">useCallback(fn, deps)</code> — stores the <em>function itself</em> without calling it.{' '}
          They are equivalent: <code className="bg-black/40 px-1.5 py-0.5 rounded text-white/70 font-mono">useCallback(fn, d)</code> ≡ <code className="bg-black/40 px-1.5 py-0.5 rounded text-white/70 font-mono">useMemo(() =&gt; fn, d)</code>.
        </span>
      ),
      emoji: '🧠',
    },
    {
      q: 'Why use React.memo?',
      tag: 'memo',
      tagColor: 'emerald',
      a: 'To prevent child re-renders when the parent re-renders but props have not changed.',
      detail: (
        <span>
          By default, a React component re-renders every time its parent re-renders — even if none of its props changed. Wrapping a component in{' '}
          <code className="bg-black/40 px-1.5 py-0.5 rounded text-emerald-300 font-mono">React.memo</code> makes React perform a shallow comparison of the current and next props. If they are equal, the render phase is skipped entirely. 
          Works best when combined with <code className="bg-black/40 px-1.5 py-0.5 rounded text-blue-300 font-mono">useCallback</code> for function props, since inline callbacks create new references every render.
        </span>
      ),
      emoji: '⚡',
    },
    {
      q: 'When would you NOT use useMemo?',
      tag: 'performance',
      tagColor: 'amber',
      a: 'For cheap computations. Memoization itself has a cost.',
      detail: (
        <span>
          <code className="bg-black/40 px-1.5 py-0.5 rounded text-yellow-300 font-mono">useMemo</code> stores values in memory and runs a dependency comparison on every render. For trivial calculations (e.g., <code className="bg-black/40 px-1.5 py-0.5 rounded text-white/60 font-mono">a + b</code>, string concatenation, toggling a boolean), the memoization overhead can actually be <em>slower</em> than just recomputing. 
          Reserve it for genuinely expensive work: large array transformations, complex derived data, or instantiation-heavy objects.
        </span>
      ),
      emoji: '🚫',
    },
    {
      q: 'What happens if you forget to pass a dependency to useMemo or useCallback?',
      tag: 'gotcha',
      tagColor: 'rose',
      a: 'You get a stale closure — the hook captures the old value and never sees updates.',
      detail: (
        <span>
          If a dependency is missing from the array, the memoized value or function captures a stale snapshot of that variable from the first render. This leads to silent bugs where state or prop updates are silently ignored inside the callback. The ESLint rule{' '}
          <code className="bg-black/40 px-1.5 py-0.5 rounded text-rose-300 font-mono">react-hooks/exhaustive-deps</code> exists specifically to catch this.
        </span>
      ),
      emoji: '🕳️',
    },
    {
      q: 'Can React.memo prevent all re-renders?',
      tag: 'memo',
      tagColor: 'emerald',
      a: 'No. React.memo only prevents parent-triggered re-renders. Context changes and own state changes still cause a re-render.',
      detail: (
        <span>
          <code className="bg-black/40 px-1.5 py-0.5 rounded text-emerald-300 font-mono">React.memo</code> only intercepts re-renders caused by a parent re-rendering with unchanged props. If the component calls{' '}
          <code className="bg-black/40 px-1.5 py-0.5 rounded text-blue-300 font-mono">useState</code>, <code className="bg-black/40 px-1.5 py-0.5 rounded text-blue-300 font-mono">useReducer</code>, or reads from a <code className="bg-black/40 px-1.5 py-0.5 rounded text-blue-300 font-mono">useContext</code>, it will still re-render when those values change — memo has no effect on those paths.
        </span>
      ),
      emoji: '🔍',
    },
  ];

  const colorMap: Record<string, { bg: string; border: string; text: string; badge: string; badgeBorder: string }> = {
    blue:   { bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   text: 'text-blue-300',   badge: 'bg-blue-500/20',   badgeBorder: 'border-blue-500/30'   },
    emerald:{ bg: 'bg-emerald-500/10',border: 'border-emerald-500/30',text: 'text-emerald-300',badge: 'bg-emerald-500/20',badgeBorder: 'border-emerald-500/30'},
    amber:  { bg: 'bg-amber-500/10',  border: 'border-amber-500/30',  text: 'text-amber-300',  badge: 'bg-amber-500/20',  badgeBorder: 'border-amber-500/30'  },
    rose:   { bg: 'bg-rose-500/10',   border: 'border-rose-500/30',   text: 'text-rose-300',   badge: 'bg-rose-500/20',   badgeBorder: 'border-rose-500/30'   },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-xl relative overflow-hidden shadow-2xl"
    >
      {/* Decorative glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/8 blur-[120px] rounded-full pointer-events-none translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🎯</span>
          <h3 className="text-3xl font-bold text-white">High-Priority Interview Q&amp;A</h3>
        </div>
        <p className="text-white/50 text-base mb-8 max-w-2xl">
          The questions most likely to come up in a React performance interview. Click each card to reveal the full answer.
        </p>

        <div className="space-y-4">
          {qas.map((item, i) => {
            const col = colorMap[item.tagColor];
            const isOpen = revealed.includes(i);
            return (
              <motion.div
                key={i}
                layout
                onClick={() => toggle(i)}
                className={`rounded-2xl border border-white/10 bg-black/20 overflow-hidden cursor-pointer hover:border-white/20 transition-colors`}
              >
                {/* Question row */}
                <div className="flex items-start gap-4 p-5">
                  <div className={`w-10 h-10 rounded-xl ${col.bg} border ${col.border} flex items-center justify-center text-xl shrink-0 mt-0.5`}>
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-white/80 font-medium leading-snug">{item.q}</p>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${col.badge} ${col.text} border ${col.badgeBorder}`}>
                          {item.tag}
                        </span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-white/30 text-sm"
                        >▼</motion.span>
                      </div>
                    </div>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-3">
                        {/* Short answer highlight */}
                        <div className={`flex items-start gap-3 p-4 rounded-xl ${col.bg} border ${col.border}`}>
                          <span className="text-white/50 text-xs uppercase tracking-wider font-bold mt-0.5 shrink-0">Answer</span>
                          <p className={`${col.text} font-semibold text-sm leading-relaxed`}>{item.a}</p>
                        </div>
                        {/* Detailed explanation */}
                        <p className="text-white/55 text-sm leading-relaxed pl-1">{item.detail}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Cheat-sheet footer */}
        <div className="mt-8 p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-inner">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white/70 font-mono text-sm uppercase tracking-widest">Quick Cheat Sheet</h4>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
          </div>
          <pre className="text-xs md:text-sm font-mono text-blue-300 overflow-x-auto whitespace-pre leading-loose">
{`// useMemo  → caches a VALUE
const total = useMemo(() => items.reduce(...), [items]);

// useCallback  → caches a FUNCTION
const handleClick = useCallback((id) => dispatch(id), [dispatch]);

// React.memo  → skips render if props are shallow-equal
const Card = React.memo(({ title }) => <div>{title}</div>);

// React.memo + custom comparator  → fine-grained control
const Card = React.memo(Component, (prev, next) => prev.id === next.id);`}
          </pre>
        </div>
      </div>
    </motion.div>
  );
}


// --- Main Module ---
export function MemoModule() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-[#0a0a0a] p-4 sm:p-8 md:p-12 -m-8 rounded-[40px] font-sans text-slate-200">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-12"
      >
        {/* Header Section */}
        <div className="text-center space-y-6 pt-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm font-medium backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Performance Visualizer
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/40 tracking-tight pb-2">
            React.memo, useCallback &amp; useMemo
          </h2>
          <p className="max-w-3xl mx-auto text-white/50 text-lg md:text-xl leading-relaxed">
            See the exact cost of missing memoization. Watch the component tree to see how <span className="text-red-400 font-medium">unnecessary re-renders propagate (Red)</span> vs how <span className="text-emerald-400 font-medium">proper memoization protects performance (Green)</span>.
          </p>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-8 text-sm font-medium">
          <div className="flex items-center gap-3 bg-white/5 px-5 py-2.5 rounded-full border border-white/10 shadow-lg">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
            <span className="text-white/70">Wasted Re-render</span>
          </div>
          <div className="flex items-center gap-3 bg-white/5 px-5 py-2.5 rounded-full border border-white/10 shadow-lg">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
            <span className="text-white/70">Optimized Render</span>
          </div>
        </div>

        {/* React.memo Side-by-Side Visualizer */}
        <div>
          <h3 className="text-2xl font-bold text-white/90 mb-6 text-center">Component Tree Re-renders <span className="text-white/40 text-lg font-normal">(React.memo &amp; useCallback)</span></h3>
          <div className="grid xl:grid-cols-2 gap-8 items-stretch">
            <BadParent />
            <GoodParent />
          </div>
        </div>

        {/* useMemo Side-by-Side Visualizer */}
        <div className="pt-8">
          <h3 className="text-2xl font-bold text-white/90 mb-6 text-center">Expensive Calculations <span className="text-white/40 text-lg font-normal">(useMemo)</span></h3>
          <div className="grid xl:grid-cols-2 gap-8 items-stretch">
            <BadExpensiveCalc />
            <GoodExpensiveCalc />
          </div>
        </div>

        {/* ── NEW: React.memo Custom Comparison Function ── */}
        <div className="pt-4">
          <h3 className="text-2xl font-bold text-white/90 mb-6 text-center">
            Custom Comparator <span className="text-white/40 text-lg font-normal">(React.memo second argument)</span>
          </h3>
          <CustomComparatorDemo />
        </div>

        {/* ── NEW: When NOT to use React.memo ── */}
        <WhenNotToMemo />

        {/* ── NEW: useMemo vs useCallback ── */}
        <UseMemoVsUseCallback />

        {/* What the User Actually Sees */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-xl relative overflow-hidden shadow-2xl"
        >
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
          
          <h3 className="text-3xl font-bold text-white mb-8 relative z-10">What the User Actually Sees</h3>
          
          <div className="grid lg:grid-cols-2 gap-10 relative z-10">
            <div className="space-y-5 bg-black/20 p-8 rounded-2xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                  <span className="text-red-400 text-2xl">🐢</span>
                </div>
                <h4 className="text-xl font-semibold text-white/90">Without Memoization</h4>
              </div>
              <p className="text-white/60 text-base leading-relaxed">
                Try typing quickly in the "Bad Architecture" input. Notice the lag? Every keystroke forces all product cards to run their artificial delays, and recalculates the 10,000 items, blocking the main thread significantly per keystroke.
              </p>
            </div>

            <div className="space-y-5 bg-black/20 p-8 rounded-2xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <span className="text-emerald-400 text-2xl">⚡</span>
                </div>
                <h4 className="text-xl font-semibold text-white/90">With Memoization</h4>
              </div>
              <p className="text-white/60 text-base leading-relaxed">
                In the "Good Architecture", typing is buttery smooth. The parent component updates, but stable callbacks and memoized children bypass the render phase. Expensive calculations are cached with <code className="bg-white/10 px-1 py-0.5 rounded text-white/80">useMemo</code>, causing zero lag.
              </p>
            </div>
          </div>

          <div className="mt-10 p-6 md:p-8 bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-inner relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-white/80 font-mono text-sm uppercase tracking-widest">The Assessment Solution</h4>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
            </div>
            <pre className="text-blue-300 text-sm md:text-base font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`const ProductCard = React.memo(
  (props) => { /* Render UI */ },
  (prev, next) => { /* Custom comparison function */ }
);

// Cache expensive operations to prevent thread blocking
const sortedItems = useMemo(() => {
  return [...items].sort((a, b) => b.price - a.price);
}, [items]); // Only re-sort when items change`}
            </pre>
            <p className="mt-8 text-sm text-white/50 border-t border-white/10 pt-6">
              <strong className="text-white/70">Performance Trade-offs:</strong> <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">React.memo</code> adds overhead because it executes the comparison function. 
              Only memoize components that are expensive to render or re-render extremely often with identical props.
            </p>
          </div>
        </motion.div>

        {/* ── NEW: High-Priority Interview Q&A ── */}
        <InterviewQA />

      </motion.div>
    </div>
  );
}
