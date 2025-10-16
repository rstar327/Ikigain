import { Link } from "wouter";
import { Mail, Heart } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from "@/hooks/useLocalizedPath";


export default function Footer() {
  const { t } = useTranslation(['navigation', 'common']);
  const { getPath } = useLocalizedPath();
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Comprehensive site navigation for SEO - Addresses ahrefs.com internal linking */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Complete Site Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Assessment Tools</h3>
              <ul className="space-y-2">
                <li><Link href="/test" className="text-gray-300 hover:text-white transition-colors">Complete Ikigai Test</Link></li>
                <li><Link href="/ikigai-type-test" className="text-gray-300 hover:text-white transition-colors">Quick Type Test</Link></li>
                <li><Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Your Results</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Learn & Explore</h3>
              <ul className="space-y-2">
                <li><Link href="/what-is-ikigai" className="text-gray-300 hover:text-white transition-colors">What is Ikigai?</Link></li>
                <li><Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Purpose Insights</Link></li>
                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">Our Story</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-400">Personality Types</h3>
              <ul className="space-y-2">
                <li><Link href="/ikigai-types/dreamer" className="text-gray-300 hover:text-white transition-colors">The Dreamer</Link></li>
                <li><Link href="/ikigai-types/builder" className="text-gray-300 hover:text-white transition-colors">The Builder</Link></li>
                <li><Link href="/ikigai-types/explorer" className="text-gray-300 hover:text-white transition-colors">The Explorer</Link></li>
                <li><Link href="/ikigai-types/helper" className="text-gray-300 hover:text-white transition-colors">The Helper</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-400">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/positive-words" className="text-gray-300 hover:text-white transition-colors">Positive Words</Link></li>
                <li><Link href="/shop" className="text-gray-300 hover:text-white transition-colors">Shop Resources</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Traditional footer sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-t border-gray-700 pt-8">
          
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ikigain.org</h3>
            <p className="text-gray-400 mb-4">
              {t('navigation:footerDescription')}
            </p>
            <div className="flex items-center text-gray-400">
              <Mail className="h-4 w-4 mr-2" />
              <span>hello@ikigain.org</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('navigation:quickLinks')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href={getPath("/")} className="text-gray-400 hover:text-white transition-colors">
                  {t('navigation:home')}
                </Link>
              </li>
              <li>
                <Link href={getPath("/test")} className="text-gray-400 hover:text-white transition-colors">
                  {t('navigation:ikigaiTest')}
                </Link>
              </li>
              <li>
                <Link href={getPath("/ikigai-type-test")} className="text-gray-400 hover:text-white transition-colors">
                  {t('navigation:freeTypeTest')}
                </Link>
              </li>
              <li>
                <Link href={getPath("/blog")} className="text-gray-400 hover:text-white transition-colors">
                  {t('navigation:blog')}
                </Link>
              </li>
              <li>
                <Link href={getPath("/positive-words")} className="text-gray-400 hover:text-white transition-colors">
                  {t('navigation:positiveWords')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn More */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('navigation:learnMore')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href={getPath("/about")} className="text-gray-400 hover:text-white transition-colors">
                  {t('navigation:aboutUs')}
                </Link>
              </li>
              <li>
                <Link href={getPath("/what-is-ikigai")} className="text-gray-400 hover:text-white transition-colors">
                  {t('navigation:whatIsIkigai')}
                </Link>
              </li>
              <li>
                <Link href={getPath("/ikigai-personality-types")} className="text-gray-400 hover:text-white transition-colors">
                  {t('navigation:personalityTypes')}
                </Link>
              </li>
              <li>
                <Link href={getPath("/ikigai-test")} className="text-gray-400 hover:text-white transition-colors">
                  {t('navigation:ikigaiTestGuide')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Ikigai Types - Quick Type Test */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('navigation:ikigaiTypesQuick')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href={getPath("/ikigai-types/builder")} className="text-gray-400 hover:text-white transition-colors">
                  The {t('navigation:builder')}
                </Link>
              </li>
              <li>
                <Link href={getPath("/ikigai-types/explorer")} className="text-gray-400 hover:text-white transition-colors">
                  The {t('navigation:explorer')}
                </Link>
              </li>
              <li>
                <Link href={getPath("/ikigai-types/dreamer")} className="text-gray-400 hover:text-white transition-colors">
                  The {t('navigation:dreamer')}
                </Link>
              </li>
              <li>
                <Link href={getPath("/ikigai-types/achiever")} className="text-gray-400 hover:text-white transition-colors">
                  The {t('navigation:achiever')}
                </Link>
              </li>
              <li>
                <Link href={getPath("/ikigai-types/helper")} className="text-gray-400 hover:text-white transition-colors">
                  The {t('navigation:helper')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Ikigai Types - Main Test */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('navigation:ikigaiTypesMain')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href={getPath("/ikigai-types/creative-enthusiast")} className="text-gray-400 hover:text-white transition-colors">
                  Creative Enthusiast
                </Link>
              </li>
              <li>
                <Link href={getPath("/ikigai-types/skilled-expert")} className="text-gray-400 hover:text-white transition-colors">
                  Skilled Expert
                </Link>
              </li>
              <li>
                <Link href={getPath("/ikigai-types/purpose-driven-leader")} className="text-gray-400 hover:text-white transition-colors">
                  Purpose-Driven Leader
                </Link>
              </li>
              <li>
                <Link href={getPath("/ikigai-types/career-focused-achiever")} className="text-gray-400 hover:text-white transition-colors">
                  Career-Focused Achiever
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Positive Words Index - Critical for SEO and fixing orphan pages */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <h3 className="text-xl font-semibold mb-6 text-center">Positive Words by Letter</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: 26 }, (_, i) => {
              const letter = String.fromCharCode(97 + i);
              const upperLetter = letter.toUpperCase();
              return (
                <Link 
                  key={letter} 
                  href={getPath(`/positive-words-that-start-with-${letter}`)} 
                  className="text-gray-400 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded font-medium"
                  onClick={() => {
                    // Scroll to top when navigating to positive words page
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                  }}
                >
                  {upperLetter}
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-4">
            <Link 
              href={getPath("/positive-words")} 
              className="text-blue-400 hover:text-blue-300 transition-colors"
              onClick={() => {
                // Scroll to top when navigating to positive words main page
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
              }}
            >
              View All Positive Words →
            </Link>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Ikigain.org. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6">
              <Link href={getPath("/privacy")} className="text-gray-400 hover:text-white transition-colors text-sm">
                {t('common:privacy')}
              </Link>
              <Link href={getPath("/terms")} className="text-gray-400 hover:text-white transition-colors text-sm">
                {t('common:terms')}
              </Link>
              <div className="flex items-center text-gray-400 text-sm">
                <span>{t('navigation:madeWith')}</span>
                <Heart className="h-4 w-4 mx-1 text-red-500" />
                <span>{t('navigation:forYourJourney')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}