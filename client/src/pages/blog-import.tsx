import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Upload, Download, CheckCircle, XCircle, AlertCircle, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  isPublished: boolean;
  author: string;
  publishDate: string;
  readingTime: number;
}

const EXISTING_POSTS: BlogPost[] = [
  {
    title: "Journal Prompts for Self Discovery",
    slug: "journal-prompts-for-self-discovery",
    content: `# Journal Prompts for Self Discovery

Have you ever felt like you're rushing through life, ticking off tasks and responsibilities, but deep down, you're searching for something more? I know that feeling too well. That quiet longing for clarity, for meaning, for something that feels real. It's what led me here—to journaling, to reflecting, and to discovering my own purpose.

Journaling isn't just about putting words on a page. It's about slowing down, sitting with yourself, and listening to the thoughts you've pushed aside for too long. If you're looking for even more ways to deepen your self-discovery, check out our latest guide on [50 Powerful Journal Prompts for Self-Discovery."](https://www.ikigain.org/blog/50-powerful-journal-prompts-for-self-discovery-to-find-clarity-amp-purpose)

If you're ready to start this journey, grab a notebook, find a quiet spot, and let's do this together. These journal prompts are here to guide you—not with pressure, but with curiosity and care.

## **Why Journaling Feels Like Coming Home**

Let me be honest with you—when I first started journaling, it felt awkward. I didn't know what to write or if my thoughts even made sense. But I kept at it. And little by little, it became a lifeline. It's where I learned to unravel my tangled thoughts, let go of things that no longer served me, and dream about a life that felt authentic.

Here's what I've discovered about journaling:

- **It clears the noise:** Sometimes, writing is the only way to quiet the chatter in your head.
- **It heals:** When you give yourself space to feel, you begin to let go of the weight you've been carrying.
- **It shows you the way:** You don't have to have all the answers. Journaling will help you find them, one word at a time.

This isn't about perfection. It's about connection—with yourself.

## **How to Start Journaling (Even If You Don't Know How)**

I know starting can feel intimidating. Trust me, I've been there, staring at a blank page, wondering if I'm doing it "right." The truth is, there's no right or wrong way to journal. It's just about showing up for yourself.

Here's what I've learned:

1. **Create a Ritual:** Light a candle, play some calming music, or sit by the window with your coffee. Make it feel special.
2. **Start Small:** You don't have to write pages. A single sentence is enough.
3. **Let Go of Perfection:** Your journal isn't here to judge you. It's here to hold you. Write what's in your heart, even if it's messy.

And when you don't know where to start, that's okay. That's why these prompts are here—to give you a little nudge.

## **Journal Prompts for Self-Discovery**

Let's dive into the prompts. These are the questions I've asked myself on my own journey, and I hope they open the same doors for you. Take your time with them. Let your thoughts flow.

### **Reflecting on the Past**

- What did you love doing as a child that made you forget about everything else? Are you still making time for those things?
- Who in your life has shaped who you are today? What would you want to thank them for?
- Think of a moment when you felt pure joy. Write about it in as much detail as you can. What made it so special?

### **Exploring the Present**

- What are your top three priorities right now? Are they aligned with the life you want to live?
- What's one thing that's been weighing on your mind lately? How can you start to let it go?
- Describe your daily routine. What parts of it feel energizing? What parts feel draining?

### **Dreaming About the Future**

- If you could live your dream life, what would it look like?
- Where do you see yourself in five years? What's one step you can take today to move closer to that vision?
- What legacy do you want to leave behind? How do you want to be remembered?

### **Building Self-Compassion**

- What's one thing you genuinely love about yourself?
- Imagine you're writing a letter to your younger self. What would you tell them? What would you thank them for?
- What does self-care look like for you? How can you make more room for it in your life?

## **Sticking with Journaling**

I get it—life gets busy, and it's easy to forget about your journal. But here's what I've learned: even five minutes a day can make a difference. Journaling doesn't have to be perfect or time-consuming—it just has to be honest.

Here's how I stay consistent:

- **Set a Time:** Choose a time that feels right for you—maybe it's first thing in the morning, or right before bed.
- **Be Flexible:** Some days, you'll write a lot. Other days, it might be a single sentence. Both are enough.
- **Celebrate Your Wins:** Look back at your entries every so often. You'll be amazed at how far you've come.

## **FAQs About Journaling**

### **1. What if I don't know what to write?**

That's okay. Start with what's on your mind, even if it feels small. Prompts like _"What am I feeling right now?"_ or _"What do I need today?"_ are great places to begin.

### **2. How often should I journal?**

There's no rule. Start with whatever feels manageable—once a week, every morning, or whenever inspiration strikes.

### **3. Can journaling really help me grow?**

Absolutely. When you take the time to reflect, you gain clarity about what matters most. Journaling isn't just writing—it's discovering yourself.

## **Your Journey Starts Here**

Journaling has been a gift in my life, and I hope it becomes one in yours too. This isn't about finding all the answers overnight. It's about showing up, one word at a time, and letting yourself grow in the process.

So, grab your journal, choose a prompt, and start writing. I'll be cheering you on from here.`,
    excerpt: "A comprehensive guide to journaling for self-discovery, featuring powerful prompts and practical tips for getting started on your personal growth journey.",
    tags: ["journaling", "self-discovery", "personal-growth", "mindfulness", "reflection", "self-care"],
    metaTitle: "Journal Prompts for Self Discovery - Find Clarity and Purpose",
    metaDescription: "Discover powerful journal prompts for self-discovery and personal growth. Learn how to start journaling and find clarity, purpose, and direction in your life.",
    isPublished: true,
    author: "Karlis Vilmanis",
    publishDate: "2024-06-19",
    readingTime: 10
  },
  {
    title: "The Benefits of Finding Your Ikigai: How Purpose Enhances Your Well-being",
    slug: "benefits-finding-ikigai-purpose-enhances-wellbeing",
    content: `# The Benefits of Finding Your Ikigai: How Purpose Enhances Your Well-being

There are many reasons why you should **find your _ikigai_**.

The Japanese _ikigai_, the concept of living a life with meaning and purpose, is finding its way into the Western world.

This idea, popularized by the book _Ikigai: The Japanese Secret to a Long and Happy Life_, has helped many individuals to find their unique place in this world, set goals, and work in a job they love.

But _ikigai_ is more than just a career test—It has numerous benefits for physical and mental health.

This article will explore the numerous advantages of **finding your _ikigai_**, from physiological to emotional and psychological benefits.

## **What is Ikigai?**

The Japanese word "ikigai" comes from the words "iki" (which means life), and "gai" which means "worth." Therefore, _Ikigai_ means "life's worth," "reason for living," "life's purpose," "reason for being," etc. It is your motivation to get up in the morning or to look forward to the future.

In the Western world, most individuals familiar with the word _ikigai_ associate it with a Venn diagram—the _Ikigai_ chart. According to this diagram, an _ikigai_ is the sum of what you love, what you are good at, what the world needs, and what you can be paid for.

## **Physical and Psychological Benefits of Finding Your Ikigai**

### **Finding your Ikigai Improves Physical Wellbeing**

Numerous studies examine the physical benefits of _ikigai_. It is associated with positive health outcomes, from improving immune function to lowering the risk of disability in old age.

Although science still cannot explain this link, some studies suggest that individuals with a greater sense of purpose and meaning usually engage in healthier behaviors—exercising, refraining from smoking, etc.

### **Finding your Ikigai Reduces the Risk of Mortality**

According to some studies, developing a sense of life worth living ( _ikigai_) reduces mortality risk. Individuals without an _ikigai_ had an increased risk of cardiovascular disease and external causes of mortality.

Besides, the concept of _ikigai_ is often associated with the Okinawa Islands at the southern end of Japan. These islands are famous for the longevity of their inhabitants. According to the book _Ikigai: The Japanese Secret to a Long and Happy Life_, there are far more centenarians than the global average. The exact rate is 24.55 people over the age of 100 for every 100,000 inhabitants.

Besides their strong social network, Okinawans have a firm sense of purpose—an _ikigai_. This trait may contribute to their longevity, positioning Okinawa as one of the world's _Blue Zones_, the areas with a higher life expectancy.

### **Finding your Ikigai Improves Mental Health**

Finding your _ikigai_ is not only beneficial for your physical health, but it also plays a role in improving your emotional and mental well-being.

According to a study, individuals with _ikigai_ experience decreased depressive symptoms and hopelessness, as well as higher levels of happiness and life satisfaction. Besides, _ikigai_ plays a role in overcoming stress and other psychological problems.

### **Finding your Ikigai Improves Social Well-being and Altruistic Behavior**

Interestingly, _ikigai_ has been associated with social activities, such as frequent participation in hobby clubs, and altruistic behaviors, including more frequent sharing of skills and experiences.

### **Finding your Ikigai Prevents Cognitive Decline**

Some studies suggest that having _ikigai_ is a significant factor for dementia prevention. Therefore, older populations will benefit from finding _ikigai_ after retirement.

### **Finding your Ikigai Helps You to Know Yourself**

Discovering your _ikigai_ involves an exercise of self-reflection. By creating your _ikigai_ chart, you ask yourself questions about what you like, your hobbies, skills, and abilities, and how you can positively impact the world.

### **Finding your Ikigai Makes Work Enjoyable**

According to a global survey by Gallup, 85% of full-time workers worldwide are not engaged in their jobs. Finding your _Ikigai_ and building a career based on it will make it more likely to work in a job you enjoy. The philosophy of _ikigai_ allows making a living from one's passions while improving the world.

## **Ikigai Test: The Key to Find Your Ikigai**

The Japanese _ikigai_, the notion of discovering meaning in life, is a groundbreaking perspective for those aspiring to find transcendence and a unique purpose. Living with a sense that life is worth living has been demonstrated to improve overall well-being and increase happiness.

_Ikigai_ can be very helpful in finding direction in life. If you haven't discovered your _ikigai_ yet, you can benefit from effective tools to discover your mission.

Here at Ikigain, we want to offer you some strategies to help you know yourself better. Try our IKIGAIN: Self-Coach Cards, a playful activity crafted to find your _ikigai_ through questions and simple tasks. You can also take the Ikigai Test, an assessment designed to clarify your purpose and align your career with your values.`,
    excerpt: "Explore the numerous benefits of finding your ikigai, from improved physical and mental health to enhanced social well-being and cognitive function.",
    tags: ["ikigai", "well-being", "mental-health", "purpose", "longevity", "self-discovery"],
    metaTitle: "The Benefits of Finding Your Ikigai: How Purpose Enhances Your Well-being",
    metaDescription: "Discover how finding your ikigai can improve your physical health, mental well-being, and overall life satisfaction. Learn about the science behind purpose and longevity.",
    isPublished: true,
    author: "Karlis Vilmanis",
    publishDate: "2024-06-19",
    readingTime: 8
  },
  {
    title: "How to Use the Ikigai Test to Create a Life You Love",
    slug: "how-to-use-ikigai-test-create-life-you-love",
    content: `# How to Use the Ikigai Test to Create a Life You Love

## **Introduction**

Have you ever felt stuck, wondering if your life is aligned with what truly matters to you? Maybe you've achieved milestones but still feel something is missing—a sense of meaning or direction. If this resonates, the Japanese concept of **Ikigai** could be the key to understanding your purpose.

Ikigai is about more than just a career or passion. It's the harmonious overlap of what you love, what you're good at, what the world needs, and what you can be paid for. This guide will help you explore the core principles of Ikigai and show you how to apply them in your life.

## **What Is Ikigai?**

Ikigai (pronounced ee-kee-guy) translates to "reason for being." It's a philosophy deeply rooted in Japanese culture, emphasizing the pursuit of a fulfilling and purposeful life. At its heart, Ikigai represents the balance of four elements:

1. **What You Love:** Activities that bring you joy.
2. **What You're Good At:** Your unique skills and talents.
3. **What the World Needs:** How you can contribute to society.
4. **What You Can Be Paid For:** Opportunities to sustain yourself financially.

When these elements align, you achieve Ikigai—a sweet spot where passion, mission, vocation, and profession intersect. This balance is believed to be one of the reasons for the remarkable longevity and happiness seen in Okinawa, a region known as a **Blue Zone**, where people live longer and healthier lives.

## **The Ikigai Test: A Tool for Self-Discovery**

The **Ikigai Test** is a structured framework that helps you reflect on these four elements. By answering carefully designed questions, you can identify where your passions, skills, and values intersect with the needs of the world.

### **How to Take the Ikigai Test**

1. **Find a Quiet Space:** Set aside time to reflect without distractions.
2. **Answer Honestly:** The test is a personal journey—there are no wrong answers.
3. **Journal Your Responses:** Expand on your answers to discover patterns.
4. **Visualize Your Ikigai:** Use a Venn Diagram to map out the overlaps between the four elements.

**Sample Questions:**

- What activities bring you joy and make you lose track of time?
- What skills or talents do others often compliment you on?
- What problems in the world would you like to help solve?
- What opportunities align with your values and financial needs?

Pair the Ikigai Test with additional self-discovery tools like journaling to deepen your insights.

## **Benefits of Taking the Ikigai Test**

The Ikigai Test isn't just a tool—it's a starting point for meaningful transformation. Here's what you stand to gain:

- **Clarity and Focus:** Untangle your priorities and gain a clear sense of what matters most to you.
- **Alignment:** Discover ways to harmonize your passions, skills, and career.
- **Motivation:** Feel more energized and purposeful in your daily life.

Research supports the idea that having a sense of purpose is linked to improved mental health, reduced stress, and even increased life expectancy.

## **Real-Life Applications of Ikigai**

The principles of Ikigai aren't just theoretical; they've been applied by people worldwide to transform their lives. Here are some inspiring examples of how Ikigai can shape different aspects of life:

### **1. Career Transformation**

Emma was climbing the corporate ladder in marketing, but the work felt hollow. After reflecting on her Ikigai, she realized her love for sustainability and education. Her strengths in communication paired with her desire to make an impact led her to transition into environmental consulting. Now, Emma feels deeply fulfilled knowing her work contributes to a greater cause.

### **2. Overcoming a Midlife Crisis**

Mark, in his 40s, felt like he was living on autopilot. Despite external success, he couldn't shake the feeling that something was missing. Through journaling and the Ikigai Test, he rediscovered his passion for music. He began teaching guitar and performing at local events, reigniting his sense of purpose and joy.

### **3. Turning a Hobby into a Business**

Lila, a busy parent, had always loved baking but never thought of it as more than a hobby. When she explored her Ikigai, she realized her talent for baking aligned with her desire to bring happiness to others. She started a small home-based baking business, allowing her to balance family life while pursuing her passion.

### **4. Building Meaningful Relationships**

Hannah found her Ikigai not in a career but in her connections with others. By focusing on how she could support and nurture her community, she built stronger relationships that gave her a profound sense of purpose. Her story shows that Ikigai isn't limited to work—it's about finding meaning in all areas of life.

### **5. Daily Practices for Mindful Living**

For David, Ikigai wasn't about a dramatic life change but small, intentional shifts. He started:

- Practicing gratitude journaling every morning to focus on what he loves.
- Volunteering weekly to contribute to his community.
- Taking evening walks as a way to connect with himself and nature.

These simple routines brought balance and joy to David's life, proving that Ikigai can be woven into even the smallest moments.

## **How to Apply Ikigai in Your Life**

Applying Ikigai doesn't require a complete life overhaul. Start small with these steps:

1. **Reflect Regularly:** Use tools like the Ikigai Test or journaling prompts to deepen your understanding of your values and passions.
2. **Experiment:** Try new hobbies, volunteer, or explore side projects to see what resonates.
3. **Simplify:** Focus on one or two changes at a time—Ikigai is about balance, not pressure.
4. **Stay Open:** Your Ikigai can evolve as you grow. Revisit your reflections periodically to stay aligned.

## **Frequently Asked Questions**

### **1. Can I have more than one Ikigai?**

Yes! Ikigai can take many forms. You might find purpose in multiple areas, such as your career, hobbies, and relationships.

### **2. How do I know if I've found my Ikigai?**

You'll know you've found your Ikigai when your life feels balanced, fulfilling, and aligned with your values.

### **3. Is Ikigai only about work?**

Not at all. While work is a significant part of Ikigai, it's also about joy, community, and daily mindfulness.

## **Conclusion**

Finding your Ikigai is a journey of self-discovery—one that brings clarity, fulfillment, and joy. Whether you're seeking a career change, looking to deepen your relationships, or simply striving for a more intentional life, Ikigai provides a roadmap to living with purpose.

The answers you're looking for are already within you. Take the first step today by reflecting, journaling, and exploring what makes you feel alive.`,
    excerpt: "Learn how to use the Ikigai Test as a tool for self-discovery and create a life aligned with your passions, skills, and values.",
    tags: ["ikigai", "ikigai-test", "self-discovery", "career-change", "life-purpose", "personal-growth"],
    metaTitle: "How to Use the Ikigai Test to Create a Life You Love",
    metaDescription: "Discover how the Ikigai Test can help you find your purpose and create a life you love. Learn practical steps to apply Ikigai principles in your daily life.",
    isPublished: true,
    author: "Karlis Vilmanis",
    publishDate: "2024-01-22",
    readingTime: 12
  },
  {
    title: "50 Powerful Journal Prompts for Self-Discovery to Find Clarity & Purpose",
    slug: "50-powerful-journal-prompts-self-discovery-clarity-purpose",
    content: `# 50 Powerful Journal Prompts for Self-Discovery to Find Clarity & Purpose

Have you ever felt lost, uncertain about your next steps, or disconnected from yourself? You're not alone. In today's fast-paced world, we often go through life fulfilling responsibilities without taking time to **reflect on who we truly are**.

That's where **journaling for self-discovery** comes in. Journaling helps you **uncover your purpose, identify personal values, and gain mental clarity**. These **50 journal prompts** are carefully designed to guide you through self-reflection, emotional awareness, and goal-setting so you can understand yourself on a deeper level.

All you need is a **notebook**, a **quiet space**, and a few minutes each day to write. Let's get started.

## **📝 Why Journaling Helps with Self-Discovery**

Journaling isn't just about writing—it's about exploring your thoughts and emotions with curiosity. Here's why it's a powerful tool for self-discovery:

✅ **It clarifies your thoughts & emotions** – Writing forces you to organize your thoughts, making them easier to understand.

✅ **It reveals patterns & behaviors** – By consistently journaling, you start noticing habits, emotions, and repeating themes in your life.

✅ **It helps with decision-making** – Journaling allows you to reflect on past choices and their impact.

✅ **It reduces stress & increases mindfulness** – Writing about emotions releases mental tension and promotes self-awareness.

Now, let's explore the **50 best self-discovery journal prompts** to help you reflect, grow, and gain clarity.

## **50 Journal Prompts for Self-Discovery (With Explanations)**

### **Reflecting on the Past (1-10)**

Understanding your past helps you recognize how experiences, choices, and people have shaped who you are today. By reflecting on past events, you can gain deeper clarity about your strengths, values, and emotions.

**1. What did you love doing as a child?**
- Think back to your younger years—what activities made you happiest? Did you love drawing, playing outdoors, building things, or reading stories?
- Often, our childhood passions give clues about our natural inclinations and strengths. Are you still engaging in those activities today? If not, how can you reintroduce them into your life?

**2. What is one childhood memory that brings you happiness?**
- Close your eyes and recall a specific **moment of pure joy** from your childhood. Maybe it was a family vacation, a special birthday, or a simple afternoon spent playing with friends.
- What emotions did you feel in that moment? What made it so special? Reflecting on happy memories can help identify what truly brings you joy and fulfillment.

**3. What's the biggest lesson you've learned from a past mistake?**
- We all make mistakes, but what truly matters is **how we learn from them**. Think of a time when you made a decision that didn't go as planned.
- Instead of focusing on regret, ask yourself: _What did this experience teach me? How did I grow from it?_ Learning from failure is key to self-improvement.

**4. Who has had the most significant impact on your life?**
- Consider a **mentor, family member, friend, or teacher** who has influenced your mindset, values, or career path.
- What lessons did this person teach you? How do you carry their influence with you today? Reflecting on key people in your life can help you understand what values and characteristics you admire most.

**5. What's one thing you wish you could tell your younger self?**
- Imagine sitting down with **your 10-year-old or teenage self**. What advice, encouragement, or reassurance would you give them?
- Would you tell them to take more risks? To be kinder to themselves? This exercise helps you identify lessons you've learned and what still holds meaning in your life.

### **Understanding Yourself in the Present (11-20)**

Who you are today is shaped by your **daily actions, emotions, and priorities**. These prompts will help you reflect on your current mindset, behaviors, and values so you can gain clarity on how you truly feel about your present life.

**11. How would you describe yourself in three words?**
- Take a moment to think about how you'd define yourself. Are you **creative, resilient, adventurous**? Or maybe **thoughtful, driven, kind**?
- If you're struggling to choose three words, ask a close friend or family member how they would describe you. Do their words match how you see yourself?

**12. What are your top three personal values?**
- Values guide your decisions and shape your identity. Think about **what matters most** to you—honesty, freedom, family, creativity, growth?
- Are you living in alignment with these values? If not, how can you adjust your actions to reflect what you truly believe in?

**13. What's something you're really good at? How did you develop this skill?**
- Recognizing your strengths builds confidence. Maybe you're great at **problem-solving, writing, listening, or organizing things**.
- Did this skill come naturally, or did you work hard to develop it? How can you use it more in your personal or professional life?

### **Finding Your Passions and Purpose (21-30)**

Your passions and purpose are often hidden in the **things you love, the challenges you enjoy solving, and the impact you want to make**. These prompts will help you uncover what excites you and how you can align your life with what truly matters to you.

**21. What's one activity that makes you lose track of time?**
- Think about a time when you became so **absorbed in an activity** that you forgot to check the clock. Maybe it's **writing, painting, solving problems, playing music, or helping others**.
- This activity might give you clues about your **true passion**. How often do you make time for it?

**22. If money wasn't a factor, how would you spend your days?**
- Imagine that financial security is guaranteed—what would you do with your time? Would you **travel, create, teach, volunteer, start a business, or explore new skills?**
- This prompt helps you uncover what you genuinely enjoy without external pressures.

**23. What is something you've always wanted to learn or try?**
- We all have dreams that get put on hold due to fear, doubt, or lack of time. Is there a **language, skill, or hobby** you've always wanted to explore?
- What's one small step you can take today toward trying it?

### **Exploring Emotions and Mental Well-Being (31-40)**

Your emotional well-being is a vital part of self-discovery. These prompts will help you **understand your emotions, how you process them, and how you can improve your mental and emotional health.**

**31. How do you process difficult emotions?**
- Do you **talk to someone, write about them, distract yourself, or suppress them**?
- Some coping mechanisms help, while others hold us back. What emotions do you struggle with the most, and how can you develop healthier ways to process them?

**32. When was the last time you truly felt happy? What contributed to that moment?**
- Think about the last time you felt **genuine, deep happiness**—not just momentary pleasure but real fulfillment.
- What were you doing? Who were you with? Understanding what makes you truly happy helps you **intentionally create more of those moments.**

### **Taking Action and Moving Forward (41-50)**

Self-discovery means nothing without action. These final prompts will help you **turn your insights into concrete steps** toward the life you want to live.

**41. What's one small change you can make this week to improve your life?**
- Self-improvement doesn't require dramatic changes. Maybe it's **waking up 10 minutes earlier, calling a friend, or spending less time on social media**.
- What's one small action that would make you feel better about yourself?

**42. What does your ideal day look like from start to finish?**
- Imagine your perfect day—what time do you wake up? What activities fill your day? Who do you spend time with?
- How can you incorporate elements of this ideal day into your current routine?

**43. What's one goal you want to achieve in the next six months?**
- Think about something specific and achievable. Maybe it's **learning a new skill, improving your health, or strengthening a relationship**.
- What's the first step you can take toward this goal?

**44. How do you want to be remembered?**
- This question helps you think about your **legacy and impact**. Do you want to be remembered as someone who was **kind, creative, helpful, or inspiring**?
- Are your current actions aligned with how you want to be remembered?

**45. What's one fear you want to overcome?**
- Fear often holds us back from living fully. Maybe it's **fear of failure, rejection, or judgment**.
- What would you do if this fear didn't exist? What small step can you take to face it?

**46. What advice would you give to someone going through a similar situation as you?**
- Sometimes we're kinder to others than we are to ourselves. What wisdom would you share with someone facing your current challenges?
- How can you apply this advice to your own life?

**47. What's one relationship in your life that you'd like to improve?**
- Relationships are central to our happiness. Is there a **family member, friend, or colleague** you'd like to connect with more deeply?
- What's one thing you can do to strengthen this relationship?

**48. What's something you're avoiding that you know you need to address?**
- We all have tasks, conversations, or decisions we put off. What's one thing you've been avoiding?
- What's the worst that could happen if you addressed it? What's the best that could happen?

**49. How do you want to grow as a person in the next year?**
- Think about the **skills, habits, or mindsets** you want to develop. Maybe you want to become more **patient, confident, or creative**.
- What steps can you take to work toward this growth?

**50. What are you most grateful for in your life right now?**
- Gratitude is a powerful way to end any self-reflection practice. Think about the **people, experiences, or opportunities** you're thankful for.
- How can you show more appreciation for these blessings in your daily life?

## **How to Use These Prompts Effectively**

- **Start with one prompt per day** – Don't overwhelm yourself by trying to answer all 50 at once.
- **Write freely** – Don't worry about grammar or structure. Just let your thoughts flow.
- **Be honest** – The most valuable insights come from truthful self-reflection.
- **Review your answers** – Look back at your responses after a week or month to see patterns and growth.
- **Take action** – Use your insights to make positive changes in your life.

## **Your Journey of Self-Discovery Starts Now**

Self-discovery is not a destination—it's an ongoing journey. These 50 journal prompts are designed to help you **reflect, understand, and grow**. Take your time with each question, be patient with yourself, and remember that every small step toward self-awareness is a victory.

Grab your journal, find a quiet space, and start exploring. The answers you seek are already within you—you just need to give yourself permission to find them.`,
    excerpt: "50 carefully crafted journal prompts designed to guide you through self-reflection, emotional awareness, and goal-setting for deeper self-understanding.",
    tags: ["journaling", "self-discovery", "personal-growth", "reflection", "clarity", "purpose", "mindfulness"],
    metaTitle: "50 Powerful Journal Prompts for Self-Discovery to Find Clarity & Purpose",
    metaDescription: "Discover 50 powerful journal prompts designed to help you uncover your purpose, identify personal values, and gain mental clarity through self-reflection.",
    isPublished: true,
    author: "Karlis Vilmanis",
    publishDate: "2024-02-02",
    readingTime: 15
  },
  {
    title: "Discovering Your True Self: The Journey of Self-Discovery",
    slug: "discovering-your-true-self-journey-of-self-discovery",
    content: `# Discovering Your True Self: The Journey of Self-Discovery

"Finding yourself is not about discovering something new; it's about rediscovering what's always been there." In the hustle and bustle of modern life, we often lose sight of who we truly are. We conform, we adapt, and sometimes we lose our way. But the journey back to oneself, though challenging, is one of the most rewarding adventures one can undertake.

## Why Finding Yourself Matters

Understanding who you are at your core is crucial for personal growth, making better life choices, and living authentically. It helps you build deeper relationships, find career satisfaction, and improve your overall well-being.

When you know yourself deeply, you can:
- Make decisions that align with your true values
- Build more meaningful and authentic relationships
- Find work that feels fulfilling rather than draining
- Navigate life's challenges with greater resilience
- Experience a deeper sense of purpose and direction

## The Challenges of Self-Discovery

Self-discovery is often hindered by societal expectations, fear, and insecurities. The complexity of change can make this journey daunting, but every step forward brings you closer to a more fulfilling life.

Common obstacles include:
- **Societal pressure** to fit into predefined roles and expectations
- **Fear of what you might discover** about yourself
- **Past experiences** that have shaped your self-perception
- **Busy lifestyles** that leave little time for reflection
- **Comparison with others** that clouds your authentic self

## The Path to Self-Discovery

### 1. Create Space for Reflection

The first step in discovering your true self is creating quiet moments in your life. This might mean:
- Setting aside time for journaling each day
- Taking regular walks without distractions
- Practicing meditation or mindfulness
- Spending time in nature
- Engaging in activities that bring you joy

### 2. Question Your Assumptions

Many of the beliefs we hold about ourselves come from others—parents, teachers, friends, or society. Ask yourself:
- Which of my beliefs are truly mine?
- What would I do if I weren't afraid of judgment?
- How much of my identity is based on others' expectations?
- What parts of myself have I been hiding or suppressing?

### 3. Explore Your Passions

Your authentic self is often revealed through the things that genuinely excite you. Pay attention to:
- Activities that make you lose track of time
- Topics you naturally gravitate toward in conversations
- Childhood interests you may have abandoned
- Dreams and aspirations you've pushed aside

### 4. Embrace Your Shadow Self

Carl Jung spoke of the "shadow"—the parts of ourselves we often reject or hide. True self-discovery involves:
- Acknowledging your flaws and imperfections
- Understanding your triggers and reactive patterns
- Exploring the aspects of yourself you find uncomfortable
- Integrating all parts of who you are

## Introducing Ikigai Self-Discovery Cards: Your Companion in Self-Discovery

To aid you on this journey, consider using [Ikigai Self-Discovery Cards](https://www.amazon.com/IKIGAI-Self-Discovery-Cards-Mindfulness/dp/B0B45WVMG9/). These cards are designed to help you find yourself by combining principles of mindfulness, personal growth, and practical exercises. With Ikigai Self-Discovery Cards, you can explore your passions, values, and strengths, and find your true purpose in life.

The cards provide:
- **Guided reflection prompts** to help you explore different aspects of yourself
- **Practical exercises** that you can incorporate into your daily routine
- **Mindfulness practices** to help you stay present and aware
- **Purpose exploration** to help you align your life with what matters most

## The Impact of Finding Yourself

Once you embark on this journey, you'll notice significant improvements in various areas of your life:

### Improved Relationships
- You'll attract people who appreciate your authentic self
- Your relationships will become deeper and more meaningful
- You'll have clearer boundaries and better communication
- You'll feel more confident in social situations

### Enhanced Career Satisfaction
- You'll make career choices that align with your values
- Work will feel more like a calling than just a job
- You'll be more creative and innovative in your approach
- You'll have the courage to pursue opportunities that excite you

### Better Mental and Emotional Health
- You'll experience less anxiety and stress
- Your self-esteem will improve naturally
- You'll develop better coping mechanisms for challenges
- You'll feel more at peace with yourself and your choices

## Real-Life Stories

Many have walked this path before you. Take inspiration from their journeys and know that you are not alone. For instance, Jane, a user of Ikigai Self-Discovery Cards, discovered her passion for writing through the self-reflective exercises in the cards, leading her to start a successful blog that brings her joy and fulfillment.

Another example is Mark, who spent years in a corporate job that felt meaningless. Through self-discovery work, he realized his true passion lay in helping others heal. He eventually transitioned to become a therapist, finding deep satisfaction in work that aligned with his authentic self.

## Practical Steps to Start Your Journey

### 1. Begin with Small Questions
- What brings me joy?
- What are my core values?
- What would I do if I knew I couldn't fail?
- How do I want to be remembered?

### 2. Pay Attention to Your Body
- Notice when you feel energized vs. drained
- Observe your physical reactions to different situations
- Listen to your intuition and gut feelings
- Practice body-based mindfulness techniques

### 3. Experiment and Explore
- Try new activities and hobbies
- Travel to new places (even if it's just a new neighborhood)
- Meet new people and learn from their perspectives
- Read books and consume content that challenges your thinking

### 4. Seek Support
- Work with a therapist or coach
- Join support groups or communities
- Find mentors who inspire you
- Use tools like the Ikigai Self-Discovery Cards

## The Ongoing Nature of Self-Discovery

Remember that self-discovery is not a destination but a lifelong journey. As you grow and evolve, new aspects of yourself will emerge. Stay curious, stay open, and be patient with the process.

Your authentic self is not something you need to create—it's something you need to uncover. It's been there all along, waiting for you to have the courage to embrace it fully.

## Conclusion: Start Your Journey Today

Finding yourself is a continuous process that requires patience and kindness towards yourself. Begin this journey with an open heart and mind, and consider using tools like the Ikigai Self-Discovery Cards to support you along the way. 

Embrace the adventure, and you'll uncover the true, wonderful you that has always been there. The world needs your authentic self—your unique gifts, perspectives, and contributions that only you can offer.

Start today. Your authentic self is waiting.`,
    excerpt: "Explore the transformative journey of self-discovery and learn practical steps to uncover your authentic self and live a more fulfilling life.",
    tags: ["self-discovery", "personal-growth", "authenticity", "mindfulness", "purpose", "identity", "self-awareness"],
    metaTitle: "Discovering Your True Self: The Journey of Self-Discovery",
    metaDescription: "Learn how to embark on the journey of self-discovery to uncover your authentic self and live a more fulfilling, purpose-driven life.",
    isPublished: true,
    author: "Karlis Vilmanis",
    publishDate: "2024-06-19",
    readingTime: 12
  },
  {
    title: "What Is Ikigai? A Comprehensive Guide to Japan's Philosophy of Purpose and Joy",
    slug: "what-is-ikigai-comprehensive-guide-japans-philosophy-purpose-joy",
    content: `# What Is Ikigai? A Comprehensive Guide to Japan's Philosophy of Purpose and Joy

## Introduction: My Personal Journey with Ikigai

When I first encountered the word _Ikigai_, I didn't fully understand it. At the time, I was burning out. I had a successful career by most Western standards, but I felt unfulfilled, disconnected, and unsure of where I was heading. That's when I began researching Ikigai more deeply — not just the catchy Venn diagram version floating around social media, but the original, cultural meaning that the Japanese live by.

This exploration eventually led to the creation of [Ikigain.org](https://www.ikigain.org/), a platform dedicated to helping others explore their own purpose. Through my own journey and the stories of others, I've come to understand that Ikigai is not a life hack or productivity system. It's a quiet, powerful mindset that permeates daily life.

This guide is a reflection of what I've learned, what I continue to learn, and what I hope will inspire you to live with more meaning and clarity.

## What Does Ikigai Mean?

The term _Ikigai_ (pronounced ee-kee-guy) combines two Japanese words: "iki" (life) and "gai" (value or worth). So, it literally translates to "a reason for being." But this translation, while accurate, is also limiting. Ikigai is more than just a reason to wake up in the morning — it is the interplay between your values, your joys, your responsibilities, and your community.

Ikigai is **not** about finding one big purpose. It's about cultivating a mindset that helps you find value in small moments, meaningful connections, and ongoing growth. As Mieko Kamiya, one of Japan's leading Ikigai researchers, wrote:

> "Ikigai is what makes life worth living. It is not necessarily related to happiness in the Western sense."

In Japan, people often associate their Ikigai with roles within their families, hobbies, volunteer work, spiritual practices, and social ties. It is flexible, personal, and deeply rooted in one's environment and relationships.

## The Western Misunderstanding of Ikigai

Most people outside Japan were introduced to Ikigai through the popular Venn diagram that intersects four circles:

- What you love
- What you are good at
- What the world needs
- What you can be paid for

While this version is helpful for career coaching, it's **not** the original Japanese concept. The diagram was first developed by Spanish author Andres Zuzunaga and adapted later by Marc Winn, who inserted the word "Ikigai" into the center. This version reflects more of a Western, achievement-based view of purpose.

In contrast, traditional Japanese Ikigai is not always tied to work or money. It may involve gardening, taking care of grandchildren, engaging in tea ceremonies, or morning walks with friends. It's about presence, rhythm, and contribution more than output or income.

As Nicholas Kemp, founder of the Ikigai Tribe, puts it:

> "Ikigai is not something grand. It's found in the practice of living with integrity and joy."

## The Five Pillars of Ikigai

In his book _The Little Book of Ikigai_, neuroscientist Ken Mogi outlines five foundational principles that shape the Ikigai mindset:

### 1. **Starting Small**
Appreciate the small wins and take joy in beginning. Whether it's learning a new skill or improving your health, progress starts with tiny steps.

### 2. **Releasing Yourself**
Let go of societal pressures, rigid expectations, and your ego. Allow your true self to emerge.

### 3. **Harmony and Sustainability**
Live in a way that is sustainable for both you and your community. Seek balance and avoid excess.

### 4. **The Joy of Little Things**
Celebrate the small joys: a perfect cup of coffee, a child's laughter, or a breeze through your window.

### 5. **Being in the Here and Now**
Practice mindfulness. Be fully present in whatever you do, whether it's work, rest, or play.

Each of these pillars has helped me refocus during challenging times, especially as a parent. I've found that when I slow down and reconnect with daily rituals, I feel more grounded and clear about what matters.

## Ikigai and Longevity in Okinawa

The people of Okinawa, Japan, are among the longest-living populations in the world. Their longevity is often attributed to diet, exercise, community, and yes — Ikigai.

In the town of Ogimi, many elders continue working into their 90s and beyond. But their work is not about financial gain; it's about connection and rhythm. Whether it's tending to a garden, preparing traditional meals, or participating in local festivals, these activities embody the spirit of Ikigai.

This communal aspect of Ikigai contrasts strongly with the individualistic paths of self-fulfillment common in the West.

## How Ikigai Has Shaped My Life

Building [Ikigain.org](https://www.ikigain.org/) was never about chasing clicks or becoming an influencer. It was born from a real need — my need — to reconnect with meaning.

When I began integrating Ikigai into my daily routines, I stopped feeling like I was running out of time. I started focusing more on:

- Spending focused, present time with my child
- Helping clients not just launch Amazon products, but build something they're proud of
- Creating products like the [Ikigai Self-Discovery Cards](https://www.ikigain.org/cards) that invite people into a dialogue with themselves
- Developing the [Ikigai Test](https://www.ikigain.org/test) as a tool for anyone to begin their journey inward

The result wasn't a massive epiphany, but a shift. A new rhythm. A feeling that I am finally aligned with what I value.

## Practical Ways to Find Your Ikigai

Here are a few exercises and reflections you can try:

### 1. **The Micro-Joy Journal**
Write down three things each day that brought you joy, however small.

### 2. **Energy Mapping**
Track the activities that energize you vs. the ones that drain you. Look for patterns.

### 3. **Life Chapters Timeline**
Map your life into "chapters" and reflect on what gave you purpose in each. What's changed? What's constant?

### 4. **The Ikigai Test**
Take our [Ikigai Test](https://www.ikigain.org/test) to identify your current strengths and areas of potential growth.

### 5. **Use the Self-Discovery Cards**
Shuffle the deck and answer one reflection card each morning. Build a routine of inner clarity.

## Common Myths About Ikigai

### Myth 1: Ikigai = Dream Job
While your career can reflect your Ikigai, they are not the same. Many Japanese people find Ikigai in family, hobbies, or spiritual practices.

### Myth 2: Ikigai Is Only for the Elderly
Ikigai is for everyone. Children, students, retirees, and working professionals all have access to it.

### Myth 3: You Need to Find It Once and For All
Ikigai evolves. Your reason for being at 20 may look completely different at 60. That's the beauty of it.

## Conclusion: Your Ikigai Is Already Within You

Ikigai isn't something you need to chase across the world. It's already inside you, waiting to be noticed, nurtured, and practiced. It's found in the cup of tea you drink mindfully, the text message you send to check on a friend, the moment you choose presence over perfection.

My hope is that this article has demystified Ikigai and brought it closer to your daily reality. Whether through journaling, quiet reflection, or using the resources we've created at [Ikigain.org](https://www.ikigain.org/), your journey begins now.

Because the most important step isn't discovering your Ikigai. It's living it.`,
    excerpt: "A comprehensive exploration of the authentic Japanese concept of Ikigai, beyond the popular Venn diagram, revealing the true philosophy of purpose and joy in daily life.",
    tags: ["ikigai", "japanese-philosophy", "purpose", "meaning", "authentic-ikigai", "life-purpose", "mindfulness", "daily-practice"],
    metaTitle: "What Is Ikigai? A Comprehensive Guide to Japan's Philosophy of Purpose and Joy",
    metaDescription: "Discover the authentic Japanese concept of Ikigai beyond the popular Venn diagram. Learn the true philosophy of purpose and joy in daily life.",
    isPublished: true,
    author: "Karlis Vilmanis",
    publishDate: "2024-05-15",
    readingTime: 18
  },
  {
    title: "15 Inspiring Ikigai Phrases to Live with Purpose and Joy",
    slug: "15-inspiring-ikigai-phrases-live-purpose-joy",
    content: `# 15 Inspiring Ikigai Phrases to Live with Purpose and Joy

**Inspiring Japanese sayings that reflect the essence of living with purpose.**

Ikigai (生き甲斐) is a Japanese concept meaning "a reason for being." It's about finding meaning in daily life, doing what you love, and contributing to the world. Below are commonly used Ikigai phrases that can help you reflect, journal, or live more intentionally.

## What are some common Ikigai phrases?

**Common Ikigai phrases include:** "Find joy in the small things," "Do what you love, love what you do," and "You are needed, you belong." These phrases reflect the Ikigai philosophy of living with purpose, mindfulness, and joy in everyday life.

## How can I use Ikigai quotes in daily life?

> **Ikigai quotes can be used** as affirmations, journaling prompts, or daily reflections. They help you reconnect with your sense of meaning, gratitude, and intentional living.

## 15 Ikigai-Inspired Phrases and Their Meaning

### 1. **"Find joy in the small things."**
True happiness is often found in everyday moments—a quiet morning, a warm meal, or the feeling of fresh air. This phrase invites mindfulness and appreciation.

### 2. **"Do what you love, love what you do."**
Ikigai encourages alignment between passion and purpose. Whether in work or hobbies, joy grows when love leads the way.

### 3. **"You are needed, you belong."**
This phrase reminds us that each person matters. Ikigai is not just about self-fulfillment—it's also about feeling useful and connected.

### 4. **"Live with intention. Act with meaning."**
Ikigai is about making choices that reflect your values, not just reacting to life passively.

### 5. **"Purpose is personal."**
Your Ikigai doesn't have to look like anyone else's. It's unique, evolving, and deeply yours.

### 6. **"Flow is a sign of Ikigai."**
When time disappears and you're fully engaged, you're likely experiencing flow—one of the clearest signs of living your purpose.

### 7. **"The journey matters more than the destination."**
Ikigai is not a final goal—it's a way of being. Meaning grows through consistency and presence, not achievement alone.

### 8. **"Gratitude turns routines into rituals."**
Doing the same thing every day can become sacred when approached with appreciation. This is where Ikigai meets habit.

### 9. **"Start small, go slow."**
Ikigai doesn't demand big life changes. A small shift in how you approach the day is often enough.

### 10. **"Joy and meaning can live in the same moment."**
Fun and purpose aren't opposites. In Ikigai, playfulness is part of purpose.

### 11. **"Take care of what you love."**
Ikigai includes nurturing—not just people and goals, but also tools, nature, and self.

### 12. **"Be present, even in repetition."**
Ikigai honors the beauty of consistency. Whether it's making tea or writing each morning, repetition becomes meaningful with awareness.

### 13. **"Let values guide your path."**
Rather than chasing success or trends, Ikigai asks: What feels right? What aligns with your values?

### 14. **"Your life is your message."**
What you do each day, how you treat others, how you show up—that's your legacy.

### 15. **"Ikigai isn't found—it's practiced."**
You don't need to discover your purpose all at once. You grow it, day by day, through action and attention.

## How to Start Living with Ikigai Today

These phrases aren't just words—they're gentle reminders of how to live with greater awareness, joy, and meaning.

You don't need to master all of them at once. Start small:

- Choose one phrase that resonates with you today
- Write it down in your journal or planner
- Reflect on what it means in the context of your life right now

Over time, these small reflections can shift how you see your work, your relationships, and your purpose.

## Practice with Intention

Each of these phrases represents a different aspect of the Ikigai philosophy. Some focus on mindfulness and presence, others on purpose and meaning, and still others on community and connection.

The beauty of Ikigai is that it's not prescriptive. You don't need to follow all 15 phrases perfectly. Instead, let them guide you toward a more intentional way of living.

## Your Daily Ikigai Practice

Consider incorporating one phrase into your morning routine:

1. **Choose a phrase** that speaks to you
2. **Write it down** somewhere visible
3. **Reflect on it** throughout the day
4. **Notice** how it influences your choices and mindset

This simple practice can help you live with greater awareness and purpose, one day at a time.

## What's Your Favorite Ikigai Phrase?

We'd love to know which phrase spoke to you most. These simple yet profound reminders can become powerful tools for living with greater intention and joy.

Remember: Ikigai isn't about perfection. It's about presence, purpose, and the gentle practice of living with meaning.`,
    excerpt: "15 inspiring Ikigai phrases to help you live with greater purpose, mindfulness, and joy in everyday life. Transform your daily routine with these powerful reminders.",
    tags: ["ikigai", "inspiration", "mindfulness", "purpose", "daily-practice", "japanese-wisdom", "intentional-living", "personal-growth"],
    metaTitle: "15 Inspiring Ikigai Phrases to Live with Purpose and Joy",
    metaDescription: "Discover 15 powerful Ikigai phrases to inspire purposeful living. Learn how to use these Japanese wisdom quotes for daily reflection and intentional living.",
    isPublished: true,
    author: "Karlis Vilmanis",
    publishDate: "2024-03-10",
    readingTime: 8
  }
];

