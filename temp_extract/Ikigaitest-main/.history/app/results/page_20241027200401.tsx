"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import dynamic from 'next/dynamic';

const useMediaQuery = dynamic(() => import('react-responsive').then(mod => mod.useMediaQuery), {
  ssr: false
}) as unknown as (query: string) => boolean;

type Category = "passion" | "vocation" | "mission" | "profession";
type Subcategory =
  | "CreativeArts"
  | "IntellectualPursuits"
  | "PhysicalActivities"
  | "ProblemSolving"
  | "Leadership"
  | "InterpersonalSkills"
  | "CommunityBuilding"
  | "EducationMentorship"
  | "SocialCauses"
  | "BusinessEntrepreneurship"
  | "SpecializedKnowledge";

const getIkigaiReport = (category: Category, isSecondary: boolean = false) => {
  const elementType = isSecondary ? "secondary" : "dominant";
  const reports: Record<Category, { title: string; content: string }> = {
    passion: {
      title: "Passion",
      content: `Your ${elementType} Ikigai element is Passion. You thrive when engaging in activities that ignite your creativity and allow you to express yourself.`,
    },
    vocation: {
      title: "Vocation",
      content: `Your ${elementType} Ikigai element is Vocation. You excel in areas where you can apply your skills and expertise to solve problems and achieve mastery.`,
    },
    mission: {
      title: "Mission",
      content: `Your ${elementType} Ikigai element is Mission. You are driven by a sense of purpose and a desire to make a positive impact on the world.`,
    },
    profession: {
      title: "Profession",
      content: `Your ${elementType} Ikigai element is Profession. You are motivated by professional success and the pursuit of tangible goals.`,
    },
  };

  return reports[category];
};

// Phrases for categories
const categoryPhrases: Record<string, string[]> = {
  passion: [
    "You are driven by your creative and intellectual pursuits, finding joy and purpose in activities that ignite your creativity and curiosity."
  ],
  vocation: [
    "You excel when using your skills to solve problems and take charge of situations, always ready to apply your expertise."
  ],
  mission: [
    "You are driven by a sense of purpose and a desire to make a positive impact on the world through meaningful actions."
  ],
  profession: [
    "Your career is central to your identity, and you thrive in structured environments where tangible achievements define success."
  ],
};

// Phrases for subcategories
const subcategoryPhrases: Record<string, string[]> = {
  CreativeArts: [
    "your creativity allows you to think outside the box and develop unique solutions."
  ],
  IntellectualPursuits: [
    "you constantly seek knowledge and understanding, pushing intellectual boundaries."
  ],
  PhysicalActivities: [
    "you are energized by physical activity, which keeps you grounded and focused."
  ],
  ProblemSolving: [
    "you excel at analyzing complex problems and devising practical solutions."
  ],
  Leadership: [
    "you take on leadership roles naturally, guiding teams to success."
  ],
  InterpersonalSkills: [
    "your interpersonal skills make you an effective communicator and team player."
  ],
  CommunityBuilding: [
    "you excel at building strong, supportive communities."
  ],
  EducationMentorship: [
    "you have a passion for mentoring and educating others, helping them grow."
  ],
  SocialCauses: [
    "you are deeply committed to advancing social causes and making a positive impact."
  ],
  BusinessEntrepreneurship: [
    "your entrepreneurial mindset enables you to spot opportunities and turn them into success."
  ],
  SpecializedKnowledge: [
    "your expertise in specialized areas sets you apart as a knowledgeable authority."
  ],
};

