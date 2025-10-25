"use client";

import type { NextPage } from "next";

const TestPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
                </svg>
                <span className="text-2xl font-bold text-green-600">Umay</span>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="#" className="text-gray-700 hover:text-green-600 font-medium">
                  Projects
                </a>
                <a href="#" className="text-gray-700 hover:text-green-600 font-medium">
                  About
                </a>
                <a href="#" className="text-gray-700 hover:text-green-600 font-medium">
                  Impact
                </a>
                <a href="#" className="text-gray-700 hover:text-green-600 font-medium">
                  Contact
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                Login
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Invest Now
              </button>
            </div>
          </div>
        </div>
      </header>
      <main>
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  🌱 Sustainable Agriculture
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
                  Invest in Kyrgyzstan's Agricultural Future
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Connect with profitable agricultural projects in the heart of Central Asia.
                  Support sustainable farming while earning attractive returns from Kyrgyzstan's
                  fertile valleys.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 shadow-lg">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 13h8V3h2v10h8l-9 9-9-9z" />
                    </svg>
                    Start Investing
                  </button>
                  <button className="inline-flex items-center px-6 py-3 border border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Watch Video
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-8 pt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">$2.5M+</div>
                    <div className="text-sm text-gray-600">Funded Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">15%</div>
                    <div className="text-sm text-gray-600">Avg. Returns</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">500+</div>
                    <div className="text-sm text-gray-600">Investors</div>
                  </div>
                </div>
              </div>
              <div className="mt-12 lg:mt-0">
                <img
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"
                  alt="Kyrgyzstan Agricultural Landscape"
                  className="w-full rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Why Invest in Kyrgyz Agriculture?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Kyrgyzstan offers unique advantages for agricultural investment with its pristine
                environment, low costs, and growing export markets.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-xl border border-green-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pristine Environment</h3>
                <p className="text-gray-600">
                  Clean air, pure water, and organic-ready soil in the heart of Central Asia
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-green-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Low Operating Costs</h3>
                <p className="text-gray-600">
                  Competitive land prices and labor costs with high-quality agricultural output
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-green-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Opportunities</h3>
                <p className="text-gray-600">
                  Growing demand in China, Russia, and Middle Eastern markets
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-green-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Government Support</h3>
                <p className="text-gray-600">
                  Favorable policies and incentives for agricultural development
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Featured Investment Projects
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Carefully selected agricultural projects offering attractive returns and positive
                impact
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80"
                  alt="Organic Apple Orchard"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-3">
                    Fruit Production
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Organic Apple Orchard Expansion
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Premium apple varieties for export to premium markets
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-sm text-gray-500">Target Return</div>
                      <div className="font-bold text-green-600">18% IRR</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Min. Investment</div>
                      <div className="font-bold text-gray-900">$5,000</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80"
                  alt="Greenhouse Vegetables"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-3">
                    Greenhouse
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    High-Tech Greenhouse Complex
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Year-round vegetable production with modern technology
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-sm text-gray-500">Target Return</div>
                      <div className="font-bold text-green-600">22% IRR</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Min. Investment</div>
                      <div className="font-bold text-gray-900">$10,000</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80"
                  alt="Wheat Fields"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full mb-3">
                    Grain Production
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Sustainable Wheat Farming
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Large-scale wheat production with sustainable practices
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-sm text-gray-500">Target Return</div>
                      <div className="font-bold text-green-600">14% IRR</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Min. Investment</div>
                      <div className="font-bold text-gray-900">$2,500</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-12">
              <button className="px-8 py-3 border border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-600 hover:text-white transition-colors">
                View All Projects
              </button>
            </div>
          </div>
        </section>
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Transparent Investment Process
                </h2>
                <p className="text-lg text-gray-600">
                  Our platform provides complete transparency and regular updates on your
                  agricultural investments in Kyrgyzstan.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <span className="text-green-600 font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Browse Projects</h3>
                      <p className="text-gray-600">
                        Explore vetted agricultural projects with detailed financial projections and
                        impact metrics
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Make Investment</h3>
                      <p className="text-gray-600">
                        Invest securely with flexible amounts starting from $1,000
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <span className="text-green-600 font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Track Progress</h3>
                      <p className="text-gray-600">
                        Receive regular updates, photos, and financial reports from your projects
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <span className="text-green-600 font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Earn Returns</h3>
                      <p className="text-gray-600">
                        Receive quarterly distributions and final returns upon project completion
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 lg:mt-0">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                  alt="Investment Dashboard"
                  className="w-full rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                What Our Investors Say
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join investors from around the world who are earning returns while supporting
                sustainable agriculture
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="James Mitchell"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">James Mitchell</div>
                    <div className="text-sm text-gray-500">London, UK</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "Excellent returns and I love supporting sustainable agriculture. The transparency
                  and regular updates give me complete confidence in my investments."
                </p>
                <div className="flex space-x-1">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Sarah Chen"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Sarah Chen</div>
                    <div className="text-sm text-gray-500">Singapore</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "Umay has exceeded my expectations. The 19% return on my apple orchard
                  investment was fantastic, and I'm reinvesting in more projects."
                </p>
                <div className="flex space-x-1">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src="https://randomuser.me/api/portraits/men/67.jpg"
                    alt="David Rodriguez"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">David Rodriguez</div>
                    <div className="text-sm text-gray-500">Madrid, Spain</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "Perfect diversification for my portfolio. Agricultural investments in Kyrgyzstan
                  offer stability and growth that traditional markets can't match."
                </p>
                <div className="flex space-x-1">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-12 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black opacity-10" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Investing?</h2>
                <p className="text-xl mb-8 opacity-90">
                  Join hundreds of investors earning attractive returns while supporting sustainable
                  agriculture in Kyrgyzstan
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                    Get Started Today
                  </button>
                  <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
                </svg>
                <span className="text-2xl font-bold">Umay</span>
              </div>
              <p className="text-gray-400">
                Connecting global investors with sustainable agricultural opportunities in
                Kyrgyzstan.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Browse Projects
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Risk Factors
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Team
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TestPage;
