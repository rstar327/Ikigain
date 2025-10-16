import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, BookOpen, Lightbulb, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import { useState, useEffect } from "react";

// Sample word data - this would typically come from a database or API
const DAILY_WORD = {
  word: "Affable",
  meaning: "Friendly, good-natured, and easy to talk to; approachable.",
  example: "Her affable personality made her a natural choice for client relations and business development.",
  ikigaiInsight: "Affability connects to your Ikigai by fostering meaningful relationships that support both personal fulfillment and professional growth."
};

const ALPHABET_STATS = {
  A: 27, B: 20, C: 20, D: 20, E: 20, F: 20, G: 20, H: 20,
  I: 20, J: 20, K: 20, L: 20, M: 20, N: 20, O: 20, P: 20,
  Q: 20, R: 20, S: 20, T: 20, U: 20, V: 20, W: 20, X: 20,
  Y: 20, Z: 20
};

export default function PositiveWords() {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderAlphabetGrid = () => {
    return Object.entries(ALPHABET_STATS).map(([letter, count]) => (
      <Link key={letter} href={`/positive-words-that-start-with-${letter.toLowerCase()}`}>
        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-300">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">
              {letter}
            </div>
            <div className="text-sm text-gray-500">~{count} words</div>
          </CardContent>
        </Card>
      </Link>
    ));
  };

  const ikigaiPillars = [
    { name: "What You Love", icon: Heart, color: "text-red-500", description: "Passion" },
    { name: "What You're Good At", icon: BookOpen, color: "text-purple-500", description: "Mission" },
    { name: "What the World Needs", icon: Lightbulb, color: "text-blue-500", description: "Vocation" },
    { name: "What You Can Be Paid For", icon: BookOpen, color: "text-green-500", description: "Profession" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <SEO 
        title="Ikigai Word Wheel - Positive Words for Purpose and Fulfillment"
        description="Explore positive words organized A-Z and discover how language connects to your Ikigai. Find inspiration through meaningful vocabulary that aligns with your life's purpose."
        keywords="positive words, ikigai words, purpose vocabulary, meaningful words, personal development, life purpose words"
        canonical="/positive-words"
      />
      
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Ikigai Word Wheel</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Words shape how we think, feel, and live. Explore positive words by letter and discover 
            how language connects to your Ikigai – your reason for being.
          </p>
        </div>

        {/* Ikigai Connection Section */}
        <Card className="mb-12 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-blue-500" />
              Discover Your Ikigai Through Words
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 mb-6">
              Explore positive words that align with your Ikigai – your reason for being. 
              Discover how language connects to purpose, passion, and fulfillment.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {ikigaiPillars.map((pillar, index) => {
                const IconComponent = pillar.icon;
                return (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <IconComponent className={`h-5 w-5 ${pillar.color}`} />
                    <div>
                      <div className="font-medium text-sm">{pillar.name}</div>
                      <div className="text-xs text-gray-500">{pillar.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Daily Word */}
        <Card className="mb-12 bg-gradient-to-r from-blue-500 to-green-500 text-white">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Daily Word</CardTitle>
            <p className="text-center opacity-90">Your mindful word for today</p>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h3 className="text-3xl font-bold">{DAILY_WORD.word}</h3>
              <Heart className="h-6 w-6 text-red-300" />
            </div>
            <div className="bg-white/10 rounded-lg p-4 mb-4">
              <p className="font-semibold mb-2">Meaning:</p>
              <p className="opacity-90">{DAILY_WORD.meaning}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 mb-4">
              <p className="font-semibold mb-2">Example:</p>
              <p className="italic opacity-90">"{DAILY_WORD.example}"</p>
            </div>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20"
              onClick={() => setSelectedInsight(selectedInsight === 'daily' ? null : 'daily')}
            >
              View Ikigai Insight <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            {selectedInsight === 'daily' && (
              <div className="mt-4 bg-white/10 rounded-lg p-4">
                <p className="opacity-90 mb-4">{DAILY_WORD.ikigaiInsight}</p>
                <Link href="/positive-words-that-start-with-a">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                    Explore More A Words →
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alphabet Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-2">Explore by Letter</h2>
          <p className="text-center text-gray-600 mb-8">
            Choose a letter to discover positive words and their connection to your Ikigai
          </p>
          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-9 gap-4">
            {renderAlphabetGrid()}
          </div>
        </div>

        {/* Related Content Links */}
        <Card className="mb-8 border-l-4 border-l-purple-500">
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
              
              <Link href="/what-is-ikigai">
                <Button variant="outline" className="w-full h-auto flex-col p-4 hover:bg-blue-50">
                  <Lightbulb className="h-6 w-6 mb-2 text-blue-600" />
                  <span className="font-medium">What is Ikigai?</span>
                  <span className="text-xs text-gray-500 mt-1">Learn about life purpose</span>
                </Button>
              </Link>
              
              <Link href="/ikigai-word-wheel">
                <Button variant="outline" className="w-full h-auto flex-col p-4 hover:bg-green-50">
                  <Heart className="h-6 w-6 mb-2 text-green-600" />
                  <span className="font-medium">Word Wheel</span>
                  <span className="text-xs text-gray-500 mt-1">Alternative word explorer</span>
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