// Helper function to generate a grammatically correct dynamic summary
const generateDynamicSummary = (dominantCategory: string, secondaryCategory: string, subcategories: string[]) => {
  const dominantCategoryPhrases = categoryPhrases[dominantCategory] || [];
  const secondaryCategoryPhrases = categoryPhrases[secondaryCategory] || [];
  const subcategoryPhrasesList = subcategories
    .map(subcategory => subcategoryPhrases[subcategory] || [])
    .flat()
    .slice(0, 2); // Limit to 2 key subcategories for brevity

  let subcategorySentence = "";

  // Adjust the sentence structure for smooth transitions
  if (subcategoryPhrasesList.length === 1) {
    subcategorySentence = `In particular, ${subcategoryPhrasesList[0]}`;
  } else if (subcategoryPhrasesList.length > 1) {
    subcategorySentence = `Your skills are particularly evident in how ${subcategoryPhrasesList[0]} Additionally, ${subcategoryPhrasesList[1]}`;
  }

  // Construct the final dynamic summary
  const summary = `
    ${dominantCategoryPhrases[0]} 
    This is complemented by your secondary strength in ${secondaryCategory.toLowerCase()}, where ${secondaryCategoryPhrases[0].toLowerCase()} 
    ${subcategorySentence}
    This unique combination of strengths sets you apart and provides a solid foundation for your personal and professional growth. 
    You are encouraged to pursue paths that align with both your ${dominantCategory} and ${secondaryCategory} inclinations, creating a well-rounded approach to life and work.
  `;

  // Return a well-formatted summary with proper spacing and corrected grammar
  return summary.trim().replace(/\s+/g, ' ');
};


const Card = ({ title, subtitle, value }: { title: string; subtitle: React.ReactNode; value: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-blue-900 p-6 rounded-lg shadow-md"
  >
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <div className="text-blue-200">{subtitle}</div>
    <p className="text-2xl font-bold mt-2 text-blue-100">{value}</p>
  </motion.div>
);

const COLORS = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  // Dynamic font size based on label length
  const fontSize = payload.name.length > 15 ? 13 : 14;

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontSize={fontSize}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
        {`${Math.round(percent * 100)}%`}
      </text>
    </g>
  );
};

