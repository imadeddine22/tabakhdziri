'use client';

import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

/**
 * DarkModeDemo Component
 * 
 * This component demonstrates all the dark mode features and styling patterns.
 * Use this as a reference for implementing dark mode in other components.
 */
export default function DarkModeDemo() {
    const { theme, toggleTheme, isDark } = useTheme();
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-white transition-colors duration-300 py-12 px-4">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900">
                        🌓 Dark Mode Demo
                    </h1>
                    <p className="text-lg text-gray-600">
                        Current Theme: <span className="font-semibold text-[var(--primary-orange)]">{theme}</span>
                    </p>
                    <button
                        onClick={toggleTheme}
                        className="px-6 py-3 bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-hover)] text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
                    >
                        Toggle Theme
                    </button>
                </div>

                {/* Typography Section */}
                <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Typography Examples
                    </h2>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold text-gray-900">Heading 1</h1>
                        <h2 className="text-2xl font-bold text-gray-800">Heading 2</h2>
                        <h3 className="text-xl font-semibold text-gray-700">Heading 3</h3>
                        <p className="text-gray-700">
                            This is body text. It should be easily readable in both light and dark modes.
                        </p>
                        <p className="text-sm text-gray-500">
                            This is muted text, typically used for secondary information.
                        </p>
                    </div>
                </section>

                {/* Buttons Section */}
                <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Button Styles
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        <button className="px-6 py-3 bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-hover)] text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium">
                            Primary Button
                        </button>
                        <button className="px-6 py-3 bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-green-hover)] text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium">
                            Secondary Button
                        </button>
                        <button className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300 font-medium border border-gray-300">
                            Ghost Button
                        </button>
                        <button className="px-6 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 font-medium">
                            Danger Button
                        </button>
                    </div>
                </section>

                {/* Cards Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Card Examples
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary-orange)] to-[var(--primary-orange-hover)] rounded-lg mb-4 flex items-center justify-center text-2xl">
                                    {i === 1 ? '🎨' : i === 2 ? '🚀' : '⚡'}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Card {i}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    This is a card component with proper dark mode styling.
                                </p>
                                <button className="text-[var(--primary-orange)] hover:text-[var(--primary-orange-hover)] font-medium transition-colors">
                                    Learn More →
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Form Elements */}
                <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Form Elements
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Input Field
                            </label>
                            <input
                                type="text"
                                placeholder="Enter text..."
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[var(--primary-orange)] focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Textarea
                            </label>
                            <textarea
                                rows={3}
                                placeholder="Enter description..."
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[var(--primary-orange)] focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 text-[var(--primary-orange)] bg-white border-gray-300 rounded focus:ring-[var(--primary-orange)]"
                                />
                                <span className="text-gray-700">
                                    I agree to the terms and conditions
                                </span>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Badges and Tags */}
                <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Badges & Tags
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        <span className="px-3 py-1 bg-[var(--primary-orange)] text-white rounded-full text-sm font-medium">
                            Featured
                        </span>
                        <span className="px-3 py-1 bg-[var(--primary-green)] text-white rounded-full text-sm font-medium">
                            New
                        </span>
                        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                            Popular
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                            Info
                        </span>
                        <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                            Alert
                        </span>
                    </div>
                </section>

                {/* Alerts */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Alert Messages
                    </h2>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800">
                            ✅ Success! Your changes have been saved.
                        </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-800">
                            ℹ️ Information: Please review the updated terms.
                        </p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800">
                            ⚠️ Warning: This action cannot be undone.
                        </p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800">
                            ❌ Error: Something went wrong. Please try again.
                        </p>
                    </div>
                </section>

                {/* Color Palette Reference */}
                <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Color Palette
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <div className="w-full h-20 bg-[var(--primary-orange)] rounded-lg"></div>
                            <p className="text-sm text-gray-600">Primary Orange</p>
                        </div>
                        <div className="space-y-2">
                            <div className="w-full h-20 bg-[var(--primary-green)] rounded-lg"></div>
                            <p className="text-sm text-gray-600">Primary Green</p>
                        </div>
                        <div className="space-y-2">
                            <div className="w-full h-20 bg-white border border-gray-300 rounded-lg"></div>
                            <p className="text-sm text-gray-600">Background</p>
                        </div>
                        <div className="space-y-2">
                            <div className="w-full h-20 bg-gray-200 rounded-lg"></div>
                            <p className="text-sm text-gray-600">Card Background</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
