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
  Mountain, 
  Building,
  Compass,
  Clock,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

// Map primary types to URL paths
const getTypeUrlPath = (primaryType: string) => {
  const typeMap: Record<string, string> = {
    // Quick Type Test results
    "dreamer": "dreamer",
    "achiever": "achiever", 
    "helper": "helper",
    "explorer": "explorer",
    "builder": "builder",
    "The Builder": "builder",
    "The Explorer": "explorer", 
    "The Dreamer": "dreamer",
    "The Achiever": "achiever",
    "The Helper": "helper",
    "Builder": "builder",
    "Explorer": "explorer",
    "Dreamer": "dreamer", 
    "Achiever": "achiever",
    "Helper": "helper",
    // Main Ikigai Test results - map to their own dedicated pages
    "Creative Enthusiast": "creative-enthusiast",
    "Skilled Expert": "skilled-expert",
    "Purpose-Driven Leader": "purpose-driven-leader",
    "Career-Focused Achiever": "career-focused-achiever",
    "Balanced Explorer": "explorer" // This one can still map to explorer since it's similar
  };
  return typeMap[primaryType] || primaryType.toLowerCase().replace(/\s+/g, '-');
};

const typeQuestions = [
  {
    question: "What motivates you most in life?",
    options: [
      { text: "Creating something beautiful or meaningful", scores: { dreamer: 1, achiever: 0, helper: 0, explorer: 0, builder: 0 } },
      { text: "Achieving ambitious goals and recognition", scores: { dreamer: 0, achiever: 1, helper: 0, explorer: 0, builder: 0 } },
      { text: "Making a positive impact on others", scores: { dreamer: 0, achiever: 0, helper: 1, explorer: 0, builder: 0 } },
      { text: "Discovering new experiences and knowledge", scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 1, builder: 0 } },
      { text: "Building something lasting and valuable", scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 0, builder: 1 } }
    ]
  },
  {
    question: "When facing a challenge, you prefer to:",
    options: [
      { text: "Think deeply and find creative solutions", scores: { dreamer: 1, achiever: 0, helper: 0, explorer: 0, builder: 0 } },
      { text: "Set clear goals and push through obstacles", scores: { dreamer: 0, achiever: 1, helper: 0, explorer: 0, builder: 0 } },
      { text: "Seek support and work with others", scores: { dreamer: 0, achiever: 0, helper: 1, explorer: 0, builder: 0 } },
      { text: "Try different approaches until something works", scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 1, builder: 0 } },
      { text: "Break it down into manageable steps", scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 0, builder: 1 } }
    ]
  },
  {
    question: "Your ideal work environment would be:",
    options: [
      { text: "A quiet space where you can focus and create", scores: { dreamer: 1, achiever: 0, helper: 0, explorer: 0, builder: 0 } },
      { text: "A competitive environment that pushes you to excel", scores: { dreamer: 0, achiever: 1, helper: 0, explorer: 0, builder: 0 } },
      { text: "A collaborative space with supportive colleagues", scores: { dreamer: 0, achiever: 0, helper: 1, explorer: 0, builder: 0 } },
      { text: "A dynamic environment with variety and change", scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 1, builder: 0 } },
      { text: "A structured environment with clear processes", scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 0, builder: 1 } }
    ]
  },
  {
    question: "What brings you the most satisfaction?",
    options: [
      { text: "Expressing your unique vision and creativity", scores: { dreamer: 1, achiever: 0, helper: 0, explorer: 0, builder: 0 } },
      { text: "Reaching ambitious targets and milestones", scores: { dreamer: 0, achiever: 1, helper: 0, explorer: 0, builder: 0 } },
      { text: "Helping others grow and succeed", scores: { dreamer: 0, achiever: 0, helper: 1, explorer: 0, builder: 0 } },
      { text: "Learning new things and expanding horizons", scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 1, builder: 0 } },
      { text: "Creating systems that work efficiently", scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 0, builder: 1 } }
    ]
  },
  {
    question: "How do you prefer to spend your free time?",
    options: [
      { text: "Pursuing artistic or creative hobbies", scores: { dreamer: 1, achiever: 0, helper: 0, explorer: 0, builder: 0 } },
      { text: "Working on personal goals and self-improvement", scores: { dreamer: 0, achiever: 1, helper: 0, explorer: 0, builder: 0 } },
      { text: "Spending quality time with family and friends", scores: { dreamer: 0, achiever: 0, helper: 1, explorer: 0, builder: 0 } },
      { text: "Exploring new places or trying new activities", scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 1, builder: 0 } },
      { text: "Organizing and planning future projects", scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 0, builder: 1 } }
    ]
  },
  {
    question: "When making decisions, you tend to:",
    options: [
      { text: "Follow your intuition and inner voice", scores: { dreamer: 1, achiever: 0, helper: 0, explorer: 0, builder: 0 } },
      { text: "Focus on what will bring the best results", scores: { dreamer: 0, achiever: 1, helper: 0, explorer: 0, builder: 0 } },
      { text: "Consider how it will affect others", scores: { dreamer: 0, achiever: 0, helper: 1, explorer: 0, builder: 0 } },
      { text: "Gather information from multiple sources", scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 1, builder: 0 } },
      { text: "Use logical analysis and proven methods", scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 0, builder: 1 } }
    ]
  },
  {
    question: "Your communication style is typically:",
    options: [
      { text: "Thoughtful and reflective", scores: { dreamer: 1, achiever: 0, helper: 0, explorer: 0, builder: 0 } },
      { text: "Direct and results-oriented", scores: { dreamer: 0, achiever: 1, helper: 0, explorer: 0, builder: 0 } },
      { text: "Warm and empathetic", scores: { dreamer: 0, achiever: 0, helper: 1, explorer: 0, builder: 0 } },
      { text: "Curious and questioning", scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 1, builder: 0 } },
      { text: "Clear and systematic", scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 0, builder: 1 } }
    ]
  },
  {
    question: "You feel most energized when:",
    options: [
      { text: "Working on projects that inspire you", scores: { dreamer: 1, achiever: 0, helper: 0, explorer: 0, builder: 0 } },
      { text: "Competing and striving for excellence", scores: { dreamer: 0, achiever: 1, helper: 0, explorer: 0, builder: 0 } },
      { text: "Making a difference in someone's life", scores: { dreamer: 0, achiever: 0, helper: 1, explorer: 0, builder: 0 } },
      { text: "Discovering something new and exciting", scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 1, builder: 0 } },
      { text: "Completing tasks efficiently and effectively", scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 0, builder: 1 } }
    ]
  },
  {
    question: "Your approach to problem-solving is:",
    options: [
      { text: "Imaginative and innovative", scores: { dreamer: 1, achiever: 0, helper: 0, explorer: 0, builder: 0 } },
      { text: "Strategic and goal-focused", scores: { dreamer: 0, achiever: 1, helper: 0, explorer: 0, builder: 0 } },
      { text: "Collaborative and people-centered", scores: { dreamer: 0, achiever: 0, helper: 1, explorer: 0, builder: 0 } },
      { text: "Experimental and adaptive", scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 1, builder: 0 } },
      { text: "Methodical and systematic", scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 0, builder: 1 } }
    ]
  },
  {
    question: "What type of recognition do you value most?",
    options: [
      { text: "Appreciation for your creativity and originality", scores: { dreamer: 1, achiever: 0, helper: 0, explorer: 0, builder: 0 } },
      { text: "Recognition for your achievements and success", scores: { dreamer: 0, achiever: 1, helper: 0, explorer: 0, builder: 0 } },
      { text: "Gratitude for your care and support", scores: { dreamer: 0, achiever: 0, helper: 1, explorer: 0, builder: 0 } },
      { text: "Respect for your knowledge and expertise", scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 1, builder: 0 } },
      { text: "Acknowledgment of your reliability and competence", scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 0, builder: 1 } }
    ]
  },
  {
    question: "When learning something new, you prefer to:",
    options: [
      { text: "Explore it at your own pace and in your own way", scores: { dreamer: 1, achiever: 0, helper: 0, explorer: 0, builder: 0 } },
      { text: "Set learning goals and track your progress", scores: { dreamer: 0, achiever: 1, helper: 0, explorer: 0, builder: 0 } },
      { text: "Learn with others and share experiences", scores: { dreamer: 0, achiever: 0, helper: 1, explorer: 0, builder: 0 } },
      { text: "Jump in and learn through hands-on experience", scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 1, builder: 0 } },
      { text: "Follow a structured curriculum or plan", scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 0, builder: 1 } }
    ]
  },
  {
    question: "Your ideal lifestyle would include:",
    options: [
      { text: "Freedom to pursue your passions and interests", scores: { dreamer: 1, achiever: 0, helper: 0, explorer: 0, builder: 0 } },
      { text: "Continuous growth and achievement", scores: { dreamer: 0, achiever: 1, helper: 0, explorer: 0, builder: 0 } },
      { text: "Strong relationships and community connections", scores: { dreamer: 0, achiever: 0, helper: 1, explorer: 0, builder: 0 } },
      { text: "Adventure and variety in your experiences", scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 1, builder: 0 } },
      { text: "Stability and security in your daily routine", scores: { dreamer: 0, achiever: 0, helper: 0, explorer: 0, builder: 1 } }
    ]
  }
];