const PieChartComponent = ({ data }: { data: { name: string; value: number }[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={onPieEnter}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

const formatSubcategoryLabel = (subcategory: string): string => {
  return subcategory.replace(/([A-Z])/g, ' $1').trim();
};

const ResultsPage = () => {
  const [scores, setScores] = useState<Record<Category, Record<Subcategory, number>>>({
    passion: {
      CreativeArts: 0,
      IntellectualPursuits: 0,
      PhysicalActivities: 0,
      ProblemSolving: 0,
      Leadership: 0,
      InterpersonalSkills: 0,
      CommunityBuilding: 0,
      EducationMentorship: 0,
      SocialCauses: 0,
      BusinessEntrepreneurship: 0,
      SpecializedKnowledge: 0,
    },
    vocation: {
      ProblemSolving: 0,
      Leadership: 0,
      SpecializedKnowledge: 0,
      CreativeArts: 0,
      IntellectualPursuits: 0,
      PhysicalActivities: 0,
      InterpersonalSkills: 0,
      CommunityBuilding: 0,
      EducationMentorship: 0,
      SocialCauses: 0,
      BusinessEntrepreneurship: 0,
    },
    mission: {
      InterpersonalSkills: 0,
      CommunityBuilding: 0,
      EducationMentorship: 0,
      SocialCauses: 0,
      CreativeArts: 0,
      IntellectualPursuits: 0,
      PhysicalActivities: 0,
      ProblemSolving: 0,
      Leadership: 0,
      BusinessEntrepreneurship: 0,
      SpecializedKnowledge: 0,
    },
    profession: {
      BusinessEntrepreneurship: 0,
      SpecializedKnowledge: 0,
      Leadership: 0,
      CreativeArts: 0,
      IntellectualPursuits: 0,
      PhysicalActivities: 0,
      ProblemSolving: 0,
      InterpersonalSkills: 0,
      CommunityBuilding: 0,
      EducationMentorship: 0,
      SocialCauses: 0,
    },
  });

  const [dominantCategory, setDominantCategory] = useState<Category | null>(null);
  const [secondaryCategory, setSecondaryCategory] = useState<Category | null>(null);

  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const storedScores = JSON.parse(localStorage.getItem("ikigaiScores") || "{}") as Record<Category, Record<Subcategory, number>>;
    setScores(storedScores);

    const categoryTotals: Record<Category, number> = {
      passion: 0,
      vocation: 0,
      mission: 0,
      profession: 0,
    };

    for (const category in categoryTotals) {
      categoryTotals[category as Category] = Object.values(storedScores[category as Category]).reduce((acc: number, val: number) => acc + val, 0);
    }

    const sortedCategories = Object.keys(categoryTotals).sort((a, b) => categoryTotals[b as Category] - categoryTotals[a as Category]);
    setDominantCategory(sortedCategories[0] as Category);
    setSecondaryCategory(sortedCategories[1] as Category);
  }, []);

  if (!dominantCategory || !secondaryCategory) return null;

  const dominantReport = getIkigaiReport(dominantCategory);
  const secondaryReport = getIkigaiReport(secondaryCategory, true);

  const mainCategoryData = [
    { name: "Passion", value: scores.passion.CreativeArts + scores.passion.IntellectualPursuits + scores.passion.PhysicalActivities },
    { name: "Vocation", value: scores.vocation.ProblemSolving + scores.vocation.Leadership + scores.vocation.SpecializedKnowledge },
    { name: "Mission", value: scores.mission.InterpersonalSkills + scores.mission.CommunityBuilding + scores.mission.EducationMentorship + scores.mission.SocialCauses },
    { name: "Profession", value: scores.profession.BusinessEntrepreneurship + scores.profession.SpecializedKnowledge + scores.profession.Leadership },
  ];

  const subcategoryData = Object.keys(scores[dominantCategory])
    .filter((subcategory) => scores[dominantCategory][subcategory as Subcategory] > 0)
    .map((subcategory) => ({
      name: formatSubcategoryLabel(subcategory),
      value: scores[dominantCategory][subcategory as Subcategory],
    }));

  // Generate dynamic summary
  const dynamicSummary = generateDynamicSummary(dominantCategory, secondaryCategory, Object.keys(scores[dominantCategory]));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-5xl font-semibold text-blue-800 tracking-wide font-sans">Results Overview</h1>
              <p className="text-blue-500 mt-1 text-xl">A Glimpse into Your Ikigai</p>
            </div>
          </div>

          {/* New Buttons Section */}
          <div className="flex space-x-4 mt-4">
            <motion.a
              href="https://www.ikigain.org/ikigai-self-discovery-cards"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md"
            >
              Buy the E-book
            </motion.a>
            <motion.a
              href="https://www.amazon.com/dp/B0B45WVMG9"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-md"
            >
              Buy the product on Amazon
            </motion.a>
          </div>

          <div className="text-gray-700 text-lg font-semibold bg-blue-50 p-4 rounded-lg space-y-4">
            {dynamicSummary.split('. ').map((sentence, index) => (
              <p key={index}>{sentence.trim()}.</p>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
              title="Dominant Category"
              subtitle={<span className="text-xl font-bold text-white">{dominantReport.title}</span>}
              value={mainCategoryData.find((data) => data.name === dominantReport.title)?.value.toString() || "0"}
            />
            <Card
              title="Secondary Category"
              subtitle={<span className="text-xl font-bold text-white">{secondaryReport.title}</span>}
              value={mainCategoryData.find((data) => data.name === secondaryReport.title)?.value.toString() || "0"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-blue-50 p-6 rounded-lg"
            >
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Main Category Distribution</h3>
              <PieChartComponent data={mainCategoryData} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-blue-50 p-6 rounded-lg"
            >
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Subcategories</h3>
              <PieChartComponent data={subcategoryData} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-900 p-6 rounded-lg mt-6"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Action Plan</h3>
            <ul className="list-disc list-inside text-md text-blue-100 space-y-3">
              <li><strong className="text-blue-200">1-3 Months:</strong> Start by exploring introductory resources and opportunities related to {dominantReport.title}. Engage in small projects or volunteer work that aligns with this element.</li>
              <li><strong className="text-blue-200">3-6 Months:</strong> Seek out more substantial roles or projects that deepen your involvement in both {dominantReport.title} and {secondaryReport.title}. Begin building a network of contacts in these areas.</li>
              <li><strong className="text-blue-200">6-12 Months:</strong> Focus on gaining advanced knowledge or certifications related to {dominantReport.title}. Look for ways to integrate {secondaryReport.title} into your long-term goals.</li>
              <li><strong className="text-blue-200">Beyond 12 Months:</strong> Aim to establish a career or a long-term role that fully aligns with your {dominantReport.title} and {secondaryReport.title}. Consider mentoring others in these areas to further solidify your expertise.</li>
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultsPage;
