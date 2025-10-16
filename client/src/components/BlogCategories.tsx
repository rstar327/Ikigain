import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Heart, Compass, Target, Star, Users } from "lucide-react";
import { motion } from "framer-motion";

interface BlogCategoriesProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  posts: any[];
}

export default function BlogCategories({ selectedCategory, onCategoryChange, posts }: BlogCategoriesProps) {
  const categories = [
    {
      id: "all",
      name: "All Articles",
      icon: BookOpen,
      color: "bg-blue-500",
      description: "All blog posts",
      count: posts.length
    },
    {
      id: "self-discovery",
      name: "Self Discovery",
      icon: Star,
      color: "bg-purple-500",
      description: "Finding your authentic self",
      count: posts.filter(p => p.tags?.some((tag: string) => tag.toLowerCase().includes('self-discovery'))).length
    },
    {
      id: "career",
      name: "Career Guidance",
      icon: Target,
      color: "bg-green-500",
      description: "Professional development",
      count: posts.filter(p => p.tags?.some((tag: string) => tag.toLowerCase().includes('career'))).length
    },
    {
      id: "balance",
      name: "Life Balance",
      icon: Heart,
      color: "bg-red-500",
      description: "Work-life harmony",
      count: posts.filter(p => p.tags?.some((tag: string) => tag.toLowerCase().includes('balance'))).length
    },
    {
      id: "motivation",
      name: "Motivation",
      icon: Users,
      color: "bg-orange-500",
      description: "Inspiration and drive",
      count: posts.filter(p => p.tags?.some((tag: string) => tag.toLowerCase().includes('motivation'))).length
    },
    {
      id: "mindfulness",
      name: "Mindfulness",
      icon: Compass,
      color: "bg-indigo-500",
      description: "Present moment awareness",
      count: posts.filter(p => p.tags?.some((tag: string) => tag.toLowerCase().includes('mindfulness'))).length
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Browse by Category</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category, index) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  isSelected 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-md bg-white'
                }`}
                onClick={() => onCategoryChange(category.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-full ${category.color} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {category.count}
                    </Badge>
                  </div>
                  
                  <h4 className={`text-lg font-semibold mb-2 ${
                    isSelected ? 'text-blue-700' : 'text-gray-900'
                  }`}>
                    {category.name}
                  </h4>
                  
                  <p className="text-sm text-gray-600">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}