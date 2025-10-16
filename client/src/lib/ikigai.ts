export type Category = "passion" | "vocation" | "mission" | "profession";
export type Subcategory =
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

export interface IkigaiScores {
  passion: number;
  mission: number;
  vocation: number;
  profession: number;
  overall: number;
  primaryType: string;
  secondaryType: string;
  strengths: string[];
  recommendations: {
    description: string;
    careers: string[];
    actions: string[];
  };
  subcategoryScores: Record<Category, Record<Subcategory, number>>;
}

// Phrases for categories
const categoryPhrases: Record<string, string> = {
  passion: "You are driven by your creative and intellectual pursuits, finding joy and purpose in activities that ignite your creativity and curiosity.",
  vocation: "You excel when using your skills to solve problems and take charge of situations, always ready to apply your expertise.",
  mission: "You are driven by a sense of purpose and a desire to make a positive impact on the world through meaningful actions.",
  profession: "Your career is central to your identity, and you thrive in structured environments where tangible achievements define success.",
};

// Phrases for subcategories
const subcategoryPhrases: Record<string, string> = {
  CreativeArts: "your creativity allows you to think outside the box and develop unique solutions.",
  IntellectualPursuits: "you constantly seek knowledge and understanding, pushing intellectual boundaries.",
  PhysicalActivities: "you are energized by physical activity, which keeps you grounded and focused.",
  ProblemSolving: "you excel at analyzing complex problems and devising practical solutions.",
  Leadership: "you take on leadership roles naturally, guiding teams to success.",
  InterpersonalSkills: "your interpersonal skills make you an effective communicator and team player.",
  CommunityBuilding: "you excel at building strong, supportive communities.",
  EducationMentorship: "you have a passion for mentoring and educating others, helping them grow.",
  SocialCauses: "you are deeply committed to advancing social causes and making a positive impact.",
  BusinessEntrepreneurship: "your entrepreneurial mindset enables you to spot opportunities and turn them into success.",
  SpecializedKnowledge: "your expertise in specialized areas sets you apart as a knowledgeable authority.",
};

export function calculateIkigaiScores(answers: Record<string, { category: string; subcategory: string }>): IkigaiScores {
  // Initialize scores
  const subcategoryScores: Record<Category, Record<Subcategory, number>> = {
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
  };

  // Count answers for each category/subcategory
  Object.values(answers).forEach(answer => {
    const category = answer.category as Category;
    const subcategory = answer.subcategory as Subcategory;
    
    if (subcategoryScores[category] && subcategoryScores[category][subcategory] !== undefined) {
      subcategoryScores[category][subcategory]++;
    }
  });

  // Calculate category totals
  const categoryTotals: Record<Category, number> = {
    passion: Object.values(subcategoryScores.passion).reduce((sum, val) => sum + val, 0),
    vocation: Object.values(subcategoryScores.vocation).reduce((sum, val) => sum + val, 0),
    mission: Object.values(subcategoryScores.mission).reduce((sum, val) => sum + val, 0),
    profession: Object.values(subcategoryScores.profession).reduce((sum, val) => sum + val, 0),
  };

  // Determine primary and secondary types
  const sortedCategories = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .map(([category]) => category as Category);

  const primaryType = getPrimaryType(sortedCategories[0]);
  const secondaryType = getPrimaryType(sortedCategories[1]);

  // Calculate overall score as sum of all category totals
  const overall = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

  // Generate strengths and recommendations
  const strengths = generateStrengths(subcategoryScores, sortedCategories[0]);
  const recommendations = generateRecommendations(sortedCategories[0], sortedCategories[1]);

  return {
    passion: categoryTotals.passion,
    mission: categoryTotals.mission,
    vocation: categoryTotals.vocation,
    profession: categoryTotals.profession,
    overall,
    primaryType,
    secondaryType,
    strengths,
    recommendations,
    subcategoryScores,
  };
}

function getPrimaryType(category: Category): string {
  const typeMap: Record<Category, string> = {
    passion: "Creative Enthusiast",
    mission: "Purpose-Driven Leader",
    vocation: "Skilled Expert",
    profession: "Career-Focused Achiever"
  };
  
  return typeMap[category] || "Balanced Individual";
}

