import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  Target, 
  Users, 
  Building,
  Compass,
  Clock,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();

// Map primary types to URL paths
const getTypeUrlPath = (primaryType: string) => {
  const typeMap: Record<string, string> = {
    "dreamer": "dreamer",
    "achiever": "achiever", 
    "helper": "helper",
    "explorer": "explorer",
    "builder": "builder"
  };
  return typeMap[primaryType] || primaryType;
};

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    scores: {
      dreamer: number;
      achiever: number;
      helper: number;
      explorer: number;
      builder: number;
    };
  }[];
}

const typeQuestions: Question[] = [
  {
    id: 1,
    question: "When you're starting something new, what's most important to you?",
    options: [
      {
        text: "That it aligns with a bigger vision or purpose",
        scores: { dreamer: 1, achiever: 0, helper: 0, explorer: 0, builder: 0 }
      },
      {
        text: "That it leads to measurable results",
        scores: { dreamer: 0, achiever: 1, helper: 0, explorer: 0, builder: 0 }
      },
      {
        text: "That it helps others in some way",
        scores: { dreamer: 0, achiever: 0, helper: 1, explorer: 0, builder: 0 }
      },
      {
        text: "That it's exciting or unfamiliar",
        scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 1, builder: 0 }
      },
      {
        text: "That it's structured and sustainable",
        scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 0, builder: 1 }
      }
    ]
  },
  {
    id: 2,
    question: "Which compliment would make you the happiest?",
    options: [
      {
        text: "You always know how to support others",
        scores: { dreamer: 0, achiever: 0, helper: 1, explorer: 0, builder: 0 }
      },
      {
        text: "You get things done like no one else",
        scores: { dreamer: 0, achiever: 1, helper: 0, explorer: 0, builder: 0 }
      },
      {
        text: "You're always trying new things",
        scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 1, builder: 0 }
      },
      {
        text: "You're so reliable and organized",
        scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 0, builder: 1 }
      },
      {
        text: "You inspire me with your ideas",
        scores: { dreamer: 1, achiever: 0, helper: 0, explorer: 0, builder: 0 }
      }
    ]
  },
  {
    id: 3,
    question: "What frustrates you the most?",
    options: [
      {
        text: "Lack of planning or structure",
        scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 0, builder: 1 }
      },
      {
        text: "Seeing people in pain or being left out",
        scores: { dreamer: 0, achiever: 0, helper: 1, explorer: 0, builder: 0 }
      },
      {
        text: "Having to follow meaningless routines",
        scores: { dreamer: 1, achiever: 0, helper: 0, explorer: 0, builder: 0 }
      },
      {
        text: "Wasting time without results",
        scores: { dreamer: 0, achiever: 1, helper: 0, explorer: 0, builder: 0 }
      },
      {
        text: "Feeling stuck or bored",
        scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 1, builder: 0 }
      }
    ]
  },
  {
    id: 4,
    question: "What motivates you most to wake up in the morning?",
    options: [
      {
        text: "Pursuing a meaningful vision",
        scores: { dreamer: 1, achiever: 0, helper: 0, explorer: 0, builder: 0 }
      },
      {
        text: "Accomplishing your goals",
        scores: { dreamer: 0, achiever: 1, helper: 0, explorer: 0, builder: 0 }
      },
      {
        text: "Being there for someone who needs you",
        scores: { dreamer: 0, achiever: 0, helper: 1, explorer: 0, builder: 0 }
      },
      {
        text: "Discovering something new",
        scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 1, builder: 0 }
      },
      {
        text: "Working toward long-term stability",
        scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 0, builder: 1 }
      }
    ]
  },
  {
    id: 5,
    question: "When you're faced with a problem, what's your natural first move?",
    options: [
      {
        text: "Ask who's affected and how I can help",
        scores: { dreamer: 0, achiever: 0, helper: 1, explorer: 0, builder: 0 }
      },
      {
        text: "Break it into steps and organize a plan",
        scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 0, builder: 1 }
      },
      {
        text: "Look for the deeper meaning behind it",
        scores: { dreamer: 1, achiever: 0, helper: 0, explorer: 0, builder: 0 }
      },
      {
        text: "Push through to solve it quickly",
        scores: { dreamer: 0, achiever: 1, helper: 0, explorer: 0, builder: 0 }
      },
      {
        text: "Look for a new angle or opportunity in it",
        scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 1, builder: 0 }
      }
    ]
  },
  {
    id: 6,
    question: "Your free time is best spent:",
    options: [
      {
        text: "Exploring ideas or trying something new",
        scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 1, builder: 0 }
      },
      {
        text: "Journaling, imagining, or brainstorming",
        scores: { dreamer: 1, achiever: 0, helper: 0, explorer: 0, builder: 0 }
      },
      {
        text: "Listening or spending time with others",
        scores: { dreamer: 0, achiever: 0, helper: 1, explorer: 0, builder: 0 }
      },
      {
        text: "Knocking things off your list",
        scores: { dreamer: 0, achiever: 1, helper: 0, explorer: 0, builder: 0 }
      },
      {
        text: "Planning or organizing something",
        scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 0, builder: 1 }
      }
    ]
  },
  {
    id: 7,
    question: "You're praised for your:",
    options: [
      {
        text: "Work ethic and drive",
        scores: { dreamer: 0, achiever: 1, helper: 0, explorer: 0, builder: 0 }
      },
      {
        text: "Kindness and empathy",
        scores: { dreamer: 0, achiever: 0, helper: 1, explorer: 0, builder: 0 }
      },
      {
        text: "Curiosity and open-mindedness",
        scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 1, builder: 0 }
      },
      {
        text: "Creativity and vision",
        scores: { dreamer: 1, achiever: 0, helper: 0, explorer: 0, builder: 0 }
      },
      {
        text: "Reliability and systems thinking",
        scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 0, builder: 1 }
      }
    ]
  },
  {
    id: 8,
    question: "You'd be most fulfilled if your work helped you:",
    options: [
      {
        text: "Express your unique voice",
        scores: { dreamer: 1, achiever: 0, helper: 0, explorer: 0, builder: 0 }
      },
      {
        text: "Reach meaningful goals",
        scores: { dreamer: 0, achiever: 1, helper: 0, explorer: 0, builder: 0 }
      },
      {
        text: "Improve others' lives",
        scores: { dreamer: 0, achiever: 0, helper: 1, explorer: 0, builder: 0 }
      },
      {
        text: "Explore and grow continuously",
        scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 1, builder: 0 }
      },
      {
        text: "Build something lasting",
        scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 0, builder: 1 }
      }
    ]
  },
  {
    id: 9,
    question: "If someone else had to describe you in one word, you'd hope they'd say:",
    options: [
      {
        text: "Compassionate",
        scores: { dreamer: 0, achiever: 0, helper: 1, explorer: 0, builder: 0 }
      },
      {
        text: "Organized",
        scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 0, builder: 1 }
      },
      {
        text: "Adventurous",
        scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 1, builder: 0 }
      },
      {
        text: "Visionary",
        scores: { dreamer: 1, achiever: 0, helper: 0, explorer: 0, builder: 0 }
      },
      {
        text: "Driven",
        scores: { dreamer: 0, achiever: 1, helper: 0, explorer: 0, builder: 0 }
      }
    ]
  },
  {
    id: 10,
    question: "When working with others, you tend to:",
    options: [
      {
        text: "Take the lead and drive forward",
        scores: { dreamer: 0, achiever: 1, helper: 0, explorer: 0, builder: 0 }
      },
      {
        text: "Make sure everyone feels seen",
        scores: { dreamer: 0, achiever: 0, helper: 1, explorer: 0, builder: 0 }
      },
      {
        text: "Spark creative ideas",
        scores: { dreamer: 1, achiever: 0, helper: 0, explorer: 0, builder: 0 }
      },
      {
        text: "Question assumptions",
        scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 1, builder: 0 }
      },
      {
        text: "Keep things structured and clear",
        scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 0, builder: 1 }
      }
    ]
  },
  {
    id: 11,
    question: "The thing you value most in life is:",
    options: [
      {
        text: "Freedom and flexibility",
        scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 1, builder: 0 }
      },
      {
        text: "Security and structure",
        scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 0, builder: 1 }
      },
      {
        text: "Meaning and purpose",
        scores: { dreamer: 1, achiever: 0, helper: 0, explorer: 0, builder: 0 }
      },
      {
        text: "Connection and kindness",
        scores: { dreamer: 0, achiever: 0, helper: 1, explorer: 0, builder: 0 }
      },
      {
        text: "Progress and results",
        scores: { dreamer: 0, achiever: 1, helper: 0, explorer: 0, builder: 0 }
      }
    ]
  },
  {
    id: 12,
    question: "You know you're thriving when you feel:",
    options: [
      {
        text: "Calm, steady, and in control",
        scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 0, builder: 1 }
      },
      {
        text: "Focused and productive",
        scores: { dreamer: 0, achiever: 1, helper: 0, explorer: 0, builder: 0 }
      },
      {
        text: "Aligned with your purpose",
        scores: { dreamer: 1, achiever: 0, helper: 0, explorer: 0, builder: 0 }
      },
      {
        text: "Appreciated and helpful",
        scores: { dreamer: 0, achiever: 0, helper: 1, explorer: 0, builder: 0 }
      },
      {
        text: "Inspired and curious",
        scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 1, builder: 0 }
      }
    ]
  }
];

