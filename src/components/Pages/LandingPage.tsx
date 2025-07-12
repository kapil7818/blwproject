import React from 'react';
import { Link } from 'react-router-dom';
import { Train, Users, Star, ArrowRight, CheckCircle, Zap, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const sports = [
  { 
    name: 'Golf', 
    icon: '🏌️', 
    description: 'Professional golf course with 18 holes', 
    members: '500+' 
  },
  { name: 'Swimming', icon: '🏊', description: 'Olympic-size swimming pool with coaching', members: '300+' },
  { name: 'Tennis', icon: '🎾', description: 'Multiple courts with professional training', members: '400+' },
  { name: 'Football', icon: '⚽', description: 'Full-size field with youth programs', members: '250+' },
  { name: 'Basketball', icon: '🏀', description: 'Indoor and outdoor courts available', members: '200+' },
  { name: 'Cricket', icon: '🏏', description: 'Professional cricket ground and nets', members: '350+' },
];

const features = [
  'World-class railway sports facilities',
  'Professional coaching for railway employees',
  'Special discounted membership rates',
  'Family-friendly railway community',
  'Regular tournaments and railway events',
  'Modern clubhouse with railway heritage'
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-100 via-blue-50 to-gray-100 text-gray-800 py-12 sm:py-16 lg:py-20 overflow-hidden">
        {/* Railway Track Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 48px,
              #64748b 48px,
              #64748b 52px
            ), repeating-linear-gradient(
              0deg,
              transparent,
              transparent 8px,
              #64748b 8px,
              #64748b 12px
            )`
          }}></div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-slate-100/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <Train className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full animate-pulse flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              BLW Sports Club
            </span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-2 max-w-3xl mx-auto px-4 text-blue-700">
            Premier Railway Sports Community
          </p>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 max-w-3xl mx-auto text-gray-600 px-4">
            Join the exclusive sports community for railway employees and their families. Experience world-class facilities, 
            professional coaching, and special railway employee benefits at BLW Sports Club.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            {!user ? (
              <>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center border border-blue-500"
                >
                  Join Railway Sports Club
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-blue-400 text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-blue-50 transition-all duration-300"
                >
                  Railway Member Login
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center border border-blue-500"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Railway Heritage Banner */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-6 text-white">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Railway Heritage Since 1950</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/30"></div>
            <div className="flex items-center space-x-2">
              <Train className="w-5 h-5" />
              <span className="text-sm font-medium">Exclusive Railway Community</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex justify-center mb-4">
              <Train className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Railway Sports Facilities</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Discover our comprehensive range of sports facilities designed exclusively for railway employees and their families
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {sports.map((sport, index) => (
              <div key={sport.name} className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 hover:border-blue-600">
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
                <div className="text-4xl sm:text-6xl mb-4">{sport.icon}</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{sport.name}</h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">{sport.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-semibold text-sm sm:text-base flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {sport.members} Members
                  </span>
                  {user && (
                    <Link
                      to={`/apply/${sport.name.toLowerCase()}`}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 text-xs sm:text-sm font-medium"
                    >
                      Apply Now
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-blue-50 text-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="flex items-center mb-4">
                <Train className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Why Choose BLW Sports Club?</h2>
              </div>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
                We provide an unmatched sporting experience with state-of-the-art facilities, 
                expert coaching, and exclusive benefits for the railway community.
              </p>
              <div className="space-y-3 sm:space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium text-sm sm:text-base">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 grid grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 sm:p-6 rounded-2xl shadow-lg text-center">
                <Train className="w-8 h-8 sm:w-12 sm:h-12 text-white mx-auto mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">75+</h3>
                <p className="text-blue-100 text-sm sm:text-base">Years of Railway Heritage</p>
              </div>
              <div className="bg-gradient-to-br from-slate-500 to-slate-600 p-4 sm:p-6 rounded-2xl shadow-lg text-center">
                <Users className="w-8 h-8 sm:w-12 sm:h-12 text-white mx-auto mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">2000+</h3>
                <p className="text-slate-100 text-sm sm:text-base">Railway Families</p>
              </div>
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-4 sm:p-6 rounded-2xl shadow-lg text-center">
                <Star className="w-8 h-8 sm:w-12 sm:h-12 text-white mx-auto mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">4.9</h3>
                <p className="text-orange-100 text-sm sm:text-base">Member Rating</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 sm:p-6 rounded-2xl shadow-lg text-center">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-green-600 font-bold text-sm sm:text-base">50+</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Sports</h3>
                <p className="text-green-100 text-sm sm:text-base">Championships Won</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-500 to-blue-600 text-white relative overflow-hidden">
        {/* Railway Track Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 48px,
              #fff 48px,
              #fff 52px
            )`
          }}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Train className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Ready to Join the Railway Sports Family?</h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90 px-4">
            Take the first step towards achieving your sporting dreams with exclusive railway employee benefits. 
            Join thousands of satisfied railway families who have made BLW Sports Club their sporting home.
          </p>
          {!user && (
            <Link
              to="/register"
              className="bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:shadow-lg transition-all duration-300 inline-flex items-center border-2 border-white"
            >
              Join Railway Sports Club Today!
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}