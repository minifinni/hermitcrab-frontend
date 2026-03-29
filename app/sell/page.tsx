import { Upload, DollarSign, TrendingUp } from "lucide-react";

const STEPS = [
  {
    icon: Upload,
    step: "01",
    title: "Upload SKILL.md",
    description:
      "Write your skill in the standard SKILL.md format. Define what your AI does, how it behaves, and any required context. Drop it into the upload form.",
  },
  {
    icon: DollarSign,
    step: "02",
    title: "Set Your Price",
    description:
      "Choose Free, one-time paid, or subscription rental. You set the price. We take a small cut (15%) to keep the lights on. You keep the rest.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Start Earning",
    description:
      "Your skill goes live on the marketplace. Every download or rental = revenue. Track analytics, update your skill, build your creator profile.",
  },
];

export default function SellPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-block mb-6">
          <span
            className="text-[9px] text-amber-400 border border-amber-400 px-3 py-1.5"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            FOR CREATORS
          </span>
        </div>
        <h1
          className="text-lg md:text-2xl text-white leading-relaxed mb-4"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          Publish Your{" "}
          <span className="text-amber-400">Skill</span>
        </h1>
        <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
          Turn your AI expertise into passive income. Build once, sell forever.
          The marketplace for agent skills is just getting started.
        </p>
      </div>

      {/* 3-step explainer */}
      <div className="space-y-4 mb-16">
        {STEPS.map(({ icon: Icon, step, title, description }) => (
          <div
            key={step}
            className="bg-[#161920] border-2 border-[#2a2d35] p-6 flex gap-5 group hover:border-amber-400/40 transition-colors"
            style={{ boxShadow: "2px 2px 0px #000" }}
          >
            {/* Step number */}
            <div className="flex-shrink-0">
              <div
                className="w-12 h-12 border-2 border-amber-400 flex items-center justify-center bg-amber-400/10"
              >
                <Icon size={20} className="text-amber-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="text-[8px] text-amber-400/60"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  {step}
                </span>
                <h3
                  className="text-[11px] text-white"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  {title}
                </h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <div className="relative inline-block group">
          <button
            disabled
            className="text-[10px] bg-[#2a2d35] text-gray-500 px-10 py-4 cursor-not-allowed border-2 border-[#2a2d35]"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              boxShadow: "3px 3px 0px #000",
            }}
            title="Coming soon — creator publishing is in development"
          >
            Get Started
          </button>
          {/* Coming soon tooltip */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span
              className="text-[8px] bg-[#161920] border border-[#2a2d35] text-amber-400 px-2 py-1"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              Coming soon ✦
            </span>
            <div className="w-2 h-2 bg-[#161920] border-r border-b border-[#2a2d35] rotate-45 mx-auto -mt-1" />
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-4">
          Creator publishing launching soon. Drop your email below to get early access.
        </p>

        {/* Email capture */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-[#161920] border-2 border-[#2a2d35] text-sm text-gray-300 px-4 py-2.5 focus:border-amber-400 focus:outline-none placeholder-gray-600"
          />
          <button
            className="text-[9px] bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 transition-all whitespace-nowrap"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              boxShadow: "2px 2px 0px #000",
            }}
          >
            Notify Me
          </button>
        </div>
      </div>

      {/* Social proof */}
      <div className="mt-20 pt-10 border-t border-[#2a2d35] text-center">
        <p
          className="text-[9px] text-gray-600 mb-4"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          89 creators already waiting
        </p>
        <div className="flex justify-center gap-6">
          {[
            ["247", "Skills listed"],
            ["14.3k", "Downloads/week"],
            ["85%", "Avg. 4★+"],
          ].map(([num, label]) => (
            <div key={label} className="text-center">
              <div
                className="text-amber-400 text-sm"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {num}
              </div>
              <div className="text-[9px] text-gray-600 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
