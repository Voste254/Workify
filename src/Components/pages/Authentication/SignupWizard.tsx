import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpUser, checkEmailExists, type Role, type SignupFormData } from "../../../services/authService";

const STEPS = ["Account", "Role", "Profile", "Confirm"];

const Field = ({ label, error, children, success }: { label: string; error?: string | false; children: React.ReactNode; success?: boolean }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-1.5">{label}</label>
    <div className="relative">
      {children}
      {success && !error && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-xs font-bold">✓</span>}
      {error && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-xs font-bold">✗</span>}
    </div>
    {error && <p className="text-xs text-red-500 mt-1.5 animate-pulse font-medium">{error}</p>}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full h-11 border border-gray-200 px-3 text-sm text-gray-900 outline-none focus:border-gray-900 transition placeholder:text-gray-400" />
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
          {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-1 mb-5 ${i + 1 < step ? "bg-green-600" : "bg-gray-200"}`} />}
        </div>
      ))}
    </div>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showPw, setShowPw] = useState(false);
  const [done, setDone] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [attemptedSteps, setAttemptedSteps] = useState({ 1: false, 2: false, 3: false });
  const [emailTaken, setEmailTaken] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const [form, setForm] = useState<SignupFormData & { confirm: string }>({
    fname: "", lname: "", email: "", phone: "", password: "", confirm: "",
    profession: "", location: "", emptype: "", bio: "",
    company: "", industry: "", size: "", elocation: "",
    terms: false, marketing: true,
  });

  const set = (k: string, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

  const toggleRole = (r: Role) => setRoles(p => p.includes(r) ? p.filter(x => x !== r) : [...p, r]);

  const isSeeker = roles.includes("seeker");
  const isEmployer = roles.includes("employer");

  // Real-time Email Check
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (isValidEmail(form.email)) {
        setCheckingEmail(true);
        const exists = await checkEmailExists(form.email);
        setEmailTaken(exists);
        setCheckingEmail(false);
      } else {
        setEmailTaken(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [form.email]);

  // ----- Validation helpers -----
  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    return re.test(email);
  };

  const getDigitsCount = (str: string) => (str.match(/\d/g) || []).length;
  const isValidPhone = (phone: string) => {
    const digitCount = getDigitsCount(phone);
    return digitCount >= 10 && digitCount <= 13;
  };

  const hasDigits = (str: string) => /\d/.test(str);

  // ----- Step validity -----
  const pwValid = form.password.length >= 8 && /[A-Z]/.test(form.password) && /[a-z]/.test(form.password) && /[0-9]/.test(form.password) && /[^A-Za-z0-9]/.test(form.password);
  const step1Valid = form.fname && form.lname && isValidEmail(form.email) && !emailTaken && isValidPhone(form.phone) && pwValid && form.password === form.confirm;
  const step2Valid = roles.length > 0;
  const step3Valid = (!isSeeker || (form.profession && form.location && !hasDigits(form.profession) && !hasDigits(form.location))) &&
    (!isEmployer || (form.company && form.industry && form.elocation && !hasDigits(form.elocation)));

  const roleCards: { role: Role; icon: string; title: string; desc: string }[] = [
    { role: "seeker", icon: "🔍", title: "Job Seeker", desc: "Find jobs, build profile, track applications" },
    { role: "employer", icon: "🏢", title: "Employer", desc: "Post jobs, find candidates, manage hiring" },
  ];

  if (done) return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-green-600 flex items-center justify-center text-white text-3xl mx-auto mb-6">✓</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account created!</h2>
        {needsConfirmation ? (
          <>
            <p className="text-sm text-gray-500 mb-2">Welcome, {form.fname}! We've sent a confirmation link to <strong>{form.email}</strong>.</p>
            <p className="text-sm text-gray-400 mb-8">Please check your inbox and confirm your email before signing in.</p>
            <Link to='/login'><PrimaryBtn>Go to Login →</PrimaryBtn></Link>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-8">Welcome to Workify, {form.fname}! Your profile is live and ready.</p>
            <PrimaryBtn onClick={() => navigate(roles.includes("employer") && !roles.includes("seeker") ? "/EmployerDashboard" : "/dashboard")}>Proceed to Dashboard →</PrimaryBtn>
          </>
        )}
      </div>
    </div>
  );

  const handleSignup = async () => {
    if (!form.terms) return;
    setSubmitting(true);
    setAuthError("");

    const result = await signUpUser({ form, roles });

    if (result.error) {
      setAuthError(result.error);
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setNeedsConfirmation(result.needsConfirmation ?? false);
    setDone(true);
  };

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
          <StepBar step={step} />

          {/* ── Step 1: Account ── */}
          {step === 1 && <>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Create account</h2>
            <p className="text-sm text-gray-500 mb-6">Already have one?
              <Link to='/login'><button className="text-gray-900 font-semibold hover:underline">Sign in</button></Link> </p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="First name" error={attemptedSteps[1] && !form.fname && "Required"} success={!!form.fname}>
                  <Input placeholder="John" value={form.fname} onChange={e => set("fname", e.target.value.replace(/[^a-zA-Z\s-]/g, ""))} />
                </Field>
                <Field label="Last name" error={attemptedSteps[1] && !form.lname && "Required"} success={!!form.lname}>
                  <Input placeholder="Doe" value={form.lname} onChange={e => set("lname", e.target.value.replace(/[^a-zA-Z\s-]/g, ""))} />
                </Field>
              </div>

              <Field
                label="Email"
                error={(form.email && !isValidEmail(form.email)) ? "Invalid email format" : (emailTaken ? "This email is already in use" : (attemptedSteps[1] && !form.email && "Required"))}
                success={isValidEmail(form.email) && !emailTaken && !checkingEmail}
              >
                <Input type="email" placeholder="you@example.com" value={form.email} onChange={e => set("email", e.target.value)} />
                {checkingEmail && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />}
              </Field>

              <Field
                label="Phone"
                error={(form.phone && !isValidPhone(form.phone)) ? "Phone must contain 10–13 digits" : (attemptedSteps[1] && !form.phone && "Required")}
                success={isValidPhone(form.phone)}
              >
                <Input type="tel" placeholder="+254 7xx xxx xxx" value={form.phone} onChange={e => set("phone", e.target.value.replace(/[^0-9+\s-]/g, ""))} />
              </Field>
              <Field label="Password" error={attemptedSteps[1] && !pwValid && "Password must meet all rules below"}>
                <div className="relative">
                  <Input type={showPw ? "text" : "password"} placeholder="Min. 8 characters" value={form.password} onChange={e => set("password", e.target.value)} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono">{showPw ? "hide" : "show"}</button>
                </div>
                {form.password && (() => {
                  const pw = form.password;
                  const rules = [
                    { label: "At least 8 characters", met: pw.length >= 8 },
                    { label: "One uppercase letter (A–Z)", met: /[A-Z]/.test(pw) },
                    { label: "One lowercase letter (a–z)", met: /[a-z]/.test(pw) },
                    { label: "One number (0–9)", met: /[0-9]/.test(pw) },
                    { label: "One special character (!@#…)", met: /[^A-Za-z0-9]/.test(pw) },
                  ];
                  return (
                    <div className="mt-3 space-y-1.5">
                      {rules.map(({ label, met }) => (
                        <div key={label} className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${met ? "bg-green-500 border-green-500" : "border-gray-300 bg-white"}`}>
                            {met && (
                              <svg className="w-2 h-2" viewBox="0 0 10 8" fill="none">
                                <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-xs transition-colors duration-200 ${met ? "text-green-600 font-medium" : "text-gray-400"}`}>{label}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </Field>
              <Field label="Confirm password" error={attemptedSteps[1] && form.password !== form.confirm && "Passwords must match"}>
                <div className="relative">
                  <Input type="password" placeholder="Repeat your password" value={form.confirm} onChange={e => set("confirm", e.target.value)} />
                  {form.confirm && <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono ${form.confirm === form.password ? "text-green-600" : "text-red-500"}`}>{form.confirm === form.password ? "✓" : "✗"}</span>}
                </div>
              </Field>
              <PrimaryBtn onClick={() => { setAttemptedSteps(p => ({ ...p, 1: true })); if (step1Valid) setStep(2); }} className="w-full h-11 text-sm font-semibold transition bg-gray-900 text-white hover:bg-gray-700">Continue →</PrimaryBtn>
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
                  {roles.includes(role) && <div className="absolute top-2 right-2 w-4 h-4 bg-gray-900 flex items-center justify-center"><svg className="w-2.5 h-2.5" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" /></svg></div>}
                  <div className="text-2xl mb-3">{icon}</div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">{title}</div>
                  <div className="text-xs text-gray-400 leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
            {isSeeker && isEmployer && <p className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-2.5 mb-4">You'll have a single dashboard to toggle between seeking work and hiring talent — perfect for freelancers and contractors.</p>}
            {attemptedSteps[2] && !step2Valid && <p className="text-xs text-red-500 mb-4">Please select at least one role to continue.</p>}
            <PrimaryBtn onClick={() => { setAttemptedSteps(p => ({ ...p, 2: true })); if (step2Valid) setStep(3); }} className="w-full h-11 text-sm font-semibold transition bg-gray-900 text-white hover:bg-gray-700">Continue →</PrimaryBtn>
          </>}

          {/* ── Step 3: Profile ── */}
          {step === 3 && <>
            <button onClick={() => setStep(2)} className="text-xs text-gray-400 hover:text-gray-700 mb-4 flex items-center gap-1">← Back</button>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{isSeeker && isEmployer ? "Your profiles" : isSeeker ? "Your profile" : "Company profile"}</h2>
            <p className="text-sm text-gray-500 mb-6">{isSeeker && isEmployer ? "Tell us about yourself and your organization." : isSeeker ? "Tell employers about yourself." : "Tell candidates about your organisation."}</p>
            <div className="space-y-4">
              {isSeeker && <>
                {isEmployer && <div className="text-xs font-semibold text-gray-900 uppercase tracking-widest border-b pb-2 mb-4">Job Seeker Profile</div>}
                <Field label="Profession / Service offered" error={(form.profession && hasDigits(form.profession)) ? "Should not contain digits" : (attemptedSteps[3] && !form.profession && "Required")} success={!!form.profession && !hasDigits(form.profession)}>
                  <Input placeholder="e.g. Graphic Designer, Plumber" value={form.profession} onChange={e => set("profession", e.target.value.replace(/\d/g, ''))} />
                </Field>
                <Field label="Location" error={(form.location && hasDigits(form.location)) ? "Should not contain digits" : (attemptedSteps[3] && !form.location && "Required")} success={!!form.location && !hasDigits(form.location)}>
                  <Input placeholder="e.g. Nairobi, Kenya or remote" value={form.location} onChange={e => set("location", e.target.value.replace(/\d/g, ''))} />
                </Field>
                <Field label="Employment type preference" success={!!form.emptype}>
                  <Select value={form.emptype} onChange={e => set("emptype", e.target.value)}>
                    <option value="">Select preference</option>
                    {["Corporate – Permanent", "Corporate – Contract", "Casual – Daily", "Casual – Hourly", "Open to all"].map(t => <option key={t}>{t}</option>)}
                  </Select>
                </Field>
                <Field label="Brief bio (optional)" success={!!form.bio}>
                  <textarea maxLength={200} value={form.bio} onChange={e => set("bio", e.target.value)} placeholder="Describe your experience..." className="w-full border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900 transition placeholder:text-gray-400 resize-none h-20" />
                  <p className="text-xs text-gray-400 mt-1">{form.bio.length}/200</p>
                </Field>
              </>}
              {isEmployer && <>
                {isSeeker && <div className="text-xs font-semibold text-gray-900 uppercase tracking-widest border-b pb-2 mb-4 mt-8">Company Profile</div>}
                <Field label="Company name" error={attemptedSteps[3] && !form.company && "Required"} success={!!form.company}>
                  <Input placeholder="e.g. Safaricom PLC" value={form.company} onChange={e => set("company", e.target.value)} />
                </Field>
                <Field label="Industry" error={attemptedSteps[3] && !form.industry && "Required"} success={!!form.industry}>
                  <Select value={form.industry} onChange={e => set("industry", e.target.value)}>
                    <option value="">Select industry</option>
                    {["Technology", "Finance & Banking", "Telecommunications", "Construction", "Hospitality", "Healthcare", "Media & Creative", "Logistics", "Agriculture", "Education", "Other"].map(i => <option key={i}>{i}</option>)}
                  </Select>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Company size" success={!!form.size}>
                    <Select value={form.size} onChange={e => set("size", e.target.value)}>
                      <option value="">Select</option>
                      {["1–10", "11–50", "51–200", "201–1,000", "1,000+"].map(s => <option key={s}>{s} employees</option>)}
                    </Select>
                  </Field>
                  <Field label="Location" error={(form.elocation && hasDigits(form.elocation)) ? "Should not contain digits" : (attemptedSteps[3] && !form.elocation && "Required")} success={!!form.elocation && !hasDigits(form.elocation)}>
                    <Input placeholder="e.g. Nairobi, Kenya or remote" value={form.elocation} onChange={e => set("elocation", e.target.value.replace(/\d/g, ''))} />
                  </Field>
                </div>
              </>}
              <PrimaryBtn onClick={() => { setAttemptedSteps(p => ({ ...p, 3: true })); if (step3Valid) setStep(4); }} className="w-full h-11 text-sm font-semibold transition bg-gray-900 text-white hover:bg-gray-700 mt-6">Continue →</PrimaryBtn>
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
                <input type="checkbox" checked={form.terms} onChange={e => set("terms", e.target.checked)} className="accent-gray-900 mt-0.5 w-4 h-4 flex-shrink-0" />
                <span className="text-sm text-gray-600">I agree to the <a href="#" className="text-gray-900 font-semibold underline">Terms of Service</a> and <a href="#" className="text-gray-900 font-semibold underline">Privacy Policy</a></span>
              </label>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.marketing} onChange={e => set("marketing", e.target.checked)} className="accent-gray-900 mt-0.5 w-4 h-4 flex-shrink-0" />
                <span className="text-sm text-gray-600">Send me job alerts and career insights</span>
              </label>
            </div>
            {!form.terms && <p className="text-xs text-red-500 mb-3">You must agree to the Terms of Service.</p>}
            {authError && <p className="text-xs text-red-500 mb-3">{authError}</p>}
            <PrimaryBtn
              disabled={!form.terms || submitting}
              onClick={handleSignup}
            >
              {submitting ? "Creating account…" : "Create my account →"}
            </PrimaryBtn>
          </>}
        </div>
      </div>
    </div>
  );
}