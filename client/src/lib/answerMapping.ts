// This file maps answer options to their categories and subcategories based on your original test logic

export interface AnswerMapping {
  category: string;
  subcategory: string;
}

// Mapping for each question's answer options based on your original PersonalityTest.tsx
export const answerMappings: Record<number, AnswerMapping[]> = {
  // Question 13: When you have some free time, you prefer to:
  13: [
    { category: 'passion', subcategory: 'IntellectualPursuits' },      // Read a book or dive into a documentary
    { category: 'passion', subcategory: 'PhysicalActivities' },        // Go for a run or hit the gym
    { category: 'vocation', subcategory: 'ProblemSolving' },          // Finally tackle that DIY project
    { category: 'mission', subcategory: 'InterpersonalSkills' },      // Catch up with friends over coffee
  ],
  
  // Question 14: Your friend is moving to a new place and needs help. You offer to:
  14: [
    { category: 'vocation', subcategory: 'Leadership' },              // Organize the packing and transport
    { category: 'vocation', subcategory: 'SpecializedKnowledge' },    // Provide help to fix things in the new place
    { category: 'mission', subcategory: 'CommunityBuilding' },        // Keep spirits high and make it a fun day
    { category: 'profession', subcategory: 'BusinessEntrepreneurship' }, // Research how to do it with less cost
  ],
  
  // Question 15: At a social event, you often:
  15: [
    { category: 'passion', subcategory: 'IntellectualPursuits' },     // Engage in conversations about various topics
    { category: 'passion', subcategory: 'CreativeArts' },             // Make the most photos
    { category: 'vocation', subcategory: 'ProblemSolving' },          // Help to organize things
    { category: 'mission', subcategory: 'InterpersonalSkills' },      // Share interesting stories or jokes
  ],
  
  // Question 16: When faced with a problem, your first instinct is to:
  16: [
    { category: 'vocation', subcategory: 'ProblemSolving' },          // Analyze it logically to find the best solution
    { category: 'passion', subcategory: 'CreativeArts' },             // Think of a creative way to approach it
    { category: 'mission', subcategory: 'InterpersonalSkills' },      // Ask someone you know
    { category: 'mission', subcategory: 'SocialCauses' },             // Consider how solving it might help others
  ],
  
  // Question 17: Your coworker asks for advice on improving their workspace. You suggest:
  17: [
    { category: 'vocation', subcategory: 'SpecializedKnowledge' },    // Finding a way to make it more functional
    { category: 'passion', subcategory: 'CreativeArts' },             // Adding creative touches
    { category: 'profession', subcategory: 'BusinessEntrepreneurship' }, // Setting up a system to boost productivity
    { category: 'mission', subcategory: 'EducationMentorship' },      // Sharing tips on time management
  ],
  
  // Question 18: During a job meeting, you often:
  18: [
    { category: 'vocation', subcategory: 'Leadership' },              // Lead the discussion to make decisions
    { category: 'vocation', subcategory: 'SpecializedKnowledge' },    // Share your tips on any issue
    { category: 'mission', subcategory: 'CommunityBuilding' },        // Ensure everyone has a chance to speak
    { category: 'vocation', subcategory: 'ProblemSolving' },          // Propose solutions to any issues
  ],
  
  // Question 19: When traveling, you are most excited about:
  19: [
    { category: 'passion', subcategory: 'IntellectualPursuits' },     // Visiting historical sites and museums
    { category: 'passion', subcategory: 'PhysicalActivities' },       // Exploring nature and hitting daily step goal
    { category: 'mission', subcategory: 'InterpersonalSkills' },      // Meeting new people and experiencing culture
    { category: 'passion', subcategory: 'CreativeArts' },             // Capturing new photos
  ],
  
  // Question 20: Your friends describe you as:
  20: [
    { category: 'profession', subcategory: 'BusinessEntrepreneurship' }, // Business-savvy
    { category: 'vocation', subcategory: 'Leadership' },              // A natural leader
    { category: 'passion', subcategory: 'PhysicalActivities' },       // Always active
    { category: 'vocation', subcategory: 'SpecializedKnowledge' },    // The go-to for tech help
  ],
  
  // Question 21: At work, you're most energized by:
  21: [
    { category: 'mission', subcategory: 'EducationMentorship' },      // Helping a colleague learn something new
    { category: 'passion', subcategory: 'PhysicalActivities' },       // Organizing a group activity or outing
    { category: 'vocation', subcategory: 'ProblemSolving' },          // Figuring out how to overcome challenges
    { category: 'vocation', subcategory: 'Leadership' },              // Leading the team to achieve goals
  ],
  
  // Question 22: Your favorite type of book or movie is:
  22: [
    { category: 'passion', subcategory: 'IntellectualPursuits' },     // Documentaries or dramas
    { category: 'passion', subcategory: 'PhysicalActivities' },       // Something that gets your adrenaline going
    { category: 'mission', subcategory: 'SocialCauses' },             // Heartfelt stories of people's situations
    { category: 'profession', subcategory: 'BusinessEntrepreneurship' }, // Biographies of successful people
  ],
  
  // Question 23: When planning for the future, what's on your mind?
  23: [
    { category: 'mission', subcategory: 'SocialCauses' },             // Finding ways to support someone
    { category: 'passion', subcategory: 'PhysicalActivities' },       // Staying healthy and active long-term
    { category: 'mission', subcategory: 'EducationMentorship' },      // Keeping up with learning and teaching
    { category: 'mission', subcategory: 'CommunityBuilding' },        // Building strong connections with others
  ],
  
  // Question 24: When buying a gift, you tend to:
  24: [
    { category: 'vocation', subcategory: 'SpecializedKnowledge' },    // Choose a cool gadget
    { category: 'mission', subcategory: 'CommunityBuilding' },        // Pick a group activity
    { category: 'profession', subcategory: 'BusinessEntrepreneurship' }, // Buy a productivity tool
    { category: 'passion', subcategory: 'IntellectualPursuits' },     // Choose something mind-stimulating
  ],
  
  // Question 25: Your dream job involves:
  25: [
    { category: 'vocation', subcategory: 'Leadership' },              // Leading a team
    { category: 'vocation', subcategory: 'SpecializedKnowledge' },    // Solving technical challenges
    { category: 'mission', subcategory: 'SocialCauses' },             // Making a difference
    { category: 'mission', subcategory: 'EducationMentorship' },      // Teaching others
  ],
  
  // Question 26: At work, you're often asked to:
  26: [
    { category: 'vocation', subcategory: 'SpecializedKnowledge' },    // Handle technical tasks
    { category: 'vocation', subcategory: 'ProblemSolving' },          // Solve tough problems
    { category: 'mission', subcategory: 'EducationMentorship' },      // Mentor new recruits
    { category: 'profession', subcategory: 'BusinessEntrepreneurship' }, // Help develop strategies
  ],
  
  // Question 27: On a road trip with friends, you're the one who:
  27: [
    { category: 'vocation', subcategory: 'Leadership' },              // Decides the route and plans the stops
    { category: 'vocation', subcategory: 'SpecializedKnowledge' },    // Handles the navigation
    { category: 'mission', subcategory: 'InterpersonalSkills' },      // Keeps the conversations going
    { category: 'mission', subcategory: 'SocialCauses' },             // Suggests visiting a place that supports good cause
  ],
  
  // Question 28: When trying out a new hobby, you're drawn to:
  28: [
    { category: 'passion', subcategory: 'IntellectualPursuits' },     // Something that makes you think deeply
    { category: 'profession', subcategory: 'BusinessEntrepreneurship' }, // Something you could turn into a business
    { category: 'mission', subcategory: 'CommunityBuilding' },        // Something that brings people together
    { category: 'mission', subcategory: 'EducationMentorship' },      // Something where you can learn and teach others
  ],
  
  // Question 29: Your friends would describe you as:
  29: [
    { category: 'vocation', subcategory: 'ProblemSolving' },          // Logical and analytical
    { category: 'mission', subcategory: 'InterpersonalSkills' },      // A great communicator and listener
    { category: 'mission', subcategory: 'InterpersonalSkills' },      // Compassionate and understanding
    { category: 'mission', subcategory: 'CommunityBuilding' },        // Someone who brings people together
  ],
  
  // Question 30: When cooking something special, you:
  30: [
    { category: 'passion', subcategory: 'IntellectualPursuits' },     // Look up a recipe with an interesting story
    { category: 'mission', subcategory: 'SocialCauses' },             // Use ingredients from a local farmer's market
    { category: 'vocation', subcategory: 'ProblemSolving' },          // Experiment with measurements until you get it right
    { category: 'mission', subcategory: 'CommunityBuilding' },        // Invite friends over to share it with you
  ],
};

// Helper function to get the category/subcategory mapping for a specific question and answer
export function getAnswerMapping(questionId: number, answerIndex: number): AnswerMapping | null {
  const questionMappings = answerMappings[questionId];
  if (!questionMappings || answerIndex >= questionMappings.length) {
    return null;
  }
  return questionMappings[answerIndex];
}