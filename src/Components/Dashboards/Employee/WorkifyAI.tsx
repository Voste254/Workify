
import { Sparkles, FileText, TrendingUp, Target, CheckCircle2 } from 'lucide-react';

const WorkifyAI = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center">
      
      {/* Introduction Hero */}
      <div className="max-w-3xl w-full text-center mb-12 mt-8">
        <div className="inline-flex items-center justify-center p-4 bg-purple-100 rounded-full mb-6">
          <Sparkles className="w-10 h-10 text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Workify AI</span></h1>
        <p className="text-lg text-slate-600">
          Your intelligent career companion. Draft winning resumes, get personalized career coaching, and land your dream job faster.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-purple-700 bg-purple-100 px-4 py-2 rounded-full w-fit mx-auto">
          <span className="animate-pulse w-2 h-2 bg-purple-600 rounded-full"></span>
          Premium Feature
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mb-16">
        {[
          { icon: FileText, title: "AI Resume Drafting", desc: "Generate tailored resumes instantly based on the specific permanent or casual job you want." },
          { icon: TrendingUp, title: "Career Coaching", desc: "Receive actionable tips to negotiate salaries, prepare for interviews, and grow." },
          { icon: Target, title: "Smart Matching", desc: "Get highly accurate job recommendations analyzing your profile against specific employer needs." }
        ].map((feat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="p-3 bg-slate-100 rounded-xl mb-4 text-slate-700">
              <feat.icon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">{feat.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>

      {/* Pricing / Plan Overlay */}
      <div className="w-full max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Unlock Workify AI Today</h2>
          <p className="text-slate-600 mt-2">Choose the plan that fits your career goals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Basic Plan */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 relative flex flex-col">
            <h3 className="text-xl font-bold text-slate-900">Pro Upgrade</h3>
            <p className="text-slate-500 text-sm mt-2 mb-6">Perfect for active job seekers needing an edge.</p>
            <div className="text-4xl font-bold text-slate-900 mb-6">KES 499 <span className="text-lg font-normal text-slate-500">/mo</span></div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {["5 AI generated Resumes per month", "Basic Cover Letter drafting", "Interview question prep (standard)", "Priority job matching"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 px-4 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors">Select Pro</button>
          </div>

          {/* Elite Plan */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative flex flex-col shadow-xl">
            <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
            <h3 className="text-xl font-bold text-white">Elite Career</h3>
            <p className="text-slate-400 text-sm mt-2 mb-6">Comprehensive AI coaching and limitless generation.</p>
            <div className="text-4xl font-bold text-white mb-6">KES 1,299 <span className="text-lg font-normal text-slate-400">/mo</span></div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {["Unlimited AI Resume/Cover Letters", "1-on-1 AI Career Coaching ChatBot", "Advanced Salary Negotiation scripts", "Guaranteed top-tier visibility to employers", "Unlimited platform bookmarking"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity">Select Elite</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WorkifyAI;
