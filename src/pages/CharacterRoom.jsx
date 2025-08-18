import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const characters = [
    {
        id: 'luffy',
        name: 'Monkey D. Luffy',
        title: 'Captain',
        color: 'from-red-500 to-orange-500',
        emoji: '🏴‍☠️',
        description: 'Future Pirate King!'
    },
    {
        id: 'zoro',
        name: 'Roronoa Zoro',
        title: 'Swordsman',
        color: 'from-green-500 to-emerald-500',
        emoji: '⚔️',
        description: 'Three Sword Style'
    },
    {
        id: 'nami',
        name: 'Nami',
        title: 'Navigator',
        color: 'from-orange-400 to-yellow-400',
        emoji: '🗺️',
        description: 'Cat Burglar'
    },
    {
        id: 'usopp',
        name: 'Usopp',
        title: 'Sniper',
        color: 'from-yellow-500 to-orange-400',
        emoji: '🎯',
        description: 'Brave Warrior'
    },
    {
        id: 'sanji',
        name: 'Sanji',
        title: 'Cook',
        color: 'from-blue-500 to-cyan-500',
        emoji: '👨‍🍳',
        description: 'Black Leg'
    },
    {
        id: 'chopper',
        name: 'Tony Tony Chopper',
        title: 'Doctor',
        color: 'from-pink-400 to-rose-400',
        emoji: '🦌',
        description: 'Emergency Food'
    },
    {
        id: 'robin',
        name: 'Nico Robin',
        title: 'Archaeologist',
        color: 'from-purple-500 to-indigo-500',
        emoji: '📚',
        description: 'Devil Child'
    },
    {
        id: 'franky',
        name: 'Franky',
        title: 'Shipwright',
        color: 'from-cyan-500 to-blue-500',
        emoji: '🔧',
        description: 'Cyborg'
    },
    {
        id: 'brook',
        name: 'Brook',
        title: 'Musician',
        color: 'from-gray-600 to-gray-800',
        emoji: '🎭',
        description: 'Soul King'
    }
];

export default function CharacterSelection() {
    const navigate = useNavigate();
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [chatRoomName, setChatRoomName] = useState('');
    const [step, setStep] = useState(1);

    const handleCharacterSelect = (character) => {
        setSelectedCharacter(character);
        setStep(2);
    };

    const handleSubmit = () => {
        if (selectedCharacter && chatRoomName.trim()) {
            console.log('Character Selected:', selectedCharacter);
            console.log('Chat Room Name:', chatRoomName);
            navigate('/chat-room');
            // Navigate to chat room
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-200 relative overflow-hidden">
            {/* Wood texture background */}
            <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full" style={{
                    backgroundImage: `repeating-linear-gradient(
            90deg,
            #8B4513 0px,
            #A0522D 10px,
            #8B4513 20px
          )`
                }}></div>
            </div>

            {/* Floating pirate elements */}
            <div className="absolute top-10 left-10 text-4xl animate-bounce">⚓</div>
            <div className="absolute top-20 right-20 text-3xl animate-pulse">🏴‍☠️</div>
            <div className="absolute bottom-32 left-16 text-3xl animate-bounce delay-1000">💀</div>
            <div className="absolute bottom-20 right-16 text-2xl animate-pulse delay-500">⚔️</div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        🏴‍☠️ Choose Your Nakama! 🏴‍☠️
                    </h1>
                    <p className="text-xl text-gray-700">
                        {step === 1 ? "Select your character to sail the Grand Line!" : "Set your chat room name!"}
                    </p>
                </motion.div>

                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
                    >
                        {characters.map((character, index) => (
                            <motion.div
                                key={character.id}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05, y: -10 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleCharacterSelect(character)}
                                className="cursor-pointer"
                            >
                                <div className={`bg-gradient-to-br ${character.color} p-6 rounded-xl shadow-2xl border-4 border-orange-200/50 hover:border-orange-400/70 transition-all duration-300 transform hover:shadow-orange-300/20`}>
                                    <div className="text-center">
                                        <div className="text-6xl mb-4">{character.emoji}</div>
                                        <h3 className="text-2xl font-bold text-white mb-2">{character.name}</h3>
                                        <p className="text-white/80 text-lg font-semibold mb-2">{character.title}</p>
                                        <p className="text-white/70">{character.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {step === 2 && selectedCharacter && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="bg-orange-50/80 backdrop-blur-lg rounded-2xl p-8 border-2 border-orange-300 shadow-2xl">
                            <div className="text-center mb-8">
                                <div className={`inline-block bg-gradient-to-br ${selectedCharacter.color} p-6 rounded-xl mb-4 shadow-lg`}>
                                    <div className="text-6xl">{selectedCharacter.emoji}</div>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    Welcome aboard, {selectedCharacter.name}!
                                </h2>
                                <p className="text-gray-700">Now set your chat room identity</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-gray-800 font-semibold mb-3 text-lg">
                                        🏴‍☠️ Your Pirate Name
                                    </label>
                                    <input
                                        type="text"
                                        value={chatRoomName}
                                        onChange={(e) => setChatRoomName(e.target.value)}
                                        placeholder="Enter your pirate name for the chat..."
                                        className="w-full px-4 py-4 rounded-xl border-2 border-orange-300 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 text-lg transition-all bg-white"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setStep(1)}
                                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200"
                                    >
                                        ← Change Character
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSubmit}
                                        disabled={!chatRoomName.trim()}
                                        className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${chatRoomName.trim()
                                            ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg'
                                            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                            }`}
                                    >
                                        🏴‍☠️ Set Sail!
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Water effect at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-orange-300/30 to-transparent"></div>
        </div>
    );
}
