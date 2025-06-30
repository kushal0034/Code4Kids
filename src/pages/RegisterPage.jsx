import React, { useState } from 'react';
import { Sparkles, User, Mail, Lock, UserCheck } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const Link = ({ to, children, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({
      ...prev,
      role: role
    }));
  };

  const handleSubmit = () => {
    // Handle registration logic here
    console.log('Registration attempt:', formData);
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (!formData.role) {
      alert('Please select a role!');
      return;
    }
  };

  const roles = [
    { value: 'student', label: 'Student', icon: '🧙‍♂️', description: 'Young wizard ready to learn' },
    { value: 'teacher', label: 'Teacher', icon: '🧙‍♀️', description: 'Guide young minds in magic' },
    { value: 'parent', label: 'Parent', icon: '👨‍👩‍👧‍👦', description: 'Support your child\'s journey' }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #581c87 0%, #1e3a8a 50%, #312e81 100%)'
    }}>
      {/* Fixed Background Layer */}
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 -z-10"></div>
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 right-20 w-16 h-16 bg-pink-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-green-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 right-1/3 w-8 h-8 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-10 w-6 h-6 bg-purple-400 rounded-full animate-bounce"></div>
        <div className="absolute top-20 right-1/4 w-10 h-10 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/2 right-10 w-14 h-14 bg-emerald-400 rounded-full animate-pulse"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-6 py-12">
        <div className={`w-full max-w-lg transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Logo Section */}
          <div className="text-center mb-12">
            <Link to="/" className="inline-flex items-center space-x-3 mb-8 group">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <span className="text-4xl font-bold text-white">Code4Kids</span>
            </Link>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              Begin Your Magical Journey!
            </h1>
            <p className="text-blue-100 text-lg">
              Create your wizard account and start coding adventures
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 shadow-2xl relative">
            <div className="space-y-6">
              
              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-white font-medium text-sm">
                  Wizard Name (Username)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-blue-200" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                    placeholder="Choose your wizard name"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-white font-medium text-sm">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-blue-200" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-white font-medium text-sm">
                  Create Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-200" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                    placeholder="Create your password"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-white font-medium text-sm">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserCheck className="h-5 w-5 text-blue-200" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>

              {/* Role Selection Cards */}
              <div className="space-y-4">
                <label className="block text-white font-medium text-sm text-center">
                  Choose Your Magical Role ✨
                </label>
                <div className="grid gap-3">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => handleRoleSelect(role.value)}
                      className={`relative group p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 border-2 ${
                        formData.role === role.value
                          ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-emerald-400 shadow-lg shadow-emerald-500/25'
                          : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`text-4xl transform transition-transform duration-300 ${
                          formData.role === role.value ? 'scale-110' : 'group-hover:scale-110'
                        }`}>
                          {role.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <div className={`font-bold text-lg ${
                            formData.role === role.value ? 'text-emerald-300' : 'text-white'
                          }`}>
                            {role.label}
                          </div>
                          <div className={`text-sm ${
                            formData.role === role.value ? 'text-emerald-200' : 'text-blue-200'
                          }`}>
                            {role.description}
                          </div>
                        </div>
                        {formData.role === role.value && (
                          <div className="absolute top-2 right-2">
                            <div className="w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center">
                              <UserCheck className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Magical sparkle effect for selected role */}
                      {formData.role === role.value && (
                        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                          <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                          <div className="absolute top-3 right-4 w-1 h-1 bg-pink-300 rounded-full animate-pulse"></div>
                          <div className="absolute bottom-2 left-6 w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full py-4 px-6 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-lg rounded-2xl hover:scale-105 transform transition-all duration-300 shadow-2xl flex items-center justify-center space-x-2 group"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Join the Magic Realm</span>
              </button>
            </div>
          </div>

          {/* Login Link Section */}
          <div className="mt-16 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <p className="text-blue-100 mb-4">
                Already have a magical account?
              </p>
              <Link 
                to="/login" 
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl hover:scale-105 transform transition-all duration-300 shadow-lg"
              >
                <UserCheck className="w-4 h-4" />
                <span>Login Here</span>
              </Link>
              <p className="text-blue-200 text-sm mt-3">
                Continue your coding adventure where you left off!
              </p>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="text-center mt-6">
            <Link to="/" className="text-blue-200 hover:text-white transition-colors text-sm flex items-center justify-center space-x-1">
              <span>←</span>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;