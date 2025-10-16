import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Reply, Flag } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies: Comment[];
  verified?: boolean;
}

interface BlogCommentsProps {
  postSlug: string;
}

export default function BlogComments({ postSlug }: BlogCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  
  // Generate unique comments based on post slug
  const generateCommentsForPost = (slug: string) => {
    const commentTemplates = {
      'journal-prompts-for-self-discovery': [
        {
          author: "Maya Thompson",
          content: "These journal prompts are exactly what I needed! I've been stuck in my self-discovery journey, and these questions really helped me dig deeper. The morning routine idea is brilliant.",
          likes: 18,
          replies: [
            {
              author: "Ikigai Team",
              content: "So wonderful to hear Maya! Consistency with journaling really does make a difference. We're excited to see where your journey takes you!",
              verified: true,
              likes: 6
            }
          ]
        },
        {
          author: "David Kim",
          content: "I started using these prompts last week and I'm already seeing patterns in my thoughts. The 'What energizes me?' question was particularly eye-opening.",
          likes: 12,
          replies: []
        },
        {
          author: "Lisa Chen",
          content: "Perfect timing! I just bought a new journal and was wondering what to write about. These prompts give me a clear direction for my daily reflection practice.",
          likes: 9,
          replies: []
        }
      ],
      'benefits-of-finding-your-ikigai': [
        {
          author: "Robert Martinez",
          content: "This really opened my eyes to how scattered my life has been. I never realized how much clearer everything becomes when you have a sense of purpose guiding your decisions.",
          likes: 22,
          replies: [
            {
              author: "Ikigai Team",
              content: "That's such an important realization, Robert! Having that clarity really does transform how we approach both big and small decisions in life.",
              verified: true,
              likes: 8
            }
          ]
        },
        {
          author: "Jennifer Walsh",
          content: "The section about improved decision-making really struck me. I've been struggling with career choices, but thinking about my ikigai first makes the path much clearer.",
          likes: 16,
          replies: []
        },
        {
          author: "Alex Rivera",
          content: "Amazing article! I shared this with my entire team. The workplace fulfillment aspect is so important - we spend so much time at work, it should align with our purpose.",
          likes: 14,
          replies: []
        }
      ],
      'discovering-your-true-self-journey-of-self-discovery': [
        {
          author: "Sophie Anderson",
          content: "This journey of self-discovery isn't easy, but articles like this remind me why it's so worth it. The authentic self vs. social expectations part really resonated with me.",
          likes: 20,
          replies: [
            {
              author: "Ikigai Team",
              content: "You're so right, Sophie! It takes courage to be authentic, but that's where true fulfillment lives. Keep honoring your authentic self!",
              verified: true,
              likes: 7
            }
          ]
        },
        {
          author: "James Wilson",
          content: "I'm 45 and just starting this journey seriously. Better late than never, right? The practical steps you outlined give me hope that it's never too late to find yourself.",
          likes: 25,
          replies: []
        },
        {
          author: "Maria Santos",
          content: "The part about letting go of others' expectations hit home. I spent years trying to be who others wanted me to be. Now I'm finally learning to honor my own path.",
          likes: 19,
          replies: []
        }
      ],
      'what-is-ikigai-comprehensive-guide-japans-philosophy-purpose': [
        {
          author: "Hiroshi Nakamura",
          content: "As someone who grew up in Japan, I appreciate how well you've explained ikigai to a Western audience. Many people misunderstand it as just career advice, but you captured the deeper spiritual aspect.",
          likes: 31,
          replies: [
            {
              author: "Ikigai Team",
              content: "Thank you so much for this feedback, Hiroshi! It's so important to us to honor the authentic cultural meaning while making it accessible globally.",
              verified: true,
              likes: 12
            }
          ]
        },
        {
          author: "Anna Kowalski",
          content: "The four circles diagram finally clicked for me after reading this! I've seen it before but never really understood how to apply it practically to my life.",
          likes: 18,
          replies: []
        },
        {
          author: "Michael O'Brien",
          content: "I love how you mentioned that ikigai doesn't have to be grand or world-changing. Sometimes it's just finding joy in small daily moments. Very profound.",
          likes: 24,
          replies: []
        }
      ],
      '15-inspiring-ikigai-phrases-live-purpose-joy': [
        {
          author: "Elena Vasquez",
          content: "I wrote down all 15 phrases and put them on my bathroom mirror! Starting each day with these reminders has been transformative. Thank you for compiling these.",
          likes: 27,
          replies: [
            {
              author: "Ikigai Team",
              content: "What a beautiful way to start your day, Elena! Daily reminders like this can create powerful shifts in perspective over time.",
              verified: true,
              likes: 9
            }
          ]
        },
        {
          author: "Kevin Park",
          content: "Phrase #7 about 'small steps lead to big changes' really hit me. I've been paralyzed by thinking I need to make huge life changes all at once.",
          likes: 15,
          replies: []
        },
        {
          author: "Sarah Mitchell",
          content: "I shared this with my book club and we're using one phrase per week as our discussion starter. Such wisdom in these simple statements!",
          likes: 21,
          replies: []
        }
      ]
    };

    // Create varied default comments based on post slug hash
    const getDefaultComments = (slug: string) => {
      const commentSets = [
        [
          {
            author: "Taylor Johnson",
            content: "This article came at the perfect time for me. I've been feeling lost lately, and your insights have given me a new perspective on finding my path forward.",
            likes: 13,
            replies: [
              {
                author: "Ikigai Team",
                content: "We're so glad this resonated with you, Taylor! Remember, finding your path is a journey, not a destination. Be patient with yourself!",
                verified: true,
                likes: 5
              }
            ]
          },
          {
            author: "Chris Morgan",
            content: "Really appreciate the practical approach in this post. Too many articles are just theory - this gives me actual steps I can take today.",
            likes: 11,
            replies: []
          },
          {
            author: "Rachel Green",
            content: "I've bookmarked this to read again. There's so much wisdom here that I want to really absorb and apply to my own life. Thank you for sharing!",
            likes: 8,
            replies: []
          }
        ],
        [
          {
            author: "Diana Foster",
            content: "Thank you for sharing this! I'm in my 30s and have been feeling stuck in my career. This gives me hope that I can still find my true calling.",
            likes: 16,
            replies: [
              {
                author: "Ikigai Team",
                content: "It's never too late to discover your ikigai, Diana! Your 30s are actually a perfect time for this kind of deep reflection and growth.",
                verified: true,
                likes: 7
              }
            ]
          },
          {
            author: "Marcus Thompson",
            content: "I've been following this blog for months and this is definitely one of the most insightful posts. The way you break down complex concepts is amazing.",
            likes: 14,
            replies: []
          },
          {
            author: "Lisa Wang",
            content: "Shared this with my study group! We're all going through career transitions and this perspective is exactly what we needed to hear.",
            likes: 12,
            replies: []
          }
        ],
        [
          {
            author: "Benjamin Clarke",
            content: "This resonated deeply with me. I've been chasing external validation for so long, I forgot to ask myself what truly brings me joy and fulfillment.",
            likes: 19,
            replies: []
          },
          {
            author: "Jessica Martinez",
            content: "The timing of this post is incredible. I just made a major life decision and this validates that I'm on the right path. Thank you!",
            likes: 15,
            replies: [
              {
                author: "Ikigai Team",
                content: "Trust your instincts, Jessica! When something aligns with your ikigai, you'll feel it in your core. Wishing you all the best on your new path!",
                verified: true,
                likes: 6
              }
            ]
          },
          {
            author: "Ahmed Hassan",
            content: "As someone switching careers at 40, this gives me confidence that I'm making the right choice. Age is just a number when it comes to finding purpose.",
            likes: 22,
            replies: []
          }
        ]
      ];
      
      // Use simple hash function to select comment set based on slug
      const hash = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return commentSets[hash % commentSets.length];
    };

    const defaultComments = getDefaultComments(slug);

    const postComments = (commentTemplates as any)[slug] || defaultComments;
    
    return postComments.map((comment: any, index: number) => ({
      id: (index + 1).toString(),
      author: comment.author,
      content: comment.content,
      timestamp: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000),
      likes: comment.likes,
      replies: comment.replies?.map((reply: any, replyIndex: number) => ({
        id: `${index + 1}-${replyIndex + 1}`,
        author: reply.author,
        content: reply.content,
        timestamp: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000),
        likes: reply.likes,
        replies: [],
        verified: reply.verified || false
      })) || []
    }));
  };

  const [comments, setComments] = useState<Comment[]>(generateCommentsForPost(postSlug));

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: "You",
        content: newComment,
        timestamp: new Date(),
        likes: 0,
        replies: []
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  const handleSubmitReply = (commentId: string) => {
    if (replyContent.trim()) {
      const reply: Comment = {
        id: `${commentId}-${Date.now()}`,
        author: "You",
        content: replyContent,
        timestamp: new Date(),
        likes: 0,
        replies: []
      };
      
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      ));
      setReplyContent("");
      setReplyingTo(null);
    }
  };

  const CommentCard = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${isReply ? 'ml-8 mt-4' : ''}`}
    >
      <Card className="bg-white border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`/api/placeholder/40/40`} alt={comment.author} />
              <AvatarFallback>{comment.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-gray-900">{comment.author}</span>
                {comment.verified && (
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                    Verified
                  </Badge>
                )}
                <span className="text-sm text-gray-500">
                  {format(comment.timestamp, 'MMM d, yyyy')}
                </span>
              </div>
              
              <p className="text-gray-700 mb-3 leading-relaxed">{comment.content}</p>
              
              <div className="flex items-center gap-4 text-sm">
                <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
                  <Heart className="h-4 w-4" />
                  {comment.likes}
                </button>
                
                {!isReply && (
                  <button 
                    onClick={() => setReplyingTo(comment.id)}
                    className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <Reply className="h-4 w-4" />
                    Reply
                  </button>
                )}
                
                <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
                  <Flag className="h-4 w-4" />
                  Report
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Reply Form */}
      {replyingTo === comment.id && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="mt-4 ml-8"
        >
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <Textarea
                placeholder={`Reply to ${comment.author}...`}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="mb-3 bg-white"
                rows={3}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSubmitReply(comment.id)}
                  size="sm"
                  disabled={!replyContent.trim()}
                >
                  Reply
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map(reply => (
            <CommentCard key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-5 w-5 text-blue-600" />
        <h3 className="text-2xl font-bold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      {/* New Comment Form */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <h4 className="text-lg font-semibold text-gray-900">Join the conversation</h4>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Share your thoughts on this article..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] bg-white"
          />
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Be respectful and constructive in your comments
            </p>
            <Button 
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Post Comment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map(comment => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>

      {/* Load More Comments */}
      {comments.length > 0 && (
        <div className="text-center">
          <Button variant="outline" className="w-full">
            Load More Comments
          </Button>
        </div>
      )}
    </div>
  );
}