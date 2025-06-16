import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

const SigninPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    
    // Handle successful login
    console.log('Login successful:', formData);
  };

  const inputClasses = "w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-16 left-16 w-28 h-28 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-20 w-20 h-20 bg-gradient-to-br from-pink-400 to-red-500 rounded-full animate-bounce"></div>
        <div className="absolute bottom-1/3 left-20 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-ping"></div>
        <div className="absolute bottom-16 right-16 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full animate-pulse"></div>
        
        {/* Floating Code Symbols */}
        <div className="absolute top-1/4 left-1/4 text-white/10 text-6xl font-mono animate-float">{'{'}</div>
        <div className="absolute top-1/3 right-1/3 text-white/10 text-4xl font-mono animate-float" style={{animationDelay: '1s'}}>{'</>'}</div>
        <div className="absolute bottom-1/2 left-1/3 text-white/10 text-5xl font-mono animate-float" style={{animationDelay: '2s'}}>{'[]'}</div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <a href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Code4Kids</span>
        </a>
        
        <div className="text-white/80">
          New to Code4Kids? 
          <a href="/register" className="text-purple-300 hover:text-white ml-2 font-semibold transition-colors duration-300">
            Sign Up
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-8">
        <div className="w-full max-w-md">
          {/* Welcome Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                <span className="text-3xl">🚀</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-3">
                Welcome Back!
              </h1>
              <p className="text-purple-200 text-lg">
                Ready to continue your coding adventure?
              </p>
            </div>

            {/* Login Form */}
            <div className="space-y-6">
              {/* Email Input */}
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-white/60" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`${inputClasses} pl-11 ${errors.email ? 'border-red-400' : ''}`}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-300 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-white/60" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`${inputClasses} pl-11 pr-11 ${errors.password ? 'border-red-400' : ''}`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-300 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                      formData.rememberMe 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500' 
                        : 'border-white/40 bg-white/10'
                    }`}>
                      {formData.rememberMe && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-white/90 text-sm">Remember me</span>
                </label>
                
                <a href="/forgot-password" className="text-purple-300 hover:text-white text-sm font-medium transition-colors duration-300">
                  Forgot Password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl hover:scale-105 transform transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Continue Adventure</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-transparent px-4 text-white/70">or continue with</span>
                </div>
              </div>
            </div>

            {/* Social Login */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 transform">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              
              <button className="flex items-center justify-center px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 transform">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-white/70">
                Don't have an account yet?{' '}
                <a href="/register" className="text-purple-300 hover:text-white font-semibold transition-colors duration-300">
                  Join the adventure!
                </a>
              </p>
            </div>
          </div>

          {/* Fun Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-yellow-400">10K+</div>
              <div className="text-white/70 text-sm">Young Coders</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-green-400">9</div>
              <div className="text-white/70 text-sm">Epic Levels</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-purple-400">3</div>
              <div className="text-white/70 text-sm">Magic Worlds</div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SigninPage;