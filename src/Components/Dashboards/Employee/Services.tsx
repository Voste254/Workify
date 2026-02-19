import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Service {
  id: number;
  title: string;
  description: string;
  rate: string;
  skills: string[];
  availability: string[];
  location: string;
}

const counties = ["Nairobi", "Mombasa", "Kisumu", "Nakuru"];

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      title: "Data Analyst",
      description: "I help businesses make data driven decisions.",
      rate: "2500",
      skills: ["Excel", "SQL"],
      availability: ["Monday", "Tuesday"],
      location: "Nairobi",
    },
  ]);

  const [newSkill, setNewSkill] = useState("");

  const addService = () => {
    const newService: Service = {
      id: Date.now(),
      title: "",
      description: "",
      rate: "",
      skills: [],
      availability: [],
      location: "Nairobi",
    };
    setServices([...services, newService]);
  };

  const updateService = (id: number, field: string, value: any) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      )
    );
  };

  const deleteService = (id: number) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const toggleDay = (id: number, day: string) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              availability: s.availability.includes(day)
                ? s.availability.filter((d) => d !== day)
                : [...s.availability, day],
            }
          : s
      )
    );
  };

  const addSkill = (id: number) => {
    if (!newSkill) return;

    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, skills: [...s.skills, newSkill] }
          : s
      )
    );

    setNewSkill("");
  };

  return (
    <div className="mt-8">

      {/* Header */}
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold">Services Offered</h3>

        <button
          onClick={addService}
          className="flex items-center gap-2 text-green-600"
        >
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* Services */}
      <div className="space-y-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="border rounded-xl p-5"
          >
            {/* Top */}
            <div className="flex justify-between mb-4">
              <input
                placeholder="Service title"
                value={service.title}
                onChange={(e) =>
                  updateService(
                    service.id,
                    "title",
                    e.target.value
                  )
                }
                className="border p-2 rounded w-full"
              />

              <button
                onClick={() => deleteService(service.id)}
                className="ml-2 text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Description */}
            <textarea
              placeholder="Describe your service"
              value={service.description}
              onChange={(e) =>
                updateService(
                  service.id,
                  "description",
                  e.target.value
                )
              }
              className="border rounded p-2 w-full mb-3"
            />

            {/* Rate + Location */}
            <div className="grid md:grid-cols-2 gap-4 mb-3">
              <input
                placeholder="Daily rate (KES)"
                value={service.rate}
                onChange={(e) =>
                  updateService(
                    service.id,
                    "rate",
                    e.target.value
                  )
                }
                className="border p-2 rounded"
              />

              <select
                value={service.location}
                onChange={(e) =>
                  updateService(
                    service.id,
                    "location",
                    e.target.value
                  )
                }
                className="border p-2 rounded"
              >
                {counties.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Skills */}
            <div className="mb-3">
              <div className="flex gap-2">
                <input
                  placeholder="Add skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="border p-2 rounded flex-1"
                />

                <button
                  onClick={() => addSkill(service.id)}
                  className="bg-green-600 text-white px-4 rounded"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {service.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="flex flex-wrap gap-2">
              {[
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
              ].map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(service.id, day)}
                  className={`px-3 py-1 border rounded ${
                    service.availability.includes(day)
                      ? "bg-green-600 text-white"
                      : ""
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;
