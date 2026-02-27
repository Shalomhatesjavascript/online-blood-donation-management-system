import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion, useScroll, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Droplet, Heart, Users, Clock, Shield, TrendingUp, Activity, Zap, Award } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  
  // Refs for GSAP animations
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  // Scroll progress
  const { scrollYProgress } = useScroll();
  const scaleProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // GSAP Animations
  useEffect(() => {
    // Stats Counter Animation
    const statNumbers = statsRef.current?.querySelectorAll('.stat-number');
    statNumbers?.forEach((stat) => {
      ScrollTrigger.create({
        trigger: stat,
        start: 'top 80%',
        onEnter: () => {
          const target = stat.getAttribute('data-target');
          gsap.to(stat, {
            innerText: target,
            duration: 2,
            snap: { innerText: 1 },
            ease: 'power2.out'
          });
        }
      });
    });

    // Parallax Effect on Scroll
    gsap.to(heroRef.current, {
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      y: 150,
      opacity: 0.5
    });

    // CTA Section - Reveal Animation
    if (ctaRef.current) {
      gsap.from(ctaRef.current.children, {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'back.out(1.7)'
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const features = [
    {
      icon: Clock,
      title: 'Real-Time Tracking',
      description: 'Monitor blood inventory levels and expiration dates in real-time',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Donor Network',
      description: 'Connect with eligible blood donors quickly and efficiently',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your data is protected with industry-standard security',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: TrendingUp,
      title: 'Smart Matching',
      description: 'Advanced algorithm to match donors with recipients',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { value: '10000', label: 'Registered Donors', suffix: '+', icon: Users },
    { value: '5000', label: 'Lives Saved', suffix: '+', icon: Heart },
    { value: '247', label: 'Available', suffix: '', icon: Clock },
    { value: '99', label: 'Success Rate', suffix: '%', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blood-red-light via-white to-medical-blue-light overflow-hidden relative">
      {/* Floating Background Elements */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blood-red/20 to-medical-blue/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          y: [0, 40, 0],
          x: [0, -30, 0],
          rotate: [0, -15, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-40 left-20 w-96 h-96 bg-gradient-to-br from-medical-blue/20 to-blood-red/20 rounded-full blur-3xl"
      />

      {/* Progress Bar */}
      <motion.div
        style={{ scaleX: scaleProgress }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blood-red via-medical-blue to-blood-red origin-left z-50"
      />

      {/* Hero Section */}
      <section ref={heroRef} className="container mx-auto px-4 py-20 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6 relative z-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 bg-blood-red-light px-6 py-3 rounded-full"
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Heart className="w-5 h-5 text-blood-red" />
                </motion.div>
                <span className="text-blood-red font-semibold text-sm">
                  Save Lives Today
                </span>
              </motion.div>
              
              <motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-5xl md:text-7xl font-bold leading-tight"
                >
                  <motion.span
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity
                    }}
                    style={{
                      backgroundSize: '200% auto'
                    }}
                    className="bg-gradient-to-r from-blood-red via-medical-blue to-blood-red bg-clip-text text-transparent"
                  >
                    Blood Donation
                  </motion.span>
                  <br />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-gray-900"
                  >
                    Made Simple
                  </motion.span>
                </motion.h1>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="text-xl text-gray-600"
              >
                Connect donors with recipients instantly. Manage blood inventory efficiently. 
                <motion.span
                  animate={{ color: ['#dc2626', '#3b82f6', '#dc2626'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="font-semibold"
                >
                  {' '}Save lives through technology.
                </motion.span>
              </motion.p>

              {!isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="flex flex-wrap gap-4 pt-4"
                >
                  <Link to="/register">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="primary" size="lg" className="flex items-center gap-2">
                        <Droplet className="w-5 h-5" />
                        Get Started
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/login">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="outline" size="lg">
                        Login
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <Link to={user?.role === 'donor' ? '/donor/dashboard' : user?.role === 'recipient' ? '/recipient/dashboard' : '/admin/dashboard'}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="primary" size="lg">
                        Go to Dashboard
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              )}
            </motion.div>

            {/* Right Content - Animated Blood Drop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
              className="relative"
            >
              <motion.div
                className="bg-gradient-to-br from-blood-red via-blood-red-dark to-blood-red-dark rounded-3xl p-12 shadow-2xl relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
              >
                {/* Blood drop icon */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Droplet className="w-full h-64 text-white opacity-20" />
                </motion.div>

                {/* Center content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotateY: [0, 360]
                      }}
                      transition={{
                        scale: { duration: 2, repeat: Infinity },
                        rotateY: { duration: 4, repeat: Infinity, ease: "linear" }
                      }}
                      className="text-8xl font-bold mb-4 drop-shadow-2xl"
                    >
                      A+
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-2xl font-semibold"
                    >
                      Universal Donor
                    </motion.div>
                  </div>
                </div>

                {/* Pulse rings */}
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                  className="absolute inset-0 border-4 border-white rounded-3xl"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.5
                  }}
                  className="absolute inset-0 border-4 border-white rounded-3xl"
                />
              </motion.div>

              {/* Floating orbs */}
              <motion.div
                animate={{
                  y: [0, -40, 0],
                  x: [0, 20, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-medical-blue to-medical-blue-dark rounded-full blur-xl opacity-60"
              />
              <motion.div
                animate={{
                  y: [0, 40, 0],
                  x: [0, -20, 0],
                  rotate: [360, 180, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-blood-red to-blood-red-dark rounded-full blur-xl opacity-60"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section with Counter */}
      <motion.section
        ref={statsRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-gray-900 to-gray-800 py-20 relative overflow-hidden"
      >
        {/* Animated background pattern */}
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="text-center"
              >
                <motion.div
                  animate={{
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blood-red to-medical-blue rounded-full flex items-center justify-center shadow-2xl"
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </motion.div>
                <div className="stat-number text-5xl font-bold text-white mb-2" data-target={stat.value}>
                  0{stat.suffix}
                </div>
                <div className="text-gray-300 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        className="container mx-auto px-4 py-20"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.h2 className="text-5xl font-bold text-gray-900 mb-4">
              Why Choose{' '}
              <motion.span
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity
                }}
                style={{
                  backgroundSize: '200% auto'
                }}
                className="bg-gradient-to-r from-blood-red via-medical-blue to-blood-red bg-clip-text text-transparent"
              >
                BloodBank
              </motion.span>
              ?
            </motion.h2>
            <p className="text-xl text-gray-600">
              Modern technology meets life-saving mission
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10, scale: 1.03 }}
              >
                <Card className="p-6 h-full hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
                  {/* Gradient background on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />

                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>

                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Interactive CTA Section */}
      <motion.section
        ref={ctaRef}
        className="bg-gradient-to-br from-blood-red via-blood-red-dark to-medical-blue py-24 relative overflow-hidden"
      >
        {/* Animated mesh gradient */}
        <motion.div
          animate={{
            rotate: [0, 360]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)'
          }}
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: 0
            }}
          />
        ))}

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.h2 className="text-5xl md:text-6xl font-bold text-white">
              Ready to Make a{' '}
              <motion.span
                animate={{
                  textShadow: [
                    '0 0 20px rgba(255,255,255,0.5)',
                    '0 0 40px rgba(255,255,255,0.8)',
                    '0 0 20px rgba(255,255,255,0.5)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                Difference
              </motion.span>
              ?
            </motion.h2>

            <motion.p className="text-2xl text-white/90">
              Join thousands of donors and recipients in our mission to save lives
            </motion.p>

            {!isAuthenticated && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/register">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white text-blood-red hover:bg-gray-100 shadow-2xl text-xl px-12 py-6"
                  >
                    <span className="flex items-center gap-3">
                      <Zap className="w-6 h-6" />
                      Register Now
                    </span>
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Animated Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gray-900 text-white py-16 relative overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <motion.div
            animate={{
              backgroundPosition: ['0px 0px', '100px 100px']
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.5) 35px, rgba(255,255,255,0.5) 70px)'
            }}
            className="w-full h-full"
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Droplet className="w-10 h-10 text-blood-red" />
            </motion.div>
            <span className="text-3xl font-bold">
              BloodBank
            </span>
          </motion.div>

          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity
            }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Activity className="w-5 h-5 text-blood-red" />
            <span className="text-gray-400">
              Saving lives through technology
            </span>
            <Activity className="w-5 h-5 text-blood-red" />
          </motion.div>

          <p className="text-gray-500">
            © 2026 BloodBank Management System. All rights reserved.
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;