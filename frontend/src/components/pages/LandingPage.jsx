"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Book,
  BookOpen,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  Users,
  Sun,
  Moon,
  X,
  Loader2
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ErrorProvider } from "../../contexts/ErrorContext";
import { useDarkMode } from "@/contexts/DarkModeContext";

export default function LandingPage() {
  const { darkMode, setDarkMode } = useDarkMode();
  const [activeDemo, setActiveDemo] = useState(null);
  const [showFAQ, setShowFAQ] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const router = useRouter();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hello! How can I help you with Gradia?", isUser: false }
  ]);
  const [chatInputValue, setChatInputValue] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleChatInputChange = (e) => {
    setChatInputValue(e.target.value);
  };

  const scrollToChatBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToChatBottom();
    }
  }, [chatMessages, isChatOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const trimmedMessage = chatInputValue.trim();
    if (!trimmedMessage) return;
  
    const userMessage = { 
      id: chatMessages.length + 1, 
      text: trimmedMessage, 
      isUser: true 
    };
  
    setChatMessages(prev => [...prev, userMessage]);
    setChatInputValue('');
    setIsChatLoading(true);
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedMessage,
          chatHistory: [...chatMessages, userMessage]
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) throw new Error(data.error || 'Unknown error');
  
      const chatBotResponse = {
        id: chatMessages.length + 2,
        text: data.message,
        isUser: false
      };
  
      setChatMessages(prev => [...prev, chatBotResponse]);
  
    } catch (error) {
      console.error('Error sending message:', error);
      setChatMessages(prev => [
        ...prev,
        {
          id: chatMessages.length + 2,
          text: 'Sorry, something went wrong. Please try again later.',
          isUser: false
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };
  
  const ThinkingDots = () => {
    return (
      <span className="inline-flex items-center italic">
        Thinking
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >.</motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, repeat: Infinity, repeatType: "reverse" }}
        >.</motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4, repeat: Infinity, repeatType: "reverse" }}
        >.</motion.span>
      </span>
    );
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const scaleOnHover = {
    rest: { scale: 1, transition: { duration: 0.2 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  const CTApulse = {
    initial: { boxShadow: "0 0 0 0 rgba(213, 108, 78, 0.7)" },
    animate: {
      boxShadow: "0 0 0 20px rgba(213, 108, 78, 0)",
      transition: {
        repeat: Infinity,
        duration: 2,
      },
    },
  };

  const howItWorks = [
    {
      title: "Create your class",
      description: "Set up virtual classrooms in seconds with our intuitive interface",
      icon: <Users className="w-12 h-12" />,
    },
    {
      title: "Design assessments",
      description: "Create tests, quizzes, and assignments with AI-powered tools",
      icon: <Book className="w-12 h-12" />,
    },
    {
      title: "Track progress",
      description: "Get real-time insights on student performance and learning gaps",
      icon: <CheckCircle className="w-12 h-12" />,
    },
  ];

  const demoCards = [
    {
      title: "Student Dashboard",
      description: "See how students navigate their personalized learning journey",
      image: "/student-dashboard.jpg",
    },
    {
      title: "Teacher Analytics",
      description: "Explore comprehensive insights into classroom performance",
      image: "/teacher-dashboard.jpg",
    },
    {
      title: "Test Creation",
      description: "Watch how easy it is to create engaging assessments",
      image: "/create-test.png",
    },
  ];

  const faqs = [
    {
      question: "How does the platform benefit students?",
      answer: "Our platform provides personalized feedback, progress tracking, and targeted practice to help students identify and address their learning gaps.",
    },
    {
      question: "Is it easy to set up for teachers?",
      answer: "Absolutely! Teachers can create classes and assessments in minutes with our intuitive interface and ready-to-use templates.",
    },
    {
      question: "How does the pricing work?",
      answer: "We offer flexible pricing plans for individual teachers, schools, and districts. Contact us for a customized quote.",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Show FAQ suggestions when typing in message field
    if (name === "message" && value.length > 3) {
      setShowFAQ(true);
    } else {
      setShowFAQ(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    // Reset form after submission
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <ErrorProvider>
      <div className={`min-h-screen ${darkMode ? "bg-[#2d2c2a] text-[#fcf9ea] dark" : "bg-[#edead7] text-[#2d2c2a]"}`}>
        {/* Navbar */}
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-opacity-70  border-[#e2c3ae] px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <span style={{ fontFamily: "'Rage Italic', sans-serif" }} className="px-4 text-4xl font-bold text-[#d56c4e]">Gradia</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center space-x-6"
          >
            <a href="#features" className="hover:text-[#d56c4e] transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[#d56c4e] transition-colors">
              How It Works
            </a>
            <a href="#demo" className="hover:text-[#d56c4e] transition-colors">
              Demo
            </a>
            <a href="#contact" className="hover:text-[#d56c4e] transition-colors">
              Contact
            </a>
            <motion.button
              onClick={toggleDarkMode}
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className={`p-2 rounded-full ${
                darkMode 
                  ? "bg-[#3f3f3f] text-[#fcf9ea]"
                  : "bg-[#fcf9ea] text-[#2d2c2a]" 
              }`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => {router.push('/signin')}}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-2 font-medium ${darkMode ? "text-white" : "text-[#2d2c2a"}`}
            >
              Sign In
            </motion.button>
            <motion.button
              type='button'
              onClick={() => {router.push('/signup')}}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-full bg-[#d56c4e] text-white font-medium"
            >
              Sign Up
            </motion.button>
          </motion.div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-6 md:px-12 lg:px-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeIn} className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-[clamp(3rem,5vw,3.5rem)] font-bold leading-tight"
              >
                Transform how you
                <span className="block text-[#d56c4e]">teach and learn</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg md:text-xl"
              >
                Streamline assessments, grading, track progress, and provide personalized feedback for every student with our innovative educational platform.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <button
                  onClick={() => router.push('/signup')}
                  className="px-8 py-3 rounded-full bg-[#d56c4e] text-white font-medium flex items-center justify-center space-x-2 hover:scale-105 transform transition-transform duration-200"
                >
                  <span>Try Now</span>
                  <ArrowRight size={18} />
                </button>
              </motion.div>
            </motion.div>

            {/* Hero image/animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative backdrop-blur-sm bg-[#fcf9ea]/20 border border-[#e2c3ae]/50 rounded-2xl p-6 shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-[#d56c4e] flex items-center justify-center text-white font-bold text-xl">A+</div>
                <Image
                  src="/teacher-dashboard.jpg"
                  width={"800"}
                  height={"800"}
                  alt="Platform Dashboard"
                  className="rounded-lg shadow-md"
                />
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">Detailed Dashboards</h3>
                    <p className="text-sm opacity-75">Track progress in real-time</p>
                  </div>
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="w-10 h-10 rounded-full bg-[#d56c4e] flex items-center justify-center text-white"
                  >
                    <CheckCircle size={20} />
                  </motion.div>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  x: [0, 10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: "easeInOut",
                }}
                className="absolute -top-12 right-16 bg-[#fcf9ea] p-3 rounded-lg shadow-lg"
              >
                <Clock className="w-8 h-8 text-[#d56c4e]" />
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 15, 0],
                  x: [0, -5, 0],
                  rotate: [0, -3, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -bottom-8 left-12 bg-[#fcf9ea] p-3 rounded-lg shadow-lg"
              >
                <Book className="w-8 h-8 text-[#d56c4e]" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10 opacity-30 blur-3xl bg-gradient-to-br from-[#d56c4e]/30 via-[#e2c3ae]/20 to-transparent rounded-full"></div>
        </section>


        {/* Features Section (What It Does & How It Helps) */}
        <section id="features" className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-transparent to-[#fcf9ea]/10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <motion.div 
              variants={fadeIn} 
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 relative inline-block">
                Transforming <span className="text-[#d56c4e]">Education</span>
                <motion.div 
                  className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-[#d56c4e]/20 via-[#d56c4e] to-[#d56c4e]/20 w-full" 
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                />
              </h2>
              <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                An intelligent ecosystem where teachers thrive and students flourish, 
                reimagining how we teach, learn, and grow together.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-16 relative">
              {/* Connecting line between cards */}
              <motion.div 
                className="hidden md:block absolute top-1/2 left-1/2 h-px w-16 bg-[#e2c3ae]/50 -translate-x-1/2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              />

              {/* For Teachers */}
              <motion.div
                variants={fadeIn}
                className={`group backdrop-blur-lg ${
                  darkMode
                    ? "bg-gradient-to-br from-[#63615c]/30 to-[#63615c]/10 hover:shadow-[0px_10px_40px_rgba(255,255,255,0.2)]"
                    : "bg-gradient-to-br from-[#fcf9ea]/30 to-[#fcf9ea]/10 hover:shadow-[0px_10px_40px_rgba(0,0,0,0.2)]"
                } border border-[#e2c3ae]/50 rounded-3xl p-8 shadow-lg transition-all duration-500 relative overflow-hidden`}
              >
                {/* Background pattern */}
                <div className="absolute -right-24 -bottom-24 w-64 h-64 rounded-full bg-[#d56c4e]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <motion.div 
                  className="bg-gradient-to-br from-[#d56c4e]/20 to-[#d56c4e]/10 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Users className="w-10 h-10 text-[#d36b4e]" />
                </motion.div>
                
                <h3 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
                  <span>For Educators</span>
                  <motion.div 
                    className="ml-3 w-6 h-6 rounded-full bg-[#d56c4e]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                  >
                    <ArrowRight className="w-3 h-3 text-[#d56c4e]" />
                  </motion.div>
                </h3>
                
                <ul className="space-y-6">
                  {[
                    { 
                      title: "AI-Powered Creation", 
                      description: "Design tests and assignments in minutes with intelligent assistance tailored to your curriculum" 
                    },
                    { 
                      title: "Insightful Analytics", 
                      description: "Visualize individual and class performance with dynamic dashboards that reveal learning patterns" 
                    },
                    { 
                      title: "Gap Analysis", 
                      description: "Automatically identify knowledge gaps and receive personalized intervention strategies" 
                    },
                    { 
                      title: "Time Reclaimed", 
                      description: "Reduce grading workload by 70% with smart assessment tools that provide deeper feedback" 
                    }
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ x: -10, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + (index * 0.1) }}
                      whileHover={{ x: 5 }} 
                      className="flex items-start group/item"
                    >
                      <div className="mr-4 mt-1 flex-shrink-0">
                        <motion.div 
                          className="w-6 h-6 rounded-full border border-[#d56c4e]/30 flex items-center justify-center group-hover/item:bg-[#d56c4e]/10 transition-colors duration-300"
                          whileHover={{ scale: 1.2 }}
                        >
                          <CheckCircle className="w-4 h-4 text-[#d56c4e]" />
                        </motion.div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-1">{item.title}</h4>
                        <p className="text-sm opacity-80 leading-relaxed">{item.description}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-8 px-6 py-2 bg-gradient-to-r from-[#d56c4e]/80 to-[#d56c4e] text-white rounded-full text-sm font-medium"
                >
                  Discover Educator Tools
                </motion.button>
              </motion.div>

        {/* For Students */}
        <motion.div
          variants={fadeIn}
          className={`group backdrop-blur-lg ${
            darkMode
              ? "bg-gradient-to-br from-[#63615c]/30 to-[#63615c]/10 hover:shadow-[0px_10px_40px_rgba(255,255,255,0.2)]"
              : "bg-gradient-to-br from-[#fcf9ea]/30 to-[#fcf9ea]/10 hover:shadow-[0px_10px_40px_rgba(0,0,0,0.2)]"
          } border border-[#e2c3ae]/50 rounded-3xl p-8 shadow-lg transition-all duration-500 relative overflow-hidden`}
        >
            {/* Background pattern */}
            <div className="absolute -right-24 -bottom-24 w-64 h-64 rounded-full bg-[#d56c4e]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Main content */}          
            <motion.div 
              className="bg-gradient-to-br from-[#d56c4e]/30 to-[#d56c4e]/20 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300"
              whileHover={{ rotate: [0, 5, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <BookOpen className="w-10 h-10 text-[#d56c4e]" />
            </motion.div>
            
            <h3 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
              <span>For Learners</span>
              <motion.div 
                className="ml-3 w-6 h-6 rounded-full bg-[#d56c4e]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <ArrowRight className="w-3 h-3 text-[#d56c4e]" />
              </motion.div>
            </h3>
            
            <ul className="space-y-6">
              {[
                { 
                  title: "Tailored Guidance", 
                  description: "Receive personalized feedback highlighting exactly where to focus and how to improve your understanding" 
                },
                { 
                  title: "Progress Visualization", 
                  description: "Watch your growth unfold through interactive timelines and achievement milestones" 
                },
                { 
                  title: "Adaptive Resources", 
                  description: "Access a curated library of learning materials that automatically adjust to your unique needs" 
                },
                { 
                  title: "Seamless Organization", 
                  description: "Navigate your learning journey with intuitive scheduling and smart deadline management" 
                }
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ x: -10, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                  whileHover={{ x: 5 }} 
                  className="flex items-start group/item"
                >
                  <div className="mr-4 mt-1 flex-shrink-0">
                    <motion.div 
                      className="w-6 h-6 rounded-full border border-[#d56c4e]/50 flex items-center justify-center group-hover/item:bg-[#d56c4e]/10 transition-colors duration-300"
                      whileHover={{ scale: 1.2 }}
                    >
                      <CheckCircle className="w-4 h-4 text-[#d56c4e]" />
                    </motion.div>
                  </div>
                  <div>
                  <h4 className="font-semibold text-lg mb-1">{item.title}</h4>
                  <p className="text-sm opacity-80 leading-relaxed">{item.description}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 px-6 py-2 bg-gradient-to-r from-[#d56c4e]/80 to-[#d56c4e] text-white rounded-full text-sm font-medium"
            >
              Start Your Journey
            </motion.button>
        </motion.div>
      </div>
      
      {/* Bottom decorative element */}
      <motion.div 
        className="mt-16 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d56c4e]/40 to-transparent rounded-full" />
      </motion.div>
    </motion.div>
  </section>

        {/* How It Works Section */}
        <section 
          id="how-it-works" 
          className={`py-20 px-6 md:px-12 lg:px-24 ${
            darkMode 
              ? "bg-[#2a2a2a]/30" 
              : "bg-[#e2c3ae]/30"
          }`}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? "text-white" : ""}`}>
                How It <span className={darkMode ? "text-[#ff8f6e]" : "text-[#d56c4e]"}>Works</span>
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${darkMode ? "text-gray-300" : ""}`}>
                Get started in minutes with our intuitive, user-friendly platform.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  whileHover={{ y: -10 }}
                  className={`relative backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center text-center ${
                    darkMode
                      ? "bg-[#3a3a3a]/60 border border-[#4a4a4a] shadow-xl text-gray-200"
                      : "bg-[#fcf9ea]/40 border border-[#e2c3ae] shadow-lg"
                  }`}
                >
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    className={`mb-6 ${darkMode ? "text-[#ff8f6e]" : "text-[#d56c4e]"}`}
                  >
                    {step.icon}
                  </motion.div>
                  <div className={`absolute -top-4 -left-4 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    darkMode ? "bg-[#ff8f6e]" : "bg-[#d56c4e]"
                  }`}>
                    {index + 1}
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : ""}`}>{step.title}</h3>
                  <p className={darkMode ? "text-gray-300" : ""}>{step.description}</p>
                  
                  {/* Connection line */}
                  {index < howItWorks.length - 1 && (
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className={`hidden md:block absolute top-1/2 left-full h-1 -z-10 ${
                        darkMode ? "bg-[#ff8f6e]/40" : "bg-[#d56c4e]/30"
                      }`}
                      style={{ width: '50%', transformOrigin: 'left' }}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            
            <motion.div
              variants={fadeIn}
              className="mt-16 flex justify-center"
            >
              <motion.button
                onClick={() => {router.push('/signup')}}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 rounded-full ${darkMode ? "bg-[#ff8f6e]" : "bg-[#d56c4e]"} text-white font-medium flex items-center space-x-2`}
              >
                <span>Get Started</span>
                <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          </motion.div>
        </section>

        {/* Demo Section */}
        <section id="demo" className={`py-20 px-6 md:px-12 lg:px-24 ${darkMode ? "bg-[#403f3c]" : ""}`}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? "text-white" : ""}`}>
                See it in <span className={darkMode ? "text-[#ff8f6e]" : "text-[#d56c4e]"}>Action</span>
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${darkMode ? "text-gray-300" : ""}`}>
                Hover over the cards below to see how our platform transforms the educational experience.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {demoCards.map((demo, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  initial="rest"
                  whileHover="hover"
                  className="overflow-hidden rounded-xl shadow-lg cursor-pointer relative"
                  onHoverStart={() => setActiveDemo(index)}
                  onHoverEnd={() => setActiveDemo(null)}
                >
                  <motion.div
                    variants={{
                      rest: { scale: 1 },
                      hover: { scale: 1.025 },
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={demo.image}
                      alt={demo.title}
                      width={500}
                      height={500}
                      className="w-full h-64 object-cover"
                    />
                  </motion.div>
                  
                  {/* Overlay */}
                  <motion.div
                    variants={{
                      rest: { opacity: 0.7, y: "100%" },
                      hover: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#2d2c2a] to-transparent p-6"
                  >
                    <h3 className="text-xl font-bold text-white mb-2">{demo.title}</h3>
                    <p className="text-white/80">{demo.description}</p>
                    
                    <a
                      href="https://youtu.be/4ia0UlskKhs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <motion.button
                        variants={{
                          rest: { opacity: 0, y: 10 },
                          hover: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className={`mt-4 px-4 py-2 rounded-full ${darkMode ? "bg-[#d56c4e]" : "bg-[#d56c4e]"} text-white text-sm font-medium flex items-center space-x-1`}
                      >
                        <span>Watch Demo</span>
                        <ArrowRight size={14} />
                      </motion.button>
                    </a>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section id="contact" className={`py-20 px-6 md:px-12 lg:px-24 ${
          darkMode 
            ? "bg-[#2c2c2a]" 
            : "bg-[#e2c3ae]/30"
        }`}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? "text-white" : ""}`}>
                Get in <span className={darkMode ? "text-[#ff8f6e]" : "text-[#d56c4e]"}>Touch</span>
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${darkMode ? "text-gray-300" : ""}`}>
                Have questions or ready to transform your teaching experience? We're here to help.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
              <motion.div variants={fadeIn} className="space-y-8">
                <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : ""}`}>Contact Us</h3>
                <p className={darkMode ? "text-gray-300" : ""}>
                  Our team is ready to answer your questions and help you discover how our platform can address your specific needs.
                </p>
                
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full ${darkMode ? "bg-[#ff8f6e]/20" : "bg-[#d56c4e]/10"} flex items-center justify-center ${darkMode ? "text-[#ff8f6e]" : "text-[#d56c4e]"}`}>
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className={`font-bold ${darkMode ? "text-white" : ""}`}>Email Us</h4>
                    <p className={darkMode ? "text-gray-300" : ""}>support@gradia.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full ${darkMode ? "bg-[#ff8f6e]/20" : "bg-[#d56c4e]/10"} flex items-center justify-center ${darkMode ? "text-[#ff8f6e]" : "text-[#d56c4e]"}`}>
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h4 className={`font-bold ${darkMode ? "text-white" : ""}`}>Live Chat</h4>
                    <p className={darkMode ? "text-gray-300" : ""}>Available Monday - Friday, 9am - 5pm</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeIn}>
                <form 
                  onSubmit={handleSubmit} 
                  className={`backdrop-blur-sm transition-all duration-500 ${
                    darkMode 
                      ? "bg-[#3a3631]/40 border border-[#4a4a4a] hover:shadow-[0px_10px_40px_rgba(255,255,255,0.2)]" 
                      : "bg-[#fcf9ea]/20 border border-[#e2c3ae]/50 hover:shadow-[0px_10px_40px_rgba(0,0,0,0.2)]"
                  } rounded-2xl p-8 shadow-lg`}
                >
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className={`block mb-2 font-medium ${darkMode ? "text-white" : ""}`}>
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full p-3 rounded-lg placeholder:text-white-900 ${
                          darkMode 
                            ? "border border-[#4a4a4a] bg-[#2a2a2a]/70 text-white focus:ring-[#ff8f6e]" 
                            : "border border-[#e2c3ae] bg-[#fcf9ea]/50 focus:ring-[#d56c4e]"
                        } focus:outline-none focus:ring-2`}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className={`block mb-2 font-medium ${darkMode ? "text-white" : ""}`}>
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full p-3 rounded-lg placeholder:text-white-900 ${
                          darkMode 
                            ? "border border-[#4a4a4a] bg-[#2a2a2a]/70 text-white focus:ring-[#ff8f6e]" 
                            : "border border-[#e2c3ae] bg-[#fcf9ea]/50 focus:ring-[#d56c4e]"
                        } focus:outline-none focus:ring-2`}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    
                    <div className="relative">
                      <label htmlFor="message" className={`block mb-2 font-medium ${darkMode ? "text-white" : ""}`}>
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="4"
                        className={`w-full p-3 rounded-lg placeholder:text-white-900 ${
                          darkMode 
                            ? "border border-[#4a4a4a] bg-[#2a2a2a]/70 text-white focus:ring-[#ff8f6e]" 
                            : "border border-[#e2c3ae] bg-[#fcf9ea]/50 focus:ring-[#d56c4e]"
                        } focus:outline-none focus:ring-2`}
                        placeholder="How can we help you?"
                        required
                      ></textarea>
                      
                      {/* FAQ Suggestions */}
                      <AnimatePresence>
                        {showFAQ && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className={`absolute z-10 left-0 right-0 mt-2 ${
                              darkMode 
                                ? "bg-[#2a2a2a] border border-[#4a4a4a]" 
                                : "bg-[#fcf9ea] border border-[#e2c3ae]"
                            } rounded-lg shadow-lg overflow-hidden`}
                          >
                            <div className={`p-3 border-b ${darkMode ? "border-[#4a4a4a]" : "border-[#e2c3ae]"}`}>
                              <h4 className={`font-bold text-sm ${darkMode ? "text-white" : ""}`}>Suggested FAQs:</h4>
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                              {faqs.map((faq, index) => (
                                <motion.div
                                  key={index}
                                  whileHover={{ backgroundColor: darkMode ? "rgba(255, 143, 110, 0.15)" : "rgba(213, 108, 78, 0.1)" }}
                                  className={`p-3 cursor-pointer border-b ${
                                    darkMode ? "border-[#4a4a4a] text-gray-200" : "border-[#e2c3ae]"
                                  } last:border-0`}
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      message: faq.question,
                                    });
                                    setShowFAQ(false);
                                  }}
                                >
                                  <p className="font-medium text-sm">{faq.question}</p>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`w-full py-3 rounded-lg ${
                        darkMode ? "bg-[#ff8f6e] hover:bg-[#ff7a5c]" : "bg-[#d56c4e] hover:bg-[#c85b3f]"
                      } text-white font-medium`}
                      type="submit"
                    >
                      Send Message
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className={`py-12 px-6 md:px-12 lg:px-24 ${
          darkMode 
            ? "bg-[#1d1c1a] border-t border-[#3a3a38]" 
            : "bg-[#2d2c2a] border-t border-[#d6c7b3]"
          } ${darkMode ? "text-gray-300" : "text-gray-200"}`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="col-span-1">
                <h3 style={{ fontFamily: "'Rage Italic', sans-serif" }} className="text-4xl font-bold text-[#d56c4e] mb-4">Gradia</h3>
                <p className="mb-6 opacity-80">
                  Transforming education with smart assessment tools.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-[#d56c4e]/20 flex items-center justify-center hover:bg-[#d56c4e]/40 transition-colors">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-[#d56c4e]/20 flex items-center justify-center hover:bg-[#d56c4e]/40 transition-colors">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-[#d56c4e]/20 flex items-center justify-center hover:bg-[#d56c4e]/40 transition-colors">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                  </a>
                </div>
              </div>
              
              <div className="col-span-1">
                <h4 className="text-lg font-bold mb-4">Product</h4>
                <ul className="space-y-2 opacity-80">
                  <li><a href="#" className="hover:text-[#d56c4e] transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-[#d56c4e] transition-colors">For Teachers</a></li>
                  <li><a href="#" className="hover:text-[#d56c4e] transition-colors">For Students</a></li>
                  <li><a href="#" className="hover:text-[#d56c4e] transition-colors">Pricing</a></li>
                </ul>
              </div>
              
              <div className="col-span-1">
                <h4 className="text-lg font-bold mb-4">Company</h4>
                <ul className="space-y-2 opacity-80">
                  <li><a href="#" className="hover:text-[#d56c4e] transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-[#d56c4e] transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-[#d56c4e] transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-[#d56c4e] transition-colors">Contact</a></li>
                </ul>
              </div>
              
              <div className="col-span-1">
                <h4 className="text-lg font-bold mb-4">Legal</h4>
                <ul className="space-y-2 opacity-80">
                  <li><a href="#" className="hover:text-[#d56c4e] transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-[#d56c4e] transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-[#d56c4e] transition-colors">Cookie Policy</a></li>
                  <li><a href="#" className="hover:text-[#d56c4e] transition-colors">GDPR</a></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-[#fcf9ea]/20 text-center opacity-60 text-sm">
              <p>&copy; {new Date().getFullYear()} Gradia. All rights reserved.</p>
            </div>
          </div>
        </footer>
        
        {/* Floating Chat Button */}
        <motion.div
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleChat}
          className="w-14 h-14 rounded-full bg-[#d56c4e] text-white shadow-lg flex items-center justify-center"
        >
          <MessageSquare size={28} />
        </motion.button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence mode="wait">
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`fixed bottom-24 right-6 w-80 sm:w-96 h-96 rounded-lg shadow-xl overflow-hidden flex flex-col z-40 ${
              darkMode ? 'bg-[#2d2c2a]' : 'bg-white'
            }`}
          >
            {/* Header */}
            <div className={'px-4 py-3 text-white flex justify-between items-center bg-[#d56c4e]'}>
              <div className="flex items-center">
                <h3 className="font-semibold text-lg">Gradia Support</h3>
              </div>
              <button 
                onClick={toggleChat} 
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Messages Container */}
            <div className={`flex-1 p-4 overflow-y-auto ${
              darkMode ? 'bg-[#2d2c2a]' : 'bg-[#edead7]'
            }`}>
              {chatMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`mb-4 flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-3/4 rounded-lg px-4 py-2 ${
                      message.isUser 
                        ? 'bg-[#d56c4e] text-white rounded-br-none' 
                        : darkMode 
                          ? 'bg-[#403f3c] text-gray-200 rounded-bl-none' 
                          : 'bg-[#e9decb] text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start mb-4">
                  <div className={`rounded-lg rounded-bl-none px-4 py-2 flex items-center ${
                    darkMode 
                      ? 'bg-[#41403d] text-gray-200' 
                      : 'bg-[#e9decb] text-gray-800'
                  }`}>
                    <ThinkingDots />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <form onSubmit={sendMessage} className={`border-t p-3 flex ${
              darkMode ? 'bg-[#2d2c2a]' : 'border-gray-200 bg-[#e8e4cd]'
            }`}>
              <input
                type="text"
                value={chatInputValue}
                onChange={handleChatInputChange}
                placeholder="Send a query..."
                className={`flex-1 border rounded-l-lg px-3 py-2 focus:outline-none ${
                  darkMode 
                    ? 'bg-[#41403d] border-gray-700 text-gray-200 placeholder-gray-500' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
              />
              <button
                type="submit"
                disabled={!chatInputValue.trim() || isChatLoading}
                className={`text-white px-4 rounded-r-lg flex items-center justify-center transition-all ${
                  !chatInputValue.trim() || isChatLoading 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-[#c25e42]'
                } ${
                  darkMode ? 'bg-[#d56c4e]' : 'bg-[#d56c4e]'
                }`}
                aria-label="Send message"
              >
                {isChatLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <ArrowRight size={18} />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </ErrorProvider>
  );
};