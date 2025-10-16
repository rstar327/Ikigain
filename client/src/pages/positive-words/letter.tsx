import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, ChevronDown, BookOpen, Lightbulb } from "lucide-react";
import { Link, useParams } from "wouter";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import { useState } from "react";

// Sample word data for each letter - this would typically come from a database
const WORDS_DATA: Record<string, Array<{
  word: string;
  meaning: string;
  example: string;
  ikigaiInsight: string;
  category: 'passion' | 'mission' | 'vocation' | 'profession';
}>> = {
  a: [
    {
      word: "Able",
      meaning: "Having the power, skill, means, or opportunity to do something; capable.",
      example: "She proved herself able to handle complex negotiations with international clients.",
      ikigaiInsight: "Being 'able' connects to your Ikigai by recognizing your capabilities and using them to serve both your passions and the world's needs.",
      category: "vocation"
    },
    {
      word: "Abundant",
      meaning: "Existing in large quantities; plentiful; having plenty of something.",
      example: "She lived with an abundant mindset, always seeing opportunities for growth and joy.",
      ikigaiInsight: "An abundant mindset aligns with Ikigai by helping you see endless possibilities to contribute meaningfully to the world.",
      category: "passion"
    },
    {
      word: "Affable",
      meaning: "Friendly, good-natured, and easy to talk to; approachable.",
      example: "Her affable personality made her a natural choice for client relations and business development.",
      ikigaiInsight: "Affability connects to your Ikigai by fostering meaningful relationships that support both personal fulfillment and professional growth.",
      category: "profession"
    },
    {
      word: "Ambitious",
      meaning: "Having or showing a strong desire and determination to succeed.",
      example: "His ambitious vision transformed the local community center into a thriving hub for youth development.",
      ikigaiInsight: "Healthy ambition drives your Ikigai by channeling your desires for achievement toward meaningful impact on others.",
      category: "mission"
    },
    {
      word: "Authentic",
      meaning: "Being genuine, real, and true to one's own personality, spirit, or character.",
      example: "Her authentic approach to leadership inspired others to bring their whole selves to work.",
      ikigaiInsight: "Authenticity is central to Ikigai – when you're true to yourself, you naturally align with your purpose and attract opportunities that fit.",
      category: "passion"
    }
  ],
  // Add more letters for comprehensive coverage
  b: [
    {
      word: "Balanced",
      meaning: "Having different elements in the right proportions; stable and harmonious.",
      example: "She maintained a balanced approach to work and family, never sacrificing one for the other.",
      ikigaiInsight: "Balance supports your Ikigai by ensuring all four elements – what you love, what you're good at, what the world needs, and what you can be paid for – work together harmoniously.",
      category: "mission"
    },
    {
      word: "Brave",
      meaning: "Ready to face and endure danger or pain; showing courage.",
      example: "It was brave of him to leave his corporate job to start a nonprofit focused on environmental conservation.",
      ikigaiInsight: "Bravery enables your Ikigai by giving you the courage to pursue your true calling, even when it means stepping outside your comfort zone.",
      category: "passion"
    },
    {
      word: "Brilliant",
      meaning: "Exceptionally clever or talented; showing intelligence and skill.",
      example: "Her brilliant solution to the sustainability challenge earned recognition from industry leaders.",
      ikigaiInsight: "Brilliance in your Ikigai means applying your natural talents to solve problems that matter deeply to you and the world.",
      category: "vocation"
    }
  ],
  c: [
    {
      word: "Creative",
      meaning: "Having the ability to create or bring new ideas, forms, or methods into existence.",
      example: "His creative approach to urban planning transformed neglected spaces into thriving community gardens.",
      ikigaiInsight: "Creativity connects to Ikigai by allowing you to express your unique perspective while contributing innovative solutions to the world's needs.",
      category: "passion"
    },
    {
      word: "Compassionate",
      meaning: "Feeling or showing sympathy and concern for others' suffering.",
      example: "Her compassionate leadership style created a supportive work environment where everyone could thrive.",
      ikigaiInsight: "Compassion forms the heart of many Ikigai paths, connecting what you care about with what the world needs most.",
      category: "mission"
    },
    {
      word: "Confident",
      meaning: "Feeling or showing certainty about one's abilities or qualities.",
      example: "His confident presentation of the business plan secured the funding needed to launch the social enterprise.",
      ikigaiInsight: "Confidence in your Ikigai means trusting your abilities while staying humble about your mission to serve others.",
      category: "profession"
    }
  ],
  d: [
    {
      word: "Determined",
      meaning: "Having made a firm decision and being resolved not to change it.",
      example: "Her determined effort to reduce plastic waste led to the creation of an award-winning recycling program.",
      ikigaiInsight: "Determination fuels your Ikigai journey, providing the persistence needed to overcome obstacles while pursuing your life's purpose.",
      category: "mission"
    },
    {
      word: "Dedicated",
      meaning: "Committed to a task or purpose; having single-minded loyalty or integrity.",
      example: "His dedicated service to community education earned him the respect and gratitude of countless families.",
      ikigaiInsight: "Dedication to your Ikigai means consistently aligning your daily actions with your deeper purpose and values.",
      category: "vocation"
    }
  ]
};

