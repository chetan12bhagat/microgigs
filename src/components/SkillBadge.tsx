import React from 'react';

interface SkillBadgeProps {
  skill: string;
}

const skillLogoMap: Record<string, string> = {
  "react": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "react native": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "swift": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
  "swiftui": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
  "javascript": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  "typescript": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  "kotlin": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
  "figma": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  "firebase": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
  "next.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  "redux": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
  "android sdk": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg",
  "seo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg", // Approximate
  "mailchimp": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mailchimp/mailchimp-original.svg",
  "canva": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg",
};

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill }) => {
  const lowerSkill = skill.toLowerCase();
  const logoUrl = skillLogoMap[lowerSkill];

  return (
    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-md border border-slate-100 shadow-sm transition-all hover:border-[#3b82f6]/30 hover:bg-white">
      {logoUrl ? (
        <img src={logoUrl} alt={skill} className="w-3.5 h-3.5 object-contain" />
      ) : (
        <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]/40" />
      )}
      {skill}
    </span>
  );
};

export default SkillBadge;
