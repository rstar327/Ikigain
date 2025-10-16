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
  questionBackground: "#E5E7EB",  // Light gray for question container
  questionText: "#374151"  // Darker gray for text
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


  const questions: { question: string; options: { label: string; category: string; subcategory: string }[] }[] = [
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

  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowSize.width && windowSize.height) {
      setStars(Array.from({ length: 100 }, (_, i) => generateStar(i, windowSize.width, windowSize.height)));
    }
  }, [windowSize]);

  useEffect(() => {
    const updateStars = () => {
      setStars((prevStars) =>
        prevStars.map((star) => {
          let { x, y, vx, vy } = star;
          x += vx;
          y += vy;
          if (x <= 0 || x >= windowSize.width) vx = -vx;
          if (y <= 0 || y >= windowSize.height) vy = -vy;

          return { ...star, x, y, vx, vy };
        })
      );

      if (Math.random() < 0.02) {
        setShootingStars((prev) => [...prev, generateShootingStar(windowSize.width, windowSize.height)]);
      }

      setShootingStars((prev) => prev.filter((star) => Date.now() - star.id < 1000));

      animationRef.current = requestAnimationFrame(updateStars);
    };
    animationRef.current = requestAnimationFrame(updateStars);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [windowSize]);

  return (
    <div className="min-h-screen bg-blue-900 flex flex-col items-center justify-center overflow-hidden relative">
      {stars.map((star) => (
        <StarComponent key={star.id} star={star} />
      ))}
      {shootingStars.map((star) => (
        <ShootingStarComponent key={star.id} star={star} />
      ))}

      <ProgressBar currentQuestion={currentQuestion} totalQuestions={totalQuestions} />

      <div className="bg-blue-800 bg-opacity-50 backdrop-blur-md rounded-lg p-8 w-full max-w-2xl z-10">
        <h1 className="text-3xl font-bold text-center text-blue-100 mb-8 font-serif">
          {questions[currentQuestion]?.question}  {/* Updated to show the current question */}
        </h1>
        <div className="grid grid-cols-2 gap-4">
          {questions[currentQuestion]?.options.map((option, index) => (
            <button
              key={index}
              className="bg-blue-600 hover:bg-blue-700 text-blue-100 font-medium py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              onClick={() => setSelectedOption(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          disabled={!selectedOption}
          className="w-full mt-8 bg-blue-500 text-white py-2 px-4 rounded-lg transition duration-300 hover:bg-blue-600"
        >
          {currentQuestion < questions.length - 1 ? "Next Question" : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default PersonalityTest;