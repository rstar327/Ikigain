import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { testSessions, testResults, digitalProducts, digitalPurchases } from "@shared/schema";
import { eq, and, isNotNull, desc, sql } from "drizzle-orm";
import { setupReplitAuth, isAuthenticated, isAdmin } from "./replitAuthBuiltIn";
import { insertQuestionSchema, insertAnswerOptionSchema, insertTestSessionSchema, insertBlogPostSchema, insertShopProductSchema, insertCheckoutAnalyticsSchema } from "@shared/schema";
import { calculateIkigaiScores } from "../client/src/lib/ikigai";
import { generateSitemap, generateRSSFeed } from "./sitemap";
import { sendIkigaiResultsEmail } from "./sendgrid";
import { seoMiddleware } from "./seoMiddleware";
import { serveStaticFirst, debugStaticRoutes } from './staticRoutes';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bcrypt from "bcryptjs";
import crypto from 'crypto';

// Answer mapping data (server-side copy)
const answerMappings: Record<number, Array<{ category: string; subcategory: string }>> = {
  13: [
    { category: 'passion', subcategory: 'IntellectualPursuits' },
    { category: 'passion', subcategory: 'PhysicalActivities' },
    { category: 'vocation', subcategory: 'ProblemSolving' },
    { category: 'mission', subcategory: 'InterpersonalSkills' },
  ],
  14: [
    { category: 'vocation', subcategory: 'Leadership' },
    { category: 'vocation', subcategory: 'SpecializedKnowledge' },
    { category: 'mission', subcategory: 'CommunityBuilding' },
    { category: 'profession', subcategory: 'BusinessEntrepreneurship' },
  ],
  15: [
    { category: 'passion', subcategory: 'IntellectualPursuits' },
    { category: 'passion', subcategory: 'CreativeArts' },
    { category: 'vocation', subcategory: 'ProblemSolving' },
    { category: 'mission', subcategory: 'InterpersonalSkills' },
  ],
  16: [
    { category: 'vocation', subcategory: 'ProblemSolving' },
    { category: 'passion', subcategory: 'CreativeArts' },
    { category: 'mission', subcategory: 'InterpersonalSkills' },
    { category: 'mission', subcategory: 'SocialCauses' },
  ],
  17: [
    { category: 'vocation', subcategory: 'SpecializedKnowledge' },
    { category: 'passion', subcategory: 'CreativeArts' },
    { category: 'profession', subcategory: 'BusinessEntrepreneurship' },
    { category: 'mission', subcategory: 'EducationMentorship' },
  ],
  18: [
    { category: 'vocation', subcategory: 'Leadership' },
    { category: 'vocation', subcategory: 'SpecializedKnowledge' },
    { category: 'mission', subcategory: 'CommunityBuilding' },
    { category: 'vocation', subcategory: 'ProblemSolving' },
  ],
  19: [
    { category: 'passion', subcategory: 'IntellectualPursuits' },
    { category: 'passion', subcategory: 'PhysicalActivities' },
    { category: 'mission', subcategory: 'InterpersonalSkills' },
    { category: 'passion', subcategory: 'CreativeArts' },
  ],
  20: [
    { category: 'profession', subcategory: 'BusinessEntrepreneurship' },
    { category: 'vocation', subcategory: 'Leadership' },
    { category: 'passion', subcategory: 'PhysicalActivities' },
    { category: 'vocation', subcategory: 'SpecializedKnowledge' },
  ],
  21: [
    { category: 'mission', subcategory: 'EducationMentorship' },
    { category: 'passion', subcategory: 'PhysicalActivities' },
    { category: 'vocation', subcategory: 'ProblemSolving' },
    { category: 'vocation', subcategory: 'Leadership' },
  ],
  22: [
    { category: 'passion', subcategory: 'IntellectualPursuits' },
    { category: 'passion', subcategory: 'PhysicalActivities' },
    { category: 'mission', subcategory: 'SocialCauses' },
    { category: 'profession', subcategory: 'BusinessEntrepreneurship' },
  ],
  23: [
    { category: 'mission', subcategory: 'SocialCauses' },
    { category: 'passion', subcategory: 'PhysicalActivities' },
    { category: 'mission', subcategory: 'EducationMentorship' },
    { category: 'mission', subcategory: 'CommunityBuilding' },
  ],
  24: [
    { category: 'vocation', subcategory: 'SpecializedKnowledge' },
    { category: 'mission', subcategory: 'CommunityBuilding' },
    { category: 'profession', subcategory: 'BusinessEntrepreneurship' },
    { category: 'passion', subcategory: 'IntellectualPursuits' },
  ],
  25: [
    { category: 'vocation', subcategory: 'Leadership' },
    { category: 'vocation', subcategory: 'SpecializedKnowledge' },
    { category: 'mission', subcategory: 'SocialCauses' },
    { category: 'mission', subcategory: 'EducationMentorship' },
  ],
  26: [
    { category: 'vocation', subcategory: 'SpecializedKnowledge' },
    { category: 'vocation', subcategory: 'ProblemSolving' },
    { category: 'mission', subcategory: 'EducationMentorship' },
    { category: 'profession', subcategory: 'BusinessEntrepreneurship' },
  ],
  27: [
    { category: 'vocation', subcategory: 'Leadership' },
    { category: 'vocation', subcategory: 'SpecializedKnowledge' },
    { category: 'mission', subcategory: 'InterpersonalSkills' },
    { category: 'mission', subcategory: 'SocialCauses' },
  ],
  28: [
    { category: 'passion', subcategory: 'IntellectualPursuits' },
    { category: 'profession', subcategory: 'BusinessEntrepreneurship' },
    { category: 'mission', subcategory: 'CommunityBuilding' },
    { category: 'mission', subcategory: 'EducationMentorship' },
  ],
  29: [
    { category: 'vocation', subcategory: 'ProblemSolving' },
    { category: 'mission', subcategory: 'InterpersonalSkills' },
    { category: 'mission', subcategory: 'InterpersonalSkills' },
    { category: 'mission', subcategory: 'CommunityBuilding' },
  ],
  30: [
    { category: 'passion', subcategory: 'IntellectualPursuits' },
    { category: 'mission', subcategory: 'SocialCauses' },
    { category: 'vocation', subcategory: 'ProblemSolving' },
    { category: 'mission', subcategory: 'CommunityBuilding' },
  ],
};

function getAnswerMappings() {
  return answerMappings;
}

// Translation mapping for server-side content generation
const translations = {
  en: {
    weeklyQuestions: {
      impact: "What impact did you create for others this week?",
      growth: "How did you develop or support someone else's growth this week?",
      social: "What community or social issue captured your attention this week?"
    },
    monthlyGoals: {
      community: "Launch or contribute to a community initiative",
      leadership: "Develop leadership and organizational skills",
      role: "Take on a leadership role in an organization"
    },
    actionSteps: "Action Steps:",
    successMetrics: "Success Metrics:",
    timeline: "Timeline:",
    actionPlan: "Action Plan",
    resources: "Resources",
    currentLevel: "Current Level",
    targetLevel: "Target Level",
    priorities: {
      high: "High Priority",
      medium: "Medium Priority",
      low: "Low Priority"
    },
    phases: {
      foundation: "Foundation Phase",
      action: "Action Phase",
      optimization: "Optimization Phase"
    },
    timeframes: {
      "2-4 months": "2-4 months",
      "6-12 months": "6-12 months",
      "1-2 years": "1-2 years",
      "2-3 years": "2-3 years"
    }
  },
  es: {
    weeklyQuestions: {
      impact: "¿Qué impacto creaste para otros esta semana?",
      growth: "¿Cómo desarrollaste o apoyaste el crecimiento de alguien más esta semana?",
      social: "¿Qué tema comunitario o social captó tu atención esta semana?"
    },
    monthlyGoals: {
      community: "Lanzar o contribuir a una iniciativa comunitaria",
      leadership: "Desarrollar habilidades de liderazgo y organización",
      role: "Asumir un rol de liderazgo en una organización"
    },
    actionSteps: "Pasos de Acción:",
    successMetrics: "Métricas de Éxito:",
    timeline: "Cronograma:",
    actionPlan: "Plan de Acción",
    resources: "Recursos",
    currentLevel: "Nivel Actual",
    targetLevel: "Nivel Objetivo",
    priorities: {
      high: "Alta Prioridad",
      medium: "Prioridad Media",
      low: "Baja Prioridad"
    },
    phases: {
      foundation: "Fase de Fundación",
      action: "Fase de Acción",
      optimization: "Fase de Optimización"
    },
    timeframes: {
      "2-4 months": "2-4 meses",
      "6-12 months": "6-12 meses",
      "1-2 years": "1-2 años",
      "2-3 years": "2-3 años"
    }
  }
};

function translate(key: string, language: string = 'en', fallback: string = key): string {
  const lang = translations[language as keyof typeof translations] || translations.en;
  const keys = key.split('.');
  let value: any = lang;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return fallback;
    }
  }
  
  return typeof value === 'string' ? value : fallback;
}

function generatePremiumAnalysis(result: any, language: string = 'en') {
  const { primaryType, passionScore, missionScore, vocationScore, professionScore } = result;
  const passion = parseInt(passionScore) || 0;
  const mission = parseInt(missionScore) || 0;
  const vocation = parseInt(vocationScore) || 0;
  const profession = parseInt(professionScore) || 0;
  
  // Generate personality insights based on scores
  const personalityInsights = [
    `Your dominant area of ${primaryType.toLowerCase()} indicates a strong alignment with your natural talents and interests.`,
    `With a passion score of ${passion}, you show ${passion > 70 ? 'exceptional' : passion > 50 ? 'good' : 'moderate'} engagement with activities that energize you.`,
    `Your mission score of ${mission} reflects your ${mission > 70 ? 'strong' : mission > 50 ? 'developing' : 'emerging'} sense of purpose and meaning.`,
    `The vocation score of ${vocation} suggests you have ${vocation > 70 ? 'excellent' : vocation > 50 ? 'solid' : 'developing'} natural abilities and skills.`,
    `Your profession score of ${profession} indicates ${profession > 70 ? 'strong' : profession > 50 ? 'good' : 'growing'} market viability in your areas of interest.`
  ];

  // Generate career matches based on primary type
  const careerMatches = getCareerMatches(primaryType, { passion, mission, vocation, profession }, language);
  
  // Generate development roadmaps
  const roadmaps = generateCareerRoadmaps(primaryType, careerMatches.highFit, language);
  
  // Generate development areas
  const developmentAreas = generateDevelopmentAreas({ passion, mission, vocation, profession }, language);
  
  // Generate market insights
  const marketInsights = generateMarketInsights(primaryType);
  
  // Generate personality profile
  const personalityProfile = generatePersonalityProfile(primaryType, { passion, mission, vocation, profession });
  
  // Generate networking strategy
  const networkingStrategy = generateNetworkingStrategy(primaryType);
  
  // Generate AI mentor content
  const aiMentor = generateAIMentor(primaryType, { passion, mission, vocation, profession }, language);
  
  // Generate interview preparation
  const interviewPreparation = generateInterviewPreparation(primaryType);
  
  // Generate success blueprint
  const successBlueprint = generateSuccessBlueprint(primaryType, { passion, mission, vocation, profession });

  return {
    personalityInsights,
    careerFit: careerMatches,
    roadmaps,
    developmentAreas,
    marketInsights,
    personalityProfile,
    networkingStrategy,
    aiMentor,
    interviewPreparation,
    successBlueprint
  };
}

function getCareerContentTranslation(key: string, language: string = 'en'): string {
  const translations = {
    en: {
      // Career descriptions
      "Design intuitive and visually appealing user experiences for digital products.": "Design intuitive and visually appealing user experiences for digital products.",
      "Lead creative teams and develop brand strategies for marketing campaigns.": "Lead creative teams and develop brand strategies for marketing campaigns.",
      "Guide product development from conception to launch, balancing user needs and business goals.": "Guide product development from conception to launch, balancing user needs and business goals.",
      "Develop and execute marketing strategies to promote products and services.": "Develop and execute marketing strategies to promote products and services.",
      "Use creative processes to help people express themselves and heal.": "Use creative processes to help people express themselves and heal.",
      "Lead organizations focused on social impact and community development.": "Lead organizations focused on social impact and community development.",
      "Help individuals and communities overcome challenges and improve their lives.": "Help individuals and communities overcome challenges and improve their lives.",
      "Help organizations implement environmentally responsible practices.": "Help organizations implement environmentally responsible practices.",
      "Design, develop, and maintain software applications and systems.": "Design, develop, and maintain software applications and systems.",
      "Analyze complex data to extract insights and drive business decisions.": "Analyze complex data to extract insights and drive business decisions.",
      "Conduct research to advance knowledge in specialized fields.": "Conduct research to advance knowledge in specialized fields.",
      "Educate and inspire students across various subjects and age groups.": "Educate and inspire students across various subjects and age groups.",
      "Manage employee relations, recruitment, and organizational development.": "Manage employee relations, recruitment, and organizational development.",
      "Advise organizations on strategic decisions and operational improvements.": "Advise organizations on strategic decisions and operational improvements.",
      "Analyze financial markets and investment opportunities.": "Analyze financial markets and investment opportunities.",
      "Lead sales teams and develop strategies to drive revenue growth.": "Lead sales teams and develop strategies to drive revenue growth.",
      "Coordinate teams and resources to deliver projects on time and within budget.": "Coordinate teams and resources to deliver projects on time and within budget.",
      "Provide financial planning and investment advice to clients.": "Provide financial planning and investment advice to clients.",
      
      // Skills
      "Design Thinking": "Design Thinking",
      "Prototyping": "Prototyping",
      "User Research": "User Research",
      "Visual Design": "Visual Design",
      "Creative Leadership": "Creative Leadership",
      "Brand Strategy": "Brand Strategy",
      "Team Management": "Team Management",
      "Visual Communication": "Visual Communication",
      "Product Strategy": "Product Strategy",
      "User Experience": "User Experience",
      "Cross-functional Leadership": "Cross-functional Leadership",
      "Marketing Strategy": "Marketing Strategy",
      "Content Creation": "Content Creation",
      "Analytics": "Analytics",
      "Campaign Management": "Campaign Management",
      "Art Therapy": "Art Therapy",
      "Psychology": "Psychology",
      "Counseling": "Counseling",
      "Creative Techniques": "Creative Techniques",
      "Leadership": "Leadership",
      "Fundraising": "Fundraising", 
      "Strategic Planning": "Strategic Planning",
      "Community Engagement": "Community Engagement",
      "Case Management": "Case Management",
      "Community Resources": "Community Resources",
      "Advocacy": "Advocacy",
      "Sustainability Strategy": "Sustainability Strategy",
      "Environmental Analysis": "Environmental Analysis",
      "Project Management": "Project Management",
      "Policy Knowledge": "Policy Knowledge",
      "Programming": "Programming",
      "System Design": "System Design",
      "Problem Solving": "Problem Solving",
      "Technical Leadership": "Technical Leadership",
      "Statistics": "Statistics",
      "Machine Learning": "Machine Learning",
      "Python/R": "Python/R",
      "Data Visualization": "Data Visualization",
      "Research Methods": "Research Methods",
      "Data Analysis": "Data Analysis",
      "Scientific Writing": "Scientific Writing",
      "Critical Thinking": "Critical Thinking",
      "Curriculum Development": "Curriculum Development",
      "Classroom Management": "Classroom Management",
      "Educational Technology": "Educational Technology",
      "Assessment": "Assessment",
      "HR Management": "HR Management",
      "Employee Relations": "Employee Relations",
      "Recruitment": "Recruitment",
      "Policy Development": "Policy Development",
      "Strategic Analysis": "Strategic Analysis",
      "Presentation": "Presentation",
      "Client Management": "Client Management",
      "Financial Analysis": "Financial Analysis",
      "Market Research": "Market Research",
      "Risk Assessment": "Risk Assessment",
      "Investment Strategy": "Investment Strategy",
      "Sales Strategy": "Sales Strategy",
      "Team Leadership": "Team Leadership",
      "Customer Relations": "Customer Relations",
      "Performance Management": "Performance Management",
      "Team Coordination": "Team Coordination",
      "Risk Management": "Risk Management",
      "Process Optimization": "Process Optimization",
      "Financial Planning": "Financial Planning",
      "Investment Knowledge": "Investment Knowledge",
      "Client Relations": "Client Relations",
      
      // Growth descriptions
      "High demand, 13% growth expected": "High demand, 13% growth expected",
      "Steady growth, 5% expected": "Steady growth, 5% expected",
      "Very high demand, 25% growth expected": "Very high demand, 25% growth expected",
      "Moderate growth, 8% expected": "Moderate growth, 8% expected",
      "High growth, 18% expected": "High growth, 18% expected",
      "Steady growth, 4% expected": "Steady growth, 4% expected",
      "High growth, 16% expected": "High growth, 16% expected",
      "Very high growth, 28% expected": "Very high growth, 28% expected",
      "Very high demand, 22% growth expected": "Very high demand, 22% growth expected",
      "Extremely high demand, 35% growth expected": "Extremely high demand, 35% growth expected",
      "Steady growth, 6% expected": "Steady growth, 6% expected",
      "High growth, 14% expected": "High growth, 14% expected",
      "Good growth, 9% expected": "Good growth, 9% expected",
      "High growth, 11% expected": "High growth, 11% expected",
      "Steady growth, 7% expected": "Steady growth, 7% expected"
    },
    es: {
      // Career descriptions
      "Design intuitive and visually appealing user experiences for digital products.": "Diseñar experiencias de usuario intuitivas y visualmente atractivas para productos digitales.",
      "Lead creative teams and develop brand strategies for marketing campaigns.": "Liderar equipos creativos y desarrollar estrategias de marca para campañas de marketing.",
      "Guide product development from conception to launch, balancing user needs and business goals.": "Guiar el desarrollo de productos desde la concepción hasta el lanzamiento, equilibrando necesidades del usuario y objetivos comerciales.",
      "Develop and execute marketing strategies to promote products and services.": "Desarrollar y ejecutar estrategias de marketing para promover productos y servicios.",
      "Use creative processes to help people express themselves and heal.": "Usar procesos creativos para ayudar a las personas a expresarse y sanar.",
      "Lead organizations focused on social impact and community development.": "Liderar organizaciones enfocadas en el impacto social y desarrollo comunitario.",
      "Help individuals and communities overcome challenges and improve their lives.": "Ayudar a individuos y comunidades a superar desafíos y mejorar sus vidas.",
      "Help organizations implement environmentally responsible practices.": "Ayudar a las organizaciones a implementar prácticas ambientalmente responsables.",
      "Design, develop, and maintain software applications and systems.": "Diseñar, desarrollar y mantener aplicaciones y sistemas de software.",
      "Analyze complex data to extract insights and drive business decisions.": "Analizar datos complejos para extraer insights y impulsar decisiones comerciales.",
      "Conduct research to advance knowledge in specialized fields.": "Realizar investigación para avanzar el conocimiento en campos especializados.",
      "Educate and inspire students across various subjects and age groups.": "Educar e inspirar a estudiantes de diversas materias y grupos de edad.",
      "Manage employee relations, recruitment, and organizational development.": "Gestionar relaciones laborales, reclutamiento y desarrollo organizacional.",
      "Advise organizations on strategic decisions and operational improvements.": "Asesorar a organizaciones sobre decisiones estratégicas y mejoras operacionales.",
      "Analyze financial markets and investment opportunities.": "Analizar mercados financieros y oportunidades de inversión.",
      "Lead sales teams and develop strategies to drive revenue growth.": "Liderar equipos de ventas y desarrollar estrategias para impulsar el crecimiento de ingresos.",
      "Coordinate teams and resources to deliver projects on time and within budget.": "Coordinar equipos y recursos para entregar proyectos a tiempo y dentro del presupuesto.",
      "Provide financial planning and investment advice to clients.": "Proporcionar planificación financiera y asesoramiento de inversión a clientes.",
      
      // Skills
      "Design Thinking": "Pensamiento de Diseño",
      "Prototyping": "Prototipado",
      "User Research": "Investigación de Usuario",
      "Visual Design": "Diseño Visual",
      "Creative Leadership": "Liderazgo Creativo",
      "Brand Strategy": "Estrategia de Marca",
      "Team Management": "Gestión de Equipo",
      "Visual Communication": "Comunicación Visual",
      "Product Strategy": "Estrategia de Producto",
      "User Experience": "Experiencia de Usuario",
      "Cross-functional Leadership": "Liderazgo Multifuncional",
      "Marketing Strategy": "Estrategia de Marketing",
      "Content Creation": "Creación de Contenido",
      "Analytics": "Análisis",
      "Campaign Management": "Gestión de Campañas",
      "Art Therapy": "Arteterapia",
      "Psychology": "Psicología",
      "Counseling": "Asesoramiento",
      "Creative Techniques": "Técnicas Creativas",
      "Leadership": "Liderazgo",
      "Fundraising": "Recaudación de Fondos",
      "Strategic Planning": "Planificación Estratégica",
      "Community Engagement": "Participación Comunitaria",
      "Case Management": "Gestión de Casos",
      "Community Resources": "Recursos Comunitarios",
      "Advocacy": "Defensa",
      "Sustainability Strategy": "Estrategia de Sostenibilidad",
      "Environmental Analysis": "Análisis Ambiental",
      "Project Management": "Gestión de Proyectos",
      "Policy Knowledge": "Conocimiento de Políticas",
      "Programming": "Programación",
      "System Design": "Diseño de Sistemas",
      "Problem Solving": "Resolución de Problemas",
      "Technical Leadership": "Liderazgo Técnico",
      "Statistics": "Estadísticas",
      "Machine Learning": "Aprendizaje Automático",
      "Python/R": "Python/R",
      "Data Visualization": "Visualización de Datos",
      "Research Methods": "Métodos de Investigación",
      "Data Analysis": "Análisis de Datos",
      "Scientific Writing": "Escritura Científica",
      "Critical Thinking": "Pensamiento Crítico",
      "Curriculum Development": "Desarrollo Curricular",
      "Classroom Management": "Gestión de Aula",
      "Educational Technology": "Tecnología Educativa",
      "Assessment": "Evaluación",
      "HR Management": "Gestión de RRHH",
      "Employee Relations": "Relaciones Laborales",
      "Recruitment": "Reclutamiento",
      "Policy Development": "Desarrollo de Políticas",
      "Strategic Analysis": "Análisis Estratégico",
      "Presentation": "Presentación",
      "Client Management": "Gestión de Clientes",
      "Financial Analysis": "Análisis Financiero",
      "Market Research": "Investigación de Mercado",
      "Risk Assessment": "Evaluación de Riesgos",
      "Investment Strategy": "Estrategia de Inversión",
      "Sales Strategy": "Estrategia de Ventas",
      "Team Leadership": "Liderazgo de Equipo",
      "Customer Relations": "Relaciones con Clientes",
      "Performance Management": "Gestión de Desempeño",
      "Team Coordination": "Coordinación de Equipo",
      "Risk Management": "Gestión de Riesgos",
      "Process Optimization": "Optimización de Procesos",
      "Financial Planning": "Planificación Financiera",
      "Investment Knowledge": "Conocimiento de Inversiones",
      "Client Relations": "Relaciones con Clientes",
      
      // Growth descriptions
      "High demand, 13% growth expected": "Alta demanda, 13% crecimiento esperado",
      "Steady growth, 5% expected": "Crecimiento estable, 5% esperado",
      "Very high demand, 25% growth expected": "Demanda muy alta, 25% crecimiento esperado",
      "Moderate growth, 8% expected": "Crecimiento moderado, 8% esperado",
      "High growth, 18% expected": "Alto crecimiento, 18% esperado",
      "Steady growth, 4% expected": "Crecimiento estable, 4% esperado",
      "High growth, 16% expected": "Alto crecimiento, 16% esperado",
      "Very high growth, 28% expected": "Crecimiento muy alto, 28% esperado",
      "Very high demand, 22% growth expected": "Demanda muy alta, 22% crecimiento esperado",
      "Extremely high demand, 35% growth expected": "Demanda extremadamente alta, 35% crecimiento esperado",
      "Steady growth, 6% expected": "Crecimiento estable, 6% esperado",
      "High growth, 14% expected": "Alto crecimiento, 14% esperado",
      "Good growth, 9% expected": "Buen crecimiento, 9% esperado",
      "High growth, 11% expected": "Alto crecimiento, 11% esperado",
      "Steady growth, 7% expected": "Crecimiento estable, 7% esperado"
    }
  };
  
  const langTranslations = translations[language as keyof typeof translations];
  if (!langTranslations) return key;
  return (langTranslations as any)[key] || key;
}

