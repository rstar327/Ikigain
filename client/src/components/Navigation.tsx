import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import logoImage from "@assets/IKIGAIN+Black (1)_1752659023498.png";
import { User, Settings, LogOut, Menu, X, ChevronDown, Info, Users, BookOpen, Target, Brain, Compass, Star, ShoppingCart, Mail, BarChart3 } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

export default function Navigation() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation(['navigation', 'common']);
  const { getPath } = useLocalizedPath();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href={getPath("/")}>
              <img 
                src={logoImage} 
                alt="Ikigain" 
                className="h-[5rem] w-auto hover:opacity-80 cursor-pointer transition-opacity"
              />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 transition-colors font-semibold px-4 py-2">
                  {t('navigation:about', 'À PROPOS')}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href={getPath("/about")} className="cursor-pointer w-full">
                    <Info className="mr-2 h-4 w-4" />
                    {t('navigation:aboutUs')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={getPath("/what-is-ikigai")} className="cursor-pointer w-full">
                    <BookOpen className="mr-2 h-4 w-4" />
                    {t('navigation:whatIsIkigai')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={getPath("/ikigai-personality-types")} className="cursor-pointer w-full">
                    <Users className="mr-2 h-4 w-4" />
                    {t('navigation:personalityTypes')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getPath("/ikigai-test")} className="cursor-pointer w-full">
                    <Target className="mr-2 h-4 w-4" />
                    {t('navigation:ikigaiTest')}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link href={getPath("/blog")} className="text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-md hover:bg-gray-50">
              {t('navigation:blog')}
            </Link>
            <Link href={getPath("/shop")} className="text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-md hover:bg-gray-50">
              {t('navigation:shop')}
            </Link>
            <Link href={getPath("/positive-words")} className="text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-md hover:bg-gray-50">
              {t('navigation:positiveWords')}
            </Link>

          </div>
          
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg px-4 py-2">
                    {t('navigation:freeTypeTest')}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuItem asChild>
                  <Link href={getPath("/ikigai-type-test")} className="cursor-pointer w-full group">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className="mr-2 h-4 w-4 text-blue-600"
                    >
                      <Compass className="w-full h-full" />
                    </motion.div>
                    <div>
                      <div className="font-medium group-hover:text-blue-700 transition-colors">{t('navigation:freeTypeTest')}</div>
                      <div className="text-xs text-gray-500">{t('navigation:fiveMinTest')}</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={getPath("/test")} className="cursor-pointer w-full group">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className="mr-2 h-4 w-4 text-indigo-600"
                    >
                      <Brain className="w-full h-full" />
                    </motion.div>
                    <div>
                      <div className="font-medium group-hover:text-indigo-700 transition-colors">{t('navigation:ikigaiTest')}</div>
                      <div className="text-xs text-gray-500">{t('navigation:completeAnalysis')}</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <LanguageSwitcher />
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50">
                  {t('navigation:dashboard')}
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {(user as any)?.firstName?.[0] || (user as any)?.email?.[0] || "U"}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        {t('navigation:dashboard')}
                      </Link>
                    </DropdownMenuItem>

                    
                    {/* Only show admin functions to admin users */}
                    {((user as any)?.role === 'admin' || (user as any)?.email === 'karlisvilmanis@gmail.com') && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <a href="/admin" className="cursor-pointer flex items-center w-full">
                            <Settings className="mr-2 h-4 w-4" />
                            {t('navigation:adminDashboard')}
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <a href="/admin/blog-enhanced" className="cursor-pointer flex items-center w-full">
                            <BookOpen className="mr-2 h-4 w-4" />
                            {t('navigation:blogManagement')}
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <a href="/admin/shop" className="cursor-pointer flex items-center w-full">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {t('navigation:shopManagement')}
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <a href="/admin/emails" className="cursor-pointer flex items-center w-full">
                            <Mail className="mr-2 h-4 w-4" />
                            {t('navigation:emailCollection')}
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <a href="/admin/checkout-analytics" className="cursor-pointer flex items-center w-full">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Checkout Analytics
                          </a>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        // Use our new logout endpoint
                        fetch('/api/auth/logout', { method: 'POST' })
                          .then(() => window.location.href = "/")
                          .catch(() => window.location.href = "/");
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('navigation:signOut')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {!isLoading && (
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2"
                    onClick={() => {
                      // Redirect to our new email/password login page
                      window.location.href = `/login`;
                    }}
                  >
                    {t('navigation:signIn')}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <div className="px-3 py-2 text-sm font-medium text-gray-900 border-b border-gray-200 mb-2">
                {t('navigation:takeIkigaiTest')}
              </div>
              <Link href={getPath("/ikigai-test")} onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md ml-4">
                  <Star className="mr-2 h-4 w-4" />
                  {t('navigation:ikigaiTest')}
                </div>
              </Link>
              <Link href={getPath("/ikigai-type-test")} onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md ml-4">
                  <Compass className="mr-2 h-4 w-4" />
                  {t('navigation:freeIkigaiTypeTest')}
                </div>
              </Link>
              <Link href={getPath("/test")} onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md ml-4">
                  <Brain className="mr-2 h-4 w-4" />
                  {t('navigation:ikigaiTest')}
                </div>
              </Link>
              
              <div className="px-3 py-2 text-sm font-medium text-gray-900 border-b border-gray-200 mb-2 mt-4">
                IKIGAI
              </div>
              <Link href={getPath("/about")} onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md ml-4">
                  <Info className="mr-2 h-4 w-4" />
                  {t('navigation:aboutUs')}
                </div>
              </Link>
              <Link href={getPath("/what-is-ikigai")} onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md ml-4">
                  <BookOpen className="mr-2 h-4 w-4" />
                  {t('navigation:whatIsIkigai')}
                </div>
              </Link>
              <Link href={getPath("/ikigai-personality-types")} onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md ml-4">
                  <Users className="mr-2 h-4 w-4" />
                  {t('navigation:personalityTypes')}
                </div>
              </Link>
              <Link href={getPath("/ikigai-test")} onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md ml-4">
                  <Target className="mr-2 h-4 w-4" />
                  {t('navigation:ikigaiTest')}
                </div>
              </Link>
              
              <Link href={getPath("/blog")} onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                  <BookOpen className="mr-2 h-4 w-4" />
                  {t('navigation:blog')}
                </div>
              </Link>
              <Link href={getPath("/shop")} onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {t('navigation:shop')}
                </div>
              </Link>
              <Link href={getPath("/positive-words")} onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                  <BookOpen className="mr-2 h-4 w-4" />
                  {t('navigation:positiveWords')}
                </div>
              </Link>

            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
