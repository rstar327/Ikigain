import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import React from "react";
import { CheckCircle, Star, Target, TrendingUp, BookOpen, Users, Briefcase, Clock, Award, ArrowRight, Brain, Lightbulb, Zap, ChevronRight, Calendar, DollarSign, BarChart3, Globe, Trophy, Rocket, Network, MessageSquare, Bot, Building, Heart, Sparkles, AlertCircle, Lock } from "lucide-react";
import { getFeatureAccess, getTierDisplayName, getTierColor, getUpgradeOptions, getUpgradePrice, getTierFeatures, type PremiumTier, type PremiumFeatures } from "@shared/access-control";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IkigaiChart from "@/components/IkigaiChart";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { useLocation } from "wouter";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

// Translation utility function
const translateDynamicContent = (text: string, t: any) => {
  if (!text) return text;
  
  // Remove any namespace prefixes that may have been added
  let cleanText = text.replace(/^results:/, '').replace(/^dynamicContent\./, '');
  
  // Try translation with results namespace and dynamicContent key first
  try {
    const dynamicTranslation = t(`results:dynamicContent.${cleanText}`, { defaultValue: cleanText });
    if (dynamicTranslation && dynamicTranslation !== cleanText && dynamicTranslation !== `results:dynamicContent.${cleanText}`) {
      return dynamicTranslation;
    }
  } catch {
    // Ignore translation errors
  }
  
  // Try direct translation with results namespace
  try {
    const directTranslation = t(`results:${cleanText}`, { defaultValue: cleanText });
    if (directTranslation && directTranslation !== cleanText && directTranslation !== `results:${cleanText}`) {
      return directTranslation;
    }
  } catch {
    // Ignore translation errors
  }
  
  // Return the clean text as fallback
  return cleanText;
};

interface PremiumResultsData {
  id: number;
  sessionId: number;
  passionScore: string;
  missionScore: string;
  vocationScore: string;
  professionScore: string;
  overallScore: string;
  primaryType: string;
  strengths: string[];
  recommendations: {
    description: string;
    careers: string[];
    actions: string[];
  };
  subcategoryScores: Record<string, Record<string, number>>;
  featureAccess: PremiumFeatures;
  premiumTier: PremiumTier;
  detailedAnalysis: {
    personalityInsights: string[];
    careerFit: {
      highFit: Array<{
        title: string;
        match: number;
        description: string;
        skills: string[];
        growth: string;
        salary: string;
        marketDemand: string;
        workEnvironment: string;
        dailyTasks: string[];
      }>;
      mediumFit: Array<{
        title: string;
        match: number;
        description: string;
        skills: string[];
        growth: string;
        salary: string;
        marketDemand: string;
        workEnvironment: string;
        dailyTasks: string[];
      }>;
    };
    roadmaps: Array<{
      career: string;
      timeline: string;
      difficulty: string;
      steps: Array<{
        phase: string;
        duration: string;
        activities: string[];
        skills: string[];
        milestones: string[];
        resources: string[];
      }>;
    }>;

    developmentAreas?: Array<{
      area: string;
      current: number;
      target: number;
      priority: string;
      actions: string[];
      resources: string[];
      timeframe: string;
    }>;
    marketInsights?: {
      industryTrends: string[];
      emergingRoles: string[];
      skillsInDemand: string[];
      salaryTrends: string;
    };
    personalityProfile?: {
      cognitiveStyle: string;
      workStyle: string;
      communicationStyle: string;
      decisionMaking: string;
      stressManagement: string;
    };
    networkingStrategy?: {
      targetIndustries: string[];
      keyProfessionals: Array<{
        role: string;
        value: string;
        platforms: string[];
      }>;
      networkingEvents: Array<{
        type: string;
        description: string;
        frequency: string;
      }>;
      onlineCommunities: Array<{
        platform: string;
        community: string;
        focus: string;
      }>;
    };
    aiMentor?: {
      weeklyQuestions: Array<{
        question: string;
        purpose: string;
        reflection: string;
      }>;
      monthlyGoals: Array<{
        goal: string;
        actions: string[];
        metrics: string[];
      }>;
      personalized_tips: Array<{
        category: string;
        tip: string;
        implementation: string;
      }>;
    };
    interviewPreparation?: {
      commonQuestions?: string[];
      typeSpecificQuestions?: string[];
      preparationChecklist?: string[];
      interviewSteps?: string[];
      preparation?: any;
      followUpStrategy?: any;
    };
    successBlueprint?: {
      transformationPlan?: {
        days1to30?: {
          title?: string;
          focus?: string;
          activities?: string[];
        };
        days31to60?: {
          title?: string;
          focus?: string;
          activities?: string[];
        };
        days61to90?: {
          title?: string;
          focus?: string;
          activities?: string[];
        };
      };
      dailyHabits?: any[];
      confidenceBuilding?: any[];
      developmentAreas?: any[];
      habitTracker?: any[];
      lifeBalanceAssessment?: any[];
    };
  };
  secondaryType?: string;
}