function getCareerTranslation(careerKey: string, language: string = 'en'): string {
  const careerTranslations = {
    en: {
      "Non-profit Director": "Non-profit Director",
      "Social Worker": "Social Worker",
      "Sustainability Consultant": "Sustainability Consultant",
      "Teacher": "Teacher",
      "Human Resources Manager": "Human Resources Manager",
      "Management Consultant": "Management Consultant",
      "Investment Analyst": "Investment Analyst",
      "Sales Director": "Sales Director",
      "Project Manager": "Project Manager",
      "Financial Advisor": "Financial Advisor",
      "UX/UI Designer": "UX/UI Designer",
      "Creative Director": "Creative Director",
      "Marketing Manager": "Marketing Manager",
      "Content Creator": "Content Creator",
      "Research Scientist": "Research Scientist",
      "Technical Writer": "Technical Writer",
      "Business Analyst": "Business Analyst",
      "Product Manager": "Product Manager",
      "Art Therapist": "Art Therapist",
      "Software Engineer": "Software Engineer",
      "Systems Analyst": "Systems Analyst",
      "Data Scientist": "Data Scientist"
    },
    es: {
      "Non-profit Director": "Director/a de ONG",
      "Social Worker": "Trabajador/a Social",
      "Sustainability Consultant": "Consultor/a de Sostenibilidad",
      "Teacher": "Maestro/a",
      "Human Resources Manager": "Gerente de Recursos Humanos",
      "Management Consultant": "Consultor/a de Gestión",
      "Investment Analyst": "Analista de Inversiones",
      "Sales Director": "Director/a de Ventas",
      "Project Manager": "Gerente de Proyectos",
      "Financial Advisor": "Asesor/a Financiero",
      "UX/UI Designer": "Diseñador/a UX/UI",
      "Creative Director": "Director/a Creativo",
      "Marketing Manager": "Gerente de Marketing",
      "Content Creator": "Creador/a de Contenido",
      "Research Scientist": "Científico/a de Investigación",
      "Technical Writer": "Redactor/a Técnico",
      "Business Analyst": "Analista de Negocio",
      "Product Manager": "Gerente de Producto",
      "Art Therapist": "Arteterapeuta",
      "Software Engineer": "Ingeniero/a de Software",
      "Systems Analyst": "Analista de Sistemas",
      "Data Scientist": "Científico/a de Datos"
    }
  };
  
  const langTranslations = careerTranslations[language as keyof typeof careerTranslations];
  if (!langTranslations) return careerKey;
  return (langTranslations as any)[careerKey] || careerKey;
}

function getCareerMatches(primaryType: string, scores: any, language: string = 'en') {
  const careerDatabase = {
    "Creative Enthusiast": {
      highFit: [
        {
          title: getCareerTranslation('UX/UI Designer', language),
          match: 92,
          description: getCareerContentTranslation("Design intuitive and visually appealing user experiences for digital products.", language),
          skills: ["Design Thinking", "Prototyping", "User Research", "Visual Design"].map(skill => getCareerContentTranslation(skill, language)),
          growth: getCareerContentTranslation("High demand, 13% growth expected", language),
          salary: "$65,000 - $120,000"
        },
        {
          title: getCareerTranslation('Creative Director', language),
          match: 88,
          description: getCareerContentTranslation("Lead creative teams and develop brand strategies for marketing campaigns.", language),
          skills: ["Creative Leadership", "Brand Strategy", "Team Management", "Visual Communication"].map(skill => getCareerContentTranslation(skill, language)),
          growth: getCareerContentTranslation("Steady growth, 5% expected", language),
          salary: "$80,000 - $150,000"
        },
        {
          title: getCareerTranslation('Product Manager', language),
          match: 85,
          description: getCareerContentTranslation("Guide product development from conception to launch, balancing user needs and business goals.", language),
          skills: ["Product Strategy", "User Experience", "Data Analysis", "Cross-functional Leadership"].map(skill => getCareerContentTranslation(skill, language)),
          growth: getCareerContentTranslation("Very high demand, 25% growth expected", language),
          salary: "$90,000 - $160,000"
        }
      ],
      mediumFit: [
        {
          title: getCareerTranslation('Marketing Manager', language),
          match: 78,
          description: getCareerContentTranslation("Develop and execute marketing strategies to promote products and services.", language),
          skills: ["Marketing Strategy", "Content Creation", "Analytics", "Campaign Management"].map(skill => getCareerContentTranslation(skill, language)),
          growth: getCareerContentTranslation("Moderate growth, 8% expected", language),
          salary: "$55,000 - $95,000"
        },
        {
          title: getCareerTranslation('Art Therapist', language),
          match: 72,
          description: getCareerContentTranslation("Use creative processes to help people express themselves and heal.", language),
          skills: ["Art Therapy", "Psychology", "Counseling", "Creative Techniques"].map(skill => getCareerContentTranslation(skill, language)),
          growth: getCareerContentTranslation("High growth, 18% expected", language),
          salary: "$45,000 - $75,000"
        }
      ]
    },
    "Skilled Expert": {
      highFit: [
        {
          title: getCareerTranslation('Software Engineer', language),
          match: 94,
          description: getCareerContentTranslation("Design, develop, and maintain software applications and systems.", language),
          skills: ["Programming", "System Design", "Problem Solving", "Technical Leadership"].map(skill => getCareerContentTranslation(skill, language)),
          growth: getCareerContentTranslation("Very high demand, 22% growth expected", language),
          salary: "$85,000 - $180,000"
        },
        {
          title: getCareerTranslation('Data Scientist', language),
          match: 90,
          description: getCareerContentTranslation("Analyze complex data to extract insights and drive business decisions.", language),
          skills: ["Statistics", "Machine Learning", "Python/R", "Data Visualization"].map(skill => getCareerContentTranslation(skill, language)),
          growth: getCareerContentTranslation("Extremely high demand, 35% growth expected", language),
          salary: "$95,000 - $200,000"
        },
        {
          title: getCareerTranslation('Research Scientist', language),
          match: 87,
          description: getCareerContentTranslation("Conduct research to advance knowledge in specialized fields.", language),
          skills: ["Research Methods", "Data Analysis", "Scientific Writing", "Critical Thinking"].map(skill => getCareerContentTranslation(skill, language)),
          growth: getCareerContentTranslation("Steady growth, 6% expected", language),
          salary: "$70,000 - $130,000"
        }
      ],
      mediumFit: [
        {
          title: getCareerTranslation('Technical Writer', language),
          match: 75,
          description: "Create clear documentation and guides for technical products.",
          skills: ["Technical Writing", "Documentation", "Communication", "Subject Matter Expertise"],
          growth: "Moderate growth, 7% expected",
          salary: "$60,000 - $100,000"
        },
        {
          title: getCareerTranslation('Business Analyst', language),
          match: 70,
          description: "Analyze business processes and recommend improvements.",
          skills: ["Business Analysis", "Process Improvement", "Data Analysis", "Requirements Gathering"],
          growth: "Good growth, 11% expected",
          salary: "$65,000 - $110,000"
        }
      ]
    },
    "Purpose-Driven Leader": {
      highFit: [
        {
          title: getCareerTranslation('Non-profit Director', language),
          match: 95,
          description: getCareerContentTranslation("Lead organizations focused on social impact and community development.", language),
          skills: ["Leadership", "Fundraising", "Strategic Planning", "Community Engagement"].map(skill => getCareerContentTranslation(skill, language)),
          growth: getCareerContentTranslation("Steady growth, 4% expected", language),
          salary: "$60,000 - $120,000"
        },
        {
          title: getCareerTranslation('Social Worker', language),
          match: 90,
          description: getCareerContentTranslation("Help individuals and communities overcome challenges and improve their lives.", language),
          skills: ["Counseling", "Case Management", "Community Resources", "Advocacy"].map(skill => getCareerContentTranslation(skill, language)),
          growth: getCareerContentTranslation("High growth, 16% expected", language),
          salary: "$45,000 - $85,000"
        },
        {
          title: getCareerTranslation('Sustainability Consultant', language),
          match: 88,
          description: getCareerContentTranslation("Help organizations implement environmentally responsible practices.", language),
          skills: ["Sustainability Strategy", "Environmental Analysis", "Project Management", "Policy Knowledge"].map(skill => getCareerContentTranslation(skill, language)),
          growth: getCareerContentTranslation("Very high growth, 28% expected", language),
          salary: "$70,000 - $130,000"
        }
      ],
      mediumFit: [
        {
          title: getCareerTranslation('Teacher', language),
          match: 82,
          description: getCareerContentTranslation("Educate and inspire students across various subjects and age groups.", language),
          skills: ["Curriculum Development", "Classroom Management", "Educational Technology", "Assessment"].map(skill => getCareerContentTranslation(skill, language)),
          growth: getCareerContentTranslation("Moderate growth, 8% expected", language),
          salary: "$40,000 - $70,000"
        },
        {
          title: getCareerTranslation('Human Resources Manager', language),
          match: 76,
          description: getCareerContentTranslation("Manage employee relations, recruitment, and organizational development.", language),
          skills: ["HR Management", "Employee Relations", "Recruitment", "Policy Development"].map(skill => getCareerContentTranslation(skill, language)),
          growth: getCareerContentTranslation("Steady growth, 6% expected", language),
          salary: "$65,000 - $115,000"
        }
      ]
    },
    "Career-Focused Achiever": {
      highFit: [
        {
          title: getCareerTranslation('Management Consultant', language),
          match: 93,
          description: getCareerContentTranslation("Advise organizations on strategic decisions and operational improvements.", language),
          skills: ["Strategic Analysis", "Problem Solving", "Presentation", "Client Management"].map(skill => getCareerContentTranslation(skill, language)),
          growth: getCareerContentTranslation("High growth, 14% expected", language),
          salary: "$85,000 - $180,000"
        },
        {
          title: getCareerTranslation('Investment Analyst', language),
          match: 89,
          description: getCareerContentTranslation("Analyze financial markets and investment opportunities.", language),
          skills: ["Financial Analysis", "Market Research", "Risk Assessment", "Investment Strategy"].map(skill => getCareerContentTranslation(skill, language)),
          growth: getCareerContentTranslation("Good growth, 9% expected", language),
          salary: "$75,000 - $150,000"
        },
        {
          title: getCareerTranslation('Sales Director', language),
          match: 86,
          description: getCareerContentTranslation("Lead sales teams and develop strategies to drive revenue growth.", language),
          skills: ["Sales Strategy", "Team Leadership", "Customer Relations", "Performance Management"].map(skill => getCareerContentTranslation(skill, language)),
          growth: getCareerContentTranslation("Steady growth, 5% expected", language),
          salary: "$80,000 - $160,000"
        }
      ],
      mediumFit: [
        {
          title: getCareerTranslation('Project Manager', language),
          match: 78,
          description: getCareerContentTranslation("Coordinate teams and resources to deliver projects on time and within budget.", language),
          skills: ["Project Management", "Team Coordination", "Risk Management", "Process Optimization"].map(skill => getCareerContentTranslation(skill, language)),
          growth: getCareerContentTranslation("High growth, 11% expected", language),
          salary: "$70,000 - $130,000"
        },
        {
          title: getCareerTranslation('Financial Advisor', language),
          match: 74,
          description: getCareerContentTranslation("Provide financial planning and investment advice to clients.", language),
          skills: ["Financial Planning", "Investment Knowledge", "Client Relations", "Risk Assessment"].map(skill => getCareerContentTranslation(skill, language)),
          growth: getCareerContentTranslation("Steady growth, 7% expected", language),
          salary: "$60,000 - $120,000"
        }
      ]
    }
  };

  return careerDatabase[primaryType as keyof typeof careerDatabase] || careerDatabase["Creative Enthusiast"];
}

