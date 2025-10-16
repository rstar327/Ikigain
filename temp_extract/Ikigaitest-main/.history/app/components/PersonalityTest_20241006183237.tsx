"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion"; // Import Framer Motion for animations

const colors = {
  primary: "#1D4ED8",  // Dark blue
  secondary: "#6B7280",  // Gray
  background: "#F3F4F6",  // Light gray
  white: "#FFFFFF",
  hover: "#2563EB",  // Lighter blue
};

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

interface Option {
  label: string;
  category: Category;
  subcategory: Subcategory;
}

interface Question {
  question: string;
  options: Option[];
}

const PersonalityTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
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
      SpecializedKnowledge: 0
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
      BusinessEntrepreneurship: 0
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
      SpecializedKnowledge: 0
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
      SocialCauses: 0
    },
  });
  const router = useRouter();

  const questions: Question[] = [
    {
      question: "When you have some free time, you prefer to:",
      options: [
        { label: "Read a book or dive into a documentary", category: 'passion', subcategory: 'IntellectualPursuits' },
        { label: "Go for a run or hit the gym", category: 'passion', subcategory: 'PhysicalActivities' },
        { label: "Finally tackle that DIY project that's been bugging you.", category: 'vocation', subcategory: 'ProblemSolving' },
        { label: "Catch up with friends over coffee", category: 'mission', subcategory: 'InterpersonalSkills' },
      ],
    },
    {
      question: "Your friend is moving to a new place and needs help. You offer to:",
      options: [
        { label: "Organize the packing and transport", category: 'vocation', subcategory: 'Leadership' },
        { label: "Provide help to fix things in the new place", category: 'vocation', subcategory: 'SpecializedKnowledge' },
        { label: "Keep spirits high and make it a fun day", category: 'mission', subcategory: 'CommunityBuilding' },
        { label: "Research how to do it with less cost", category: 'profession', subcategory: 'BusinessEntrepreneurship' },
      ],
    },
    {
      question: "At a social event, you often:",


      options: [
        { label: "Engage in conversations about various topics", category: 'passion', subcategory: 'IntellectualPursuits' },
        { label: "Make the most photos", category: 'passion', subcategory: 'CreativeArts' },
        { label: "Help to organize things", category: 'vocation', subcategory: 'ProblemSolving' },
        { label: "Share interesting stories or jokes to entertain others", category: 'mission', subcategory: 'InterpersonalSkills' },
      ],
    
    },
    {
      question: "When faced with a problem, your first instinct is to:",
      options: [
        { label: "Analyze it logically to find the best solution", category: 'vocation', subcategory: 'ProblemSolving' },
        { label: "Think of a creative way to approach it", category: 'passion', subcategory: 'CreativeArts' },
        { label: "Ask someone you know", category: 'mission', subcategory: 'InterpersonalSkills' },
        { label: "Consider how solving it might help others", category: 'mission', subcategory: 'SocialCauses' },
      ],
    },
    {
      question: "Your coworker asks for advice on improving their workspace. You suggest:",
      options: [
        { label: "Finding a way to make it more functional and organized", category: 'vocation', subcategory: 'SpecializedKnowledge' },
        { label: "Adding creative touches to make it more inspiring", category: 'passion', subcategory: 'CreativeArts' },
        { label: "Setting up a system to boost productivity", category: 'profession', subcategory: 'BusinessEntrepreneurship' },
        { label: "Sharing tips on time management and focus", category: 'mission', subcategory: 'EducationMentorship' },
      ],
    },
    {
      question: "During a job meeting, you often:",
      options: [
        { label: "Lead the discussion to make decisions", category: 'vocation', subcategory: 'Leadership' },
        { label: "Share your tips on any issue", category: 'vocation', subcategory: 'SpecializedKnowledge' },
        { label: "Ensure that everyone has a chance to speak", category: 'mission', subcategory: 'CommunityBuilding' },
        { label: "Propose solutions to any issues that come up", category: 'vocation', subcategory: 'ProblemSolving' },
      ],
    },
    {
      question: "When traveling, you are most excited about:",
      options: [
        { label: "Visiting historical sites and museums", category: 'passion', subcategory: 'IntellectualPursuits' },
        { label: "Exploring nature and hitting your daily step goal", category: 'passion', subcategory: 'PhysicalActivities' },
        { label: "Meeting new people and experiencing the culture", category: 'mission', subcategory: 'InterpersonalSkills' },
        { label: "Capturing new photos", category: 'passion', subcategory: 'CreativeArts' },
      ],
    },
    {
      question: "Your friends describe you as:",
      options: [
        { label: "Business-savvy", category: 'profession', subcategory: 'BusinessEntrepreneurship' },
        { label: "A natural leader", category: 'vocation', subcategory: 'Leadership' },
        { label: "Always active", category: 'passion', subcategory: 'PhysicalActivities' },
        { label: "The go-to for tech help", category: 'vocation', subcategory: 'SpecializedKnowledge' },
      ],
    },
    {
      question: "At work, you're most energized by:",
      options: [
        { label: "Helping a colleague learn something new", category: 'mission', subcategory: 'EducationMentorship' },
        { label: "Organizing a group activity or outing", category: 'passion', subcategory: 'PhysicalActivities' },
        { label: "Figuring out how to overcome challenges", category: 'vocation', subcategory: 'ProblemSolving' },
        { label: "Leading the team to achieve goals", category: 'vocation', subcategory: 'Leadership' },
      ],
    },
    {
      question: "Your favorite type of book or movie is:",
      options: [
        { label: "Documentaries or dramas", category: 'passion', subcategory: 'IntellectualPursuits' },
        { label: "Something that gets your adrenaline going", category: 'passion', subcategory: 'PhysicalActivities' },
        { label: "Heartfelt stories of people's situations", category: 'mission', subcategory: 'SocialCauses' },
        { label: "Biographies of successful people", category: 'profession', subcategory: 'BusinessEntrepreneurship' },
      ],
    },
    {
      question: "When planning for the future, what's on your mind?",
      options: [
        { label: "Finding ways to support someone", category: 'mission', subcategory: 'SocialCauses' },
        { label: "Staying healthy and active long-term", category: 'passion', subcategory: 'PhysicalActivities' },
        { label: "Keeping up with learning and teaching", category: 'mission', subcategory: 'EducationMentorship' },
        { label: "Building strong connections with others", category: 'mission', subcategory: 'CommunityBuilding' },
      ],
    },
    {
      question: "When buying a gift, you tend to:",
      options: [
        { label: "Choose a cool gadget", category: 'vocation', subcategory: 'SpecializedKnowledge' },
        { label: "Pick a group activity", category: 'mission', subcategory: 'CommunityBuilding' },
        { label: "Buy a productivity tool", category: 'profession', subcategory: 'BusinessEntrepreneurship' },
        { label: "Choose something mind-stimulating", category: 'passion', subcategory: 'IntellectualPursuits' },
      ],
    },
    {
      question: "Your dream job involves:",
      options: [
        { label: "Leading a team", category: 'vocation', subcategory: 'Leadership' },
        { label: "Solving technical challenges", category: 'vocation', subcategory: 'SpecializedKnowledge' },
        { label: "Making a difference", category: 'mission', subcategory: 'SocialCauses' },
        { label: "Teaching others", category: 'mission', subcategory: 'EducationMentorship' },
      ],
    },
    {
      question: "At work, you're often asked to:",
      options: [
        { label: "Handle technical tasks", category: 'vocation', subcategory: 'SpecializedKnowledge' },
        { label: "Solve tough problems", category: 'vocation', subcategory: 'ProblemSolving' },
        { label: "Mentor new recruits", category: 'mission', subcategory: 'EducationMentorship' },
        { label: "Help develop strategies", category: 'profession', subcategory: 'BusinessEntrepreneurship' },
      ],
    },
    {
      question: "On a road trip with friends, you're the one who:",
      options: [
        { label: "Decides the route and plans the stops", category: 'vocation', subcategory: 'Leadership' },
        { label: "Handles the navigation", category: 'vocation', subcategory: 'SpecializedKnowledge' },
        { label: "Keeps the conversations going", category: 'mission', subcategory: 'InterpersonalSkills' },
        { label: "Suggests visiting a place that supports a good cause", category: 'mission', subcategory: 'SocialCauses' },
      ],
    },
    {
      question: "When trying out a new hobby, you're drawn to:",
      options: [
        { label: "Something that makes you think deeply", category: 'passion', subcategory: 'IntellectualPursuits' },
        { label: "Something you could eventually turn into a business", category: 'profession', subcategory: 'BusinessEntrepreneurship' },
        { label: "Something that brings people together", category: 'mission', subcategory: 'CommunityBuilding' },
        { label: "Something where you can learn and teach others", category: 'mission', subcategory: 'EducationMentorship' },
      ],
    },
    {
      question: "Your friends would describe you as:",
      options: [
        { label: "Logical and analytical", category: 'vocation', subcategory: 'ProblemSolving' },
        { label: "A great communicator and listener", category: 'mission', subcategory: 'InterpersonalSkills' },
        { label: "Compassionate and understanding", category: 'mission', subcategory: 'InterpersonalSkills' },
        { label: "Someone who brings people together", category: 'mission', subcategory: 'CommunityBuilding' },
      ],
    },
    {
      question: "When cooking something special, you:",
      options: [
        { label: "Look up a recipe with an interesting story", category: 'passion', subcategory: 'IntellectualPursuits' },
        { label: "Use ingredients from a local farmer's market", category: 'mission', subcategory: 'SocialCauses' },
        { label: "Experiment with measurements until you get it just right", category: 'vocation', subcategory: 'ProblemSolving' },
        { label: "Invite friends over to share it with you", category: 'mission', subcategory: 'CommunityBuilding' },
      ],
    },
  ];

  
  const handleSubmit = () => {
    if (selectedOption) {
      const { category, subcategory } = selectedOption;
      setScores((prevScores) => ({
        ...prevScores,
        [category]: {
          ...prevScores[category],
          [subcategory]: prevScores[category][subcategory] + 1,
        },
      }));

      setSelectedOption(null);
      setCurrentQuestion((prev) => prev + 1);

      if (currentQuestion === questions.length - 1) {
        localStorage.setItem("ikigaiScores", JSON.stringify(scores));
        router.push("/results");
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen flex justify-center items-center"
      style={{ backgroundColor: colors.background }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl w-full">

        <p
          className="text-xl mt-6"
          style={{ color: colors.secondary, fontFamily: "Inter, sans-serif" }}
        >
          {questions[currentQuestion]?.question}
        </p>

        <motion.div
          className="grid grid-cols-2 gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {questions[currentQuestion]?.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => setSelectedOption(option)}
              whileTap={{ scale: 0.9 }}
              className={`p-6 border rounded-lg text-lg font-medium transition-transform transform ${
                selectedOption?.label === option.label
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
              style={{
                fontFamily: "Inter, sans-serif",
                backgroundColor:
                  selectedOption?.label === option.label
                    ? colors.primary
                    : colors.white,
                color:
                  selectedOption?.label === option.label
                    ? colors.white
                    : colors.secondary,
              }}
            >
              {option.label}
            </motion.button>
          ))}
        </motion.div>

        <Button
          onClick={handleSubmit}
          disabled={!selectedOption}
          className="w-full mt-8"
          style={{
            backgroundColor: colors.primary,
            color: colors.white,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {currentQuestion < questions.length - 1 ? "Next Question" : "Submit"}
        </Button>

        <div className="mt-6">
          <div className="w-full max-w-md mx-auto space-y-4">
            <motion.div
              className="flex justify-between items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {[...Array(questions.length)].map((_, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-500 ${
                    index < currentQuestion
                      ? "bg-primary scale-100"
                      : index === currentQuestion
                      ? "bg-primary scale-125"
                      : "bg-secondary"
                  }`}
                />
              ))}
            </motion.div>
            <p
              className="text-center text-sm"
              style={{ color: colors.primary, fontFamily: "Inter, sans-serif" }}
            >
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PersonalityTest;