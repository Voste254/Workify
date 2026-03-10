import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    accountType: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    skills: "",
    location: "",
    companyName: "",
    companyWebsite: "",
    industry: "",
  });

  const update = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const input = (name: string, placeholder: string, type = "text") => (
    <input
      required
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={update}
      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
    />
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/jobs");
  };

  const progress = (step / 3) * 100;

  return (
    <form onSubmit={submit} className="space-y-6">

      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div
          className="bg-green-600 h-2 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-sm text-center text-gray-500">
        Step {step} of 3
      </p>

      {/* STEP 1 — ACCOUNT TYPE */}
      {step === 1 && (
        <div className="space-y-4">

          <p className="text-center font-medium">
            How will you use Workify?
          </p>

          {[
            {
              id: "jobseeker",
              title: "Job Seeker",
              desc: "Find jobs and apply to opportunities",
            },
            {
              id: "employer",
              title: "Employer",
              desc: "Post jobs and hire candidates",
            },
            {
              id: "both",
              title: "Both",
              desc: "Hire talent and find work",
            },
          ].map((role) => (
            <div
              key={role.id}
              onClick={() => setForm({ ...form, accountType: role.id })}
              className={`cursor-pointer border rounded-xl p-4 transition
              ${
                form.accountType === role.id
                  ? "border-green-600 bg-green-50"
                  : "hover:border-gray-400"
              }`}
            >
              <p className="font-semibold">{role.title}</p>
              <p className="text-sm text-gray-500">{role.desc}</p>
            </div>
          ))}

          <button
            type="button"
            disabled={!form.accountType}
            onClick={next}
            className="w-full bg-green-600 text-white py-3 rounded-lg disabled:opacity-40"
          >
            Continue
          </button>

        </div>
      )}

      {/* STEP 2 — ACCOUNT INFO */}
      {step === 2 && (
        <>
          {input("name", "Full Name")}
          {input("email", "Email Address", "email")}
          {input("password", "Password", "password")}
          {input("confirmPassword", "Confirm Password", "password")}

          <div className="flex justify-between">
            <button type="button" onClick={back} className="text-gray-500">
              Back
            </button>

            <button
              type="button"
              onClick={next}
              className="bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              Continue
            </button>
          </div>
        </>
      )}

      {/* STEP 3 — PROFILE INFO */}
      {step === 3 && (
        <>
          {(form.accountType === "jobseeker" ||
            form.accountType === "both") && (
            <>
              {input("skills", "Your Skills")}
              {input("location", "Location")}
            </>
          )}

          {(form.accountType === "employer" ||
            form.accountType === "both") && (
            <>
              {input("companyName", "Company Name")}
              {input("companyWebsite", "Company Website")}
              {input("industry", "Industry")}
            </>
          )}

          <div className="flex justify-between">
            <button type="button" onClick={back} className="text-gray-500">
              Back
            </button>

            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              Create Account
            </button>
          </div>
        </>
      )}

    </form>
  );
};

export default SignupWizard;