function getRoadmapTranslations(language: string = 'en') {
  const translations = {
    en: {
      phases: {
        "Foundation Building": "Foundation Building",
        "Practical Experience": "Practical Experience",
        "Specialization": "Specialization",
        "Leadership Development": "Leadership Development",
        "Advanced Expertise": "Advanced Expertise",
        "Technical Foundation": "Technical Foundation",
        "Industry Experience": "Industry Experience",
        "Senior Expertise": "Senior Expertise"
      },
      timeline: {
        "2-3 years to senior level": "2-3 years to senior level",
        "3-5 years to senior level": "3-5 years to senior level",
        "4-6 years to senior level": "4-6 years to senior level",
        "3-4 years to senior level": "3-4 years to senior level"
      },
      activities: {
        "Complete UX/UI design bootcamp or online courses": "Complete UX/UI design bootcamp or online courses",
        "Build portfolio with 3-5 projects": "Build portfolio with 3-5 projects",
        "Learn design tools (Figma, Sketch, Adobe Creative Suite)": "Learn design tools (Figma, Sketch, Adobe Creative Suite)",
        "Practice user research methodologies": "Practice user research methodologies",
        "Apply for junior UX/UI positions or internships": "Apply for junior UX/UI positions or internships",
        "Work on real client projects": "Work on real client projects",
        "Collaborate with development teams": "Collaborate with development teams",
        "Conduct user testing sessions": "Conduct user testing sessions",
        "Lead design projects from conception to completion": "Lead design projects from conception to completion",
        "Mentor junior designers": "Mentor junior designers",
        "Develop design system standards": "Develop design system standards",
        "Present designs to stakeholders": "Present designs to stakeholders",
        "Master programming fundamentals (algorithms, data structures)": "Master programming fundamentals (algorithms, data structures)",
        "Learn primary programming language (Python, JavaScript, Java)": "Learn primary programming language (Python, JavaScript, Java)",
        "Build personal projects and contribute to open source": "Build personal projects and contribute to open source",
        "Complete coding bootcamp or computer science degree": "Complete coding bootcamp or computer science degree",
        "Secure entry-level or junior developer position": "Secure entry-level or junior developer position",
        "Work on production applications": "Work on production applications",
        "Learn team collaboration and code review processes": "Learn team collaboration and code review processes",
        "Gain experience with different technologies and frameworks": "Gain experience with different technologies and frameworks"
      },
      skills: {
        "Design Principles": "Design Principles",
        "User Research": "User Research",
        "Prototyping": "Prototyping",
        "Visual Design": "Visual Design",
        "Design Systems": "Design Systems",
        "Collaboration": "Collaboration",
        "User Testing": "User Testing",
        "Design Handoff": "Design Handoff",
        "Design Leadership": "Design Leadership",
        "Strategic Thinking": "Strategic Thinking",
        "Mentoring": "Mentoring",
        "Stakeholder Management": "Stakeholder Management",
        "Programming": "Programming",
        "Problem Solving": "Problem Solving",
        "Version Control": "Version Control",
        "Software Architecture": "Software Architecture",
        "Full-stack Development": "Full-stack Development",
        "Testing": "Testing",
        "Code Review": "Code Review",
        "Agile Methodologies": "Agile Methodologies"
      }
    },
    es: {
      phases: {
        "Foundation Building": "Construcción de Base",
        "Practical Experience": "Experiencia Práctica",
        "Specialization": "Especialización",
        "Leadership Development": "Desarrollo de Liderazgo",
        "Advanced Expertise": "Experiencia Avanzada",
        "Technical Foundation": "Fundación Técnica",
        "Industry Experience": "Experiencia en la Industria",
        "Senior Expertise": "Experiencia Senior"
      },
      timeline: {
        "2-3 years to senior level": "2-3 años para nivel senior",
        "3-5 years to senior level": "3-5 años para nivel senior",
        "4-6 years to senior level": "4-6 años para nivel senior",
        "3-4 years to senior level": "3-4 años para nivel senior"
      },
      activities: {
        "Complete UX/UI design bootcamp or online courses": "Completar bootcamp de diseño UX/UI o cursos en línea",
        "Build portfolio with 3-5 projects": "Construir portafolio con 3-5 proyectos",
        "Learn design tools (Figma, Sketch, Adobe Creative Suite)": "Aprender herramientas de diseño (Figma, Sketch, Adobe Creative Suite)",
        "Practice user research methodologies": "Practicar metodologías de investigación de usuario",
        "Apply for junior UX/UI positions or internships": "Aplicar para posiciones junior UX/UI o pasantías",
        "Work on real client projects": "Trabajar en proyectos reales de clientes",
        "Collaborate with development teams": "Colaborar con equipos de desarrollo",
        "Conduct user testing sessions": "Conducir sesiones de pruebas de usuario",
        "Lead design projects from conception to completion": "Liderar proyectos de diseño desde la concepción hasta la finalización",
        "Mentor junior designers": "Mentorear diseñadores junior",
        "Develop design system standards": "Desarrollar estándares de sistema de diseño",
        "Present designs to stakeholders": "Presentar diseños a las partes interesadas",
        "Master programming fundamentals (algorithms, data structures)": "Dominar fundamentos de programación (algoritmos, estructuras de datos)",
        "Learn primary programming language (Python, JavaScript, Java)": "Aprender lenguaje de programación principal (Python, JavaScript, Java)",
        "Build personal projects and contribute to open source": "Construir proyectos personales y contribuir al código abierto",
        "Complete coding bootcamp or computer science degree": "Completar bootcamp de programación o grado en ciencias de la computación",
        "Secure entry-level or junior developer position": "Asegurar posición de desarrollador de nivel inicial o junior",
        "Work on production applications": "Trabajar en aplicaciones de producción",
        "Learn team collaboration and code review processes": "Aprender colaboración en equipo y procesos de revisión de código",
        "Gain experience with different technologies and frameworks": "Ganar experiencia con diferentes tecnologías y frameworks",
        "Learn core skills": "Aprender habilidades básicas",
        "Build portfolio": "Construir portafolio",
        "Gain basic experience": "Ganar experiencia básica",
        "Apply skills in real projects": "Aplicar habilidades en proyectos reales",
        "Build professional network": "Construir red profesional",
        "Gain industry experience": "Ganar experiencia en la industria",
        "Lead projects": "Liderar proyectos",
        "Mentor others": "Mentorear a otros",
        "Develop expertise": "Desarrollar experiencia",
        "Lead technical projects and architecture decisions": "Liderar proyectos técnicos y decisiones de arquitectura",
        "Mentor junior developers": "Mentorear desarrolladores junior",
        "Design scalable systems and applications": "Diseñar sistemas y aplicaciones escalables",
        "Contribute to technical strategy and planning": "Contribuir a la estrategia técnica y planificación"
      },
      skills: {
        "Design Principles": "Principios de Diseño",
        "User Research": "Investigación de Usuario",
        "Prototyping": "Prototipado",
        "Visual Design": "Diseño Visual",
        "Design Systems": "Sistemas de Diseño",
        "Collaboration": "Colaboración",
        "User Testing": "Pruebas de Usuario",
        "Design Handoff": "Entrega de Diseño",
        "Design Leadership": "Liderazgo de Diseño",
        "Strategic Thinking": "Pensamiento Estratégico",
        "Mentoring": "Mentoría",
        "Stakeholder Management": "Gestión de Partes Interesadas",
        "Programming": "Programación",
        "Problem Solving": "Resolución de Problemas",
        "Version Control": "Control de Versiones",
        "Software Architecture": "Arquitectura de Software",
        "Full-stack Development": "Desarrollo Full-stack",
        "Testing": "Pruebas",
        "Code Review": "Revisión de Código",
        "Agile Methodologies": "Metodologías Ágiles",
        "Core Competencies": "Competencias Básicas",
        "Industry Knowledge": "Conocimiento de la Industria",
        "Professional Skills": "Habilidades Profesionales",
        "Advanced Skills": "Habilidades Avanzadas",
        "Professional Development": "Desarrollo Profesional",
        "Industry Connections": "Conexiones de la Industria",
        "Leadership": "Liderazgo",
        "Expertise Development": "Desarrollo de Experiencia",
        "System Design": "Diseño de Sistemas",
        "Technical Leadership": "Liderazgo Técnico",
        "Architecture": "Arquitectura",
        "Performance Optimization": "Optimización de Rendimiento"
      }
    }
  };
  
  return translations[language as keyof typeof translations] || translations.en;
}

function generateCareerRoadmaps(primaryType: string, topCareers: any[], language: string = 'en') {
  const roadmapTrans = getRoadmapTranslations(language);
  
  const roadmapTemplates = {
    "UX/UI Designer": {
      career: getCareerTranslation("UX/UI Designer", language),
      timeline: roadmapTrans.timeline["2-3 years to senior level"],
      steps: [
        {
          phase: roadmapTrans.phases["Foundation Building"],
          duration: "6-12 months",
          activities: [
            roadmapTrans.activities["Complete UX/UI design bootcamp or online courses"],
            roadmapTrans.activities["Build portfolio with 3-5 projects"],
            roadmapTrans.activities["Learn design tools (Figma, Sketch, Adobe Creative Suite)"],
            roadmapTrans.activities["Practice user research methodologies"]
          ],
          skills: [roadmapTrans.skills["Design Principles"], roadmapTrans.skills["User Research"], roadmapTrans.skills["Prototyping"], roadmapTrans.skills["Visual Design"]]
        },
        {
          phase: roadmapTrans.phases["Practical Experience"],
          duration: "12-18 months",
          activities: [
            roadmapTrans.activities["Apply for junior UX/UI positions or internships"],
            roadmapTrans.activities["Work on real client projects"],
            roadmapTrans.activities["Collaborate with development teams"],
            roadmapTrans.activities["Conduct user testing sessions"]
          ],
          skills: [roadmapTrans.skills["Design Systems"], roadmapTrans.skills["Collaboration"], roadmapTrans.skills["User Testing"], roadmapTrans.skills["Design Handoff"]]
        },
        {
          phase: roadmapTrans.phases["Advanced Expertise"],
          duration: "18+ months",
          activities: [
            roadmapTrans.activities["Lead design projects from conception to completion"],
            roadmapTrans.activities["Mentor junior designers"],
            roadmapTrans.activities["Develop design system standards"],
            roadmapTrans.activities["Present designs to stakeholders"]
          ],
          skills: [roadmapTrans.skills["Design Leadership"], roadmapTrans.skills["Strategic Thinking"], roadmapTrans.skills["Mentoring"], roadmapTrans.skills["Stakeholder Management"]]
        }
      ]
    },
    "Software Engineer": {
      career: getCareerTranslation("Software Engineer", language),
      timeline: roadmapTrans.timeline["3-4 years to senior level"],
      steps: [
        {
          phase: roadmapTrans.phases["Technical Foundation"],
          duration: "8-12 months",
          activities: [
            roadmapTrans.activities["Master programming fundamentals (algorithms, data structures)"],
            roadmapTrans.activities["Learn primary programming language (Python, JavaScript, Java)"],
            roadmapTrans.activities["Build personal projects and contribute to open source"],
            roadmapTrans.activities["Complete coding bootcamp or computer science degree"]
          ],
          skills: [roadmapTrans.skills["Programming"], roadmapTrans.skills["Problem Solving"], roadmapTrans.skills["Version Control"], roadmapTrans.skills["Software Architecture"]]
        },
        {
          phase: roadmapTrans.phases["Industry Experience"],
          duration: "18-24 months",
          activities: [
            roadmapTrans.activities["Secure entry-level or junior developer position"],
            roadmapTrans.activities["Work on production applications"],
            roadmapTrans.activities["Learn team collaboration and code review processes"],
            roadmapTrans.activities["Gain experience with different technologies and frameworks"]
          ],
          skills: [roadmapTrans.skills["Full-stack Development"], roadmapTrans.skills["Testing"], roadmapTrans.skills["Code Review"], roadmapTrans.skills["Agile Methodologies"]]
        },
        {
          phase: roadmapTrans.phases["Senior Expertise"],
          duration: "24+ months",
          activities: [
            (roadmapTrans.activities as any)["Lead technical projects and architecture decisions"] || "Lead technical projects and architecture decisions",
            (roadmapTrans.activities as any)["Mentor junior developers"] || "Mentor junior developers",
            (roadmapTrans.activities as any)["Design scalable systems and applications"] || "Design scalable systems and applications",
            (roadmapTrans.activities as any)["Contribute to technical strategy and planning"] || "Contribute to technical strategy and planning"
          ],
          skills: [
            (roadmapTrans.skills as any)["System Design"] || "System Design",
            (roadmapTrans.skills as any)["Technical Leadership"] || "Technical Leadership", 
            (roadmapTrans.skills as any)["Architecture"] || "Architecture",
            (roadmapTrans.skills as any)["Performance Optimization"] || "Performance Optimization"
          ]
        }
      ]
    }
  };

  return topCareers.slice(0, 2).map(career => 
    roadmapTemplates[career.title as keyof typeof roadmapTemplates] || {
      career: career.title,
      timeline: roadmapTrans.timeline["2-3 years to senior level"],
      steps: [
        {
          phase: roadmapTrans.phases["Foundation Building"],
          duration: "6-12 months",
          activities: [
            (roadmapTrans.activities as any)["Learn core skills"] || "Learn core skills",
            (roadmapTrans.activities as any)["Build portfolio"] || "Build portfolio",
            (roadmapTrans.activities as any)["Gain basic experience"] || "Gain basic experience"
          ],
          skills: [(roadmapTrans.skills as any)["Core Competencies"] || "Core Competencies", (roadmapTrans.skills as any)["Industry Knowledge"] || "Industry Knowledge", (roadmapTrans.skills as any)["Professional Skills"] || "Professional Skills"]
        },
        {
          phase: roadmapTrans.phases["Practical Experience"],
          duration: "12-18 months",
          activities: [
            (roadmapTrans.activities as any)["Apply skills in real projects"] || "Apply skills in real projects",
            (roadmapTrans.activities as any)["Build professional network"] || "Build professional network",
            (roadmapTrans.activities as any)["Gain industry experience"] || "Gain industry experience"
          ],
          skills: [(roadmapTrans.skills as any)["Advanced Skills"] || "Advanced Skills", (roadmapTrans.skills as any)["Professional Development"] || "Professional Development", (roadmapTrans.skills as any)["Industry Connections"] || "Industry Connections"]
        },
        {
          phase: roadmapTrans.phases["Advanced Expertise"],
          duration: "18+ months",
          activities: [
            (roadmapTrans.activities as any)["Lead projects"] || "Lead projects",
            (roadmapTrans.activities as any)["Mentor others"] || "Mentor others",
            (roadmapTrans.activities as any)["Develop expertise"] || "Develop expertise"
          ],
          skills: [(roadmapTrans.skills as any)["Leadership"] || "Leadership", (roadmapTrans.skills as any)["Strategic Thinking"] || "Strategic Thinking", (roadmapTrans.skills as any)["Expertise Development"] || "Expertise Development"]
        }
      ]
    }
  );
}

function getDevelopmentTranslations(language: string = 'en') {
  const translations = {
    en: {
      areas: {
        "Passion Development": "Passion Development",
        "Mission Clarity": "Mission Clarity",
        "Skill Enhancement": "Skill Enhancement",
        "Market Positioning": "Market Positioning"
      },
      actions: {
        "Explore new hobbies and interests regularly": "Explore new hobbies and interests regularly",
        "Set aside dedicated time for passionate pursuits": "Set aside dedicated time for passionate pursuits",
        "Join communities related to your interests": "Join communities related to your interests",
        "Take on projects that energize you": "Take on projects that energize you",
        "Define your personal values and purpose": "Define your personal values and purpose",
        "Volunteer for causes you care about": "Volunteer for causes you care about",
        "Reflect on the impact you want to make": "Reflect on the impact you want to make",
        "Set meaningful long-term goals": "Set meaningful long-term goals",
        "Identify key skills for your desired career": "Identify key skills for your desired career",
        "Create a structured learning plan": "Create a structured learning plan",
        "Practice skills through real projects": "Practice skills through real projects",
        "Seek feedback and continuous improvement": "Seek feedback and continuous improvement",
        "Research industry trends and demands": "Research industry trends and demands",
        "Build a strong professional network": "Build a strong professional network",
        "Develop your personal brand": "Develop your personal brand",
        "Gain relevant experience and credentials": "Gain relevant experience and credentials"
      },
      resources: {
        "Online courses on platforms like Coursera or Udemy": "Online courses on platforms like Coursera or Udemy",
        "Local hobby groups and meetups": "Local hobby groups and meetups",
        "Books and podcasts in your areas of interest": "Books and podcasts in your areas of interest",
        "Mentorship from experts in your field": "Mentorship from experts in your field",
        "Purpose-finding workshops and retreats": "Purpose-finding workshops and retreats",
        "Values assessment tools": "Values assessment tools",
        "Books on personal development and purpose": "Books on personal development and purpose",
        "Coaching or therapy for self-discovery": "Coaching or therapy for self-discovery",
        "Professional development courses": "Professional development courses",
        "Industry certifications and training": "Industry certifications and training",
        "Skill-building platforms like LinkedIn Learning": "Skill-building platforms like LinkedIn Learning",
        "Practice opportunities and internships": "Practice opportunities and internships",
        "Industry reports and market analysis": "Industry reports and market analysis",
        "Professional networking events": "Professional networking events",
        "Personal branding workshops": "Personal branding workshops",
        "Career coaching and job search resources": "Career coaching and job search resources"
      },
      priority: {
        "High": "High",
        "Medium": "Medium"
      },
      timeframes: {
        "3-6 months": "3-6 months",
        "6-12 months": "6-12 months",
        "2-4 months": "2-4 months"
      }
    },
    es: {
      areas: {
        "Passion Development": "Desarrollo de Pasión",
        "Mission Clarity": "Claridad de Misión",
        "Skill Enhancement": "Mejora de Habilidades",
        "Market Positioning": "Posicionamiento de Mercado"
      },
      actions: {
        "Explore new hobbies and interests regularly": "Explorar nuevos hobbies e intereses regularmente",
        "Set aside dedicated time for passionate pursuits": "Reservar tiempo dedicado para actividades apasionantes",
        "Join communities related to your interests": "Unirse a comunidades relacionadas con tus intereses",
        "Take on projects that energize you": "Tomar proyectos que te energizan",
        "Define your personal values and purpose": "Definir tus valores personales y propósito",
        "Volunteer for causes you care about": "Ser voluntario para causas que te importan",
        "Reflect on the impact you want to make": "Reflexionar sobre el impacto que quieres generar",
        "Set meaningful long-term goals": "Establecer objetivos significativos a largo plazo",
        "Identify key skills for your desired career": "Identificar habilidades clave para tu carrera deseada",
        "Create a structured learning plan": "Crear un plan de aprendizaje estructurado",
        "Practice skills through real projects": "Practicar habilidades a través de proyectos reales",
        "Seek feedback and continuous improvement": "Buscar retroalimentación y mejora continua",
        "Research industry trends and demands": "Investigar tendencias y demandas de la industria",
        "Build a strong professional network": "Construir una red profesional sólida",
        "Develop your personal brand": "Desarrollar tu marca personal",
        "Gain relevant experience and credentials": "Obtener experiencia y credenciales relevantes"
      },
      resources: {
        "Online courses on platforms like Coursera or Udemy": "Cursos en línea en plataformas como Coursera o Udemy",
        "Local hobby groups and meetups": "Grupos locales de hobbies y reuniones",
        "Books and podcasts in your areas of interest": "Libros y podcasts en tus áreas de interés",
        "Mentorship from experts in your field": "Mentoría de expertos en tu campo",
        "Purpose-finding workshops and retreats": "Talleres y retiros para encontrar propósito",
        "Values assessment tools": "Herramientas de evaluación de valores",
        "Books on personal development and purpose": "Libros sobre desarrollo personal y propósito",
        "Coaching or therapy for self-discovery": "Coaching o terapia para el autodescubrimiento",
        "Professional development courses": "Cursos de desarrollo profesional",
        "Industry certifications and training": "Certificaciones y capacitación de la industria",
        "Skill-building platforms like LinkedIn Learning": "Plataformas de desarrollo de habilidades como LinkedIn Learning",
        "Practice opportunities and internships": "Oportunidades de práctica y pasantías",
        "Industry reports and market analysis": "Informes de la industria y análisis de mercado",
        "Professional networking events": "Eventos de networking profesional",
        "Personal branding workshops": "Talleres de marca personal",
        "Career coaching and job search resources": "Coaching de carrera y recursos de búsqueda de empleo"
      },
      priority: {
        "High": "Alta",
        "Medium": "Media"
      },
      timeframes: {
        "3-6 months": "3-6 meses",
        "6-12 months": "6-12 meses",
        "2-4 months": "2-4 meses"
      }
    }
  };

  return translations[language as keyof typeof translations] || translations.en;
}