const CATEGORY_COLORS = {
  passion: { bg: "bg-red-50", border: "border-red-200", text: "text-red-600", icon: Heart },
  mission: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-600", icon: Lightbulb },
  vocation: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600", icon: BookOpen },
  profession: { bg: "bg-green-50", border: "border-green-200", text: "text-green-600", icon: BookOpen }
};

const CATEGORY_LABELS = {
  passion: "What You Love",
  mission: "What You're Good At", 
  vocation: "What the World Needs",
  profession: "What You Can Be Paid For"
};

export default function PositiveWordsLetter() {
  const params = useParams();
  console.log('PositiveWordsLetter component loaded!');
  console.log('Route params:', params);
  console.log('All params keys:', Object.keys(params));
  console.log('Current URL:', window.location.pathname);
  
  // Extract letter from various possible route patterns
  let letter = params.letter?.toUpperCase();
  
  // Method 1: Direct parameter (/positive-words/a)
  if (letter) {
    console.log('Extracted letter from direct params:', letter);
  }
  
  // Method 2: Extract from complex URL pattern (/positive-words-that-start-with-a)
  if (!letter) {
    const urlMatch = window.location.pathname.match(/positive-words-that-start-with-([a-z])/i);
    letter = urlMatch ? urlMatch[1].toUpperCase() : undefined;
    if (letter) console.log('Extracted letter from URL pattern:', letter);
  }
  
  // Method 3: Extract from wildcard parameter
  if (!letter && params['*']) {
    const wildcardMatch = params['*'].match(/([a-z])$/i);
    letter = wildcardMatch ? wildcardMatch[1].toUpperCase() : undefined;
    if (letter) console.log('Extracted letter from wildcard:', letter);
  }
  
  // Default to 'A' if no letter found
  if (!letter) {
    letter = 'A';
    console.log('Using default letter:', letter);
  }
  const [expandedWord, setExpandedWord] = useState<string | null>(null);
  
  const words = WORDS_DATA[letter.toLowerCase()] || [];
  const wordCount = words.length;

  const toggleWordExpansion = (word: string) => {
    setExpandedWord(expandedWord === word ? null : word);
  };

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Positive Words That Start With ${letter}`,
    "description": `Discover ${wordCount} positive words beginning with ${letter} and their connection to your Ikigai purpose.`,
    "itemListElement": words.map((wordData, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": wordData.word,
      "description": wordData.meaning
    }))
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <SEO 
        title={`Positive Words That Start With ${letter} – Ikigai Word Wheel`}
        description={`Discover ${wordCount} inspiring positive words beginning with ${letter}. Learn their meanings, see examples, and explore how each connects to your Ikigai purpose.`}
        keywords={`positive words ${letter}, ${letter} words, ikigai words ${letter}, meaningful words ${letter}, personal development vocabulary`}
        canonical={`/positive-words-that-start-with-${letter.toLowerCase()}`}
        structuredData={structuredData}
      />
      
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" size="sm">
            <Link href="/positive-words">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Word Wheel
            </Link>
          </Button>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mb-6">
            <span className="text-3xl font-bold text-white">{letter}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Positive Words That Start With {letter}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore {wordCount} inspiring words beginning with {letter} and discover how each connects to your Ikigai.
          </p>
        </div>

        {/* Words Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {words.map((wordData, index) => {
            const categoryStyle = CATEGORY_COLORS[wordData.category];
            const CategoryIcon = categoryStyle.icon;
            const isExpanded = expandedWord === wordData.word;

            return (
              <Card key={index} className={`${categoryStyle.border} border-2 hover:shadow-lg transition-all duration-300`}>
                <CardHeader className={`${categoryStyle.bg} pb-3`}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {wordData.word}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <CategoryIcon className={`h-5 w-5 ${categoryStyle.text}`} />
                      <Heart className="h-5 w-5 text-red-400" />
                    </div>
                  </div>
                  <Badge variant="secondary" className={`${categoryStyle.text} text-xs w-fit`}>
                    {CATEGORY_LABELS[wordData.category]}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="mb-4">
                    <p className="font-semibold text-gray-800 mb-2">Meaning:</p>
                    <p className="text-gray-600 text-sm">{wordData.meaning}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-semibold text-gray-800 mb-2">Example:</p>
                    <blockquote className="text-gray-600 text-sm italic border-l-2 border-gray-300 pl-3">
                      "{wordData.example}"
                    </blockquote>
                  </div>

                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleWordExpansion(wordData.word)}
                    className={`w-full ${categoryStyle.text} hover:${categoryStyle.bg}`}
                  >
                    View Ikigai Insight 
                    <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </Button>

                  {isExpanded && (
                    <div className={`mt-4 p-4 ${categoryStyle.bg} rounded-lg border-l-4 ${categoryStyle.border}`}>
                      <p className="text-sm text-gray-700">
                        <strong>Ikigai Connection:</strong> {wordData.ikigaiInsight}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Navigation with Previous/Next */}
        <div className="space-y-6 mb-8">
          {/* Previous/Next Navigation */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  {letter !== 'A' && (
                    <Link href={`/positive-words-that-start-with-${String.fromCharCode(letter.charCodeAt(0) - 1).toLowerCase()}`}>
                      <Button variant="outline" className="flex items-center gap-2 hover:bg-blue-100">
                        <ArrowLeft className="h-4 w-4" />
                        Previous: {String.fromCharCode(letter.charCodeAt(0) - 1)} Words
                      </Button>
                    </Link>
                  )}
                </div>
                
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Exploring Letter {letter}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {words?.length || 0} inspiring words to discover
                  </p>
                </div>
                
                <div className="flex-1 text-right">
                  {letter !== 'Z' && (
                    <Link href={`/positive-words-that-start-with-${String.fromCharCode(letter.charCodeAt(0) + 1).toLowerCase()}`}>
                      <Button variant="outline" className="flex items-center gap-2 hover:bg-green-100">
                        Next: {String.fromCharCode(letter.charCodeAt(0) + 1)} Words
                        <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alphabet Grid Navigation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Explore All Letters</CardTitle>
              <p className="text-center text-gray-600">Jump to any letter to discover more positive words</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 md:grid-cols-13 gap-2">
                {Array.from({length: 26}, (_, i) => {
                  const currentLetter = String.fromCharCode(65 + i);
                  const isActive = currentLetter === letter;
                  return (
                    <Button
                      key={currentLetter}
                      asChild
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      className="aspect-square"
                    >
                      <Link href={`/positive-words-that-start-with-${currentLetter.toLowerCase()}`}>
                        {currentLetter}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Related Content Links */}
        <Card className="mb-6 border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-purple-500" />
              Continue Your Ikigai Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/ikigai-personality-types">
                <Button variant="outline" className="w-full h-auto flex-col p-4 hover:bg-purple-50">
                  <BookOpen className="h-6 w-6 mb-2 text-purple-600" />
                  <span className="font-medium">Personality Types</span>
                  <span className="text-xs text-gray-500 mt-1">Discover your Ikigai archetype</span>
                </Button>
              </Link>
              
              <Link href="/positive-words">
                <Button variant="outline" className="w-full h-auto flex-col p-4 hover:bg-blue-50">
                  <Heart className="h-6 w-6 mb-2 text-blue-600" />
                  <span className="font-medium">Word Wheel Home</span>
                  <span className="text-xs text-gray-500 mt-1">Explore all positive words</span>
                </Button>
              </Link>
              
              <Link href="/what-is-ikigai">
                <Button variant="outline" className="w-full h-auto flex-col p-4 hover:bg-green-50">
                  <Lightbulb className="h-6 w-6 mb-2 text-green-600" />
                  <span className="font-medium">What is Ikigai?</span>
                  <span className="text-xs text-gray-500 mt-1">Learn about life purpose</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="text-center bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Discover Your Ikigai?</h3>
            <p className="text-lg mb-6 opacity-90">
              Take our comprehensive Ikigai test to discover your unique path to purpose and fulfillment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                <Link href="/ikigai-test">Take the Full Ikigai Test</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                <Link href="/ikigai-type-test">Quick Type Assessment</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}