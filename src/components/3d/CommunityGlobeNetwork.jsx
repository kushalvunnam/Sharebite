import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Utensils, HeartHandshake, ShieldCheck, Zap, Navigation, ArrowUpRight } from 'lucide-react';

export const CommunityGlobeNetwork = () => {
  const [activeNode, setActiveNode] = useState(null);

  const nodes = [
    {
      id: "node-1",
      name: "Verde Artisan Osteria",
      type: "Donor (Restaurant)",
      x: 28,
      y: 35,
      meals: "1,420 meals saved",
      status: "Active listing available",
      color: "#84cc16"
    },
    {
      id: "node-2",
      name: "Golden Harvest Bakery",
      type: "Donor (Bakery)",
      x: 72,
      y: 28,
      meals: "3,210 meals saved",
      status: "Pickup in progress",
      color: "#84cc16"
    },
    {
      id: "node-3",
      name: "Terra Organics Grocer",
      type: "Donor (Supermarket)",
      x: 18,
      y: 68,
      meals: "5,640 meals saved",
      status: "Daily surplus logged",
      color: "#84cc16"
    },
    {
      id: "node-4",
      name: "Eastside Hope Food Rescue",
      type: "Recipient NGO",
      x: 52,
      y: 52,
      meals: "12,450 meals distributed",
      status: "Verified 501(c)(3) Hub",
      color: "#f97316"
    },
    {
      id: "node-5",
      name: "Community Breadbasket Hub",
      type: "Recipient Shelter",
      x: 82,
      y: 74,
      meals: "8,900 meals distributed",
      status: "Cold-chain equipped",
      color: "#f97316"
    },
    {
      id: "node-6",
      name: "Metropolis Caterers",
      type: "Donor (Caterer)",
      x: 64,
      y: 84,
      meals: "4,890 meals saved",
      status: "Event surplus ready",
      color: "#84cc16"
    }
  ];

  const connections = [
    { from: nodes[0], to: nodes[3] },
    { from: nodes[1], to: nodes[3] },
    { from: nodes[1], to: nodes[4] },
    { from: nodes[2], to: nodes[3] },
    { from: nodes[5], to: nodes[4] },
    { from: nodes[0], to: nodes[1] },
  ];

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-br from-[#0a231b] via-[#0f392b] to-[#164e3b] text-white p-6 sm:p-10 overflow-hidden shadow-2xl border border-[#84cc16]/20">
      {/* 3D Atmospheric Background Glows and Grid */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#84cc16]/15 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#f97316]/10 rounded-full filter blur-3xl pointer-events-none" />
      
      {/* Perspective grid lines */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #84cc16 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Header Info */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#84cc16]/20 border border-[#84cc16]/30 text-[#a3e635] text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5" /> Live Hyperlocal Redistribution Grid
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Outfit']">
            Autonomous Community Food Network
          </h3>
          <p className="text-white/70 text-sm max-w-xl mt-1">
            Visualizing instant algorithmic pairings between verified food donors and registered charity food distribution centers within a 5km radius.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-[#84cc16]" />
            <span>Surplus Donors</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
            <span>NGO Shelters</span>
          </div>
        </div>
      </div>

      {/* Interactive 3D Canvas / Network Map */}
      <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl bg-black/30 backdrop-blur-sm border border-white/10 overflow-hidden flex items-center justify-center">
        {/* Globe Orbital Rings */}
        <div className="absolute w-[500px] h-[500px] rounded-full border border-white/5 animate-spin-slow pointer-events-none" />
        <div className="absolute w-[360px] h-[360px] rounded-full border border-[#84cc16]/10 animate-spin-slow pointer-events-none" style={{ animationDirection: 'reverse' }} />

        {/* SVG Connection Arcs */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#84cc16" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.8" />
            </linearGradient>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#84cc16" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#84cc16" stopOpacity="0" />
            </radialGradient>
          </defs>

          {connections.map((conn, idx) => (
            <g key={idx}>
              {/* Static faint connection line */}
              <line
                x1={`${conn.from.x}%`}
                y1={`${conn.from.y}%`}
                x2={`${conn.to.x}%`}
                y2={`${conn.to.y}%`}
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              {/* Dynamic glowing pulse line */}
              <motion.line
                x1={`${conn.from.x}%`}
                y1={`${conn.from.y}%`}
                x2={`${conn.to.x}%`}
                y2={`${conn.to.y}%`}
                stroke="url(#arcGrad)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0.2 }}
                animate={{ pathLength: [0, 1, 1], opacity: [0.2, 0.9, 0.2] }}
                transition={{
                  duration: 3 + idx * 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: idx * 0.5
                }}
              />
            </g>
          ))}
        </svg>

        {/* Network Nodes */}
        {nodes.map((node) => {
          const isSelected = activeNode?.id === node.id;
          const isDonor = node.type.includes("Donor");

          return (
            <motion.div
              key={node.id}
              className="absolute cursor-pointer z-20 group"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              whileHover={{ scale: 1.15 }}
              onClick={() => setActiveNode(node)}
            >
              {/* Node radar ripple */}
              <span 
                className="absolute -inset-3 rounded-full opacity-40 animate-ping"
                style={{ backgroundColor: node.color }}
              />

              {/* Node core pill */}
              <div 
                className={`relative flex items-center justify-center p-3 rounded-2xl shadow-xl transition-all border ${
                  isSelected ? 'ring-4 ring-white/50 scale-110' : ''
                }`}
                style={{
                  backgroundColor: isDonor ? '#0f392b' : '#3d1a0d',
                  borderColor: node.color,
                }}
              >
                {isDonor ? (
                  <Utensils className="w-4 h-4 text-[#84cc16]" />
                ) : (
                  <HeartHandshake className="w-4 h-4 text-[#f97316]" />
                )}
              </div>

              {/* Node Label on Hover / Always small */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-white/90 border border-white/10 pointer-events-none transition-opacity group-hover:opacity-100 opacity-80">
                {node.name}
              </div>
            </motion.div>
          );
        })}

        {/* Selected Node Details Floating Overlay */}
        {activeNode && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-white text-[#0f392b] p-4 rounded-2xl shadow-2xl border border-[#84cc16]/30 z-30"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#84cc16] px-2 py-0.5 rounded-full bg-[#0f392b]">
                  {activeNode.type}
                </span>
                <h4 className="font-bold text-base text-[#0f392b] mt-1">
                  {activeNode.name}
                </h4>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveNode(null); }}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-600 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#84cc16]" />
              <span>Status: <strong className="text-gray-900">{activeNode.status}</strong></span>
            </div>
            <div className="mt-1 text-xs text-gray-600 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#f97316]" />
              <span>Lifetime Rescue: <strong className="text-gray-900">{activeNode.meals}</strong></span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Network Bottom Stats Banner */}
      <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-xl sm:text-2xl font-bold text-[#84cc16] font-['Outfit']">2.4 mins</div>
          <div className="text-xs text-white/60">Average Claim Match Time</div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">98.9%</div>
          <div className="text-xs text-white/60">Safe Handoff Success</div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-[#f97316] font-['Outfit']">100% Free</div>
          <div className="text-xs text-white/60">Zero Platform Cut</div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">3.2 km</div>
          <div className="text-xs text-white/60">Avg. Local Pickup Radius</div>
        </div>
      </div>
    </div>
  );
};

export default CommunityGlobeNetwork;
