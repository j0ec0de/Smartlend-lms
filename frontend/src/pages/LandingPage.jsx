import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { ArrowRight, CheckCircle2, Star, ChevronDown, ShieldCheck, Zap, BarChart3, Globe, Users, FileText } from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-2">
                            <div className="bg-indigo-600 rounded-lg p-1.5">
                                <Zap className="text-white w-6 h-6 fill-current" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-slate-900">SmartLend</span>
                        </div>
                        <div className="hidden md:flex space-x-8">
                            <a href="#features" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Features</a>
                            <a href="#solutions" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Solutions</a>
                            <a href="#testimonials" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Reviews</a>
                            <a href="#faq" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">FAQ</a>
                        </div>
                        <div className="flex items-center gap-4">
                            {user ? (
                                <Link to="/dashboard">
                                    <Button className="font-semibold shadow-lg shadow-indigo-500/20">Go to Dashboard</Button>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors hidden sm:block">Log in</Link>
                                    <Link to="/register">
                                        <Button className="rounded-full px-6 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5">
                                            Get Started
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white" />
                <div className="absolute top-20 right-0 w-96 h-96 bg-purple-200/50 rounded-full blur-3xl -z-10 mix-blend-multiply animate-blob" />
                <div className="absolute top-40 left-0 w-96 h-96 bg-blue-200/50 rounded-full blur-3xl -z-10 mix-blend-multiply animate-blob animation-delay-2000" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        New: Instant Approval Engine 2.0
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                        We manage the loan <br className="hidden md:block" />
                        process from <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">start to finish</span>
                    </h1>

                    <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Experience the future of lending with our AI-powered platform. Fast approvals, competitive rates, and seamless document handling.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
                        <Link to="/register">
                            <Button className="h-14 px-8 text-lg rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20">
                                Start Your Application
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="secondary" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-gray-50">
                                Check Status
                            </Button>
                        </Link>
                    </div>

                    {/* Mockup Container */}
                    <div className="relative mx-auto max-w-5xl mt-12">
                        <div className="relative z-10 bg-white rounded-3xl shadow-2xl border border-gray-100 p-2 md:p-4 overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                                alt="Dashboard Mockup"
                                className="rounded-2xl w-full h-auto object-cover opacity-90"
                                style={{ maxHeight: '600px', objectPosition: 'top' }}
                            />

                            {/* Floating UI Cards */}
                            <div className="absolute top-10 left-10 md:top-20 md:left-20 bg-white p-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 md:animate-bounce-slow hidden md:block">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Loan Status</p>
                                        <p className="text-sm font-bold text-gray-900">Approved</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 bg-white p-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 md:animate-bounce-slow animation-delay-1500 hidden md:block">
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-100 p-2 rounded-full">
                                        <BarChart3 className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Interest Rate</p>
                                        <p className="text-sm font-bold text-gray-900">8.5% Fixed</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Background blur behind image */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] blur-2xl opacity-20 -z-10"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Empowering your financial journey</h2>
                        <p className="text-lg text-slate-600">Everything you need to secure funding without the hassle.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: ShieldCheck, title: "Secure & Private", desc: "Bank-grade encryption keeps your data safe and compliant." },
                            { icon: Zap, title: "Instant Decisions", desc: "Our AI engine analyzes diverse data points for real-time approvals." },
                            { icon: Users, title: "Human Support", desc: "Expert loan officers ready to help when you need a personal touch." },
                        ].map((feature, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Workflow Section */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <h2 className="text-4xl font-bold text-slate-900 mb-6">Streamline loan applications with easy workflow</h2>
                            <p className="text-lg text-slate-600 mb-8">
                                No more paperwork mountains. Our digital-first process gets you funded fast.
                            </p>

                            <ul className="space-y-6">
                                {[
                                    "Create an account in 30 seconds",
                                    "Upload documents securely via dashboard",
                                    "Real-time status tracking & updates",
                                    "Direct bank disbursement upon approval"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                            <CheckCircle2 size={14} className="text-green-600" />
                                        </div>
                                        <span className="text-slate-700 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button className="mt-10 bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8">
                                See How It Works
                            </Button>
                        </div>

                        <div className="order-1 lg:order-2 relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-3xl transform rotate-3 scale-95 -z-10"></div>
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
                                {/* Mimic a form flow */}
                                <div className="space-y-4">
                                    <div className="h-4 bg-gray-100 rounded w-1/3 mb-6"></div>
                                    <div className="flex gap-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                            <div className="h-10 bg-gray-50 border border-gray-200 rounded-lg"></div>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                            <div className="h-10 bg-gray-50 border border-gray-200 rounded-lg"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                                        <div className="h-24 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                                            <FileText className="w-8 h-8 opacity-50" />
                                        </div>
                                    </div>
                                    <div className="h-12 bg-indigo-600 rounded-lg w-full mt-4"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-24 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
                        <p className="text-indigo-200 text-lg">Trusted by thousands of borrowers nationwide.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: "Alex Johnson", role: "Small Business Owner", quote: "SmartLend saved my business during a crunch. The funds were in my account in 24 hours!" },
                            { name: "Sarah Williams", role: "Freelancer", quote: "The process was incredibly transparent. I knew exactly what my rates were upfront. No hidden fees." },
                            { name: "Michael Chen", role: "Homeowner", quote: "Refinancing my home was a breeze with their document upload system. Highly recommended!" },
                        ].map((t, i) => (
                            <div key={i} className="bg-slate-800 p-8 rounded-2xl border border-slate-700 relative">
                                <div className="text-indigo-400 mb-6">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={16} className="inline fill-current" />)}
                                </div>
                                <p className="text-lg text-slate-300 italic mb-6">"{t.quote}"</p>
                                <div>
                                    <p className="font-bold text-white">{t.name}</p>
                                    <p className="text-sm text-slate-500">{t.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-24 bg-slate-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">Frequently Asked Questions</h2>

                    <div className="space-y-4">
                        {[
                            { q: "How long does the approval process take?", a: "Typically, our AI engine provides a decision within minutes. Funds are disbursed within 24 hours of final approval." },
                            { q: "What documents do I need to apply?", a: "You'll generally need proof of identity, proof of income (pay stubs or tax returns), and bank statements." },
                            { q: "Is my personal data secure?", a: "Absolutely. We use bank-level 256-bit encryption to protect your data and never share it without your consent." },
                        ].map((item, i) => (
                            <details key={i} className="group bg-white rounded-xl shadow-sm border border-gray-200">
                                <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-slate-900 list-none">
                                    <span>{item.q}</span>
                                    <ChevronDown className="transition-transform group-open:rotate-180 text-slate-400" />
                                </summary>
                                <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                                    {item.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-indigo-600 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
                        {/* Abstract shapes */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">Unlock Your Financial Potential Today</h2>
                        <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">
                            Join thousands of satisfied users who have taken control of their financial future with SmartLend.
                        </p>
                        <Link to="/register" className="relative z-10">
                            <button className="bg-white text-indigo-600 font-bold py-4 px-10 rounded-full text-lg shadow-xl hover:bg-indigo-50 transition-colors">
                                Get Started Now
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 border-t border-gray-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 rounded-lg p-1">
                            <Zap className="text-white w-5 h-5 fill-current" />
                        </div>
                        <span className="font-bold text-lg text-slate-900">SmartLend</span>
                    </div>
                    <div className="text-slate-500 text-sm">
                        &copy; 2024 SmartLend Inc. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <Globe className="text-slate-400 hover:text-slate-600 cursor-pointer" size={20} />
                        {/* Social icons would go here */}
                    </div>
                </div>
            </footer>
        </div>
    );
}