export default function BlogImport() {
  const { isAuthenticated, isLoading } = useAuth();
  const [importMode, setImportMode] = useState<'preset' | 'custom'>('preset');
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [importResults, setImportResults] = useState<{success: string[], errors: string[]}>({success: [], errors: []});
  const [customUrl, setCustomUrl] = useState("");
  const [customContent, setCustomContent] = useState("");
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the import system",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
    }
  }, [isAuthenticated, isLoading, toast]);

  const importMutation = useMutation({
    mutationFn: async (posts: BlogPost[]) => {
      const results = { success: [] as string[], errors: [] as string[] };
      
      for (const post of posts) {
        try {
          await apiRequest("POST", "/api/admin/blog/posts", post);
          results.success.push(post.title);
        } catch (error) {
          console.error('Import error:', error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (errorMessage.includes('409')) {
            results.errors.push(`${post.title} (already exists)`);
          } else {
            results.errors.push(post.title);
          }
        }
      }
      
      return results;
    },
    onSuccess: (results) => {
      setImportResults(results);
      toast({
        title: "Import Complete",
        description: `Successfully imported ${results.success.length} posts. ${results.errors.length} failed.`,
      });
    },
    onError: () => {
      toast({
        title: "Import Failed",
        description: "Failed to import blog posts. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleImportSelected = () => {
    const postsToImport = selectedPosts.map(index => EXISTING_POSTS[index]);
    importMutation.mutate(postsToImport);
  };

  const handleImportAll = () => {
    importMutation.mutate(EXISTING_POSTS);
  };

  const handleSelectPost = (index: number, checked: boolean) => {
    if (checked) {
      setSelectedPosts(prev => [...prev, index]);
    } else {
      setSelectedPosts(prev => prev.filter(i => i !== index));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPosts(EXISTING_POSTS.map((_, index) => index));
    } else {
      setSelectedPosts([]);
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading import system...</p>
        </div>
      </div>
    );
  }

  // Show authentication required message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LogIn className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h1>
          <p className="text-gray-600 mb-4">Please log in to access the blog import system</p>
          <Button onClick={() => window.location.href = "/api/login"}>
            <LogIn className="mr-2 h-4 w-4" />
            Log In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Import System</h1>
          <p className="text-gray-600">Import your existing blog posts from ikigain.org into your new admin system</p>
        </div>

        {/* Import Mode Selection */}
        <div className="mb-6">
          <div className="flex gap-4">
            <Button
              variant={importMode === 'preset' ? 'default' : 'outline'}
              onClick={() => setImportMode('preset')}
            >
              <Download className="mr-2 h-4 w-4" />
              Import from ikigain.org
            </Button>
            <Button
              variant={importMode === 'custom' ? 'default' : 'outline'}
              onClick={() => setImportMode('custom')}
            >
              <Upload className="mr-2 h-4 w-4" />
              Custom Import
            </Button>
          </div>
        </div>

        {importMode === 'preset' && (
          <div className="space-y-6">
            {/* Bulk Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Available Posts from ikigain.org</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    variant="outline"
                    onClick={() => handleSelectAll(selectedPosts.length < EXISTING_POSTS.length)}
                  >
                    {selectedPosts.length === EXISTING_POSTS.length ? 'Deselect All' : 'Select All'}
                  </Button>
                  <Button
                    onClick={handleImportSelected}
                    disabled={selectedPosts.length === 0 || importMutation.isPending}
                  >
                    Import Selected ({selectedPosts.length})
                  </Button>
                  <Button
                    onClick={handleImportAll}
                    disabled={importMutation.isPending}
                    variant="secondary"
                  >
                    Import All Posts
                  </Button>
                </div>

                {/* Posts List */}
                <div className="space-y-4">
                  {EXISTING_POSTS.map((post, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-4">
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            checked={selectedPosts.includes(index)}
                            onChange={(e) => handleSelectPost(index, e.target.checked)}
                            className="mt-2"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-gray-900">{post.title}</h3>
                              <Badge variant={post.isPublished ? "default" : "secondary"}>
                                {post.isPublished ? "Published" : "Draft"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{post.excerpt}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>By {post.author}</span>
                              <span>{post.readingTime} min read</span>
                              <span>{post.publishDate}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {post.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {importMode === 'custom' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Custom Import</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="url">Website URL</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com/blog-post"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="content">Or paste content directly</Label>
                  <Textarea
                    id="content"
                    placeholder="Paste your blog post content here..."
                    value={customContent}
                    onChange={(e) => setCustomContent(e.target.value)}
                    rows={10}
                  />
                </div>
                <Button disabled>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Custom Content (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Import Results */}
        {(importResults.success.length > 0 || importResults.errors.length > 0) && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Import Results</CardTitle>
            </CardHeader>
            <CardContent>
              {importResults.success.length > 0 && (
                <Alert className="mb-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Successfully imported {importResults.success.length} posts:
                    <ul className="list-disc ml-4 mt-2">
                      {importResults.success.map(title => (
                        <li key={title}>{title}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              {importResults.errors.length > 0 && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to import {importResults.errors.length} posts:
                    <ul className="list-disc ml-4 mt-2">
                      {importResults.errors.map(title => (
                        <li key={title}>{title}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Help */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Import Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Posts are imported with their original metadata, tags, and publishing status</li>
              <li>• Duplicate posts (same slug) will be skipped to avoid conflicts</li>
              <li>• Images and links are preserved but may need manual adjustment</li>
              <li>• SEO metadata is automatically generated from the original content</li>
              <li>• After import, you can edit posts in the Enhanced Blog Admin</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}