const typeDescriptions = {
  dreamer: {
    title: "The Dreamer",
    icon: <Star className="h-6 w-6" />,
    color: "purple",
    description: "You are driven by creativity, imagination, and personal expression. Your ikigai lies in bringing unique visions to life.",
    characteristics: [
      "Highly creative and imaginative",
      "Values personal expression and authenticity",
      "Prefers flexible, inspiring environments",
      "Motivated by meaning over money"
    ],
    careers: [
      "Artist/Designer",
      "Writer/Content Creator",
      "Musician/Performer",
      "Creative Director",
      "Entrepreneur"
    ]
  },
  achiever: {
    title: "The Achiever",
    icon: <Target className="h-6 w-6" />,
    color: "red",
    description: "You thrive on goals, competition, and success. Your ikigai comes from reaching new heights and being recognized for your accomplishments.",
    characteristics: [
      "Highly goal-oriented and competitive",
      "Thrives under pressure and challenges",
      "Natural leader and influencer",
      "Motivated by recognition and success"
    ],
    careers: [
      "CEO/Executive",
      "Sales Manager",
      "Professional Athlete",
      "Investment Banker",
      "Consultant"
    ]
  },
  helper: {
    title: "The Helper",
    icon: <Heart className="h-6 w-6" />,
    color: "green",
    description: "You find purpose in supporting others and making a positive impact. Your ikigai is rooted in service and human connection.",
    characteristics: [
      "Naturally empathetic and supportive",
      "Values relationships and community",
      "Motivated by helping others succeed",
      "Finds meaning in service to others"
    ],
    careers: [
      "Teacher/Educator",
      "Healthcare Worker",
      "Social Worker",
      "Counselor/Therapist",
      "Non-profit Leader"
    ]
  },
  explorer: {
    title: "The Explorer",
    icon: <Compass className="h-6 w-6" />,
    color: "blue",
    description: "You are driven by curiosity, learning, and new experiences. Your ikigai lies in discovery and continuous growth.",
    characteristics: [
      "Highly curious and adaptable",
      "Loves learning and new experiences",
      "Thrives on variety and change",
      "Values knowledge and understanding"
    ],
    careers: [
      "Researcher/Scientist",
      "Travel Writer",
      "Consultant",
      "Product Manager",
      "Entrepreneur"
    ]
  },
  builder: {
    title: "The Builder",
    icon: <Building className="h-6 w-6" />,
    color: "orange",
    description: "You excel at creating systems, structures, and lasting value. Your ikigai comes from building something meaningful and enduring.",
    characteristics: [
      "Systematic and strategic thinker",
      "Excellent at organizing and planning",
      "Values stability and long-term impact",
      "Motivated by creating lasting value"
    ],
    careers: [
      "Engineer/Architect",
      "Project Manager",
      "Business Owner",
      "Operations Manager",
      "Financial Planner"
    ]
  }
};