function generateDevelopmentAreas(scores: any, language: string = 'en') {
  const { passion, mission, vocation, profession } = scores;
  const devTrans = getDevelopmentTranslations(language);
  
  const areas = [
    {
      area: devTrans.areas["Passion Development"],
      current: Math.floor(passion / 10),
      target: Math.min(10, Math.floor(passion / 10) + 2),
      actions: [
        devTrans.actions["Explore new hobbies and interests regularly"],
        devTrans.actions["Set aside dedicated time for passionate pursuits"],
        devTrans.actions["Join communities related to your interests"],
        devTrans.actions["Take on projects that energize you"]
      ],
      resources: [
        devTrans.resources["Online courses on platforms like Coursera or Udemy"],
        devTrans.resources["Local hobby groups and meetups"],
        devTrans.resources["Books and podcasts in your areas of interest"],
        devTrans.resources["Mentorship from experts in your field"]
      ]
    },
    {
      area: devTrans.areas["Mission Clarity"],
      current: Math.floor(mission / 10),
      target: Math.min(10, Math.floor(mission / 10) + 2),
      actions: [
        devTrans.actions["Define your personal values and purpose"],
        devTrans.actions["Volunteer for causes you care about"],
        devTrans.actions["Reflect on the impact you want to make"],
        devTrans.actions["Set meaningful long-term goals"]
      ],
      resources: [
        devTrans.resources["Purpose-finding workshops and retreats"],
        devTrans.resources["Values assessment tools"],
        devTrans.resources["Books on personal development and purpose"],
        devTrans.resources["Coaching or therapy for self-discovery"]
      ]
    },
    {
      area: devTrans.areas["Skill Enhancement"],
      current: Math.floor(vocation / 10),
      target: Math.min(10, Math.floor(vocation / 10) + 2),
      actions: [
        devTrans.actions["Identify key skills for your desired career"],
        devTrans.actions["Create a structured learning plan"],
        devTrans.actions["Practice skills through real projects"],
        devTrans.actions["Seek feedback and continuous improvement"]
      ],
      resources: [
        devTrans.resources["Professional development courses"],
        devTrans.resources["Industry certifications and training"],
        devTrans.resources["Skill-building platforms like LinkedIn Learning"],
        devTrans.resources["Practice opportunities and internships"]
      ]
    },
    {
      area: devTrans.areas["Market Positioning"],
      current: Math.floor(profession / 10),
      target: Math.min(10, Math.floor(profession / 10) + 2),
      actions: [
        devTrans.actions["Research industry trends and demands"],
        devTrans.actions["Build a strong professional network"],
        devTrans.actions["Develop your personal brand"],
        devTrans.actions["Gain relevant experience and credentials"]
      ],
      resources: [
        devTrans.resources["Industry reports and market analysis"],
        devTrans.resources["Professional networking events"],
        devTrans.resources["Personal branding workshops"],
        devTrans.resources["Career coaching and job search resources"]
      ]
    }
  ];

  return areas.filter(area => area.current < 8).map(area => ({
    ...area,
    priority: area.target - area.current > 20 ? devTrans.priority["High"] : devTrans.priority["Medium"],
    timeframe: area.area === "Technical Skills" ? devTrans.timeframes["3-6 months"] : area.area === "Leadership Skills" ? devTrans.timeframes["6-12 months"] : devTrans.timeframes["2-4 months"]
  })); // Only show areas with room for improvement
}

function generateMarketInsights(primaryType: string) {
  const insights = {
    "Skilled Expert": {
      industryTrends: [
        "AI and automation are creating new opportunities for technical specialists",
        "Remote work is expanding global talent pools for skilled professionals",
        "Continuous learning and upskilling are becoming essential for career growth",
        "Cross-functional collaboration is increasingly valued in technical roles"
      ],
      emergingRoles: [
        "AI/ML Engineer",
        "Cloud Solutions Architect",
        "DevOps Engineer",
        "Data Scientist",
        "Cybersecurity Specialist"
      ],
      skillsInDemand: [
        "Python/JavaScript",
        "Cloud Computing",
        "Data Analysis",
        "Machine Learning",
        "Agile Methodologies",
        "System Design"
      ],
      salaryTrends: "Technical specialists see 8-15% annual salary growth, with AI/ML roles commanding 20-30% premiums. Remote work has increased compensation equity across geographic locations."
    },
    "Creative Enthusiast": {
      industryTrends: [
        "Digital content creation is experiencing unprecedented growth",
        "Creator economy platforms are democratizing monetization",
        "AI tools are augmenting creative workflows and productivity",
        "Brands are investing heavily in authentic content partnerships"
      ],
      emergingRoles: [
        "Content Creator",
        "UX/UI Designer",
        "Digital Marketing Specialist",
        "Brand Strategist",
        "Social Media Manager"
      ],
      skillsInDemand: [
        "Content Creation",
        "Social Media Marketing",
        "Graphic Design",
        "Video Editing",
        "Brand Strategy",
        "Analytics"
      ],
      salaryTrends: "Creative roles show 10-18% growth with successful creators earning significantly more through multiple revenue streams including sponsorships, courses, and digital products."
    },
    "Purpose-Driven Leader": {
      industryTrends: [
        "Purpose-driven organizations are attracting top talent",
        "Social impact roles are expanding across all sectors",
        "ESG (Environmental, Social, Governance) initiatives are creating new opportunities",
        "Remote leadership requires new skills and approaches"
      ],
      emergingRoles: [
        "Sustainability Manager",
        "Chief Impact Officer",
        "Social Enterprise Leader",
        "Community Manager",
        "Policy Analyst"
      ],
      skillsInDemand: [
        "Project Management",
        "Strategic Planning",
        "Community Building",
        "Policy Analysis",
        "Fundraising",
        "Communication"
      ],
      salaryTrends: "Mission-driven roles show 12-20% growth as organizations prioritize social impact. Non-profit sector compensation is improving with competitive benefits packages."
    },
    "Career-Focused Achiever": {
      industryTrends: [
        "Executive roles are evolving with emphasis on digital transformation",
        "C-suite positions increasingly require technology and data literacy",
        "Performance-based compensation is becoming standard",
        "Global business operations require cross-cultural competencies"
      ],
      emergingRoles: [
        "Chief Digital Officer",
        "VP of Customer Success",
        "Strategic Operations Manager",
        "Business Intelligence Director",
        "Growth Marketing Manager"
      ],
      skillsInDemand: [
        "Strategic Planning",
        "Digital Leadership",
        "Data Analytics",
        "Change Management",
        "Global Operations",
        "Performance Management"
      ],
      salaryTrends: "Executive and management roles show 15-25% growth with significant bonus structures. Companies are investing heavily in leadership development and retention."
    }
  };

  return insights[primaryType as keyof typeof insights] || insights["Skilled Expert"];
}

function generatePersonalityProfile(primaryType: string, scores: any) {
  const profiles = {
    "Skilled Expert": {
      cognitiveStyle: "You approach problems systematically and analytically, preferring to understand the underlying mechanics before taking action. You excel at pattern recognition and logical reasoning.",
      workStyle: "You thrive in environments that allow for deep focus and minimal interruptions. You prefer working independently or in small, skilled teams where expertise is valued.",
      communicationStyle: "You communicate with precision and prefer data-driven discussions. You value accuracy over speed and appreciate when others come prepared with relevant information.",
      decisionMaking: "You make decisions based on careful analysis and evidence. You prefer to gather comprehensive information before committing to a course of action.",
      stressManagement: "You manage stress best through preparation and control. Having clear processes and adequate time to think through problems helps you maintain peak performance."
    },
    "Creative Enthusiast": {
      cognitiveStyle: "You think in possibilities and connections, often seeing potential where others see obstacles. Your mind naturally generates new ideas and creative solutions.",
      workStyle: "You work best with flexibility and variety. You need creative freedom and the ability to experiment with different approaches to stay motivated and productive.",
      communicationStyle: "You communicate with enthusiasm and storytelling. You're skilled at inspiring others and making complex ideas accessible through creative explanation.",
      decisionMaking: "You make decisions based on intuition and values alignment. You consider the emotional and creative impact of choices, not just logical outcomes.",
      stressManagement: "You manage stress through creative expression and variety. Having outlets for creativity and the freedom to change approaches helps you maintain energy and focus."
    },
    "Purpose-Driven Leader": {
      cognitiveStyle: "You think in terms of systems and long-term impact. You naturally consider how actions affect communities and organizations, seeking sustainable solutions.",
      workStyle: "You work best when you can see the bigger picture and your role in creating positive change. You thrive in collaborative environments with shared purpose.",
      communicationStyle: "You communicate with conviction and empathy. You're skilled at rallying people around shared goals and making everyone feel valued and heard.",
      decisionMaking: "You make decisions considering stakeholder impact and long-term consequences. You balance multiple perspectives and seek win-win solutions.",
      stressManagement: "You manage stress by connecting with your purpose and support network. Regular reflection on impact and progress helps you maintain motivation and resilience."
    },
    "Career-Focused Achiever": {
      cognitiveStyle: "You think strategically and competitively, always looking for opportunities to advance and optimize performance. You excel at identifying market trends and positioning yourself advantageously.",
      workStyle: "You work best in goal-oriented environments with clear metrics and advancement opportunities. You thrive on challenges and competition that drive professional growth.",
      communicationStyle: "You communicate with confidence and strategic focus. You're skilled at presenting ideas persuasively and building professional relationships that advance mutual goals.",
      decisionMaking: "You make decisions based on strategic advantage and career impact. You carefully weigh risks and benefits while considering long-term professional positioning.",
      stressManagement: "You manage stress through achievement and progress tracking. Setting clear goals and celebrating milestones helps you maintain motivation and direction."
    }
  };

  return profiles[primaryType as keyof typeof profiles] || profiles["Skilled Expert"];
}

function generateNetworkingStrategy(primaryType: string) {
  const strategies = {
    "Skilled Expert": {
      targetIndustries: [
        "Technology & Software",
        "Engineering & Manufacturing",
        "Research & Development",
        "Consulting & Analytics",
        "Healthcare & Biotechnology"
      ],
      keyProfessionals: [
        {
          role: "Senior Engineers & Technical Leads",
          value: "Learn about advanced technical challenges and industry best practices",
          platforms: ["LinkedIn", "GitHub", "Stack Overflow"]
        },
        {
          role: "Product Managers",
          value: "Understand how technical skills translate to business value",
          platforms: ["LinkedIn", "Product Hunt", "Medium"]
        },
        {
          role: "Industry Researchers",
          value: "Stay current with emerging technologies and methodologies",
          platforms: ["ResearchGate", "IEEE", "LinkedIn"]
        }
      ],
      networkingEvents: [
        {
          type: "Technical Conferences",
          description: "Attend industry-specific conferences to learn about latest trends and meet peers",
          frequency: "Quarterly"
        },
        {
          type: "Hackathons & Coding Competitions",
          description: "Participate in coding challenges to showcase skills and meet other developers",
          frequency: "Monthly"
        },
        {
          type: "Professional Meetups",
          description: "Join local tech meetups and professional associations",
          frequency: "Bi-weekly"
        }
      ],
      onlineCommunities: [
        {
          platform: "GitHub",
          community: "Open Source Projects",
          focus: "Contribute to projects in your field and build reputation"
        },
        {
          platform: "Stack Overflow",
          community: "Developer Q&A",
          focus: "Answer questions and build expertise recognition"
        },
        {
          platform: "Reddit",
          community: "r/programming, r/technology",
          focus: "Discuss trends and share knowledge with peers"
        }
      ]
    },
    "Creative Enthusiast": {
      targetIndustries: [
        "Design & Creative Services",
        "Media & Entertainment",
        "Marketing & Advertising",
        "E-commerce & Retail",
        "Education & Training"
      ],
      keyProfessionals: [
        {
          role: "Creative Directors",
          value: "Learn about creative leadership and project management",
          platforms: ["Behance", "Dribbble", "LinkedIn"]
        },
        {
          role: "Brand Managers",
          value: "Understand how creativity drives business outcomes",
          platforms: ["LinkedIn", "Brand New", "Marketing Land"]
        },
        {
          role: "Fellow Creatives",
          value: "Collaborate on projects and share creative techniques",
          platforms: ["Instagram", "Behance", "DeviantArt"]
        }
      ],
      networkingEvents: [
        {
          type: "Design Conferences",
          description: "Attend creative conferences to see latest trends and meet industry leaders",
          frequency: "Quarterly"
        },
        {
          type: "Creative Workshops",
          description: "Participate in hands-on workshops to learn new skills",
          frequency: "Monthly"
        },
        {
          type: "Art Shows & Exhibitions",
          description: "Attend local art events to connect with the creative community",
          frequency: "Bi-weekly"
        }
      ],
      onlineCommunities: [
        {
          platform: "Behance",
          community: "Creative Portfolio Network",
          focus: "Share work and get feedback from other creatives"
        },
        {
          platform: "Instagram",
          community: "Design & Art Communities",
          focus: "Build following and connect with other artists"
        },
        {
          platform: "Discord",
          community: "Creative Servers",
          focus: "Real-time collaboration and feedback"
        }
      ]
    },
    "Purpose-Driven Leader": {
      targetIndustries: [
        "Non-profit & Social Impact",
        "Government & Public Service",
        "Healthcare & Human Services",
        "Education & Community Development",
        "Environmental & Sustainability"
      ],
      keyProfessionals: [
        {
          role: "Non-profit Directors",
          value: "Learn about organizational leadership and impact measurement",
          platforms: ["LinkedIn", "Guidestar", "Chronicle of Philanthropy"]
        },
        {
          role: "Community Organizers",
          value: "Understand grassroots mobilization and community building",
          platforms: ["LinkedIn", "Facebook", "Twitter"]
        },
        {
          role: "Social Entrepreneurs",
          value: "Explore innovative approaches to social problems",
          platforms: ["LinkedIn", "Ashoka", "Net Impact"]
        }
      ],
      networkingEvents: [
        {
          type: "Social Impact Conferences",
          description: "Attend events focused on social change and community development",
          frequency: "Quarterly"
        },
        {
          type: "Volunteer Events",
          description: "Participate in community service to meet like-minded individuals",
          frequency: "Monthly"
        },
        {
          type: "Policy Forums",
          description: "Attend discussions on social issues and policy solutions",
          frequency: "Bi-weekly"
        }
      ],
      onlineCommunities: [
        {
          platform: "LinkedIn",
          community: "Social Impact Groups",
          focus: "Connect with professionals in social change"
        },
        {
          platform: "Facebook",
          community: "Community Organization Groups",
          focus: "Share resources and coordinate efforts"
        },
        {
          platform: "Slack",
          community: "Non-profit Networks",
          focus: "Real-time collaboration with other leaders"
        }
      ]
    },
    "Career-Focused Achiever": {
      targetIndustries: [
        "Business & Finance",
        "Consulting & Strategy",
        "Sales & Marketing",
        "Real Estate & Investment",
        "Executive Leadership"
      ],
      keyProfessionals: [
        {
          role: "C-Suite Executives",
          value: "Learn about strategic leadership and business development",
          platforms: ["LinkedIn", "Executive Forums", "Industry Associations"]
        },
        {
          role: "Management Consultants",
          value: "Understand problem-solving frameworks and business strategy",
          platforms: ["LinkedIn", "McKinsey Insights", "Harvard Business Review"]
        },
        {
          role: "Sales Leaders",
          value: "Master relationship building and revenue generation",
          platforms: ["LinkedIn", "Sales Navigator", "Sales Forums"]
        }
      ],
      networkingEvents: [
        {
          type: "Business Conferences",
          description: "Attend industry conferences to learn about business trends",
          frequency: "Quarterly"
        },
        {
          type: "Executive Roundtables",
          description: "Participate in leadership discussions and strategic planning",
          frequency: "Monthly"
        },
        {
          type: "Professional Associations",
          description: "Join industry associations for networking and development",
          frequency: "Bi-weekly"
        }
      ],
      onlineCommunities: [
        {
          platform: "LinkedIn",
          community: "Executive & Leadership Groups",
          focus: "Professional networking and business insights"
        },
        {
          platform: "Reddit",
          community: "r/business, r/entrepreneur",
          focus: "Business discussions and strategy sharing"
        },
        {
          platform: "Slack",
          community: "Professional Networks",
          focus: "Industry-specific collaboration"
        }
      ]
    }
  };

  return strategies[primaryType as keyof typeof strategies] || strategies["Skilled Expert"];
}

function generateAIMentor(primaryType: string, scores: any, language: string = 'en') {
  const mentorContent = {
    "Skilled Expert": {
      weeklyQuestions: [
        {
          question: "What new technical skill or methodology did you explore this week?",
          purpose: "Encourage continuous learning and skill development",
          reflection: "Technical expertise requires constant evolution. Regular learning keeps you competitive and engaged."
        },
        {
          question: "How did you share your knowledge with others this week?",
          purpose: "Develop leadership and mentoring capabilities",
          reflection: "Teaching others solidifies your own understanding and builds your reputation as a thought leader."
        },
        {
          question: "What problem did you solve that others found challenging?",
          purpose: "Build confidence and recognize your unique value",
          reflection: "Your expertise is valuable when applied to real-world problems. Document these successes."
        }
      ],
      monthlyGoals: [
        {
          goal: "Master a new technical framework or tool",
          actions: [
            "Research and select a relevant technology",
            "Complete online courses or tutorials",
            "Build a small project using the new skill",
            "Share your learnings with colleagues"
          ],
          metrics: ["Completed tutorial progress", "Project completion", "Peer feedback"]
        },
        {
          goal: "Contribute to open source or technical community",
          actions: [
            "Find relevant open source projects",
            "Submit code contributions or bug fixes",
            "Write technical articles or documentation",
            "Participate in technical discussions"
          ],
          metrics: ["Contribution frequency", "Community engagement", "Recognition received"]
        }
      ],
      personalized_tips: [
        {
          category: "Skill Development",
          tip: "Focus on depth over breadth - become the go-to expert in your chosen area",
          implementation: "Choose 2-3 core technologies and become deeply proficient rather than learning many superficially"
        },
        {
          category: "Career Advancement",
          tip: "Document your technical achievements and their business impact",
          implementation: "Keep a record of problems solved, systems improved, and value created for future performance reviews"
        },
        {
          category: "Networking",
          tip: "Share your expertise through technical writing and speaking",
          implementation: "Write blog posts, give conference talks, or create educational content in your field"
        }
      ]
    },
    "Creative Enthusiast": {
      weeklyQuestions: [
        {
          question: "What creative project or idea energized you most this week?",
          purpose: "Identify sources of creative inspiration and passion",
          reflection: "Understanding what sparks your creativity helps you seek out similar opportunities and projects."
        },
        {
          question: "How did you push your creative boundaries this week?",
          purpose: "Encourage experimentation and artistic growth",
          reflection: "Creative growth comes from stepping outside your comfort zone and trying new techniques or mediums."
        },
        {
          question: "What feedback did you receive on your creative work?",
          purpose: "Develop resilience and learn from constructive criticism",
          reflection: "External perspectives help refine your creative vision and identify areas for improvement."
        }
      ],
      monthlyGoals: [
        {
          goal: "Complete a creative project from concept to finish",
          actions: [
            "Brainstorm and select a meaningful project",
            "Create a project timeline and milestones",
            "Gather feedback during the process",
            "Share the completed work publicly"
          ],
          metrics: ["Project completion rate", "Quality of output", "Audience engagement"]
        },
        {
          goal: "Build your creative portfolio and online presence",
          actions: [
            "Curate your best work for portfolio",
            "Create or update online presence",
            "Engage with other creatives online",
            "Apply for creative opportunities"
          ],
          metrics: ["Portfolio views", "Social media engagement", "Opportunities applied for"]
        }
      ],
      personalized_tips: [
        {
          category: "Creative Process",
          tip: "Establish a regular creative practice, even if just 15 minutes daily",
          implementation: "Set aside time each day for creative work, whether it's sketching, writing, or exploring new ideas"
        },
        {
          category: "Professional Growth",
          tip: "Connect your creative work to business value and client needs",
          implementation: "Learn to articulate how your creativity solves problems and creates value for employers or clients"
        },
        {
          category: "Inspiration",
          tip: "Expose yourself to diverse creative influences and experiences",
          implementation: "Visit galleries, read different genres, explore new media, and connect with creatives from other fields"
        }
      ]
    },
    "Purpose-Driven Leader": {
      weeklyQuestions: [
        {
          question: translate('weeklyQuestions.impact', language),
          purpose: "Reinforce connection to purpose and mission",
          reflection: "Regular reflection on impact helps maintain motivation and identify areas for greater influence."
        },
        {
          question: translate('weeklyQuestions.growth', language),
          purpose: "Strengthen leadership and mentoring skills",
          reflection: "Leadership is about empowering others. Look for opportunities to lift others up and create positive change."
        },
        {
          question: translate('weeklyQuestions.social', language),
          purpose: "Stay connected to broader social concerns and opportunities",
          reflection: "Awareness of social issues helps you find meaningful ways to contribute and make a difference."
        }
      ],
      monthlyGoals: [
        {
          goal: translate('monthlyGoals.community', language),
          actions: [
            "Identify a community need or issue",
            "Research existing efforts and potential partners",
            "Develop an action plan or join existing initiative",
            "Measure and communicate impact"
          ],
          metrics: ["People reached", "Problem addressed", "Community engagement"]
        },
        {
          goal: translate('monthlyGoals.leadership', language),
          actions: [
            translate('monthlyGoals.role', language),
            "Complete leadership training or education",
            "Mentor someone junior in your field",
            "Practice public speaking or advocacy"
          ],
          metrics: ["Leadership roles taken", "People mentored", "Skills developed"]
        }
      ],
      personalized_tips: [
        {
          category: "Leadership Development",
          tip: "Focus on building authentic relationships based on shared values",
          implementation: "Invest time in understanding others' motivations and find common ground for collaboration"
        },
        {
          category: "Social Impact",
          tip: "Start with small, local actions that can grow into larger movements",
          implementation: "Begin with manageable projects in your community that can demonstrate success and attract others"
        },
        {
          category: "Sustainability",
          tip: "Build systems and processes that can continue without your direct involvement",
          implementation: "Create structures, train others, and document processes so your impact can scale and persist"
        }
      ]
    },
    "Career-Focused Achiever": {
      weeklyQuestions: [
        {
          question: "What strategic opportunity did you identify or pursue this week?",
          purpose: "Maintain focus on career advancement and strategic thinking",
          reflection: "Success comes from recognizing and acting on strategic opportunities before others do."
        },
        {
          question: "How did you add measurable value to your organization this week?",
          purpose: "Ensure actions align with business outcomes and career goals",
          reflection: "Career advancement requires demonstrable results. Track and communicate your contributions clearly."
        },
        {
          question: "What new professional relationship did you build or strengthen this week?",
          purpose: "Emphasize importance of networking and relationship building",
          reflection: "Professional success depends heavily on relationships. Invest in building a strong network."
        }
      ],
      monthlyGoals: [
        {
          goal: "Advance a key business initiative or project",
          actions: [
            "Identify high-impact projects aligned with company goals",
            "Develop comprehensive project plan and timeline",
            "Secure resources and stakeholder buy-in",
            "Execute and measure results"
          ],
          metrics: ["Project completion", "ROI achieved", "Stakeholder satisfaction"]
        },
        {
          goal: "Expand professional network and industry influence",
          actions: [
            "Attend industry events and conferences",
            "Connect with key professionals in your field",
            "Share insights through writing or speaking",
            "Join professional associations or boards"
          ],
          metrics: ["New connections made", "Speaking engagements", "Industry recognition"]
        }
      ],
      personalized_tips: [
        {
          category: "Strategic Thinking",
          tip: "Always connect your work to broader business objectives and outcomes",
          implementation: "Before taking on tasks, ask how they advance company goals and your career trajectory"
        },
        {
          category: "Performance Management",
          tip: "Quantify your achievements and communicate them regularly",
          implementation: "Keep a record of accomplishments with specific metrics and share them during reviews and meetings"
        },
        {
          category: "Leadership",
          tip: "Take on stretch assignments that demonstrate leadership potential",
          implementation: "Volunteer for challenging projects that showcase your ability to lead teams and drive results"
        }
      ]
    }
  };

  return mentorContent[primaryType as keyof typeof mentorContent] || mentorContent["Skilled Expert"];
}

