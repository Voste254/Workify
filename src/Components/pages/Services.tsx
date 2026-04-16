import { Briefcase, Users, FileText, BarChart3, PenTool, Globe } from "lucide-react";

const services = [
  {
    title: "Job Listings",
    description: "Browse thousands of job opportunities tailored to your skills, location, and preferences.",
    icon: Briefcase,
    color: "text-green-500",
    bg: "bg-green-100",
    blob: "clip-path-[polygon(50%_0%,_100%_38%,_82%_100%,_18%_100%,_0%_38%)]"
  },
  {
    title: "Employer Branding",
    description: "Employers can showcase their brand and culture to attract the right candidates.",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-100",
    blob: "clip-path-[polygon(20%_0%,_100%_0%,_80%_100%,_0%_80%)]"
  },
  {
    title: "Resume Builder",
    description: "Candidates can create professional resumes that highlight their experience and skills.",
    icon: FileText,
    color: "text-purple-500",
    bg: "bg-purple-100",
    blob: "clip-path-[polygon(40%_0%,_100%_20%,_80%_100%,_0%_80%)]"
  },
  {
    title: "Analytics Dashboard",
    description: "Employers track job postings, applications, and hiring progress with ease.",
    icon: BarChart3,
    color: "text-orange-500",
    bg: "bg-orange-100",
    blob: "clip-path-[polygon(50%_0%,_100%_50%,_50%_100%,_0%_50%)]"
  },
  {
    title: "Skill Assessments",
    description: "Test and verify candidate skills to ensure the right fit for job opportunities.",
    icon: PenTool,
    color: "text-red-500",
    bg: "bg-red-100",
    blob: "clip-path-[polygon(30%_0%,_100%_30%,_70%_100%,_0%_70%)]"
  },
  {
    title: "Global Reach",
    description: "Connect with employers and candidates worldwide, expanding your opportunities.",
    icon: Globe,
    color: "text-pink-500",
    bg: "bg-pink-100",
    blob: "clip-path-[polygon(25%_0%,_100%_25%,_75%_100%,_0%_75%)]"
  }
];

const Services = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <service.icon className={`h-8 w-8 ${service.color} mb-4`} />
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
