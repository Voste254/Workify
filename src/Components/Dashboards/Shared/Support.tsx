import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Send, 
  CheckCircle2, 
  Info,
  ChevronRight,
  BookOpen
} from "lucide-react";


import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";

export default function Support() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketType, setTicketType] = useState("support");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  
  const faqData = [
    {
      q: "How do I upgrade my account?",
      a: "You can upgrade your account anytime from the Settings > Billing page. We offer various tiers suited to your needs."
    },
    {
      q: "What happens when my job post expires?",
      a: "Expired jobs remain in your 'My Jobs' tab as inactive. You can easily duplicate or renew them at any time."
    },
    {
      q: "How can I contact a candidate?",
      a: "Once a candidate applies, you can message them directly through the 'Messages' tab using our secure platform."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !subject) return;
    
    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from("support_requests")
        .insert([
          {
            user_id: user?.id,
            ticket_type: ticketType,
            subject: subject,
            message: message,
            status: "open",
          },
        ]);

      if (insertError) throw insertError;

      setSubmitted(true);
      setMessage("");
      setSubject("");
    } catch (err: any) {
      console.error("Support submission error:", err);
      setError(err.message || "Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Help & Support</h1>
        <p className="text-gray-500 mt-1.5 text-sm max-w-2xl">
          We're here to help. Reach out to our support team or explore our resources to get the most out of Workify.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Support Form (Left Side, 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="border-b border-gray-100 p-6 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare size={18} className="text-gray-400" />
                Submit a Request
              </h2>
            </div>
            
            <div className="p-6">
              {submitted ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Message Sent!</h3>
                    <p className="text-gray-500 mt-2 max-w-sm">
                      We've received your request. Kindly check your email inbox within 24 hours. Our support team will get back to you as soon as possible.
                    </p>
                  </div>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                      {error}
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Request Type</label>
                      <select 
                        value={ticketType}
                        onChange={(e) => setTicketType(e.target.value)}
                        className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white text-sm"
                      >
                        <option value="support">General Support</option>
                        <option value="feedback">Feature Feedback</option>
                        <option value="bug">Report a Bug</option>
                        <option value="billing">Billing Inquiry</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Subject</label>
                      <input 
                        type="text"
                        placeholder="Brief summary of your request"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Message</label>
                    <textarea 
                      placeholder="Please provide as much detail as possible..."
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Info size={14} />
                      <span>Typically replies within 2-4 hours</span>
                    </div>
                    <button 
                      type="submit"
                      disabled={!message || !subject || loading}
                      className="h-11 px-6 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Submit Request
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Resources & Contact Info (Right Side) */}
        <div className="space-y-6">
          {/* Quick Contact */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Direct Contact</h3>
            <div className="space-y-4">
              <a href="mailto:support@workify.com" className="flex items-start gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Email Us</p>
                  <p className="text-sm text-gray-500">support@workify.com</p>
                </div>
              </a>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Call Us</p>
                  <p className="text-sm text-gray-500">+254 700 123 456</p>
                  <p className="text-xs text-gray-400 mt-0.5">Mon-Fri, 8am-5pm EAT</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQs */}
          <div className="bg-gray-900 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-5 flex items-center gap-2">
              <BookOpen size={16} className="text-green-400" />
              Popular FAQs
            </h3>
            <div className="space-y-5 relative z-10">
              {faqData.map((faq, i) => (
                <div key={i} className="group cursor-pointer">
                  <p className="text-sm font-semibold text-white group-hover:text-green-400 transition mb-1">{faq.q}</p>
                  <p className="text-sm text-gray-400 line-clamp-2">{faq.a}</p>
                </div>
              ))}
            </div>
            <Link to="/faq">
            <button className="mt-6 w-full py-2.5 bg-white/10 hover:bg-white/20 transition rounded-lg text-sm font-medium flex items-center justify-center gap-2">
              Visit Help Center <ChevronRight size={14} />
            </button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
