import { useState } from "react";
import { Link } from "react-router-dom";

type Role = "seeker" | "employer";

const STEPS = ["Account", "Role", "Profile", "Confirm"];

const GoogleBtn = () => (
  <button className="w-full flex items-center justify-center gap-3 border border-gray-200 h-11 text-sm font-medium text-gray-700 hover:bg-gray-50 transition mb-6">
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
    Continue with Google
  </button>
);

const Divider = () => (
  <div className="flex items-center gap-3 mb-6">
    <div className="flex-1 h-px bg-gray-200"/>
    <span className="text-xs text-gray-400 font-mono">or</span>
    <div className="flex-1 h-px bg-gray-200"/>
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-1.5">{label}</label>
    {children}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full h-11 border border-gray-200 px-3 text-sm text-gray-900 outline-none focus:border-gray-900 transition placeholder:text-gray-400"/>
);

const Select = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className="w-full h-11 border border-gray-200 px-3 text-sm text-gray-900 outline-none focus:border-gray-900 transition bg-white appearance-none">
    {children}
  </select>
);

const PrimaryBtn = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className="w-full h-11 bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition disabled:opacity-50">{children}</button>
);

function StepBar({ step }: { step: number }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-semibold border-2 transition
              ${i + 1 < step ? "bg-green-600 border-green-600 text-white" : i + 1 === step ? "bg-gray-900 border-gray-900 text-white" : "border-gray-200 text-gray-400"}`}>
              {i + 1 < step ? "✓" : i + 1}
            </div>
            <span className={`text-xs whitespace-nowrap ${i + 1 === step ? "text-gray-900 font-semibold" : "text-gray-400"}`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-1 mb-5 ${i + 1 < step ? "bg-green-600" : "bg-gray-200"}`}/>}
        </div>
      ))}
    </div>
  );
}