export default function TypeTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }



  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);

    if (currentQuestion < typeQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (finalAnswers: number[]) => {
    const scores = {
      dreamer: 0,
      achiever: 0,
      helper: 0,
      explorer: 0,
      builder: 0
    };

    finalAnswers.forEach((answerIndex, questionIndex) => {
      const question = typeQuestions[questionIndex];
      const selectedOption = question.options[answerIndex];
      
      scores.dreamer += selectedOption.scores.dreamer;
      scores.achiever += selectedOption.scores.achiever;
      scores.helper += selectedOption.scores.helper;
      scores.explorer += selectedOption.scores.explorer;
      scores.builder += selectedOption.scores.builder;
    });

    const primaryType = Object.entries(scores).reduce((a, b) => 
      scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
    )[0] as keyof typeof scores;

    const secondaryType = Object.entries(scores)
      .filter(([type]) => type !== primaryType)
      .reduce((a, b) => 
        scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
      )[0] as keyof typeof scores;

    setResults({
      primaryType,
      secondaryType,
      scores,
      description: typeDescriptions[primaryType]
    });
    setShowResults(true);
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / typeQuestions.length) * 100;

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30, delay: 0.2 }}
            >
              <CheckCircle className="h-8 w-8 text-green-600" />
            </motion.div>
            <motion.h1 
              className="text-3xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {t('typeTest:resultsTitle')}
            </motion.h1>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {t('typeTest:resultsSubtitle')}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="mb-8"
          >
            <Card className="border-2 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="text-center">
                <motion.div 
                  className={`w-20 h-20 bg-${results.description.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className={`text-${results.description.color}-600`}>
                    {results.description.icon}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <CardTitle className="text-2xl text-gray-900">
                    {t(`typeTest:typeDescriptions.${results.primaryType}.name`)}
                  </CardTitle>
                  <p className="text-gray-600 mt-2">
                    {t(`typeTest:typeDescriptions.${results.primaryType}.description`)}
                  </p>
                </motion.div>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ y: -3 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {t('common:keyCharacteristics')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results.description.characteristics.map((char: string, index: number) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{char}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ y: -3 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Career Matches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {results.description.careers.map((career: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="inline-block"
                      >
                        <Badge variant="secondary" className="mr-2 mb-2">
                          {career}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-8"
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle>Your Type Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(results.scores).map(([type, score], index) => (
                    <motion.div 
                      key={type} 
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {typeDescriptions[type as keyof typeof typeDescriptions].title}
                        </span>
                        <span className="text-sm text-gray-600">{score as number}/12</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div 
                          className={`bg-${typeDescriptions[type as keyof typeof typeDescriptions].color}-500 h-2 rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(score as number / 12) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.9 + index * 0.1, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <motion.p 
              className="text-gray-600 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              Want a more detailed analysis? Take our comprehensive <strong>Ikigai test</strong> for deeper insights into what is Ikigai for you.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <Link href={`/ikigai-types/${getTypeUrlPath(results.primaryType)}`}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white transition-all duration-300 hover:shadow-lg">
                    {t('typeTest:learnMore', { type: t(`typeTest:typeDescriptions.${results.primaryType}.name`) })}
                  </Button>
                </motion.div>
              </Link>
              <Link href="/test">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 hover:shadow-lg">
                    {t('typeTest:takeFullTest')}
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" onClick={() => window.location.reload()} className="transition-all duration-300 hover:shadow-md">
                  {t('typeTest:retakeTest')}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": "Free Ikigai Type Test - Quick Personality Assessment",
    "description": "Take our free Ikigai type test to discover what is Ikigai and your dominant personality type: Dreamer, Achiever, Helper, Explorer, or Builder.",
    "url": "https://www.ikigain.org/ikigai-type-test",
    "estimatedDuration": "PT5M",
    "numberOfQuestions": 12,
    "author": {
      "@type": "Organization",
      "name": "Ikigain.org",
      "url": "https://www.ikigain.org"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <SEO
        title="Free Ikigai Type Test - Quick 5-Minute Personality Assessment | What is Ikigai Quiz"
        description="Take our free Ikigai type test to discover what is Ikigai and your dominant personality type. Free 5-minute Ikigai quiz reveals if you're a Dreamer, Achiever, Helper, Explorer, or Builder."
        keywords="free ikigai type test, ikigai quiz, what is ikigai, ikigai test free, free ikigai quiz, personality test, quick assessment, dreamer achiever helper explorer builder"
        canonical="https://www.ikigain.org/ikigai-type-test"
        structuredData={structuredData}
      />
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{t('typeTest:title')}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>~5 minutes</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{t('typeTest:progressText', { current: currentQuestion + 1, total: typeQuestions.length })}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {translatedQuestions[currentQuestion].question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {translatedQuestions[currentQuestion].options.map((option: any, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all hover:border-blue-300 hover:bg-blue-50 ${
                    answers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <span className="text-gray-900">{option.text}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={goBack}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('typeTest:previousButton')}
          </Button>
          
          <div className="text-sm text-gray-500 flex items-center">
            Click an option to continue
          </div>
        </div>
      </div>
    </div>
  );
}