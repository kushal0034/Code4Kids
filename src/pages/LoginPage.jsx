import React, { useState } from 'react';
import { Sparkles, Mail, Lock, LogIn, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success');

  React.useEffect(() => {
    setIsVisible(true);
    // Clear any existing session
    sessionStorage.clear();
  }, []);

  const showMessage = (message, type = 'success') => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      showMessage('Please fill in all fields!', 'error');
      return;
    }

    setLoading(true);

    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Store user data in sessionStorage
        sessionStorage.setItem('user', JSON.stringify({
          uid: user.uid,
          email: user.email,
          username: userData.username,
          role: userData.role
        }));

        showMessage('Login successful! Redirecting...', 'success');
        
        // Navigate based on role
        setTimeout(() => {
          switch(userData.role) {
            case 'student':
              navigate('/student-dashboard');
              break;
            case 'teacher':
              navigate('/teacher-dashboard');
              break;
            case 'parent':
              navigate('/parent-dashboard');
              break;
            default:
              navigate('/');
          }
        }, 1500);
      } else {
        showMessage('User data not found!', 'error');
        await auth.signOut();
      }
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific Firebase errors
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email!';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password!';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address!';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled!';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }
      
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

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
      </div>

      {/* Popup Notification */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className={`pointer-events-auto transform transition-all duration-500 ${
            showPopup ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-10 opacity-0 scale-95'
          }`}>
            <div className={`px-8 py-6 rounded-2xl shadow-2xl flex items-center space-x-4 ${
              popupType === 'success' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                : 'bg-gradient-to-r from-red-500 to-pink-600'
            }`}>
              {popupType === 'success' ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : (
                <XCircle className="w-8 h-8 text-white" />
              )}
              <p className="text-white font-bold text-lg">{popupMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-6 py-12">
        <div className={`w-full max-w-md transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Logo Section */}
          <div className="text-center mb-12">
            <button onClick={() => navigate('/')} className="inline-flex items-center space-x-3 mb-8 group">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <span className="text-4xl font-bold text-white">Code4Kids</span>
            </button>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome Back, Young Wizard!
            </h1>
            <p className="text-blue-100 text-lg">
              Continue your magical coding adventure
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 shadow-2xl">
            <div className="space-y-6">
              
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
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-white font-medium text-sm">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-200" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-lg rounded-2xl transform transition-all duration-300 shadow-2xl flex items-center justify-center space-x-2 group ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <span>Enter the Magic Realm</span>
                  </>
                )}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center mt-6">
              <button 
                type="button"
                onClick={() => navigate('/forgot-password')} 
                className="text-blue-200 hover:text-white transition-colors text-sm"
              >
                Forgot your spell? Reset password
              </button>
            </div>
          </form>

          {/* Register Link Section */}
          <div className="mt-8 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <p className="text-blue-100 mb-4">
                New to Code4Kids?
              </p>
              <button 
                onClick={() => navigate('/register')}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl hover:scale-105 transform transition-all duration-300 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>Register Here</span>
              </button>
              <p className="text-blue-200 text-sm mt-3">
                Join thousands of young wizards on their coding journey!
              </p>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="text-center mt-6">
            <button onClick={() => navigate('/')} className="text-blue-200 hover:text-white transition-colors text-sm flex items-center justify-center space-x-1">
              <span>←</span>
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;