export default function Signup() {
  const [step, setStep] = useState(1);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showPw, setShowPw] = useState(false);
  const [pwStrength, setPwStrength] = useState(0);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    fname:"", lname:"", email:"", phone:"", password:"", confirm:"",
    profession:"", location:"", emptype:"", pay:"", bio:"",
    company:"", industry:"", size:"", elocation:"",
    terms: false, marketing: true,
  });

  const set = (k: string, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

  const strength = (pw: string) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };

  const toggleRole = (r: Role) => setRoles(p => p.includes(r) ? p.filter(x => x !== r) : [...p, r]);

  const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      setSkills(p => [...p, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const isSeeker = roles.includes("seeker");
  const isEmployer = roles.includes("employer");

  const step1Valid = form.fname && form.lname && form.email.includes("@") && form.phone && form.password.length >= 8 && form.password === form.confirm;
  const step2Valid = roles.length > 0;
  const step3Valid = isSeeker ? (form.profession && form.location) : (form.company && form.industry);

  const roleCards: { role: Role; icon: string; title: string; desc: string }[] = [
    { role: "seeker", icon: "🔍", title: "Job Seeker", desc: "Find jobs, build profile, track applications" },
    { role: "employer", icon: "🏢", title: "Employer", desc: "Post jobs, find candidates, manage hiring" },
  ];

  if (done) return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-green-600 flex items-center justify-center text-white text-3xl mx-auto mb-6">✓</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account created!</h2>
        <p className="text-sm text-gray-500 mb-8">Welcome to Workify, {form.fname}! Your profile is live and ready.</p>
        <PrimaryBtn >Proceed to Dashboard →</PrimaryBtn>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between bg-gray-950 p-12">
        <div className="text-white text-xl font-bold tracking-tight">Workify</div>
        <div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">Your career<br />starts here.</h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">Join thousands of professionals and casual workers finding the right opportunities every day.</p>
          <div className="mt-10 flex flex-col gap-6">
            {[["3 mins", "Average signup time"], ["Free", "Always free for job seekers"], ["2 roles", "Seeker + employer in one account"]].map(([n, l]) => (
              <div key={l} className="border-l-2 border-gray-700 pl-4">
                <div className="text-2xl font-bold text-white font-mono">{n}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs text-gray-600">© 2025 Workify · Kenya</div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center bg-white p-8 overflow-y-auto">
        <div className="w-full max-w-sm py-8">
          <div className="lg:hidden text-xl font-bold text-gray-900 mb-8">Workify</div>
          <StepBar step={step}/>

          {/* ── Step 1: Account ── */}
          {step === 1 && <>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Create account</h2>
            <p className="text-sm text-gray-500 mb-6">Already have one?
            <Link to='/login'><button  className="text-gray-900 font-semibold hover:underline">Sign in</button></Link> </p>
            <GoogleBtn/><Divider/>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="First name"><Input placeholder="John" value={form.fname} onChange={e => set("fname", e.target.value)}/></Field>
                <Field label="Last name"><Input placeholder="Doe" value={form.lname} onChange={e => set("lname", e.target.value)}/></Field>
              </div>
              <Field label="Email"><Input type="email" placeholder="you@example.com" value={form.email} onChange={e => set("email", e.target.value)}/></Field>
              <Field label="Phone"><Input type="tel" placeholder="+254 7xx xxx xxx" value={form.phone} onChange={e => set("phone", e.target.value)}/></Field>
              <Field label="Password">
                <div className="relative">
                  <Input type={showPw ? "text" : "password"} placeholder="Min. 8 characters" value={form.password} onChange={e => { set("password", e.target.value); setPwStrength(strength(e.target.value)); }}/>
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono">{showPw ? "hide" : "show"}</button>
                </div>
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => <div key={i} className={`flex-1 h-1 transition ${i <= pwStrength ? pwStrength <= 1 ? "bg-red-500" : pwStrength <= 2 ? "bg-amber-400" : "bg-green-500" : "bg-gray-100"}`}/>)}
                    </div>
                    <p className="text-xs mt-1 text-gray-400">{pwStrength <= 1 ? "Weak" : pwStrength <= 2 ? "Medium" : "Strong"}</p>
                  </div>
                )}
              </Field>
              <Field label="Confirm password">
                <div className="relative">
                  <Input type="password" placeholder="Repeat your password" value={form.confirm} onChange={e => set("confirm", e.target.value)}/>
                  {form.confirm && <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono ${form.confirm === form.password ? "text-green-600" : "text-red-500"}`}>{form.confirm === form.password ? "✓" : "✗"}</span>}
                </div>
              </Field>
              <PrimaryBtn onClick={() => step1Valid && setStep(2)} className={`w-full h-11 text-sm font-semibold transition ${step1Valid ? "bg-gray-900 text-white hover:bg-gray-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>Continue →</PrimaryBtn>
            </div>
          </>}

          {/* ── Step 2: Role ── */}
          {step === 2 && <>
            <button onClick={() => setStep(1)} className="text-xs text-gray-400 hover:text-gray-700 mb-4 flex items-center gap-1">← Back</button>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">How will you use Workify?</h2>
            <p className="text-sm text-gray-500 mb-6">Select one or both — you can switch anytime.</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {roleCards.map(({ role, icon, title, desc }) => (
                <div key={role} onClick={() => toggleRole(role)} className={`border-2 p-5 cursor-pointer transition relative ${roles.includes(role) ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}>
                  {roles.includes(role) && <div className="absolute top-2 right-2 w-4 h-4 bg-gray-900 flex items-center justify-center"><svg className="w-2.5 h-2.5" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5"/></svg></div>}
                  <div className="text-2xl mb-3">{icon}</div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">{title}</div>
                  <div className="text-xs text-gray-400 leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
            {isSeeker && isEmployer && <p className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-2.5 mb-4">You'll have a single dashboard to toggle between seeking work and hiring talent — perfect for freelancers and contractors.</p>}
            <PrimaryBtn onClick={() => step2Valid && setStep(3)} className={`w-full h-11 text-sm font-semibold transition ${step2Valid ? "bg-gray-900 text-white hover:bg-gray-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>Continue →</PrimaryBtn>
          </>}

          {/* ── Step 3: Profile ── */}
          {step === 3 && <>
            <button onClick={() => setStep(2)} className="text-xs text-gray-400 hover:text-gray-700 mb-4 flex items-center gap-1">← Back</button>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{isSeeker ? "Your profile" : "Company profile"}</h2>
            <p className="text-sm text-gray-500 mb-6">{isSeeker ? "Tell employers about yourself." : "Tell candidates about your organisation."}</p>
            <div className="space-y-4">
              {isSeeker ? <>
                <Field label="Profession / Service offered"><Input placeholder="e.g. Graphic Designer, Plumber" value={form.profession} onChange={e => set("profession", e.target.value)}/></Field>
                <Field label="Location">
                  <Select value={form.location} onChange={e => set("location", e.target.value)}>
                    <option value="">Select city / county</option>
                    {["Nairobi","Mombasa","Kisumu","Nakuru","Eldoret","Thika","Remote / Flexible"].map(c => <option key={c}>{c}</option>)}
                  </Select>
                </Field>
                <Field label="Employment type preference">
                  <Select value={form.emptype} onChange={e => set("emptype", e.target.value)}>
                    <option value="">Select preference</option>
                    {["Corporate – Permanent","Corporate – Contract","Casual – Daily","Casual – Hourly","Open to all"].map(t => <option key={t}>{t}</option>)}
                  </Select>
                </Field>
                <Field label="Skills (press Enter to add)">
                  <Input placeholder="Type a skill and press Enter" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={addSkill}/>
                  {skills.length > 0 && <div className="flex flex-wrap gap-1.5 mt-2">{skills.map(s => <span key={s} className="flex items-center gap-1 bg-gray-900 text-white text-xs px-2.5 py-1 font-mono">{s}<button onClick={() => setSkills(p => p.filter(x => x !== s))} className="opacity-50 hover:opacity-100">×</button></span>)}</div>}
                </Field>
                <Field label="Expected pay rate"><Input placeholder="e.g. KES 80,000/month" value={form.pay} onChange={e => set("pay", e.target.value)}/></Field>
                <Field label="Brief bio (optional)">
                  <textarea maxLength={200} value={form.bio} onChange={e => set("bio", e.target.value)} placeholder="Describe your experience..." className="w-full border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900 transition placeholder:text-gray-400 resize-none h-20"/>
                  <p className="text-xs text-gray-400 mt-1">{form.bio.length}/200</p>
                </Field>
              </> : <>
                <Field label="Company name"><Input placeholder="e.g. Safaricom PLC" value={form.company} onChange={e => set("company", e.target.value)}/></Field>
                <Field label="Industry">
                  <Select value={form.industry} onChange={e => set("industry", e.target.value)}>
                    <option value="">Select industry</option>
                    {["Technology","Finance & Banking","Telecommunications","Construction","Hospitality","Healthcare","Media & Creative","Logistics","Agriculture","Education","Other"].map(i => <option key={i}>{i}</option>)}
                  </Select>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Company size">
                    <Select value={form.size} onChange={e => set("size", e.target.value)}>
                      <option value="">Select</option>
                      {["1–10","11–50","51–200","201–1,000","1,000+"].map(s => <option key={s}>{s} employees</option>)}
                    </Select>
                  </Field>
                  <Field label="Location">
                    <Select value={form.elocation} onChange={e => set("elocation", e.target.value)}>
                      <option value="">Select</option>
                      {["Nairobi","Mombasa","Kisumu","Nakuru","Nationwide"].map(c => <option key={c}>{c}</option>)}
                    </Select>
                  </Field>
                </div>
              </>}
              <PrimaryBtn onClick={() => step3Valid && setStep(4)} className={`w-full h-11 text-sm font-semibold transition ${step3Valid ? "bg-gray-900 text-white hover:bg-gray-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>Continue →</PrimaryBtn>
            </div>
          </>}

          {/* ── Step 4: Confirm ── */}
          {step === 4 && <>
            <button onClick={() => setStep(3)} className="text-xs text-gray-400 hover:text-gray-700 mb-4 flex items-center gap-1">← Back</button>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Almost done!</h2>
            <p className="text-sm text-gray-500 mb-6">Review your details before creating your account.</p>
            <div className="border border-gray-200 bg-gray-50 p-4 mb-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 font-mono">Summary</p>
              {[
                ["Name", `${form.fname} ${form.lname}`],
                ["Email", form.email],
                ["Phone", form.phone],
                ["Role(s)", roles.map(r => r === "seeker" ? "Job Seeker" : "Employer").join(" + ")],
                ["Profile", isSeeker ? `${form.profession}${form.location ? " · " + form.location : ""}` : `${form.company}${form.industry ? " · " + form.industry : ""}`],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3 text-sm">
                  <span className="text-gray-400 min-w-[72px]">{k}</span>
                  <span className="text-gray-900 font-medium break-all">{v}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3 mb-5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.terms} onChange={e => set("terms", e.target.checked)} className="accent-gray-900 mt-0.5 w-4 h-4 flex-shrink-0"/>
                <span className="text-sm text-gray-600">I agree to the <a href="#" className="text-gray-900 font-semibold underline">Terms of Service</a> and <a href="#" 
                className="text-gray-900 font-semibold underline">Privacy Policy</a></span>
              </label>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.marketing} onChange={e => set("marketing", e.target.checked)} className="accent-gray-900 mt-0.5 w-4 h-4 flex-shrink-0"/>
                <span className="text-sm text-gray-600">Send me job alerts and career insights</span>
              </label>
            </div>
            {!form.terms && <p className="text-xs text-red-500 mb-3">You must agree to the Terms of Service.</p>}
            <PrimaryBtn disabled={!form.terms || submitting} onClick={() => { if (!form.terms) return; setSubmitting(true); setTimeout(() => { setSubmitting(false); setDone(true); }, 1400); }}>
              {submitting ? "Creating account…" : "Create my account →"}
            </PrimaryBtn>
          </>}

        </div>
      </div>
    </div>
  );
}