function generateInterviewPreparation(primaryType: string) {
  const commonQuestions = [
    "Tell me about yourself and your career journey",
    "What are your greatest strengths and how do they apply to this role?",
    "Describe a challenging situation you've handled professionally",
    "Where do you see yourself in 5 years?",
    "Why are you interested in this particular position?"
  ];

  const typeSpecificQuestions = {
    "Creative Enthusiast": [
      "How do you approach creative problem-solving?",
      "Describe a creative project you're particularly proud of",
      "How do you handle creative criticism and feedback?"
    ],
    "Skilled Expert": [
      "Walk me through your technical decision-making process",
      "How do you stay current with industry developments?",
      "Describe a complex technical challenge you've solved"
    ],
    "Purpose-Driven Leader": [
      "How do you motivate and inspire team members?",
      "Describe a time when you had to lead through change",
      "What does meaningful work mean to you?"
    ],
    "Career-Focused Achiever": [
      "How do you prioritize competing demands?",
      "Describe your approach to work-life balance",
      "How do you handle multiple projects simultaneously?"
    ]
  };

  return {
    preparation: {
      research: [
        "Study the company's mission, values, and recent developments",
        "Research the role requirements and team structure",
        "Prepare specific examples that demonstrate your skills",
        "Practice your responses to common questions"
      ],
      documents: [
        "Updated resume tailored to the position",
        "Portfolio of relevant work samples",
        "List of professional references",
        "Questions to ask the interviewer"
      ]
    },
    commonQuestions,
    typeSpecificQuestions: typeSpecificQuestions[primaryType as keyof typeof typeSpecificQuestions] || typeSpecificQuestions["Career-Focused Achiever"],
    followUpStrategy: [
      "Send a thank-you email within 24 hours",
      "Reference specific conversation points from the interview",
      "Reiterate your interest and qualifications",
      "Provide any additional information requested"
    ]
  };
}

function generateSuccessBlueprint(primaryType: string, scores: any) {
  const transformationPlan = {
    days1to30: {
      title: "Foundation Phase",
      focus: "Self-awareness and goal setting",
      activities: [
        "Complete comprehensive self-assessment",
        "Define your 90-day vision and goals",
        "Establish daily success habits",
        "Create accountability system"
      ],
      milestones: [
        "Clear vision statement written",
        "Daily routine established",
        "Support network identified",
        "Progress tracking system in place"
      ]
    },
    days31to60: {
      title: "Action Phase",
      focus: "Skill building and network expansion",
      activities: [
        "Implement skill development plan",
        "Begin networking activities",
        "Start working on key projects",
        "Refine and adjust your approach"
      ],
      milestones: [
        "New skills demonstrably improved",
        "Professional connections made",
        "Project progress visible",
        "System optimizations completed"
      ]
    },
    days61to90: {
      title: "Optimization Phase",
      focus: "Refinement and sustainable growth",
      activities: [
        "Evaluate progress and adjust strategies",
        "Solidify successful habits",
        "Plan for continued growth",
        "Celebrate achievements"
      ],
      milestones: [
        "Goals achieved or exceeded",
        "Sustainable routines established",
        "Future roadmap created",
        "Success celebration completed"
      ]
    }
  };

  const habitTracker = [
    {
      habit: "Morning reflection and goal review",
      frequency: "Daily",
      trackingMethod: "Journal or app",
      purpose: "Maintain focus and intention"
    },
    {
      habit: "Skill development practice",
      frequency: "Daily (30 min)",
      trackingMethod: "Progress log",
      purpose: "Continuous improvement"
    },
    {
      habit: "Networking activity",
      frequency: "Weekly",
      trackingMethod: "Contact log",
      purpose: "Relationship building"
    },
    {
      habit: "Weekly progress review",
      frequency: "Weekly",
      trackingMethod: "Self-assessment",
      purpose: "Course correction"
    }
  ];

  const confidenceBuilding = [
    {
      exercise: "Daily affirmations",
      description: "Start each day with positive self-talk",
      timeframe: "5 minutes daily"
    },
    {
      exercise: "Success journaling",
      description: "Record daily wins, no matter how small",
      timeframe: "10 minutes evening"
    },
    {
      exercise: "Challenge comfort zone",
      description: "Do one thing that pushes your boundaries",
      timeframe: "Weekly"
    },
    {
      exercise: "Celebrate milestones",
      description: "Acknowledge progress and achievements",
      timeframe: "As achieved"
    }
  ];

  const lifeBalanceAssessment = {
    areas: [
      { name: "Career", importance: "High", currentSatisfaction: scores.profession },
      { name: "Health", importance: "High", currentSatisfaction: 70 },
      { name: "Relationships", importance: "High", currentSatisfaction: 75 },
      { name: "Personal Growth", importance: "High", currentSatisfaction: scores.passion },
      { name: "Recreation", importance: "Medium", currentSatisfaction: 65 },
      { name: "Finances", importance: "Medium", currentSatisfaction: 70 }
    ],
    recommendations: [
      "Focus on areas scoring below 60",
      "Maintain areas scoring above 80",
      "Seek integration opportunities between life areas",
      "Review and adjust balance monthly"
    ]
  };

  return {
    transformationPlan,
    habitTracker,
    confidenceBuilding,
    lifeBalanceAssessment,
    goalFramework: {
      smart: "Specific, Measurable, Achievable, Relevant, Time-bound",
      categories: ["Career", "Personal", "Health", "Relationships", "Learning"],
      reviewFrequency: "Weekly check-ins, Monthly reviews, Quarterly planning"
    }
  };
}

// Stripe integration
import Stripe from "stripe";

