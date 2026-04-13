import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Search, HelpCircle, Briefcase, Users, Shield, CreditCard, Star } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

// ── Data ────────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all",       label: "All Questions",  icon: HelpCircle },
  { id: "general",   label: "General",         icon: Star },
  { id: "jobseeker", label: "Job Seekers",     icon: Users },
  { id: "employer",  label: "Employers",       icon: Briefcase },
  { id: "account",   label: "Account",         icon: Shield },
  { id: "billing",   label: "Billing",         icon: CreditCard },
];

export interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
}

// ── Accordion Item ───────────────────────────────────────────────────────────────
function AccordionItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-300 ${
        isOpen ? "border-green-300 shadow-md shadow-green-50" : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span
          className={`text-base font-semibold pr-4 leading-snug ${
            isOpen ? "text-green-700" : "text-gray-800"
          }`}
        >
          {faq.question}
        </span>
        <span
          className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
            isOpen ? "bg-green-600 rotate-180" : "bg-gray-100"
          }`}
        >
          <ChevronDown
            size={16}
            className={isOpen ? "text-white" : "text-gray-500"}
          />
        </span>
      </button>

      {/* Answer panel */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 pt-1 bg-white border-t border-gray-100">
          <p className="text-gray-600 leading-relaxed text-sm">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────────
export default function FAQ() {
  const [faqs, setFaqs]             = useState<FAQItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [openId, setOpenId]         = useState<number | null>(null);
  const [activeCategory, setActive] = useState("all");
  const [search, setSearch]         = useState("");

  useEffect(() => {
    async function fetchFaqs() {
      try {
        const { data, error } = await supabase
          .from('faqs')
          .select('id, category, question, answer')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
          
        if (error) throw error;
        
        if (data) {
          setFaqs(data);
        }
      } catch (err) {
        console.error("Error fetching FAQs:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchFaqs();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return faqs.filter((f) => {
      const matchCat  = activeCategory === "all" || f.category === activeCategory;
      const matchText = !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
      return matchCat && matchText;
    });
  }, [activeCategory, search, faqs]);

  const toggle = (id: number) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Sticky Navbar spacer ── */}
      <div className="h-[72px]" />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-white overflow-hidden border-b border-gray-100">
        {/* Decorative diagonal shape */}
        <div
          className="absolute inset-0 bg-blue-50 pointer-events-none"
          style={{ clipPath: "polygon(0 0, 55% 0, 35% 100%, 0% 100%)" }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 z-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full mb-5">
              Help Center
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
              Frequently Asked{" "}
              <span className="text-green-600">Questions</span>
            </h1>
            <p className="text-gray-500 max-w-lg text-base leading-relaxed mb-8">
              Everything you need to know about Workify — from posting your first job to
              managing applications and growing your career.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 transition"
            >
              ← Back to Home
            </Link>
          </div>

          {/* Stats strip */}
          <div className="flex-1 z-10 grid grid-cols-2 gap-4 w-full max-w-sm">
            {[
              { value: loading ? "..." : `${faqs.length}+`,  label: "Questions Answered" },
              { value: "5",                label: "Topic Categories" },
              { value: "24/7",             label: "Support Available" },
              { value: "< 2 min",          label: "Avg. Read Time" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-center"
              >
                <p className="text-2xl font-bold text-green-600">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-14">

        {/* Search */}
        <div className="relative mb-10">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search questions…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setActive("all");
              setOpenId(null);
            }}
            className="w-full pl-12 pr-5 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition"
          />
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => {
            const Icon    = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActive(cat.id);
                  setSearch("");
                  setOpenId(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  isActive
                    ? "bg-green-600 text-white border-green-600 shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-600"
                }`}
              >
                <Icon size={14} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* FAQ list */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-green-200 border-t-green-600 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <HelpCircle size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-base font-medium">No questions match your search.</p>
            <p className="text-gray-400 text-sm mt-1">Try different keywords or browse all categories.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((faq) => (
              <AccordionItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => toggle(faq.id)}
              />
            ))}
          </div>
        )}

        {/* Still need help */}
        <div className="mt-16 bg-white border border-gray-200 rounded-3xl p-10 text-center shadow-sm">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50 mb-5">
            <HelpCircle size={24} className="text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-500 text-sm mb-7 max-w-md mx-auto">
            Can't find the answer you're looking for? Our support team is happy to help you out.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:support@workify.co.ke"
              className="px-6 py-3 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Contact Support
            </a>
            <Link
              to="/signup"
              className="px-6 py-3 border border-green-600 text-green-600 text-sm font-semibold rounded-lg hover:bg-green-50 transition"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
