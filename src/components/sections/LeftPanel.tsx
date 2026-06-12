"use client";

import { useState } from "react";

import HudButton from "@/components/hud/HudButton";
import AboutCardFrame from "./about-card/AboutCardFrame";
import ExperienceCard from "./about-card/ExperienceCard";
import InfoCard from "./about-card/InfoCard";
import {
  type AboutCardVariant,
  type InfoCardVariant,
} from "./about-card/aboutCardData";
import SkillsPanel from "./SkillsPanel";

type LeftPanelTab = {
  id: AboutCardVariant;
  label: string;
};

const tabs: LeftPanelTab[] = [
  { id: "about", label: "About me" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
];

function isInfoCardVariant(tab: AboutCardVariant): tab is InfoCardVariant {
  return tab === "about" || tab === "education";
}

export default function LeftPanel() {
  const [activeTab, setActiveTab] = useState<AboutCardVariant>("about");
  const [switchTick, setSwitchTick] = useState(0);

  function handleChangeTab(tab: AboutCardVariant) {
    if (tab === activeTab) return;

    setActiveTab(tab);
    setSwitchTick((current) => current + 1);
  }

  return (
    <aside className="relative z-30 flex h-full w-[500px] shrink-0 flex-col gap-4 overflow-visible">
      <div className="relative z-40 flex shrink-0 gap-4 overflow-visible">
        {tabs.map((tab) => (
          <HudButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => handleChangeTab(tab.id)}
          >
            {tab.label}
          </HudButton>
        ))}
      </div>

      <div className="relative z-30 h-[326px] w-[500px] shrink-0 overflow-visible">
        <AboutCardFrame
          key={`about-card-frame-${activeTab}-${switchTick}`}
          scrollKey={`${activeTab}-${switchTick}`}
          className="ep-about-card-frame-switch"
        >
          {activeTab === "experience" ? (
            <ExperienceCard />
          ) : isInfoCardVariant(activeTab) ? (
            <InfoCard variant={activeTab} />
          ) : null}
        </AboutCardFrame>
      </div>

      <div className="relative z-10 min-h-0 flex-1 overflow-visible">
        <SkillsPanel />
      </div>
    </aside>
  );
}
