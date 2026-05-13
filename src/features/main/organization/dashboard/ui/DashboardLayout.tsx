import { useState, useEffect } from "react";
import DashboardInterface from "./DashboardInterface";
import GoalsSection from "../components/GoalsSection";

type SectionType = "analytics" | "goals";

interface Section {
  id: SectionType;
  label: string;
  icon: string;
}

const DASHBOARD_SECTION_KEY = "dashboard_active_section";

export default function DashboardLayout() {
  const [activeSection, setActiveSection] = useState<SectionType>("analytics");

  useEffect(() => {
    const savedSection = localStorage.getItem(DASHBOARD_SECTION_KEY) as SectionType | null;
    if (savedSection && (savedSection === "analytics" || savedSection === "goals")) {
      setActiveSection(savedSection);
    }
  }, []);

  const handleSectionChange = (section: SectionType) => {
    setActiveSection(section);
    localStorage.setItem(DASHBOARD_SECTION_KEY, section);
  };

  const sections: Section[] = [
    { id: "analytics", label: "Overall Analytics", icon: "📊" },
    { id: "goals", label: "Goals", icon: "🎯" },
  ];

  return (
    <div className="w-full min-h-screen bg-athens_gray">
      {/* Mobile Tab Navigation - Only visible on small screens */}
      <div className="lg:hidden sticky top-[86px] z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-4 sm:px-6">
          <div className="flex gap-0">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className={`flex-1 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors relative ${
                  activeSection === section.id
                    ? "text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {section.label}
                {activeSection === section.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Layout - Sidebar + Content */}
      <div className="flex">
        {/* Desktop Sidebar - Only visible on lg and up */}
        <aside className="hidden lg:block w-72 bg-dashboard-sidebar min-h-screen pt-6">
          <div>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className={`w-full text-left px-0 py-4 font-semibold text-base transition-colors flex items-center gap-3 ${
                  activeSection === section.id
                    ? "bg-athens_gray text-slate-900"
                    : "text-slate-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg ml-4">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1">
          {activeSection === "analytics" && <DashboardInterface />}
          {activeSection === "goals" && <GoalsSection />}
        </main>
      </div>
    </div>
  );
}