function generateStrengths(subcategoryScores: Record<Category, Record<Subcategory, number>>, _dominantCategory: Category): string[] {
  
  // Find top subcategories across all categories
  const topSubcategories: Array<{subcategory: Subcategory, score: number}> = [];
  
  Object.entries(subcategoryScores).forEach(([_category, subcategories]) => {
    Object.entries(subcategories).forEach(([subcategory, score]) => {
      if (score > 0) {
        topSubcategories.push({ subcategory: subcategory as Subcategory, score });
      }
    });
  });
  
  // Sort by score and take top 3
  topSubcategories.sort((a, b) => b.score - a.score);
  
  return topSubcategories.slice(0, 3).map(item => 
    subcategoryPhrases[item.subcategory]?.replace('your ', 'Your ').replace('you ', 'You ') || 
    `Strong in ${item.subcategory.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`
  );
}

function generateRecommendations(primaryCategory: Category, secondaryCategory: Category): {
  description: string;
  careers: string[];
  actions: string[];
} {
  const primaryPhrase = categoryPhrases[primaryCategory];
  const secondaryPhrase = categoryPhrases[secondaryCategory];
  
  const description = `${primaryPhrase} This is complemented by your secondary strength in ${secondaryCategory}, where ${secondaryPhrase.toLowerCase()} This unique combination provides a solid foundation for your personal and professional growth.`;

  const careerMap: Record<Category, string[]> = {
    passion: ["Artist", "Designer", "Writer", "Researcher", "Innovator", "Content Creator"],
    vocation: ["Technical Specialist", "Engineer", "Consultant", "Project Manager", "Analyst", "Expert"],
    mission: ["Social Worker", "Teacher", "Counselor", "Non-profit Leader", "Community Organizer", "Mentor"],
    profession: ["Entrepreneur", "Executive", "Manager", "Business Analyst", "Strategic Planner", "Consultant"]
  };

  const actionMap: Record<Category, string[]> = {
    passion: [
      "Explore creative outlets and artistic pursuits",
      "Engage in continuous learning and intellectual challenges",
      "Seek activities that energize and inspire you"
    ],
    vocation: [
      "Develop and master technical skills in your field",
      "Take on leadership roles and problem-solving challenges",
      "Build expertise in specialized areas"
    ],
    mission: [
      "Volunteer for causes you care about",
      "Mentor others and share your knowledge",
      "Build strong community connections"
    ],
    profession: [
      "Set clear career goals and pursue advancement",
      "Develop business acumen and entrepreneurial skills",
      "Focus on professional development and networking"
    ]
  };

  return {
    description,
    careers: [...careerMap[primaryCategory], ...careerMap[secondaryCategory]].slice(0, 6),
    actions: [...actionMap[primaryCategory], ...actionMap[secondaryCategory]].slice(0, 4)
  };
}

// Helper function to generate a grammatically correct dynamic summary
export function generateDynamicSummary(dominantCategory: string, secondaryCategory: string, subcategories: string[]): string {
  const dominantCategoryPhrases = categoryPhrases[dominantCategory] || "";
  const secondaryCategoryPhrases = categoryPhrases[secondaryCategory] || "";
  const subcategoryPhrasesList = subcategories
    .map(subcategory => subcategoryPhrases[subcategory] || "")
    .filter(phrase => phrase)
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
    ${dominantCategoryPhrases} 
    This is complemented by your secondary strength in ${secondaryCategory.toLowerCase()}, where ${secondaryCategoryPhrases.toLowerCase()} 
    ${subcategorySentence}
    This unique combination of strengths sets you apart and provides a solid foundation for your personal and professional growth. 
    You are encouraged to pursue paths that align with both your ${dominantCategory} and ${secondaryCategory} inclinations, creating a well-rounded approach to life and work
  `;

  // Return a well-formatted summary with proper spacing and corrected grammar
  return summary.trim().replace(/\s+/g, ' ');
}