const typeDescriptions = {
  dreamer: {
    title: "The Dreamer",
    icon: <Star className="h-6 w-6" />,
    color: "purple",
    description: "You are a visionary, full of imagination, depth, and untapped ideas. You feel most alive when exploring creative possibilities and inner visions.",
    characteristics: [
      "Highly creative and imaginative",
      "Deep thinker and reflective",
      "Values authenticity and meaning",
      "Driven by personal vision and inspiration"
    ],
    careers: [
      "Artist/Creative Professional",
      "Writer/Author",
      "Therapist/Counselor",
      "Spiritual Guide",
      "Innovation Consultant"
    ]
  },
  achiever: {
    title: "The Achiever",
    icon: <Target className="h-6 w-6" />,
    color: "green",
    description: "You are ambitious, results-oriented, and thrive on accomplishing goals. Your ikigai comes from pushing boundaries and achieving excellence.",
    characteristics: [
      "Goal-oriented and ambitious",
      "Highly motivated and driven",
      "Competitive and results-focused",
      "Strong leadership qualities"
    ],
    careers: [
      "Executive/CEO",
      "Sales Leader",
      "Entrepreneur",
      "Athlete/Coach",
      "Performance Consultant"
    ]
  },
  helper: {
    title: "The Helper",
    icon: <Heart className="h-6 w-6" />,
    color: "pink",
    description: "You find deep fulfillment in supporting others and making a positive difference. Your ikigai is rooted in service and human connection.",
    characteristics: [
      "Empathetic and compassionate",
      "Excellent interpersonal skills",
      "Service-oriented mindset",
      "Natural ability to support others"
    ],
    careers: [
      "Healthcare Professional",
      "Teacher/Educator",
      "Social Worker",
      "Non-profit Leader",
      "Human Resources"
    ]
  },
  explorer: {
    title: "The Explorer",
    icon: <Compass className="h-6 w-6" />,
    color: "blue",
    description: "You are curious, adaptable, and energized by discovery. Your ikigai comes from continuous learning and exploring new territories.",
    characteristics: [
      "Naturally curious and inquisitive",
      "Adaptable and flexible",
      "Loves learning and discovery",
      "Comfortable with uncertainty"
    ],
    careers: [
      "Researcher/Scientist",
      "Journalist",
      "Travel Professional",
      "Consultant",
      "Technology Specialist"
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
  const { t, i18n } = useTranslation('typeTest');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const isSpanish = i18n.language === 'es';
  const isFrench = i18n.language === 'fr';
  const baseUrl = isSpanish ? "https://www.ikigain.org/es" : isFrench ? "https://www.ikigain.org/fr" : "https://www.ikigain.org";
  
  // Get translated questions if available
  const getTranslatedQuestions = () => {
    if (i18n.language === 'fr') {
      try {
        const frenchQuestions = t('questions', { returnObjects: true });
        if (Array.isArray(frenchQuestions) && frenchQuestions.length > 0) {
          return frenchQuestions;
        }
      } catch {
        console.log('French questions not loaded yet, using original');
      }
    }
    return typeQuestions;
  };
  
  const translatedQuestions = getTranslatedQuestions();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);

    if (currentQuestion < (translatedQuestions?.length || typeQuestions.length) - 1) {
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

  const progress = ((currentQuestion + 1) / (translatedQuestions?.length || typeQuestions.length)) * 100;

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <SEO
          title="Your Ikigai Type Results | Free Ikigai Test"
          description="Discover your unique Ikigai personality type results from our free test"
        />
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
              Your Ikigai Type
            </motion.h1>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Based on your responses, here's your personality type
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid gap-6 md:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="border-2 border-purple-200 bg-white/70 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-${results.description.color}-100`}>
                  {results.description.icon}
                </div>
                <CardTitle className="text-2xl">
                  <Badge variant="secondary" className="mb-2">Primary Type</Badge>
                  <div className="text-gray-900">{results.description.title}</div>
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  {results.description.description}
                </p>
              </CardHeader>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Key Characteristics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.description.characteristics.map((char: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{char}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Your Score Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(results.scores).map(([type, score]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="capitalize font-medium">{type}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-${typeDescriptions[type as keyof typeof typeDescriptions].color}-500`}
                            style={{ width: `${(score as number / 12) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{score as number}/12</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mountain className="h-5 w-5" />
                  Career Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {results.description.careers.map((career: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {career}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            className="text-center mt-8 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link href={`/ikigai-types/${getTypeUrlPath(results.primaryType)}`}>
                  Learn More About {results.description.title}
                </Link>
              </Button>
              
              <Button asChild variant="outline">
                <Link href="/ikigai-test">
                  Take Full Ikigai Test
                </Link>
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={() => {
                setShowResults(false);
                setCurrentQuestion(0);
                setAnswers([]);
                setResults(null);
              }}
              className="text-gray-600 hover:text-gray-900"
            >
              Retake Type Test
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <SEO
        title={t('seo.title', {
          fallbackLng: 'en',
          defaultValue: "Free Ikigai Type Test | Quick 5-Minute Assessment"
        })}
        description={t('seo.description', {
          fallbackLng: 'en',
          defaultValue: "Discover your Ikigai personality type with our quick 5-minute test"
        })}
        keywords={t('seo.keywords', {
          fallbackLng: 'en',
          defaultValue: "ikigai type test, ikigai personality test, free ikigai test, ikigai personality types, quick ikigai test"
        })}
        canonical={baseUrl + "/ikigai-type-test"}
        ogTitle={t('seo.ogTitle', {
          fallbackLng: 'en',
          defaultValue: "Free Ikigai Type Test - 5 Minutes | Discover Your Personality"
        })}
        ogDescription={t('seo.ogDescription', {
          fallbackLng: 'en',
          defaultValue: "Quick and free test to discover your Ikigai personality type. Instant results with personalized recommendations."
        })}
        language={isSpanish ? 'es' : isFrench ? 'fr' : 'en'}
      />
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30, delay: 0.2 }}
          >
            <Clock className="h-8 w-8 text-purple-600" />
          </motion.div>
          <motion.h1 
            className="text-3xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {t('hero.title', { defaultValue: 'Free Ikigai Type Test' })}
          </motion.h1>
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {t('hero.subtitle', { defaultValue: 'Quick 5-Minute Personality Assessment' })}
          </motion.p>
        </motion.div>

        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {translatedQuestions?.length || typeQuestions.length}</span>
            <span>{Math.round(progress)}% completed</span>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        <motion.div 
          key={currentQuestion}
          className="mb-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-white/70 backdrop-blur-sm border-2 border-purple-200">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-gray-900">
                {translatedQuestions?.[currentQuestion]?.question || typeQuestions[currentQuestion]?.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(translatedQuestions?.[currentQuestion]?.options || typeQuestions[currentQuestion]?.options)?.map((option: any, index: number) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full text-left h-auto p-4 justify-start hover:bg-purple-50 hover:border-purple-300 transition-colors whitespace-normal"
                      onClick={() => handleAnswer(index)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full border-2 border-purple-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-sm font-medium text-purple-600">{index + 1}</span>
                        </div>
                        <span className="text-gray-700 text-left leading-relaxed break-words">{typeof option === 'string' ? option : option.text}</span>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="flex justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Button 
            variant="outline" 
            onClick={goBack} 
            disabled={currentQuestion === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('test.previousButton', { defaultValue: 'Previous' })}
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Choose the option that best describes you</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}