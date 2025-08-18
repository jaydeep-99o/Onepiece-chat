import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from '../firebase/config'; // Adjust the path as necessary

export default function OnePieceLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevents form reload (optional but good practice)

        setIsLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Login successful:", userCredential.user);

            alert("🏴‍☠️ Welcome back, Captain!");
            navigate("/character-room");
        } catch (error) {
            console.error("Login failed:", error);

            // Better error handling
            let errorMessage = "Login failed: ";
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage += "No pirate found with this email. Join the crew first!";
                    break;
                case 'auth/wrong-password':
                    errorMessage += "Wrong secret code! Try again, mate.";
                    break;
                case 'auth/invalid-email':
                    errorMessage += "Invalid email format.";
                    break;
                case 'auth/too-many-requests':
                    errorMessage += "Too many failed attempts. Try again later.";
                    break;
                default:
                    errorMessage += error.message;
            }
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            provider.addScope('email');
            provider.addScope('profile');

            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user exists in Firestore
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                // If user doesn't exist, create their profile
                const nameParts = user.displayName?.split(' ') || ['', ''];
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';

                await setDoc(userDocRef, {
                    firstName: firstName,
                    lastName: lastName,
                    email: user.email,
                    photoURL: user.photoURL,
                    createdAt: new Date(),
                    authProvider: 'google'
                });

                alert("🏴‍☠️ Welcome to the crew, Captain " + firstName + "!");
            } else {
                alert("🏴‍☠️ Welcome back, Captain!");
            }

            navigate("/character-room");

        } catch (error) {
            console.error("Google sign-in error:", error);

            // Handle specific error cases
            let errorMessage = "Google sign-in failed: ";
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    errorMessage = "Sign-in was cancelled.";
                    break;
                case 'auth/popup-blocked':
                    errorMessage = "Popup was blocked. Please allow popups for this site.";
                    break;
                case 'auth/account-exists-with-different-credential':
                    errorMessage = "An account already exists with this email using a different sign-in method.";
                    break;
                default:
                    errorMessage += error.message;
            }
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Login Form */}
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 px-8">
                <div className="w-full max-w-md">
                    {/* Straw Hat Logo */}
                    <div className="mb-8 flex justify-center">
                        <img
                            src="../../src/assets/logo.png"
                            alt="Straw Hat Pirates Logo"
                            className="w-40 h-20 object-contain"
                        />
                    </div>

                    {/* Welcome Text */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Oi, nakama! Let's have a word</h1>
                        <p className="text-gray-600">Enter your crew credentials</p>
                    </div>

                    {/* Login Form */}
                    <div className="space-y-6">
                        {/* Google Sign In Button - Move to top */}
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center px-4 py-3 border-2 border-orange-300 rounded-lg bg-white text-gray-700 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 mr-3 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                            ) : (
                                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            )}
                            {isLoading ? 'Setting sail...' : 'Set sail with Google'}
                        </button>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gradient-to-br from-orange-50 to-red-50 text-gray-500">
                                    Or continue with email
                                </span>
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Pirate Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                placeholder="Enter your pirate email"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Secret Code
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                placeholder="Enter your secret code"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                    disabled={isLoading}
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                    Remember for 30 days
                                </label>
                            </div>
                            <a href="#" className="text-sm text-red-600 hover:text-red-500 font-medium">
                                Forgot your treasure map?
                            </a>
                        </div>

                        {/* Email Login Button */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 rounded-lg font-bold text-lg hover:from-red-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Setting sail...
                                </div>
                            ) : (
                                '🏴‍☠️ Join the Crew!'
                            )}
                        </button>
                    </div>

                    {/* Registration Link */}
                    <div className="mt-6 text-center">
                        <span className="text-sm text-gray-600">New to the crew? </span>
                        <Link to="/registration" className="text-sm text-red-600 hover:text-red-500 font-medium">
                            Join the adventure!
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right side - Wanted Posters Wall */}
            <div className="flex-1 bg-gradient-to-br from-amber-100 to-orange-200 relative overflow-hidden p-8">
                {/* Wood texture background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full" style={{
                        backgroundImage: `repeating-linear-gradient(
              90deg,
              #8B4513 0px,
              #A0522D 10px,
              #8B4513 20px
            )`
                    }}></div>
                </div>

                {/* Wanted Posters Grid */}
                <div className="relative z-10 h-full">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        🏴‍☠️ MOST WANTED PIRATES 🏴‍☠️
                    </h2>

                    {/* Use your actual wanted posters image */}
                    <div className="flex justify-center items-center h-full">
                        <img
                            src="../../src/assets/WelcomePage.jpg"
                            alt="One Piece Wanted Posters"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        />
                    </div>

                    {/* Login Status Message */}
                    <div className="absolute bottom-8 left-8 right-8 text-center">
                        <div className="bg-red-600 bg-opacity-90 text-white p-4 rounded-lg shadow-xl">
                            <h3 className="font-bold text-lg mb-2">⚓ CREW STATUS</h3>
                            <p className="text-sm">
                                "Welcome back, nakama! Ready for another grand adventure? The seas are calling!"
                            </p>
                            <p className="text-xs mt-2 opacity-90">- Captain Monkey D. Luffy</p>
                        </div>
                    </div>
                </div>

                {/* Floating elements for atmosphere */}
                <div className="absolute top-10 left-10 text-2xl animate-bounce">⚓</div>
                <div className="absolute top-20 right-20 text-xl animate-pulse">💀</div>
                <div className="absolute bottom-32 left-16 text-2xl animate-bounce delay-1000">🗡️</div>
                <div className="absolute bottom-20 right-16 text-xl animate-pulse delay-500">💰</div>
                <div className="absolute top-1/2 left-20 text-lg animate-bounce delay-700">🏴‍☠️</div>
                <div className="absolute top-1/3 right-12 text-lg animate-pulse delay-300">⚔️</div>
                <div className="absolute top-1/4 left-1/3 text-lg animate-bounce delay-200">🌟</div>
                <div className="absolute bottom-1/3 right-1/4 text-lg animate-pulse delay-800">🦜</div>

                {/* Additional floating elements */}
                <div className="absolute top-16 left-1/2 text-sm animate-pulse delay-400">🏴‍☠️</div>
                <div className="absolute bottom-16 left-1/4 text-sm animate-bounce delay-600">⭐</div>

                {/* Torn paper effect at edges */}
                <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-transparent to-amber-100 opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-transparent to-orange-200 opacity-30"></div>
            </div>
        </div>
    );
}