// Use production keys for live payments
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_TEST_SECRET_KEY!;
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-11-20.acacia",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // REMOVED: Positive words redirects to preserve SEO-friendly long URLs

  // ACME Challenge handler for Let's Encrypt SSL certificate verification
  app.get('/.well-known/acme-challenge/:token', (req, res) => {
    const token = req.params.token;
    console.log(`🔐 ACME Challenge request for token: ${token}`);
    // Respond with domain validation for SSL certificate generation
    res.type('text/plain').send(`${token}.ikigain-domain-verification`);
  });

  // PRIORITY: Static HTML serving with unique canonical URLs - Phase 1 SEO Implementation
  // Enable SEO middleware in all environments for comprehensive link preview support
  app.use(serveStaticFirst);
  if (process.env.NODE_ENV === 'production') {
    console.log('🎯 Static SEO middleware enabled for production');
  } else {
    console.log('🔧 SEO middleware enabled in development for testing - production uses optimized static files');
  }

  // Domain redirect middleware - redirect root domain to www (backup)
  app.use((req, res, next) => {
    const host = req.get('host');
    const protocol = req.get('x-forwarded-proto') || req.protocol || 'http';
    
    console.log(`🌐 Backup Request: ${protocol}://${host}${req.originalUrl} - User-Agent: ${req.get('user-agent')?.substring(0, 50)}...`);
    
    // Skip redirect for ACME challenges
    if (req.path.startsWith('/.well-known/acme-challenge/')) {
      return next();
    }
    
    // Only redirect if accessing ikigain.org (without www)
    if (host === 'ikigain.org') {
      const redirectUrl = `https://www.ikigain.org${req.originalUrl}`;
      console.log(`🔄 Backup Redirecting ${host}${req.originalUrl} to ${redirectUrl}`);
      
      // Always use HTTP redirect - let proxy handle HTTPS upgrade
      return res.redirect(301, redirectUrl);
    }
    
    next();
  });

  // Initialize authentication AFTER canonical URL middleware
  // Disabled old Replit authentication - now using email/password authentication
  console.log("🔧 Using email/password authentication system");
  
  // Setup authentication and session middleware
  setupReplitAuth(app);

  // SEO Debug endpoint to show available static routes
  app.get('/api/debug/static-routes', debugStaticRoutes);

  // CRITICAL FIX: Middleware to handle intercepted routes before Vite catch-all
  app.use((req, res, next) => {
    // If this is one of the problematic admin routes, handle it immediately
    if (req.path === '/api/admin/questions' || req.path === '/api/admin/sessions') {
      console.log(`🔧 Intercepted problematic route: ${req.path}`);
      
      // Check admin authentication
      if (process.env.NODE_ENV === 'development') {
        const sessionUser = req.session?.user;
        if (!sessionUser || sessionUser.claims?.email !== 'karlisvilmanis@gmail.com') {
          console.log('❌ Admin access denied - not karlisvilmanis@gmail.com');
          return res.status(403).json({ message: "Admin access restricted to karlisvilmanis@gmail.com only." });
        }
      } else {
        const user = req.user as any;
        if (!req.isAuthenticated() || !user || user.claims?.email !== 'karlisvilmanis@gmail.com') {
          console.log('❌ Admin access denied - not karlisvilmanis@gmail.com');
          return res.status(403).json({ message: "Admin access restricted to karlisvilmanis@gmail.com only." });
        }
      }
      
      // Handle the specific routes
      if (req.path === '/api/admin/questions') {
        console.log('✅ Handling /api/admin/questions directly');
        return handleAdminQuestions(req, res);
      } else if (req.path === '/api/admin/sessions') {
        console.log('✅ Handling /api/admin/sessions directly');
        return handleAdminSessions(req, res);
      }
    }
    
    // Continue to next middleware
    next();
  });

  // Helper functions for direct route handling
  const handleAdminQuestions = async (req: any, res: any) => {
    try {
      const questions = await storage.getQuestions();
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  };

  const handleAdminSessions = async (req: any, res: any) => {
    try {
      const sessions = await db
        .select()
        .from(testSessions)
        .orderBy(desc(testSessions.createdAt));
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching test sessions:", error);
      res.status(500).json({ message: "Failed to fetch test sessions" });
    }
  };

  // CRITICAL FIX: Use different URL pattern to avoid frontend interception
  // Admin endpoint to view all questions (using /api/secure/ to avoid conflicts)
  app.get('/api/secure/questions', isAdmin, async (req, res) => {
    console.log("✅ Secure questions endpoint hit - route registered correctly");
    try {
      const questions = await storage.getQuestions();
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  // Admin endpoint to view all test sessions (using /api/secure/ to avoid conflicts)
  app.get('/api/secure/sessions', isAdmin, async (req, res) => {
    console.log("✅ Secure sessions endpoint hit - route registered correctly");
    try {
      const sessions = await db
        .select()
        .from(testSessions)
        .orderBy(desc(testSessions.createdAt));
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching test sessions:", error);
      res.status(500).json({ message: "Failed to fetch test sessions" });
    }
  });

  // ALL ADMIN ROUTES - SECURED for karlisvilmanis@gmail.com only
  // Check authentication first, then redirect unauthorized users
  const adminRedirectHtml = `<!DOCTYPE html><html><head><title>🔒 Access Denied</title><meta http-equiv="refresh" content="0;url=/?error=admin_access_denied"><script>window.location.href = "/?error=admin_access_denied";</script></head><body style="font-family:Arial,sans-serif;text-align:center;margin:50px;"><h1>🔒 Access Denied</h1><p>Admin access restricted to karlisvilmanis@gmail.com only.</p><p>Redirecting to home page...</p></body></html>`;
  
  // Admin route handler that checks auth before redirecting
  const handleAdminRoute = async (req: any, res: any, next: any) => {
    console.log('=== ADMIN ROUTE ACCESS ATTEMPT ===');
    console.log('URL:', req.url);
    console.log('Hostname:', req.hostname);
    console.log('User agent:', req.get('User-Agent'));
    console.log('Session ID:', req.sessionID);
    console.log('Session exists:', !!req.session);
    console.log('Session data:', req.session);
    console.log('Passport user:', req.user);
    console.log('User claims:', req.user?.claims);
    console.log('User email:', req.user?.claims?.email);
    console.log('Is authenticated:', req.isAuthenticated?.());
    console.log('================================');
    
    // LOCALHOST: Allow localhost access for development
    if (req.hostname === 'localhost') {
      console.log('🔧 Localhost: allowing admin access');
      return next(); 
    }
    
    // REPLIT DOMAIN OR CUSTOM DOMAIN: Check Replit Auth for karlisvilmanis@gmail.com
    if (req.hostname.includes('replit.app') || req.hostname.includes('replit.dev') || req.hostname === 'ikigain.org') {
      // Check session user (from Replit built-in auth)
      const sessionUser = req.session?.user;
      const userEmail = sessionUser?.email;
      
      console.log('🔧 Replit domain: checking auth for', userEmail);
      
      if (userEmail === 'karlisvilmanis@gmail.com') {
        console.log('✅ Admin access granted via Replit Auth for:', userEmail);
        return next(); 
      }
      
      // If authenticated but not admin, show specific message
      if (sessionUser && userEmail) {
        console.log('❌ User authenticated but not admin:', userEmail);
        return res.send(adminRedirectHtml);
      }
      
      // If not authenticated, redirect to login
      console.log('❌ User not authenticated - redirecting to login');
      return res.redirect('/api/login');
    }
    
    console.log('❌ Unknown hostname - denying access');
    return res.send(adminRedirectHtml);
  };
  
  app.get('/admin', handleAdminRoute, (req, res, next) => next());
  app.get('/admin/emails', handleAdminRoute, (req, res, next) => next());
  app.get('/admin/blog-enhanced', handleAdminRoute, (req, res, next) => next());
  app.get('/admin/shop', handleAdminRoute, (req, res, next) => next());
  app.get('/admin/checkout-analytics', handleAdminRoute, (req, res, next) => next());
  app.get('/admin/blog-import', handleAdminRoute, (req, res, next) => next());
  
  // Spanish admin routes
  app.get('/es/admin', handleAdminRoute, (req, res, next) => next());
  app.get('/es/admin/emails', handleAdminRoute, (req, res, next) => next());
  app.get('/es/admin/blog-enhanced', handleAdminRoute, (req, res, next) => next());
  app.get('/es/admin/shop', handleAdminRoute, (req, res, next) => next());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      message: 'Server is running properly',
      port: 5000
    });
  });

  // Admin endpoint to view collected emails
  app.get('/api/admin/collected-emails', isAdmin, async (req, res) => {
    try {
      const emails = await storage.getCollectedEmails();
      res.json(emails);
    } catch (error) {
      console.error("Error fetching collected emails:", error);
      res.status(500).json({ message: "Failed to fetch collected emails" });
    }
  });

  // Public endpoint to view collected emails (for demo purposes)
  app.get('/api/collected-emails', async (req, res) => {
    try {
      const emails = await storage.getCollectedEmails();
      res.json(emails);
    } catch (error) {
      console.error("Error fetching collected emails:", error);
      res.status(500).json({ message: "Failed to fetch collected emails" });
    }
  });

  // Email dashboard API endpoint - working in production
  app.get('/api/emails-dashboard', async (req, res) => {
    // Force text/html content type
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    try {
      const emails = await storage.getCollectedEmails();
      const realEmails = emails.filter(e => e.email && !e.email.includes('@example.com'));
      const todayEmails = emails.filter(e => {
        const date = new Date(e.created_at);
        const today = new Date();
        return date.toDateString() === today.toDateString();
      });
      
      const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Email Collection Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background-color: #f9fafb;
          }
          .container { max-width: 1200px; margin: 0 auto; }
          .header { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 30px; }
          .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
          .stat-card { 
            background: white; 
            padding: 25px; 
            border-radius: 12px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            text-align: center;
          }
          .stat-number { font-size: 36px; font-weight: bold; color: #2563eb; margin-bottom: 8px; }
          .stat-label { color: #6b7280; font-size: 14px; }
          .key-status { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 30px; }
          .status-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .status-item:last-child { border-bottom: none; }
          .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
          .found { background: #dcfce7; color: #16a34a; }
          .not-found { background: #fee2e2; color: #dc2626; }
          .table-container { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; }
          .table-header { background: #f9fafb; padding: 20px; border-bottom: 1px solid #e5e7eb; }
          table { width: 100%; border-collapse: collapse; }
          th, td { text-align: left; padding: 12px 20px; border-bottom: 1px solid #e5e7eb; }
          th { background: #f9fafb; font-weight: 600; color: #374151; font-size: 12px; text-transform: uppercase; }
          tr:hover { background: #f9fafb; }
          .complete { background: #dcfce7; color: #16a34a; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
          .incomplete { background: #fef3c7; color: #d97706; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
          .refresh-btn { 
            background: #2563eb; 
            color: white; 
            border: none; 
            padding: 12px 24px; 
            border-radius: 8px; 
            cursor: pointer; 
            font-size: 14px;
            margin-top: 20px;
          }
          .refresh-btn:hover { background: #1d4ed8; }
          @media (max-width: 768px) {
            .stats { grid-template-columns: 1fr; }
            .status-item { flex-direction: column; gap: 10px; }
            table { font-size: 14px; }
            th, td { padding: 8px 12px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0 0 10px 0; color: #1f2937; font-size: 32px;">📧 Email Collection Dashboard</h1>
            <p style="margin: 0; color: #6b7280;">Manage and view collected user emails from Ikigai tests</p>
          </div>
          
          <div class="stats">
            <div class="stat-card">
              <div class="stat-number">${emails.length}</div>
              <div class="stat-label">Total Emails</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${realEmails.length}</div>
              <div class="stat-label">Real Users</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${todayEmails.length}</div>
              <div class="stat-label">Today's Collection</div>
            </div>
          </div>

          <div class="key-status">
            <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 20px;">Key Email Status</h2>
            <div class="status-item">
              <span>cindytradellc@gmail.com</span>
              <span class="status-badge ${emails.some(e => e.email === 'cindytradellc@gmail.com') ? 'found' : 'not-found'}">
                ${emails.some(e => e.email === 'cindytradellc@gmail.com') ? 'Found' : 'Not Found'}
              </span>
            </div>
            <div class="status-item">
              <span>baltscandlv@gmail.com</span>
              <span class="status-badge ${emails.some(e => e.email === 'baltscandlv@gmail.com') ? 'found' : 'not-found'}">
                ${emails.some(e => e.email === 'baltscandlv@gmail.com') ? 'Found' : 'Not Found'}
              </span>
            </div>
          </div>

          <div class="table-container">
            <div class="table-header">
              <h2 style="margin: 0; color: #1f2937; font-size: 20px;">All Collected Emails (${emails.length})</h2>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Email Address</th>
                  <th>Collection Date</th>
                  <th>Test Status</th>
                  <th>Premium Tier</th>
                </tr>
              </thead>
              <tbody>
                ${emails.map(email => `
                  <tr>
                    <td style="font-weight: 500;">${email.email}</td>
                    <td>${new Date(email.created_at).toLocaleDateString()}</td>
                    <td><span class="${email.is_completed ? 'complete' : 'incomplete'}">${email.is_completed ? 'Complete' : 'Incomplete'}</span></td>
                    <td>${email.premium_tier || 'Free'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <button class="refresh-btn" onclick="window.location.reload()">🔄 Refresh Data</button>
          <div style="margin-top: 20px; text-align: center;">
            <a href="/" style="color: #2563eb; text-decoration: none;">← Back to Main Site</a>
          </div>
        </div>
      </body>
      </html>
      `;
      
      res.status(200).send(html);
    } catch (error) {
      console.error("Error generating email dashboard:", error);
      res.status(500).send(`
        <html>
          <head><title>Error</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>Error Loading Email Dashboard</h1>
            <p>Error: ${error.message}</p>
            <a href="/api/emails-dashboard">Try Again</a>
          </body>
        </html>
      `);
    }
  });

  // Debug HTML endpoint to verify data
  app.get('/debug-emails', async (req, res) => {
    try {
      const emails = await storage.getCollectedEmails();
      const realEmails = emails.filter(e => e.email && !e.email.includes('@example.com'));
      const todayEmails = emails.filter(e => {
        const date = new Date(e.created_at);
        const today = new Date();
        return date.toDateString() === today.toDateString();
      });
      
      const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Email Collection Debug</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .stats { display: flex; gap: 20px; margin: 20px 0; }
          .stat-card { background: #f0f0f0; padding: 15px; border-radius: 8px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .success { color: green; }
          .error { color: red; }
        </style>
      </head>
      <body>
        <h1>Email Collection Debug Dashboard</h1>
        <div class="stats">
          <div class="stat-card">
            <h3>Total Emails</h3>
            <p style="font-size: 24px; color: blue;">${emails.length}</p>
          </div>
          <div class="stat-card">
            <h3>Real Users</h3>
            <p style="font-size: 24px; color: green;">${realEmails.length}</p>
          </div>
          <div class="stat-card">
            <h3>Today</h3>
            <p style="font-size: 24px; color: orange;">${todayEmails.length}</p>
          </div>
        </div>
        
        <h2>All Emails (${emails.length})</h2>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Date</th>
              <th>Status</th>
              <th>Tier</th>
            </tr>
          </thead>
          <tbody>
            ${emails.map(email => `
              <tr>
                <td>${email.email}</td>
                <td>${new Date(email.created_at).toLocaleDateString()}</td>
                <td>${email.is_completed ? 'Complete' : 'Incomplete'}</td>
                <td>${email.premium_tier || 'Free'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <h3>Key Emails Status:</h3>
        <ul>
          <li>cindytradellc@gmail.com: <span class="${emails.find(e => e.email === 'cindytradellc@gmail.com') ? 'success' : 'error'}">${emails.find(e => e.email === 'cindytradellc@gmail.com') ? '✅ Found' : '❌ Not Found'}</span></li>
          <li>baltscandlv@gmail.com: <span class="${emails.find(e => e.email === 'baltscandlv@gmail.com') ? 'success' : 'error'}">${emails.find(e => e.email === 'baltscandlv@gmail.com') ? '✅ Found' : '❌ Not Found'}</span></li>
        </ul>
      </body>
      </html>
      `;
      
      res.send(html);
    } catch (error) {
      console.error('Error in debug endpoint:', error);
      res.status(500).send('<h1>Error loading emails</h1><p>' + error.message + '</p>');
    }
  });







  // SEO endpoints
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const sitemap = await generateSitemap();
      res.set('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  });

  // RSS feed endpoint
  app.get('/rss.xml', async (req, res) => {
    try {
      const rss = await generateRSSFeed();
      res.set('Content-Type', 'application/rss+xml');
      res.send(rss);
    } catch (error) {
      console.error('Error generating RSS feed:', error);
      res.status(500).send('Error generating RSS feed');
    }
  });

  app.get('/robots.txt', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.sendFile('robots.txt', { root: 'public' });
  });

  // Digital Products API
  app.get('/api/digital-products', async (req, res) => {
    try {
      const { digitalProducts } = await import('@shared/schema');
      const products = await db.select().from(digitalProducts).where(eq(digitalProducts.isActive, true));
      res.json(products);
    } catch (error) {
      console.error('Error fetching digital products:', error);
      res.status(500).json({ error: 'Failed to fetch digital products' });
    }
  });

  // Create payment intent for digital product
  app.post('/api/create-digital-payment', async (req, res) => {
    try {
      const { productId, email } = req.body;
      
      if (!productId || !email) {
        return res.status(400).json({ error: 'Product ID and email are required' });
      }

      const { digitalProducts } = await import('@shared/schema');
      const [product] = await db.select().from(digitalProducts).where(eq(digitalProducts.id, productId));
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2023-10-16",
      });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(product.price) * 100),
        currency: 'usd',
        metadata: {
          type: 'digital_product',
          productId: productId.toString(),
          email: email
        }
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        amount: parseFloat(product.price)
      });
    } catch (error) {
      console.error('Error creating digital payment:', error);
      res.status(500).json({ error: 'Failed to create payment' });
    }
  });

  // Confirm digital purchase and create download token
  app.post('/api/confirm-digital-purchase', async (req, res) => {
    try {
      const { paymentIntentId, email } = req.body;
      
      if (!paymentIntentId || !email) {
        return res.status(400).json({ error: 'Payment intent ID and email are required' });
      }

      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2023-10-16",
      });

      // Verify payment intent
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ error: 'Payment not completed' });
      }

      const productId = parseInt(paymentIntent.metadata.productId);
      
      // Generate secure download token
      const crypto = await import('crypto');
      const downloadToken = crypto.randomBytes(32).toString('hex');

      const { digitalPurchases } = await import('@shared/schema');
      
      // Create purchase record
      await db.insert(digitalPurchases).values({
        productId: productId,
        email: email,
        stripePaymentIntentId: paymentIntentId,
        purchasePrice: (paymentIntent.amount / 100).toString(),
        downloadToken: downloadToken
      });

      res.json({ 
        success: true, 
        downloadToken,
        message: 'Purchase confirmed successfully'
      });
    } catch (error) {
      console.error('Error confirming digital purchase:', error);
      res.status(500).json({ error: 'Failed to confirm purchase' });
    }
  });

  // Download digital product
  app.get('/api/download/:token', async (req, res) => {
    try {
      const { token } = req.params;
      
      if (!token) {
        return res.status(400).json({ error: 'Download token is required' });
      }

      const { digitalPurchases, digitalProducts } = await import('@shared/schema');
      
      // Find purchase by token
      const [purchase] = await db
        .select({
          purchase: digitalPurchases,
          product: digitalProducts
        })
        .from(digitalPurchases)
        .innerJoin(digitalProducts, eq(digitalPurchases.productId, digitalProducts.id))
        .where(eq(digitalPurchases.downloadToken, token));

      if (!purchase) {
        return res.status(404).json({ error: 'Invalid or expired download token' });
      }

      // Check download limit
      if (purchase.purchase.downloadCount >= purchase.purchase.maxDownloads) {
        return res.status(403).json({ error: 'Download limit exceeded' });
      }

      // Update download count
      await db
        .update(digitalPurchases)
        .set({ downloadCount: purchase.purchase.downloadCount + 1 })
        .where(eq(digitalPurchases.id, purchase.purchase.id));

      // Serve the file
      const filePath = path.join(process.cwd(), 'server/public', purchase.product.fileName);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${purchase.product.fileName}"`);
      res.sendFile(filePath);
      
    } catch (error) {
      console.error('Error downloading digital product:', error);
      res.status(500).json({ error: 'Failed to download file' });
    }
  });

  // Authentication was already set up at the beginning of registerRoutes

  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      console.log('🔍 Auth check:', {
        sessionId: req.sessionID,
        hasSession: !!req.session,
        hasUser: !!req.session?.user,
        userEmail: req.session?.user?.email,
        cookie: req.headers.cookie,
        environment: process.env.NODE_ENV,
        hostname: req.hostname
      });
      
      // Check for email/password auth session FIRST (for production)
      if (req.session?.user) {
        console.log('✅ Session user found:', req.session.user.email);
        return res.json(req.session.user);
      }
      
      // LOCALHOST: Return admin user for development
      if (req.hostname === 'localhost') {
        console.log('🔧 Localhost: returning admin user');
        return res.json({
          id: 'karlis-dev-admin',
          email: 'karlisvilmanis@gmail.com',
          firstName: 'Karlis',
          lastName: 'Vilmanis',
          profileImageUrl: null,
          role: 'admin'
        });
      }
      
      // Check if user is authenticated via Replit Auth
      const userId = req.user?.claims?.sub;
      const userEmail = req.user?.claims?.email;
      
      if (!userId) {
        // In development mode, check session for mock user
        if (process.env.NODE_ENV === 'development') {
          const sessionUser = req.session?.user;
          if (sessionUser) {
            // Return the session user directly with role
            return res.json({
              id: sessionUser.id,
              email: sessionUser.email,
              firstName: sessionUser.firstName,
              lastName: sessionUser.lastName,
              profileImageUrl: sessionUser.profileImageUrl || null,
              role: sessionUser.role || 'user'
            });
          }
        }
        console.log('❌ No authenticated user found');
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // CRITICAL: Check if this is karlisvilmanis@gmail.com and add admin role
      const userWithRole = {
        ...user,
        role: userEmail === 'karlisvilmanis@gmail.com' ? 'admin' : 'user'
      };
      
      res.json(userWithRole);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Development auto-login route for testing
  app.get('/api/dev-auto-login', async (req: any, res) => {
    if (process.env.NODE_ENV === 'development') {
      // Create a mock user for development
      const mockUser = {
        id: 'dev-user-123',
        email: 'dev@example.com',
        firstName: 'Dev',
        lastName: 'User',
        profileImageUrl: null,
      };
      
      // Store mock user in database
      await storage.upsertUser(mockUser);
      
      // Create a mock session
      req.session = req.session || {};
      req.session.user = {
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        profileImageUrl: mockUser.profileImageUrl,
        role: 'user',
        claims: {
          sub: mockUser.id,
          email: mockUser.email,
          first_name: mockUser.firstName,
          last_name: mockUser.lastName,
        }
      };
      
      res.json({ success: true, message: "Development login successful" });
    } else {
      res.status(403).json({ message: "Development login not available in production" });
    }
  });

  // Development-friendly logout route
  app.get('/api/logout', (req: any, res) => {
    if (process.env.NODE_ENV === 'development') {
      // Clear mock session
      if (req.session) {
        req.session.destroy();
      }
      res.redirect('/');
    } else {
      // In production, this would be handled by the auth middleware
      res.redirect('/');
    }
  });

  // Email/Password Authentication Routes
  
  // Register new user
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "User with this email already exists" });
      }

      // Create new user
      const user = await storage.createUserWithPassword(email, password, firstName, lastName);
      
      // Check for existing test sessions with this email and link them to the new user
      const unlinkedSessions = await storage.getUnlinkedTestSessionsByEmail(email);
      if (unlinkedSessions.length > 0) {
        const sessionIds = unlinkedSessions.map(session => session.id);
        await storage.linkTestSessionsToUser(sessionIds, user.id);
        console.log(`✅ Linked ${unlinkedSessions.length} existing test sessions to new user ${email}`);
      }
      
      // Create session
      (req as any).session.user = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
        claims: {
          sub: user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
        }
      };

      res.json({ 
        success: true, 
        message: "Registration successful",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Login user
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      console.log('🔐 Login attempt:', { 
        email, 
        hasPassword: !!password,
        sessionId: req.sessionID,
        hostname: req.hostname,
        userAgent: req.get('User-Agent'),
        nodeEnv: process.env.NODE_ENV
      });

      // Validation
      if (!email || !password) {
        console.log('❌ Missing email or password');
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Validate credentials
      const user = await storage.validateUserPassword(email, password);
      if (!user) {
        console.log('❌ Invalid credentials for:', email);
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      console.log('✅ User validated:', { id: user.id, email: user.email });

      // Update last login
      await storage.updateLastLogin(user.id);

      // Check for any unlinked test sessions with this email and link them
      const unlinkedSessions = await storage.getUnlinkedTestSessionsByEmail(email);
      if (unlinkedSessions.length > 0) {
        const sessionIds = unlinkedSessions.map(session => session.id);
        await storage.linkTestSessionsToUser(sessionIds, user.id);
        console.log(`✅ Linked ${unlinkedSessions.length} existing test sessions to returning user ${email}`);
      }

      // Create session
      const sessionUser = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
        claims: {
          sub: user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
        }
      };
      
      (req as any).session.user = sessionUser;
      console.log('💾 Session user set:', { id: user.id, email: user.email });
      
      // Explicitly save session for production reliability
      (req as any).session.save((err: any) => {
        if (err) {
          console.error('❌ Session save error:', err);
          return res.status(500).json({ message: "Login failed - session error" });
        }
        
        console.log('✅ Session saved successfully for:', user.email);
        console.log('🔍 Final session data:', {
          sessionId: req.sessionID,
          hasUser: !!(req as any).session?.user,
          userEmail: (req as any).session?.user?.email
        });
        
        res.json({ 
          success: true, 
          message: "Login successful",
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          }
        });
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Logout user (email/password auth)
  app.post('/api/auth/logout', (req: any, res) => {
    if (req.session) {
      req.session.destroy((err: any) => {
        if (err) {
          return res.status(500).json({ message: "Logout failed" });
        }
        res.json({ success: true, message: "Logout successful" });
      });
    } else {
      res.json({ success: true, message: "Already logged out" });
    }
  });

  // User dashboard routes
  app.get('/api/user/test-sessions', async (req: any, res) => {
    try {
      // Check for email/password auth session first
      if (req.session?.user?.id) {
        const sessions = await storage.getUserTestSessions(req.session.user.id.toString());
        return res.json(sessions);
      }
      
      // In development mode, check session for mock user or X-Test-User header
      if (process.env.NODE_ENV === 'development') {
        // Check for test user header first
        const testUserId = req.headers['x-test-user'];
        if (testUserId) {
          const sessions = await storage.getUserTestSessions(testUserId);
          return res.json(sessions);
        }
        
        // Fall back to session user
        const sessionUser = req.session?.user;
        if (sessionUser?.claims?.sub) {
          const userId = sessionUser.claims.sub;
          const sessions = await storage.getUserTestSessions(userId);
          return res.json(sessions);
        }
        return res.json([]);
      }
      
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const sessions = await storage.getUserTestSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching user test sessions:", error);
      res.status(500).json({ message: "Failed to fetch test sessions" });
    }
  });

  // Dashboard API - Get user's test results with scores from test_results table
  app.get('/api/user/test-results', async (req: any, res) => {
    try {
      // Check for email/password auth session first
      if (req.session?.user?.id) {
        const userId = req.session.user.id.toString();
        console.log('📊 Fetching test results for user:', userId);
        
        // Get test results with session data
        const results = await db
          .select({
            id: testResults.id,
            sessionId: testResults.sessionId,
            userId: testResults.userId,
            passionScore: testResults.passionScore,
            missionScore: testResults.missionScore,
            vocationScore: testResults.vocationScore,
            professionScore: testResults.professionScore,
            overallScore: testResults.overallScore,
            primaryType: testResults.primaryType,
            strengths: testResults.strengths,
            recommendations: testResults.recommendations,
            createdAt: testResults.createdAt,
            hasPremiumAccess: testSessions.hasPremiumAccess,
            premiumTier: testSessions.premiumTier
          })
          .from(testResults)
          .leftJoin(testSessions, eq(testResults.sessionId, testSessions.id))
          .where(eq(testResults.userId, userId))
          .orderBy(desc(testResults.createdAt));
        
        // Transform the results to match frontend expectations
        const transformedResults = results.map(r => ({
          id: r.id,
          sessionId: r.sessionId,
          userId: r.userId,
          results: {
            passion: Number(r.passionScore) || 0,
            mission: Number(r.missionScore) || 0,
            vocation: Number(r.vocationScore) || 0,
            profession: Number(r.professionScore) || 0,
            overall: Number(r.overallScore) || 0,
            primaryType: r.primaryType || 'Unknown',
            strengths: r.strengths || [],
            recommendations: r.recommendations || {}
          },
          hasPremiumAccess: r.hasPremiumAccess || false,
          premiumTier: r.premiumTier,
          createdAt: r.createdAt,
          updatedAt: r.createdAt,
          isCompleted: true,
          currentQuestion: 30,
          totalQuestions: 30,
          answers: {},
          language: 'en'
        }));
        
        console.log(`📊 Found ${transformedResults.length} test results for user`);
        return res.json(transformedResults);
      }
      
      // Fallback for development mode
      if (process.env.NODE_ENV === 'development') {
        const sessionUser = req.session?.user;
        if (sessionUser?.claims?.sub) {
          const userId = sessionUser.claims.sub;
          // Similar logic as above but with userId
          return res.json([]);
        }
        return res.json([]);
      }
      
      return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      console.error("Error fetching user test results:", error);
      res.status(500).json({ message: "Failed to fetch test results" });
    }
  });

  // Questions routes
  app.get('/api/questions', async (req, res) => {
    try {
      const questions = await storage.getActiveQuestions();
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  app.post('/api/questions', isAdmin, async (req, res) => {
    try {
      const questionData = insertQuestionSchema.parse(req.body);
      const question = await storage.createQuestion(questionData);
      res.json(question);
    } catch (error) {
      console.error("Error creating question:", error);
      res.status(500).json({ message: "Failed to create question" });
    }
  });

  app.put('/api/questions/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const questionData = insertQuestionSchema.partial().parse(req.body);
      const question = await storage.updateQuestion(id, questionData);
      res.json(question);
    } catch (error) {
      console.error("Error updating question:", error);
      res.status(500).json({ message: "Failed to update question" });
    }
  });

  app.delete('/api/questions/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteQuestion(id);
      res.json({ message: "Question deleted" });
    } catch (error) {
      console.error("Error deleting question:", error);
      res.status(500).json({ message: "Failed to delete question" });
    }
  });

  // Answer options routes
  app.get('/api/questions/:id/options', async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      const options = await storage.getAnswerOptionsByQuestionId(questionId);
      res.json(options);
    } catch (error) {
      console.error("Error fetching answer options:", error);
      res.status(500).json({ message: "Failed to fetch answer options" });
    }
  });

  // Alternative route for testing compatibility
  app.get('/api/questions/:id/answers', async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      const options = await storage.getAnswerOptionsByQuestionId(questionId);
      res.json(options);
    } catch (error) {
      console.error("Error fetching answer options:", error);
      res.status(500).json({ message: "Failed to fetch answer options" });
    }
  });

  app.post('/api/questions/:id/options', isAdmin, async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      const optionData = insertAnswerOptionSchema.parse({
        ...req.body,
        questionId,
      });
      const option = await storage.createAnswerOption(optionData);
      res.json(option);
    } catch (error) {
      console.error("Error creating answer option:", error);
      res.status(500).json({ message: "Failed to create answer option" });
    }
  });

  // Test session routes
  app.post('/api/test-sessions', async (req: any, res) => {
    try {
      // For anonymous users, don't include userId at all
      const userId = req.user?.claims?.sub || req.session?.userId || null;
      
      const sessionData: any = {
        ...req.body,
        isCompleted: false,
        currentQuestionIndex: 0,
        answers: {},
      };
      
      // Only add userId if it exists
      if (userId) {
        sessionData.userId = userId;
      }
      
      const session = await storage.createTestSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating test session:", error);
      res.status(500).json({ message: "Failed to create test session" });
    }
  });

  app.get('/api/test-sessions/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.getTestSession(id);
      if (!session) {
        return res.status(404).json({ message: "Test session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Error fetching test session:", error);
      res.status(500).json({ message: "Failed to fetch test session" });
    }
  });

  app.put('/api/test-sessions/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const session = await storage.updateTestSession(id, updates);
      
      // Email collection is enabled and automated email sending is now working
      // SendGrid verified sender: karlisvilmanis@gmail.com
      if (updates.email && session.results) {
        const results = session.results as any;
        if (results.primaryType && results.overallScore) {
          console.log(`Sending Ikigai results email to: ${updates.email}`);
          await sendIkigaiResultsEmail(
            updates.email,
            results.primaryType,
            results.overallScore,
            id
          );
        }
      }
      
      res.json(session);
    } catch (error) {
      console.error("Error updating test session:", error);
      res.status(500).json({ message: "Failed to update test session" });
    }
  });

  app.post('/api/test-sessions/:id/complete', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.getTestSession(id);
      
      if (!session) {
        return res.status(404).json({ message: "Test session not found" });
      }

      // CRITICAL: Ensure session has answers before completion
      // Sessions without answers will result in zero scores and empty results
      // This was a bug that caused dashboard to show 0 scores for all pillars
      if (!session.answers || Object.keys(session.answers).length === 0) {
        return res.status(400).json({ message: "Cannot complete session without answers" });
      }

      // Transform answers to include category and subcategory mapping
      const transformedAnswers: Record<string, { category: string; subcategory: string }> = {};
      const answerMappings = getAnswerMappings();
      
      if (session.answers) {
        Object.entries(session.answers).forEach(([questionId, answerIndex]) => {
          const mapping = answerMappings[parseInt(questionId)]?.[answerIndex - 1]; // answerIndex is 1-based
          if (mapping) {
            transformedAnswers[questionId] = mapping;
          }
        });
      }

      // Calculate Ikigai scores with the new sophisticated algorithm
      const results = calculateIkigaiScores(transformedAnswers);
      
      // Update session as completed
      await storage.updateTestSession(id, {
        isCompleted: true,
        results,
      });

      // Create test result
      const testResult = await storage.createTestResult({
        sessionId: id,
        userId: session.userId,
        passionScore: results.passion.toString(),
        missionScore: results.mission.toString(),
        vocationScore: results.vocation.toString(),
        professionScore: results.profession.toString(),
        overallScore: results.overall.toString(),
        primaryType: results.primaryType,
        strengths: results.strengths,
        recommendations: results.recommendations,
      });

      res.json(testResult);
    } catch (error) {
      console.error("Error completing test session:", error);
      res.status(500).json({ message: "Failed to complete test session" });
    }
  });

  // Note: User test history routes are handled above with development mode compatibility

  app.get('/api/test-results/:sessionId', async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      
      // First try to get from testResults table
      let result = await storage.getTestResult(sessionId);
      
      // If not found, check if results are stored in session.results column (for completed sessions)
      if (!result) {
        const session = await storage.getTestSession(sessionId);
        if (session && session.isCompleted && session.results) {
          // Convert session results to expected format
          const sessionResults = session.results as any;
          result = {
            sessionId: sessionId,
            userId: session.userId,
            passionScore: sessionResults.passion?.toString() || '0',
            missionScore: sessionResults.mission?.toString() || '0',
            vocationScore: sessionResults.vocation?.toString() || '0',
            professionScore: sessionResults.profession?.toString() || '0',
            overallScore: sessionResults.overall?.toString() || '0',
            primaryType: sessionResults.primaryType || 'Unknown',
            strengths: sessionResults.strengths || [],
            recommendations: sessionResults.recommendations || {},
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
          };
        }
      }
      
      if (!result) {
        return res.status(404).json({ message: "Test result not found" });
      }
      res.json(result);
    } catch (error) {
      console.error("Error fetching test result:", error);
      res.status(500).json({ message: "Failed to fetch test result" });
    }
  });

  // Premium results endpoint
  app.get('/api/premium-results/:sessionId', async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const language = req.query.language as string || 'en';
      const result = await storage.getTestResult(sessionId);
      if (!result) {
        return res.status(404).json({ message: "Test result not found" });
      }

      // Get session to check premium tier
      const session = await storage.getTestSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Test session not found" });
      }

      // Get feature access based on premium tier
      const { getFeatureAccess } = await import("@shared/access-control");
      const featureAccess = getFeatureAccess(session.premiumTier);

      // Generate detailed premium analysis with language support
      const detailedAnalysis = generatePremiumAnalysis(result, language);
      
      // Parse subcategory scores from the recommendations field if available
      let subcategoryScores = {};
      try {
        if (result.recommendations && typeof result.recommendations === 'object' && result.recommendations.subcategoryScores) {
          subcategoryScores = result.recommendations.subcategoryScores;
        }
      } catch (e) {
        console.log('Could not parse subcategory scores');
      }
      
      // Filter detailed analysis based on feature access
      const filteredAnalysis = {
        personalityInsights: detailedAnalysis.personalityInsights,
        careerFit: featureAccess.careerMatches ? detailedAnalysis.careerFit : undefined,
        roadmaps: featureAccess.careerRoadmap ? detailedAnalysis.roadmaps : undefined,
        developmentAreas: featureAccess.developmentAreas ? detailedAnalysis.developmentAreas : undefined,
        marketInsights: featureAccess.marketInsights ? detailedAnalysis.marketInsights : undefined,
        personalityProfile: featureAccess.personalityProfile ? detailedAnalysis.personalityProfile : undefined,
        networkingStrategy: featureAccess.networkingStrategy ? detailedAnalysis.networkingStrategy : undefined,
        aiMentor: featureAccess.aiMentor ? detailedAnalysis.aiMentor : undefined,
        interviewPreparation: featureAccess.interviewPrep ? detailedAnalysis.interviewPreparation : undefined,
        successBlueprint: featureAccess.transformationPlan ? detailedAnalysis.successBlueprint : undefined
      };
      
      const premiumResult = {
        ...result,
        subcategoryScores,
        detailedAnalysis: filteredAnalysis,
        featureAccess,
        premiumTier: session.premiumTier
      };
      
      res.json(premiumResult);
    } catch (error) {
      console.error("Error fetching premium results:", error);
      res.status(500).json({ message: "Failed to fetch premium results" });
    }
  });

  // Payment success fallback endpoint (if webhooks fail)
  app.post("/api/payment-success", async (req, res) => {
    try {
      const { payment_intent_id, sessionId, offerId } = req.body;
      
      if (!payment_intent_id || !sessionId) {
        return res.status(400).json({ message: "Missing required parameters" });
      }
      
      // Verify the payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
      
      if (paymentIntent.status === 'succeeded') {
        // Map offer to tier
        const offerToTierMap: Record<string, string> = {
          'roadmap': 'roadmap',
          'personality': 'personality', 
          'blueprint': 'blueprint',
          'premium-report': 'blueprint'
        };
        
        const premiumTier = offerToTierMap[offerId] || 'roadmap';
        
        // Update session with premium access
        const sessionIdNum = parseInt(sessionId);
        if (!isNaN(sessionIdNum)) {
          await storage.updateTestSession(sessionIdNum, {
            hasPremiumAccess: true,
            premiumTier: premiumTier
          });
          
          console.log(`✅ Manual payment success: session ${sessionId} upgraded to ${premiumTier}`);
          res.json({ success: true, premiumTier });
        } else {
          res.status(400).json({ message: "Invalid session ID" });
        }
      } else {
        res.status(400).json({ message: "Payment not completed" });
      }
    } catch (error: any) {
      console.error("Payment success fallback error:", error);
      res.status(500).json({ message: "Error processing payment success" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, offerId, sessionId } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          offerId: offerId || 'premium-report',
          sessionId: sessionId || 'unknown'
        }
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Stripe error:", error);
      
      // If Stripe payment methods aren't activated, provide helpful feedback
      if (error.message.includes('No valid payment method types')) {
        res.status(400).json({ 
          message: "Stripe payment methods need to be activated",
          details: "Please go to https://dashboard.stripe.com/settings/payment_methods and enable card payments for your account.",
          isStripeConfigurationError: true
        });
      } else {
        res.status(500).json({ message: "Error creating payment intent: " + error.message });
      }
    }
  });
  
  // Shop payment route for Ikigai cards
  app.post("/api/shop/create-payment", async (req, res) => {
    try {
      const { productId, quantity, amount, productName } = req.body;
      
      // Use the provided amount or default to 29.99
      const basePrice = amount || 29.99; 
      const totalAmount = basePrice * (quantity || 1);
      
      // Calculate shipping cost (free shipping over $50, otherwise $5.99)
      const shippingCost = totalAmount >= 50 ? 0 : 5.99;
      const finalTotal = totalAmount + shippingCost;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(finalTotal * 100), // Convert to cents
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          productId: productId || 'ikigai-cards',
          productName: productName || 'Ikigai Self-Discovery Cards',
          quantity: String(quantity || 1),
          subtotal: String(totalAmount),
          shipping: String(shippingCost),
          source: 'shop',
          requiresShipping: 'true'
        }
      });
      
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        shippingCost,
        finalTotal 
      });
    } catch (error: any) {
      console.error("Shop payment error:", error);
      
      if (error.message.includes('No valid payment method types')) {
        res.status(400).json({ 
          message: "Stripe payment methods need to be activated",
          details: "Please go to https://dashboard.stripe.com/settings/payment_methods and enable card payments for your account.",
          isStripeConfigurationError: true
        });
      } else {
        res.status(500).json({ message: "Error creating shop payment intent: " + error.message });
      }
    }
  });

  // Demo payment route for testing the upsell flow
  app.post("/api/demo-payment", async (req, res) => {
    try {
      const { sessionId, offerId, offer } = req.body;
      const actualOffer = offerId || offer; // Support both field names
      
      console.log('Demo payment request:', { sessionId, offerId, offer, actualOffer });
      
      // Map offer ID to premium tier
      const offerToTierMap: Record<string, any> = {
        'roadmap': 'roadmap',
        'personality': 'personality', 
        'blueprint': 'blueprint',
        'premium-report': 'blueprint' // Default fallback
      };
      
      const premiumTier = offerToTierMap[actualOffer] || 'roadmap';
      console.log('Mapped tier:', premiumTier, 'from offer:', actualOffer);
      
      // Simulate successful payment and upgrade session
      if (sessionId) {
        const session = await storage.updateTestSession(parseInt(sessionId), {
          hasPremiumAccess: true,
          premiumTier: premiumTier
        });
        
        res.json({ 
          success: true, 
          message: `Demo payment successful! ${premiumTier} tier access granted.`,
          session,
          premiumTier
        });
      } else {
        res.json({ success: true, message: "Demo payment successful!" });
      }
    } catch (error: any) {
      console.error("Demo payment error:", error);
      res.status(500).json({ message: "Demo payment failed: " + error.message });
    }
  });

  // Webhook to handle successful payments
  app.post("/api/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    // DEBUG: Log incoming request details
    console.log('🔍 Webhook Debug - Body type:', typeof req.body);
    console.log('🔍 Webhook Debug - Body is Buffer:', Buffer.isBuffer(req.body));
    console.log('🔍 Webhook Debug - Content-Type:', req.headers['content-type']);
    console.log('🔍 Webhook Debug - Raw body (first 100 chars):', 
      Buffer.isBuffer(req.body) ? req.body.toString().substring(0, 100) : 
      typeof req.body === 'string' ? req.body.substring(0, 100) : 
      JSON.stringify(req.body).substring(0, 100));

    // CRITICAL FIX: Handle missing webhook secret gracefully
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.warn('⚠️ STRIPE_WEBHOOK_SECRET not configured - processing webhook anyway for development');
      // In development, we can process the webhook without signature verification
      try {
        if (Buffer.isBuffer(req.body)) {
          // Raw buffer from express.raw()
          const rawBody = req.body.toString();
          event = JSON.parse(rawBody);
          console.log('📡 Parsed webhook from raw buffer');
        } else if (typeof req.body === 'string') {
          // String body
          event = JSON.parse(req.body);
          console.log('📡 Parsed webhook from string');
        } else if (typeof req.body === 'object' && req.body !== null) {
          // Already parsed object (due to global express.json() middleware)
          event = req.body as Stripe.Event;
          console.log('📡 Using already parsed webhook object');
        } else {
          throw new Error('Unexpected body type: ' + typeof req.body);
        }
        
        console.log('📡 Processing webhook without signature verification (development mode)');
        console.log('📡 Event type:', event.type, 'Event ID:', event.id);
      } catch (parseErr: any) {
        console.error('Failed to parse webhook body:', parseErr.message);
        console.error('Body type:', typeof req.body);
        console.error('Body content:', req.body);
        return res.status(400).send('Invalid webhook body: ' + parseErr.message);
      }
    } else {
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        console.log('📡 Webhook signature verified successfully');
      } catch (err: any) {
        console.log('Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    }

    // Process the webhook event
    await processWebhookEvent(event, res);
  });
  
  // Function to process webhook events
  async function processWebhookEvent(event: Stripe.Event, res: any) {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const sessionId = paymentIntent.metadata?.sessionId;
      const offerId = paymentIntent.metadata?.offerId;
      const source = paymentIntent.metadata?.source;
      
      console.log(`💰 Payment succeeded: ${paymentIntent.id}, source: ${source}, sessionId: ${sessionId}, offerId: ${offerId}`);
      
      // Handle shop orders
      if (source === 'shop') {
        const productId = paymentIntent.metadata.productId;
        const productName = paymentIntent.metadata.productName;
        const quantity = paymentIntent.metadata.quantity;
        
        console.log(`Shop order processed: ${productName} x${quantity}`);
        
        // Here you could save order details to database
        // await storage.createOrder({ productId, productName, quantity, paymentIntentId: paymentIntent.id });
        
        return res.json({ received: true });
      }
      
      // Handle premium test upgrades
      const offerToTierMap: Record<string, any> = {
        'roadmap': 'roadmap',
        'personality': 'personality', 
        'blueprint': 'blueprint',
        'premium-report': 'blueprint'
      };
      
      const premiumTier = offerToTierMap[offerId] || 'roadmap';
      
      // Update session to have premium access
      if (sessionId && sessionId !== 'unknown') {
        try {
          const sessionIdNum = parseInt(sessionId);
          if (isNaN(sessionIdNum)) {
            console.error(`❌ Invalid session ID: ${sessionId}`);
            return res.status(400).json({ error: 'Invalid session ID' });
          }
          
          const updatedSession = await storage.updateTestSession(sessionIdNum, {
            hasPremiumAccess: true,
            premiumTier: premiumTier
          });
          
          console.log(`✅ Premium access granted for session ${sessionId} with tier ${premiumTier}`);
          console.log(`💾 Session updated:`, { sessionId, premiumTier, hasPremiumAccess: true });
        } catch (error) {
          console.error('❌ Error updating session:', error);
          // Still return 200 to acknowledge the webhook
        }
      } else {
        console.warn(`⚠️ No valid session ID in payment metadata: ${sessionId}`);
      }
    }

    res.json({ received: true });
  }

  app.post('/api/upgrade-session-premium', isAdmin, async (req, res) => {
    try {
      const { sessionId } = req.body;
      const session = await storage.updateTestSession(sessionId, {
        hasPremiumAccess: true,
      });
      res.json(session);
    } catch (error) {
      console.error("Error upgrading session to premium:", error);
      res.status(500).json({ message: "Failed to upgrade session" });
    }
  });

  // Blog API routes
  
  // Development session debug endpoint
  if (process.env.NODE_ENV === 'development') {
    app.get('/api/debug-session', (req: any, res) => {
      res.json({
        sessionID: req.sessionID,
        hasSession: !!req.session,
        sessionData: req.session,
        cookies: req.headers.cookie,
        timestamp: new Date().toISOString()
      });
    });
  }
  
  // Development admin login route
  if (process.env.NODE_ENV === 'development') {
    app.post('/api/dev-admin-login', async (req, res) => {
      const { email } = req.body;
      
      // CRITICAL: Only karlisvilmanis@gmail.com allowed for admin access
      if (email !== 'karlisvilmanis@gmail.com') {
        return res.status(403).json({ message: 'Admin access suspended. Only karlisvilmanis@gmail.com allowed.' });
      }
      
      // Create session for karlisvilmanis@gmail.com only
      const mockUser = {
        id: 'dev-admin-' + Date.now(),
        email: email,
        firstName: 'Karlis',
        lastName: 'Vilmanis',
        role: 'admin',
        claims: {
          sub: 'dev-admin-' + Date.now(),
          email: email,
          first_name: 'Karlis',
          last_name: 'Vilmanis'
        }
      };
        
      req.session.user = mockUser;
      
      // Explicitly save session for development mode
      req.session.save((err: any) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ message: 'Failed to create session' });
        }
        console.log('✅ Admin session created for:', email);
        console.log('Session ID:', req.sessionID);
        console.log('Session data:', req.session.user);
        res.json({ success: true, user: mockUser });
      });
    });

    // Debug endpoint to check session state
    app.get('/api/debug-session', async (req: any, res) => {
      res.json({
        sessionID: req.sessionID,
        hasSession: !!req.session,
        sessionData: req.session,
        cookies: req.headers.cookie,
        timestamp: new Date().toISOString()
      });
    });

    // Development user login route for testing
    app.post('/api/dev-user-login', async (req, res) => {
      const { userId, email } = req.body;
      
      // Create session for development user
      const mockUser = {
        id: userId || 'dev-user-123',
        email: email || 'dev@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
        claims: {
          sub: userId || 'dev-user-123',
          email: email || 'dev@example.com',
          first_name: 'Test',
          last_name: 'User'
        }
      };
      
      req.session.user = mockUser;
      res.json({ success: true, user: mockUser });
    });

    // Development auto-login route
    app.get('/api/dev-auto-login', async (req, res) => {
      // Create session for development user automatically
      const mockUser = {
        id: 'dev-user-123',
        email: 'dev@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
        claims: {
          sub: 'dev-user-123',
          email: 'dev@example.com',
          first_name: 'Test',
          last_name: 'User'
        }
      };
      
      req.session.user = mockUser;
      res.json({ success: true, user: mockUser, message: 'Auto-login successful' });
    });
  }

  // Public blog routes
  app.get('/api/blog/posts', async (req, res) => {
    try {
      // Set cache headers for better performance
      res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
      
      const posts = await storage.getPublishedBlogPosts();
      
      // Optimize response by removing content field for listing
      const optimizedPosts = posts.map(post => ({
        ...post,
        content: undefined // Remove heavy content field for listing
      }));
      
      res.json(optimizedPosts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get('/api/blog/posts/:slug', async (req, res) => {
    try {
      // Set cache headers for individual posts
      res.set('Cache-Control', 'public, max-age=600'); // 10 minutes
      
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      if (!post.isPublished) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Admin email collection route
  app.get('/api/admin/emails', isAdmin, async (req, res) => {
    try {
      const sessions = await db
        .select({
          id: testSessions.id,
          email: testSessions.email,
          results: testSessions.results,
          createdAt: testSessions.createdAt,
          updatedAt: testSessions.updatedAt,
          premiumTier: testSessions.premiumTier,
        })
        .from(testSessions)
        .where(and(
          isNotNull(testSessions.email),
          isNotNull(testSessions.results)
        ))
        .orderBy(desc(testSessions.createdAt));

      const emailData = sessions.map(session => {
        const results = session.results as any;
        return {
          id: session.id,
          email: session.email,
          primaryType: results?.primaryType || 'Unknown',
          overallScore: results?.overall || 0,
          createdAt: session.createdAt,
          completedAt: session.updatedAt,
          premiumTier: session.premiumTier,
        };
      });

      res.json(emailData);
    } catch (error) {
      console.error("Error fetching email collection data:", error);
      res.status(500).json({ message: "Failed to fetch email data" });
    }
  });

  // Admin-only collected emails endpoint (alternative route)
  app.get('/api/admin/collected-emails', isAdmin, async (req, res) => {
    try {
      const emails = await storage.getCollectedEmails();
      res.json({
        totalEmails: emails.length,
        todayEmails: emails.filter(e => {
          const today = new Date().toDateString();
          const emailDate = new Date(e.created_at).toDateString();
          return today === emailDate;
        }).length,
        keyEmails: [
          "cindytradellc@gmail.com",
          "baltscandlv@gmail.com",
          "karlisvilmanis@gmail.com"
        ].map(email => ({
          email,
          collected: emails.some(e => e.email === email),
          status: emails.find(e => e.email === email)?.premium_tier || "basic"
        })),
        emails
      });
    } catch (error) {
      console.error("Error fetching collected emails:", error);
      res.status(500).json({ message: "Failed to fetch collected emails" });
    }
  });

  // Checkout analytics routes
  app.post('/api/checkout-analytics', async (req, res) => {
    try {
      const analyticsData = insertCheckoutAnalyticsSchema.parse(req.body);
      const analytics = await storage.createCheckoutAnalytics(analyticsData);
      res.json(analytics);
    } catch (error) {
      console.error("Error creating checkout analytics:", error);
      res.status(500).json({ message: "Failed to create checkout analytics" });
    }
  });

  app.put('/api/checkout-analytics/:sessionId', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const updates = req.body;
      const analytics = await storage.updateCheckoutAnalytics(sessionId, updates);
      if (!analytics) {
        return res.status(404).json({ message: "Analytics record not found" });
      }
      res.json(analytics);
    } catch (error) {
      console.error("Error updating checkout analytics:", error);
      res.status(500).json({ message: "Failed to update checkout analytics" });
    }
  });

  // Admin checkout analytics endpoints
  app.get('/api/admin/checkout-analytics', isAdmin, async (req, res) => {
    try {
      const analytics = await storage.getCheckoutAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching checkout analytics:", error);
      res.status(500).json({ message: "Failed to fetch checkout analytics" });
    }
  });

  app.get('/api/admin/checkout-stats', isAdmin, async (req, res) => {
    try {
      const stats = await storage.getCheckoutConversionStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching checkout stats:", error);
      res.status(500).json({ message: "Failed to fetch checkout stats" });
    }
  });

  // Admin blog routes (require authentication)
  app.get('/api/admin/blog/posts', isAdmin, async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching all blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get('/api/admin/blog/posts/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPost(id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post('/api/admin/blog/posts', isAdmin, async (req: any, res) => {
    try {
      const authorId = req.user?.claims?.sub;
      if (!authorId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Generate slug from title if not provided
      const slug = req.body.slug || (req.body.title || '').toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      // Check for existing post with same slug
      const existingPost = await storage.getBlogPostBySlug(slug);
      if (existingPost) {
        return res.status(409).json({ message: 'A post with this slug already exists' });
      }
      
      // Ensure tags is an array
      const tags = Array.isArray(req.body.tags) 
        ? req.body.tags 
        : (req.body.tags || '').split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
      
      const postData = insertBlogPostSchema.parse({
        ...req.body,
        slug,
        tags,
        authorId,
        readingTime: Math.ceil((req.body.content || '').split(' ').length / 200) // Estimate reading time
      });
      
      const post = await storage.createBlogPost(postData);
      res.json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      if (error.message?.includes('duplicate key')) {
        return res.status(409).json({ message: "A post with this slug already exists" });
      }
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.put('/api/admin/blog/posts/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Generate slug from title if not provided
      const slug = req.body.slug || (req.body.title ? req.body.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim() : undefined);
      
      // Ensure tags is an array
      const tags = Array.isArray(req.body.tags) 
        ? req.body.tags 
        : (req.body.tags || '').split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
      
      const postData = insertBlogPostSchema.partial().parse({
        ...req.body,
        slug,
        tags,
        readingTime: req.body.content ? Math.ceil(req.body.content.split(' ').length / 200) : undefined
      });
      
      const post = await storage.updateBlogPost(id, postData);
      res.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete('/api/admin/blog/posts/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBlogPost(id);
      res.json({ message: "Blog post deleted" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  app.post('/api/admin/blog/posts/:id/publish', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.publishBlogPost(id);
      res.json(post);
    } catch (error) {
      console.error("Error publishing blog post:", error);
      res.status(500).json({ message: "Failed to publish blog post" });
    }
  });

  app.post('/api/admin/blog/posts/:id/unpublish', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.unpublishBlogPost(id);
      res.json(post);
    } catch (error) {
      console.error("Error unpublishing blog post:", error);
      res.status(500).json({ message: "Failed to unpublish blog post" });
    }
  });

  // Advanced blog management routes
  app.get('/api/admin/blog/analytics', isAdmin, async (req, res) => {
    try {
      const analytics = await storage.getBlogAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching blog analytics:", error);
      res.status(500).json({ message: "Failed to fetch blog analytics" });
    }
  });

  app.get('/api/admin/blog/drafts', isAdmin, async (req, res) => {
    try {
      const drafts = await storage.getDraftBlogPosts();
      res.json(drafts);
    } catch (error) {
      console.error("Error fetching draft blog posts:", error);
      res.status(500).json({ message: "Failed to fetch draft blog posts" });
    }
  });

  app.get('/api/admin/blog/posts/tag/:tag', isAdmin, async (req, res) => {
    try {
      const { tag } = req.params;
      const posts = await storage.getBlogPostsByTag(tag);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts by tag:", error);
      res.status(500).json({ message: "Failed to fetch blog posts by tag" });
    }
  });

  app.post('/api/admin/blog/bulk-delete', isAdmin, async (req, res) => {
    try {
      const { postIds } = req.body;
      if (!Array.isArray(postIds) || postIds.length === 0) {
        return res.status(400).json({ message: "Invalid post IDs" });
      }
      await storage.bulkDeleteBlogPosts(postIds);
      res.json({ message: "Posts deleted successfully" });
    } catch (error) {
      console.error("Error bulk deleting blog posts:", error);
      res.status(500).json({ message: "Failed to delete blog posts" });
    }
  });

  app.post('/api/admin/blog/bulk-publish', isAdmin, async (req, res) => {
    try {
      const { postIds } = req.body;
      if (!Array.isArray(postIds) || postIds.length === 0) {
        return res.status(400).json({ message: "Invalid post IDs" });
      }
      const posts = await storage.bulkPublishBlogPosts(postIds);
      res.json(posts);
    } catch (error) {
      console.error("Error bulk publishing blog posts:", error);
      res.status(500).json({ message: "Failed to publish blog posts" });
    }
  });

  app.post('/api/admin/blog/bulk-unpublish', isAdmin, async (req, res) => {
    try {
      const { postIds } = req.body;
      if (!Array.isArray(postIds) || postIds.length === 0) {
        return res.status(400).json({ message: "Invalid post IDs" });
      }
      const posts = await storage.bulkUnpublishBlogPosts(postIds);
      res.json(posts);
    } catch (error) {
      console.error("Error bulk unpublishing blog posts:", error);
      res.status(500).json({ message: "Failed to unpublish blog posts" });
    }
  });

  // Configure multer for image uploads
  const storage_multer = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blog');
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `blog-${uniqueSuffix}${ext}`);
    }
  });

  const upload = multer({
    storage: storage_multer,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      // Allow only image files
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'), false);
      }
    }
  });

  // Image upload endpoint
  app.post('/api/admin/blog/upload-image', isAdmin, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      // Return the URL to access the uploaded image
      const imageUrl = `/uploads/blog/${req.file.filename}`;
      res.json({ imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Shop admin API routes
  
  // Public shop routes
  app.get('/api/shop/products', async (req, res) => {
    try {
      const products = await storage.getActiveShopProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching shop products:", error);
      res.status(500).json({ message: "Failed to fetch shop products" });
    }
  });

  app.get('/api/shop/products/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getShopProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (!product.isActive) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching shop product:", error);
      res.status(500).json({ message: "Failed to fetch shop product" });
    }
  });

  // Admin shop routes (require authentication)
  app.get('/api/admin/shop/products', isAdmin, async (req, res) => {
    try {
      const products = await storage.getAllShopProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching all shop products:", error);
      res.status(500).json({ message: "Failed to fetch shop products" });
    }
  });

  app.get('/api/admin/shop/products/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getShopProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching shop product:", error);
      res.status(500).json({ message: "Failed to fetch shop product" });
    }
  });

  app.post('/api/admin/shop/products', isAdmin, async (req, res) => {
    try {
      // Ensure arrays are properly formatted
      const features = Array.isArray(req.body.features) 
        ? req.body.features 
        : (req.body.features || '').split(',').map((f: string) => f.trim()).filter((f: string) => f.length > 0);
      
      const benefits = Array.isArray(req.body.benefits) 
        ? req.body.benefits 
        : (req.body.benefits || '').split(',').map((b: string) => b.trim()).filter((b: string) => b.length > 0);
      
      const images = Array.isArray(req.body.images) 
        ? req.body.images 
        : (req.body.images || '').split(',').map((i: string) => i.trim()).filter((i: string) => i.length > 0);
      
      const tags = Array.isArray(req.body.tags) 
        ? req.body.tags 
        : (req.body.tags || '').split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
      
      const productData = insertShopProductSchema.parse({
        ...req.body,
        features,
        benefits,
        images,
        tags
      });
      
      const product = await storage.createShopProduct(productData);
      res.json(product);
    } catch (error) {
      console.error("Error creating shop product:", error);
      res.status(500).json({ message: "Failed to create shop product" });
    }
  });

  app.put('/api/admin/shop/products/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Ensure arrays are properly formatted
      const features = Array.isArray(req.body.features) 
        ? req.body.features 
        : (req.body.features || '').split(',').map((f: string) => f.trim()).filter((f: string) => f.length > 0);
      
      const benefits = Array.isArray(req.body.benefits) 
        ? req.body.benefits 
        : (req.body.benefits || '').split(',').map((b: string) => b.trim()).filter((b: string) => b.length > 0);
      
      const images = Array.isArray(req.body.images) 
        ? req.body.images 
        : (req.body.images || '').split(',').map((i: string) => i.trim()).filter((i: string) => i.length > 0);
      
      const tags = Array.isArray(req.body.tags) 
        ? req.body.tags 
        : (req.body.tags || '').split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
      
      const updateData = {
        ...req.body,
        features,
        benefits,
        images,
        tags
      };
      
      const product = await storage.updateShopProduct(id, updateData);
      res.json(product);
    } catch (error) {
      console.error("Error updating shop product:", error);
      res.status(500).json({ message: "Failed to update shop product" });
    }
  });

  app.delete('/api/admin/shop/products/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteShopProduct(id);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting shop product:", error);
      res.status(500).json({ message: "Failed to delete shop product" });
    }
  });

  app.post('/api/admin/shop/products/:id/activate', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.activateShopProduct(id);
      res.json(product);
    } catch (error) {
      console.error("Error activating shop product:", error);
      res.status(500).json({ message: "Failed to activate shop product" });
    }
  });

  app.post('/api/admin/shop/products/:id/deactivate', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.deactivateShopProduct(id);
      res.json(product);
    } catch (error) {
      console.error("Error deactivating shop product:", error);
      res.status(500).json({ message: "Failed to deactivate shop product" });
    }
  });

  app.post('/api/admin/shop/products/:id/stock', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      const product = await storage.updateShopProductStock(id, quantity);
      res.json(product);
    } catch (error) {
      console.error("Error updating shop product stock:", error);
      res.status(500).json({ message: "Failed to update shop product stock" });
    }
  });

  // Shop seed endpoint
  app.post('/api/admin/shop/seed', isAdmin, async (req, res) => {
    try {
      // Check if products already exist
      const existingProducts = await storage.getAllShopProducts();
      if (existingProducts.length > 0) {
        return res.json({ message: "Shop already seeded", products: existingProducts });
      }

      // Create the Ikigai Self-Discovery Cards product
      const ikigaiCardsProduct = {
        name: "Ikigai Self-Discovery Cards",
        subtitle: "35 Mindfulness Cards for Personal Growth & Life Purpose Discovery",
        description: "Discover your life's purpose with our authentic Japanese-inspired Ikigai self-discovery cards. Each card features thoughtfully crafted questions designed to help you explore your passions, mission, vocation, and profession - the four pillars of Ikigai.",
        price: "24.95",
        originalPrice: "29.95",
        currency: "USD",
        features: [
          "35 beautifully designed cards",
          "Based on authentic Japanese Ikigai concept",
          "Perfect for couples and group activities",
          "Premium quality card stock",
          "Includes instruction booklet",
          "Gift-ready packaging"
        ],
        benefits: [
          "Gain clarity on your life's purpose",
          "Explore your passions and values",
          "Perfect for mindfulness practices",
          "Strengthen relationships through shared discovery",
          "Build self-awareness and confidence",
          "Create meaningful conversations"
        ],
        images: [
          "https://images.squarespace-cdn.com/content/v1/66c496034d677a50d5c39ae1/c3296428-c862-49f4-8ef4-293d63ec5c57/81wKBy8bd4L._AC_SL1500_.jpg",
          "https://images.squarespace-cdn.com/content/v1/66c496034d677a50d5c39ae1/2b087e11-24c7-46d5-926b-f3ef3e4f73cc/4th+Picture.png",
          "https://images.squarespace-cdn.com/content/v1/66c496034d677a50d5c39ae1/9de03d07-f402-43cc-a68d-4127f34c9dea/3rd+Picture.png",
          "https://images.squarespace-cdn.com/content/v1/66c496034d677a50d5c39ae1/f1d069cf-9b69-41d9-9785-40594f54b294/2nd+Picture.png"
        ],
        badge: "Japanese Culture Inspired",
        isActive: true,
        stockQuantity: 100,
        limitedQuantity: false,
        metaTitle: "Ikigai Self-Discovery Cards - Find Your Life Purpose | Shop",
        metaDescription: "Discover your life's purpose with our authentic Japanese-inspired Ikigai self-discovery cards. 35 thoughtful prompts covering passion, mission, vocation & profession.",
        tags: ["ikigai", "self-discovery", "mindfulness", "personal-growth", "japanese-culture", "life-purpose"],
        shipping: {
          free: true,
          weight: "0.5 lbs",
          dimensions: "5.5 x 4 x 1.5 inches"
        }
      };

      const product = await storage.createShopProduct(ikigaiCardsProduct);
      res.json({ message: "Shop seeded successfully", product });
    } catch (error) {
      console.error("Error seeding shop:", error);
      res.status(500).json({ message: "Failed to seed shop" });
    }
  });

  // SEO endpoints
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const sitemap = await generateSitemap();
      res.set('Content-Type', 'application/xml');
      res.set('Cache-Control', 'public, max-age=300, s-maxage=300'); // 5 minutes cache
      res.send(sitemap);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  app.get('/robots.txt', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.set('Cache-Control', 'public, max-age=300, s-maxage=300'); // 5 minutes cache
    res.send(`User-agent: *
Allow: /

# Sitemap location
Sitemap: https://www.ikigain.org/sitemap.xml
Sitemap: https://www.ikigain.org/rss.xml

# Allow indexing of all main content
Allow: /about
Allow: /what-is-ikigai
Allow: /personality-types
Allow: /ikigai-test
Allow: /type-test
Allow: /blog
Allow: /shop
Allow: /ikigai-types/

# Allow multilingual content
Allow: /es/

# Disallow admin and private areas
Disallow: /admin
Disallow: /dashboard
Disallow: /checkout
Disallow: /premium-results
Disallow: /test-results
Disallow: /email-collection
Disallow: /upgrade
Disallow: /upsell

# Disallow API endpoints
Disallow: /api

# Allow search engines to crawl CSS and JS
Allow: /css/
Allow: /js/
Allow: /images/
Allow: /fonts/

# Common bot directives
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Baiduspider
Allow: /

# Block unwanted bots
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

# Crawl delay for all bots
Crawl-delay: 1`);
  });

  app.get('/rss.xml', async (req, res) => {
    try {
      const rss = await generateRSSFeed();
      res.set('Content-Type', 'application/rss+xml');
      res.send(rss);
    } catch (error) {
      console.error("Error generating RSS feed:", error);
      res.status(500).send("Error generating RSS feed");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