const CareerCard = ({ career, isHighFit = false }: { career: any; isHighFit?: boolean }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`p-6 rounded-lg border ${
      isHighFit ? 'border-green-200 bg-gradient-to-br from-green-50 to-green-100' : 'border-gray-200 bg-white'
    } shadow-lg hover:shadow-xl transition-all duration-300`}
  >
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{career.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant={isHighFit ? "default" : "secondary"} className="bg-gradient-to-r from-primary to-secondary text-white">
            {career.match}% Match
          </Badge>
          <Badge variant="outline" className="text-xs">
            <DollarSign className="h-3 w-3 mr-1" />
            {career.salary}
          </Badge>
        </div>
      </div>
      <div className="text-right">
        <TrendingUp className={`h-5 w-5 ${isHighFit ? 'text-green-600' : 'text-gray-400'} mb-1`} />
        <p className="text-xs text-gray-500">{career.marketDemand}</p>
      </div>
    </div>
    
    <p className="text-gray-700 mb-4">{career.description}</p>
    
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
          <Brain className="h-4 w-4 mr-1" />
          Key Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {career.skills.map((skill: string, index: number) => (
            <Badge key={index} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Target className="h-4 w-4 text-blue-500" />
          <span>Growth: {career.growth}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Globe className="h-4 w-4 text-green-500" />
          <span>Environment: {career.workEnvironment}</span>
        </div>
      </div>
      
      {career.dailyTasks && (
        <div>
          <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Daily Tasks
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {career.dailyTasks.slice(0, 3).map((task: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <ChevronRight className="h-3 w-3 mt-0.5 text-primary" />
                {task}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </motion.div>
);

const RoadmapCard = ({ roadmap }: { roadmap: any }) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Briefcase className="h-5 w-5" />
        {roadmap.career} Career Path
      </CardTitle>
      <p className="text-sm text-gray-600">Timeline: {roadmap.timeline}</p>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {roadmap.steps.map((step: any, index: number) => (
          <div key={index} className="border-l-4 border-primary pl-4 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Phase {index + 1}</Badge>
              <span className="font-medium">{step.phase}</span>
              <span className="text-sm text-gray-600">({step.duration})</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-2">Activities</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {step.activities.map((activity: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ArrowRight className="h-3 w-3 mt-1 text-primary" />
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-2">Skills to Develop</h4>
                <div className="flex flex-wrap gap-1">
                  {step.skills.map((skill: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const DevelopmentAreaCard = ({ area }: { area: any }) => (
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">{area.area}</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={area.priority === "High" ? "destructive" : "secondary"} className="text-xs">
            {area.priority} Priority
          </Badge>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Current Level</span>
            <span>{area.current}/10</span>
          </div>
          <Progress value={area.current * 10} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Target Level</span>
            <span>{area.target}/10</span>
          </div>
          <Progress value={area.target * 10} className="h-2" />
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4 text-blue-500" />
          <span>Timeline: {area.timeframe}</span>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
            <Target className="h-4 w-4 mr-1" />
            Action Plan
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {area.actions.map((action: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 mt-1 text-green-500" />
                {action}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            Resources
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {area.resources.map((resource: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 mt-1 text-blue-500" />
                {resource}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </CardContent>
  </Card>
);

function UpgradeCard({ currentTier, targetTier, sessionId }: { currentTier: PremiumTier; targetTier: PremiumTier; sessionId: string }) {
  const upgradePrice = getUpgradePrice(currentTier, targetTier);
  const tierFeatures = getTierFeatures(targetTier);
  const tierName = getTierDisplayName(targetTier);
  const tierColor = getTierColor(targetTier);
  
  return (
    <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-800">{tierName}</CardTitle>
            <p className="text-sm text-gray-600">Upgrade for {upgradePrice}</p>
          </div>
          <Lock className="h-5 w-5 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-2 flex-1">
          {tierFeatures.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <CheckCircle className={`h-4 w-4 text-${tierColor}-500`} />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button 
            className={`w-full h-11 bg-${tierColor}-500 hover:bg-${tierColor}-600 text-white whitespace-nowrap flex items-center justify-center`}
            onClick={() => window.location.href = `/upsell?sessionId=${sessionId}&tier=${targetTier}`}
          >
            Upgrade {upgradePrice}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PremiumResults() {
  // ALL HOOKS MUST BE CALLED FIRST TO FOLLOW RULES OF HOOKS
  const [, paramsEn] = useRoute("/premium-results/:sessionId");
  const [, paramsEs] = useRoute("/es/premium-results/:sessionId");
  const [location, setLocation] = useLocation();
  const sessionId = (paramsEn || paramsEs)?.sessionId;
  const { t, i18n, ready } = useTranslation(['results', 'common']);
  const [isLoading, setIsLoading] = useState(true);

  // Detect language from URL and set it
  React.useEffect(() => {
    if (location.startsWith('/es/')) {
      i18n.changeLanguage('es');
    } else {
      i18n.changeLanguage('en');
    }
  }, [location, i18n]);

  useEffect(() => {
    if (ready && i18n.hasResourceBundle(i18n.language, 'results') && i18n.hasResourceBundle(i18n.language, 'common')) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [ready, i18n]);

  // ALL useQuery HOOKS MUST BE HERE BEFORE ANY CONDITIONAL RETURNS
  const { data: results, isLoading: isQueryLoading, error } = useQuery<PremiumResultsData>({
    queryKey: ["/api/premium-results", sessionId, i18n.language],
    queryFn: async () => {
      const response = await fetch(`/api/premium-results/${sessionId}?language=${i18n.language}`);
      if (!response.ok) {
        throw new Error('Failed to fetch premium results');
      }
      return response.json();
    },
    enabled: !!sessionId,
  });

  if (!ready || isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Helper function to translate dynamic content
  const translateContent = (content: string, type: 'strengths' | 'careers' | 'actions' | 'skills' | 'activities' | 'insights' | 'trends' | 'roles' | 'areas' | 'resources' | 'tips' | 'goals' | 'questions' | 'personalityInsights'): string => {
    // Create translation mappings for Spanish
    const translations: Record<string, Record<string, string>> = {
      strengths: {
        "You excel at building strong, supportive communities.": "Sobresales construyendo comunidades fuertes y solidarias.",
        "You excel at analyzing complex problems and devising practical solutions.": "Sobresales analizando problemas complejos y encontrando soluciones prácticas.",
        "You are deeply committed to advancing social causes and making a positive impact.": "Estás profundamente comprometido/a con el avance de causas sociales y generar un impacto positivo.",
        "You have a natural talent for understanding and connecting with people.": "Tienes un talento natural para entender y conectar con las personas.",
        "You thrive in collaborative environments and enjoy working with diverse teams.": "Prosperas en ambientes colaborativos y disfrutas trabajar con equipos diversos.",
        "You possess strong leadership skills and can inspire others toward common goals.": "Posees fuertes habilidades de liderazgo y puedes inspirar a otros hacia objetivos comunes."
      },
      careers: {
        "Social Worker": "Trabajador Social",
        "Teacher": "Maestro/a",
        "Counselor": "Consejero/a",
        "Non-profit Leader": "Líder de ONG",
        "Community Organizer": "Organizador Comunitario",
        "Mentor": "Mentor",
        "UX/UI Designer": "Diseñador UX/UI",
        "Product Manager": "Gerente de Producto",
        "Marketing Manager": "Gerente de Marketing",
        "Data Analyst": "Analista de Datos",
        "Project Manager": "Gerente de Proyecto",
        "Software Developer": "Desarrollador de Software",
        "Therapist": "Terapeuta",
        "Coach": "Coach",
        "Volunteer Coordinator": "Coordinador de Voluntarios",
        "Healthcare Worker": "Trabajador de la Salud"
      },
      actions: {
        "Volunteer for causes you care about": "Ofrece voluntariado para causas que te importan",
        "Mentor others and share your knowledge": "Orienta a otros y comparte tu conocimiento",
        "Build strong community connections": "Construye conexiones comunitarias fuertes",
        "Explore creative outlets and artistic pursuits": "Explora salidas creativas y actividades artísticas",
        "Develop your communication and interpersonal skills": "Desarrolla tus habilidades de comunicación e interpersonales",
        "Seek leadership opportunities in your community": "Busca oportunidades de liderazgo en tu comunidad",
        "Join professional organizations in your field": "Únete a organizaciones profesionales en tu campo",
        "Attend workshops and conferences for personal growth": "Asiste a talleres y conferencias para el crecimiento personal",
        "Build a strong portfolio": "Construye un portafolio sólido",
        "Network with industry professionals": "Conecta con profesionales de la industria",
        "Complete relevant certifications": "Completa certificaciones relevantes",
        "Gain practical experience through internships": "Gana experiencia práctica a través de pasantías"
      },
      skills: {
        "Communication": "Comunicación",
        "Leadership": "Liderazgo",
        "Problem Solving": "Resolución de Problemas",
        "Empathy": "Empatía",
        "Creativity": "Creatividad",
        "Analytical Thinking": "Pensamiento Analítico",
        "Teamwork": "Trabajo en Equipo",
        "Time Management": "Gestión del Tiempo",
        "Critical Thinking": "Pensamiento Crítico",
        "Adaptability": "Adaptabilidad",
        "Project Management": "Gestión de Proyectos",
        "Technical Skills": "Habilidades Técnicas",
        "Research": "Investigación",
        "Planning": "Planificación",
        "Organization": "Organización",
        "Negotiation": "Negociación",
        "Presentation": "Presentación",
        "Writing": "Escritura",
        "Data Analysis": "Análisis de Datos",
        "Digital Marketing": "Marketing Digital"
      },
      activities: {
        "Complete UX certification": "Completa certificación UX",
        "Build portfolio": "Construye portafolio",
        "Practice design tools": "Practica herramientas de diseño",
        "Attend design meetups": "Asiste a meetups de diseño",
        "Create case studies": "Crea estudios de caso",
        "Apply for design roles": "Aplica para roles de diseño",
        "Develop management skills": "Desarrolla habilidades de gestión",
        "Build technical knowledge": "Construye conocimiento técnico",
        "Network with product managers": "Conecta con gerentes de producto",
        "Study market trends": "Estudia tendencias del mercado",
        "Create marketing campaigns": "Crea campañas de marketing",
        "Learn analytics tools": "Aprende herramientas de análisis",
        "Build social media presence": "Construye presencia en redes sociales",
        "Attend industry conferences": "Asiste a conferencias de la industria"
      },
      personalityInsights: {
        "Your dominant area of purpose-driven leader indicates a strong alignment with your natural talents and interests.": "Tu área dominante de líder con propósito indica una fuerte alineación con tus talentos naturales e intereses.",
        "With a passion score of 5, you show moderate engagement with activities that energize you.": "Con una puntuación de pasión de 5, muestras un compromiso moderado con actividades que te energizan.",
        "Your mission score of 7 reflects your emerging sense of purpose and meaning.": "Tu puntuación de misión de 7 refleja tu sentido emergente de propósito y significado.",
        "The vocation score of 4 suggests you have developing natural abilities and skills.": "La puntuación de vocación de 4 sugiere que tienes habilidades naturales y destrezas en desarrollo.",
        "Your profession score of 2 indicates growing market viability in your areas of interest.": "Tu puntuación de profesión de 2 indica una creciente viabilidad de mercado en tus áreas de interés."
      }
    };
    
    // Get current language
    const currentLanguage = localStorage.getItem('i18nextLng') || 'en';
    
    // Return translation if Spanish, otherwise return original
    if (currentLanguage === 'es' && translations[type] && translations[type][content]) {
      return translations[type][content];
    }
    
    return content;
  };

  // Get premium tier and features from API response
  const premiumTier: PremiumTier = results?.premiumTier || null;
  const features = results?.featureAccess || getFeatureAccess(premiumTier);

  // Component for locked features
  const LockedFeature = ({ featureName, requiredTier }: { featureName: string; requiredTier: string }) => (
    <div className="bg-gray-50 p-8 rounded-lg border-2 border-gray-200 text-center">
      <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        {featureName} - {t('results:premium.lockedFeature')}
      </h3>
      <p className="text-gray-600 mb-4">
        {t('results:premium.lockedDescription', { tier: requiredTier })}
      </p>
      <Button 
        onClick={() => setLocation(`/upsell?tier=${requiredTier.toLowerCase().replace(/\s+/g, '-')}`)}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      >
        {t('results:premium.upgradeButton', { tier: requiredTier })}
      </Button>
    </div>
  );

  if (isQueryLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg text-gray-600">{t('results:premium.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Premium results error:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Premium Results</h2>
          <p className="text-red-500">Failed to load premium analysis. Please try again.</p>
          <p className="text-sm text-gray-500">Session ID: {sessionId}</p>
        </div>
      </div>
    );
  }

  if (!results) {
    console.log('No results data returned from API');
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-yellow-600">No Data Available</h2>
          <p className="text-yellow-500">Premium results not found for this session.</p>
          <p className="text-sm text-gray-500">Session ID: {sessionId}</p>
        </div>
      </div>
    );
  }

  console.log('Premium results data:', results);

  if (error || !results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-red-600">{t('results:premium.error')}</p>
          <Button onClick={() => setLocation("/")}>{t('common:returnHome')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <SEO 
        title={`Premium ${results.primaryType} Analysis - Complete Ikigai Report | Ikigain`}
        description={`Access your complete premium Ikigai analysis for ${results.primaryType}. Detailed career matches, roadmaps, personality insights, and development plans.`}
        keywords={`premium ikigai analysis, ${results.primaryType.toLowerCase()}, career roadmap, personality insights, development plan`}
        canonical={`/premium-results/${sessionId}`}
      />
      <Navigation />
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Award className="h-8 w-8 text-yellow-400" />
              <h1 className="text-4xl font-bold">{t('results:premium.title')}</h1>
              <Star className="h-8 w-8 text-yellow-400" />
            </div>
            <p className="text-xl text-purple-100">
              {t('results:premium.subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8" />
                <div>
                  <p className="text-green-100">{t('results:premiumOverview.primaryType')}</p>
                  <p className="text-xl font-bold">{results.primaryType}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8" />
                <div>
                  <p className="text-blue-100">{t('results:premiumOverview.overallScore')}</p>
                  <p className="text-xl font-bold">{results.overallScore || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8" />
                <div>
                  <p className="text-purple-100">{t('results:premiumOverview.careerMatches')}</p>
                  <p className="text-xl font-bold">{(results.detailedAnalysis.careerFit?.highFit?.length || 0) + (results.detailedAnalysis.careerFit?.mediumFit?.length || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-2">
            <TabsTrigger value="overview">{t('results:tabs.overview')}</TabsTrigger>
            {features.careerMatches && <TabsTrigger value="careers">{t('results:tabs.careers')}</TabsTrigger>}
            {features.careerRoadmap && <TabsTrigger value="roadmaps">{t('results:tabs.roadmaps')}</TabsTrigger>}
            {features.developmentAreas && <TabsTrigger value="development">{t('results:tabs.development')}</TabsTrigger>}
            {features.marketInsights && <TabsTrigger value="market">{t('results:tabs.market')}</TabsTrigger>}
            {features.personalityProfile && <TabsTrigger value="personality">{t('results:tabs.personality')}</TabsTrigger>}
            {features.networkingStrategy && <TabsTrigger value="networking">{t('results:tabs.networking')}</TabsTrigger>}
            {features.interviewPrep && <TabsTrigger value="interview">{t('results:tabs.interview')}</TabsTrigger>}
            {features.transformationPlan && <TabsTrigger value="success">{t('results:tabs.success')}</TabsTrigger>}
            {features.aiMentor && <TabsTrigger value="ai-mentor">{t('results:tabs.aiMentor')}</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('results:premiumOverview.breakdown')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <IkigaiChart
                    scores={{
                      passion: parseInt(results.passionScore) || 0,
                      mission: parseInt(results.missionScore) || 0,
                      vocation: parseInt(results.vocationScore) || 0,
                      profession: parseInt(results.professionScore) || 0,
                      overall: parseInt(results.overallScore) || 0
                    }}
                    subcategoryScores={results.subcategoryScores || {}}
                    primaryType={results.primaryType}
                    secondaryType={results.secondaryType}
                    strengths={results.strengths}
                    recommendations={results.recommendations}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('results:premiumOverview.personalityInsights')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.detailedAnalysis.personalityInsights?.map((insight, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                        <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                        <p className="text-gray-700">{translateContent(insight, 'personalityInsights')}</p>
                      </div>
                    )) || <p className="text-gray-500">No personality insights available.</p>}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upgrade Options */}
            {premiumTier && getUpgradeOptions(premiumTier).length > 0 && (
              <div className="mt-12">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Unlock More Insights</h2>
                  <p className="text-gray-600">Upgrade to access additional premium features</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getUpgradeOptions(premiumTier).map((upgradeTier) => (
                    <UpgradeCard
                      key={upgradeTier}
                      currentTier={premiumTier}
                      targetTier={upgradeTier}
                      sessionId={sessionId!}
                    />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="careers" className="space-y-6">
            {features.careerMatches ? (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">High-Fit Career Matches</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results.detailedAnalysis.careerFit?.highFit?.map((career, index) => (
                      <CareerCard key={index} career={career} isHighFit={true} />
                    )) || <p className="text-gray-500">No high-fit career matches available.</p>}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">{translateDynamicContent("Medium-Fit Career Options", t)}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results.detailedAnalysis.careerFit?.mediumFit?.map((career, index) => (
                      <CareerCard key={index} career={career} />
                    )) || <p className="text-gray-500">{translateDynamicContent("No medium-fit career options available.", t)}</p>}
                  </div>
                </div>
              </div>
            ) : (
              <LockedFeature featureName="Career Analysis" requiredTier="Career Roadmap Guide" />
            )}
          </TabsContent>

          {features.careerRoadmap && (
            <TabsContent value="roadmaps" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{translateDynamicContent("Career Roadmaps", t)}</h2>
                {results.detailedAnalysis.roadmaps?.map((roadmap, index) => (
                  <RoadmapCard key={index} roadmap={roadmap} />
                )) || <p className="text-gray-500">{translateDynamicContent("No roadmaps available.", t)}</p>}
              </div>
            </TabsContent>
          )}

          {features.developmentAreas && (
            <TabsContent value="development" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{translateDynamicContent("Development Areas", t)}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.detailedAnalysis.developmentAreas?.map((area, index) => (
                    <DevelopmentAreaCard key={index} area={area} />
                  )) || <p className="text-gray-500">{translateDynamicContent("No development areas available.", t)}</p>}
                </div>
              </div>
            </TabsContent>
          )}

          {features.marketInsights && (
            <TabsContent value="market" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{translateDynamicContent("Market Insights", t)}</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      {translateDynamicContent("Industry Trends", t)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.detailedAnalysis.marketInsights?.industryTrends?.map((trend, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                          <p className="text-sm text-gray-700">{translateDynamicContent(trend, t)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-green-600" />
                      {translateDynamicContent("Emerging Roles", t)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.detailedAnalysis.marketInsights?.emergingRoles?.map((role, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                          <Trophy className="h-4 w-4 text-green-600 mt-0.5" />
                          <p className="text-sm text-gray-700">{translateDynamicContent(role, t)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-purple-600" />
                      {translateDynamicContent("Skills in Demand", t)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {results.detailedAnalysis.marketInsights?.skillsInDemand?.map((skill, index) => (
                        <Badge key={index} variant="outline" className="justify-center p-2">
                          {translateDynamicContent(skill, t)}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-orange-600" />
                      {translateDynamicContent("Salary Trends", t)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-gray-700">{translateDynamicContent(results.detailedAnalysis.marketInsights?.salaryTrends || "", t)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          )}

          <TabsContent value="personality" className="space-y-6">
            {features.personalityProfile ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{translateDynamicContent("Personality Profile", t)}</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-blue-600" />
                        {translateDynamicContent("Cognitive Style", t)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-gray-700">{translateDynamicContent(results.detailedAnalysis.personalityProfile?.cognitiveStyle || "", t)}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-green-600" />
                        {translateDynamicContent("Work Style", t)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-gray-700">{translateDynamicContent(results.detailedAnalysis.personalityProfile?.workStyle || "", t)}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-600" />
                        {translateDynamicContent("Communication Style", t)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-gray-700">{translateDynamicContent(results.detailedAnalysis.personalityProfile?.communicationStyle || "", t)}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-orange-600" />
                        {translateDynamicContent("Decision Making", t)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <p className="text-gray-700">{translateDynamicContent(results.detailedAnalysis.personalityProfile?.decisionMaking || "", t)}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-red-600" />
                        {translateDynamicContent("Stress Management", t)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-red-50 rounded-lg">
                        <p className="text-gray-700">{translateDynamicContent(results.detailedAnalysis.personalityProfile?.stressManagement || "", t)}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <LockedFeature featureName="Personality Profile" requiredTier="Personality Deep Dive" />
            )}
          </TabsContent>

          <TabsContent value="networking" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{translateDynamicContent("Networking Strategy", t)}</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-blue-600" />
                      {translateDynamicContent("Target Industries", t)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.detailedAnalysis.networkingStrategy?.targetIndustries?.map((industry, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <Globe className="h-4 w-4 text-blue-600" />
                          <p className="text-sm font-medium text-gray-700">{translateDynamicContent(industry, t)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Network className="h-5 w-5 text-green-600" />
                      {translateDynamicContent("Key Professionals to Connect With", t)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.detailedAnalysis.networkingStrategy?.keyProfessionals?.map((professional, index) => (
                        <div key={index} className="p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-800">{translateDynamicContent(professional.role, t)}</h4>
                            <Badge variant="outline" className="text-xs">{translateDynamicContent("High Priority", t)}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{translateDynamicContent(professional.value, t)}</p>
                          <div className="flex gap-2">
                            {professional.platforms.map((platform, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {translateDynamicContent(platform, t)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      {translateDynamicContent("Networking Events", t)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.detailedAnalysis.networkingStrategy?.networkingEvents?.map((event, index) => (
                        <div key={index} className="p-4 bg-purple-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-800">{translateDynamicContent(event.type, t)}</h4>
                            <Badge variant="outline" className="text-xs">{translateDynamicContent(event.frequency, t)}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{translateDynamicContent(event.description, t)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-orange-600" />
                      {translateDynamicContent("Online Communities", t)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.detailedAnalysis.networkingStrategy?.onlineCommunities?.map((community, index) => (
                        <div key={index} className="p-4 bg-orange-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-800">{translateDynamicContent(community.platform, t)}</h4>
                            <Badge variant="outline" className="text-xs">{translateDynamicContent("Active", t)}</Badge>
                          </div>
                          <p className="text-sm font-medium text-gray-700 mb-1">{translateDynamicContent(community.community, t)}</p>
                          <p className="text-sm text-gray-600">{translateDynamicContent(community.focus, t)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interview" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                {translateDynamicContent("Interview Preparation Guide", t)}
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      {translateDynamicContent("Common Interview Questions", t)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.detailedAnalysis.interviewPreparation?.commonQuestions?.map((question: string, index: number) => (
                        <div key={index} className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-700">{translateDynamicContent(question, t)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      {translateDynamicContent("Role-Specific Questions", t)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.detailedAnalysis.interviewPreparation?.typeSpecificQuestions?.map((question: string, index: number) => (
                        <div key={index} className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-700">{translateDynamicContent(question, t)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                      {translateDynamicContent("Preparation Checklist", t)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">{translateDynamicContent("Research & Preparation:", t)}</h4>
                        <ul className="space-y-1">
                          {results.detailedAnalysis.interviewPreparation?.preparation?.research?.map((item: string, index: number) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                              {translateDynamicContent(item, t)}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">{translateDynamicContent("Documents to Prepare:", t)}</h4>
                        <ul className="space-y-1">
                          {results.detailedAnalysis.interviewPreparation?.preparation?.documents?.map((item: string, index: number) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                              {translateDynamicContent(item, t)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowRight className="h-5 w-5 text-orange-600" />
                      {translateDynamicContent("Follow-up Strategy", t)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.detailedAnalysis.interviewPreparation?.followUpStrategy?.map((step: string, index: number) => (
                        <div key={index} className="p-3 bg-orange-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-700">{translateDynamicContent(step, t)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="success" className="space-y-6">
            {features.transformationPlan ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-primary" />
                  {translateDynamicContent("90-Day Success Blueprint", t)}
                </h2>
              
              <div className="space-y-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      {translateDynamicContent("90-Day Transformation Plan", t)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">{translateDynamicContent(results.detailedAnalysis.successBlueprint?.transformationPlan?.days1to30?.title || "", t)}</h4>
                        <p className="text-sm text-gray-600 mb-3">{translateDynamicContent(results.detailedAnalysis.successBlueprint?.transformationPlan?.days1to30?.focus || "", t)}</p>
                        <div className="space-y-2">
                          {results.detailedAnalysis.successBlueprint?.transformationPlan?.days1to30?.activities?.map((activity: string, index: number) => (
                            <div key={index} className="text-xs text-gray-600">• {translateDynamicContent(activity, t)}</div>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">{translateDynamicContent(results.detailedAnalysis.successBlueprint?.transformationPlan?.days31to60?.title || "", t)}</h4>
                        <p className="text-sm text-gray-600 mb-3">{translateDynamicContent(results.detailedAnalysis.successBlueprint?.transformationPlan?.days31to60?.focus || "", t)}</p>
                        <div className="space-y-2">
                          {results.detailedAnalysis.successBlueprint?.transformationPlan?.days31to60?.activities?.map((activity: string, index: number) => (
                            <div key={index} className="text-xs text-gray-600">• {translateDynamicContent(activity, t)}</div>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">{translateDynamicContent(results.detailedAnalysis.successBlueprint?.transformationPlan?.days61to90?.title || "", t)}</h4>
                        <p className="text-sm text-gray-600 mb-3">{translateDynamicContent(results.detailedAnalysis.successBlueprint?.transformationPlan?.days61to90?.focus || "", t)}</p>
                        <div className="space-y-2">
                          {results.detailedAnalysis.successBlueprint?.transformationPlan?.days61to90?.activities?.map((activity: string, index: number) => (
                            <div key={index} className="text-xs text-gray-600">• {translateDynamicContent(activity, t)}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        {translateDynamicContent("Daily Habit Tracker", t)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {results.detailedAnalysis.successBlueprint?.habitTracker?.map((habit, index) => (
                          <div key={index} className="p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-800">{translateDynamicContent(habit.habit, t)}</h4>
                              <Badge variant="outline" className="text-xs">{translateDynamicContent(habit.frequency, t)}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{translateDynamicContent(habit.purpose, t)}</p>
                            <p className="text-xs text-gray-500">{translateDynamicContent("Track via:", t)} {translateDynamicContent(habit.trackingMethod, t)}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-purple-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-purple-600" />
                        {translateDynamicContent("Confidence Building Exercises", t)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {results.detailedAnalysis.successBlueprint?.confidenceBuilding?.map((exercise, index) => (
                          <div key={index} className="p-3 bg-purple-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-800">{translateDynamicContent(exercise.exercise, t)}</h4>
                              <Badge variant="outline" className="text-xs">{translateDynamicContent(exercise.timeframe, t)}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">{translateDynamicContent(exercise.description, t)}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-orange-600" />
                      {translateDynamicContent("Life Balance Assessment", t)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.detailedAnalysis.successBlueprint?.lifeBalanceAssessment?.areas?.map((area: any, index: number) => (
                        <div key={index} className="p-3 bg-orange-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-800">{translateDynamicContent(area.name, t)}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{translateDynamicContent(area.importance, t)}</Badge>
                              <span className="text-sm text-gray-600">{area.currentSatisfaction}/100</span>
                            </div>
                          </div>
                          <Progress value={area.currentSatisfaction} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            ) : (
              <LockedFeature featureName="Success Blueprint" requiredTier="Success Blueprint" />
            )}
          </TabsContent>

          <TabsContent value="ai-mentor" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                {translateDynamicContent("AI Career Mentor", t)}
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-600" />
                      {translateDynamicContent("Weekly Reflection Questions", t)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.detailedAnalysis.aiMentor?.weeklyQuestions?.map((item, index) => (
                        <div key={index} className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-start gap-3 mb-3">
                            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-gray-800 mb-1">{translateDynamicContent(item.question, t)}</h4>
                              <p className="text-sm text-gray-600">{translateDynamicContent(item.purpose, t)}</p>
                            </div>
                          </div>
                          <div className="mt-3 p-3 bg-white rounded border-l-2 border-blue-200">
                            <p className="text-sm text-gray-700">{translateDynamicContent(item.reflection, t)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      {translateDynamicContent("Monthly Goals", t)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.detailedAnalysis.aiMentor?.monthlyGoals?.map((goal, index) => (
                        <div key={index} className="p-4 bg-green-50 rounded-lg">
                          <h4 className="font-medium text-gray-800 mb-3">{translateDynamicContent(goal.goal, t)}</h4>
                          <div className="space-y-3">
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">{translateDynamicContent("Action Steps:", t)}</h5>
                              <ul className="space-y-1">
                                {goal.actions.map((action, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                                    {translateDynamicContent(action, t)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">{translateDynamicContent("Success Metrics:", t)}</h5>
                              <div className="flex flex-wrap gap-1">
                                {goal.metrics.map((metric, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {translateDynamicContent(metric, t)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2 border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      {translateDynamicContent("Personalized Career Tips", t)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.detailedAnalysis.aiMentor?.personalized_tips?.map((tip, index) => (
                        <div key={index} className="p-4 bg-purple-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Heart className="h-4 w-4 text-purple-600" />
                            <h4 className="font-medium text-gray-800">{translateDynamicContent(tip.category, t)}</h4>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">{translateDynamicContent(tip.tip, t)}</p>
                          <div className="p-3 bg-white rounded border-l-2 border-purple-200">
                            <p className="text-sm text-gray-600">{translateDynamicContent(tip.implementation, t)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button onClick={() => setLocation("/ikigai-test")}>{t('results:actionButtons.takeAgain')}</Button>
          <Button onClick={() => setLocation(`/dashboard?session=${sessionId}`)} variant="outline">{t('results:actionButtons.viewDashboard')}</Button>
          <Button 
            onClick={() => window.print()} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('results:actionButtons.downloadReport')}
          </Button>
          <Button 
            onClick={() => navigator.share ? navigator.share({
              title: 'My Ikigai Test Results',
              text: 'I discovered my life purpose with the Ikigai assessment!',
              url: window.location.href
            }) : navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied to clipboard!'))}
            variant="outline"
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            {t('results:actionButtons.shareResults')}
          </Button>
        </div>
      </div>
    </div>
  );
}