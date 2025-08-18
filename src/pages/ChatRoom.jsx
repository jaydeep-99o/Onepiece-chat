import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from "socket.io-client";
const socket = io("http://localhost:3001");


const ChatRoom = () => {
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [message, setMessage] = useState('');
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [newFriendCode, setNewFriendCode] = useState('');
    const [messages, setMessages] = useState({});
    const messagesEndRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState(null);




    // Listen for incoming messages from the server
    useEffect(() => {
        socket.on("receive_message", (data) => {
            if (data.friendId === selectedFriend?.id) {
                setMessages((prev) => ({
                    ...prev,
                    [data.friendId]: [...(prev[data.friendId] || []), data.message]
                }));
            }
        });

        return () => socket.off("receive_message");
    }, [selectedFriend]);


    const sendMessage = () => {
        if (message.trim() && selectedFriend) {
            const newMessage = {
                id: Date.now(),
                sender: 'me',
                text: message,
                time: new Date().toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                })
            };

            setMessages(prev => ({
                ...prev,
                [selectedFriend.id]: [...(prev[selectedFriend.id] || []), newMessage]
            }));

            socket.emit('send_message', {
                friendId: selectedFriend.id,
                message: newMessage
            });

            setMessage('');
        }
    };

    const sendFriendRequest = () => {
        if (newFriendCode.trim()) {
            console.log('Sending friend request to:', newFriendCode);
            setNewFriendCode('');
            setShowAddFriend(false);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, selectedFriend]);

    return (
        <div className="h-screen bg-gradient-to-br from-amber-100 to-orange-200 flex">
            {/* Left Sidebar - Friends List */}
            <div className="w-80 bg-gradient-to-b from-orange-100/90 to-orange-200/90 backdrop-blur-lg border-r border-orange-300/50 shadow-lg">
                {/* Header */}
                <div className="p-6 border-b border-orange-300/50">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">🏴‍☠️ Crew</h2>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowAddFriend(true)}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors shadow-lg"
                        >
                            ➕
                        </motion.button>
                    </div>
                    <div className="text-sm text-gray-700">
                        {friends.filter(f => f.status === 'online').length} nakama online
                    </div>
                </div>

                {/* Friends List */}
                <div className="flex-1 overflow-y-auto">
                    {friends.map((friend) => (
                        <motion.div
                            key={friend.id}
                            whileHover={{ x: 5 }}
                            onClick={() => setSelectedFriend(friend)}
                            className={`p-4 cursor-pointer border-b border-orange-200/50 transition-all ${selectedFriend?.id === friend.id
                                ? 'bg-red-500/20 border-l-4 border-l-red-600'
                                : 'hover:bg-orange-300/20'
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${friend.status === 'online'
                                        ? 'bg-green-500'
                                        : friend.status === 'away'
                                            ? 'bg-yellow-500'
                                            : 'bg-gray-500'
                                        }`}>
                                        {friend.emoji}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-orange-200 ${friend.status === 'online'
                                        ? 'bg-green-400'
                                        : friend.status === 'away'
                                            ? 'bg-yellow-400'
                                            : 'bg-gray-400'
                                        }`}></div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-gray-900 font-semibold text-sm">{friend.name}</h3>
                                        {friend.unreadCount > 0 && (
                                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                                {friend.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-xs">{friend.lastSeen}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedFriend ? (
                    <>
                        {/* Chat Header */}
                        <div className="bg-orange-100/50 backdrop-blur-lg p-4 border-b border-orange-300/50">
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${selectedFriend.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                                    }`}>
                                    {selectedFriend.emoji}
                                </div>
                                <div>
                                    <h3 className="text-gray-900 font-bold">{selectedFriend.name}</h3>
                                    <p className="text-gray-600 text-sm">
                                        {selectedFriend.status === 'online' ? '🟢 Online' : `Last seen ${selectedFriend.lastSeen}`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {(messages[selectedFriend.id] || []).map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'me'
                                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                                        : 'bg-white/80 backdrop-blur-lg text-gray-900 border border-orange-200 shadow-sm'
                                        }`}>
                                        <p className="text-sm">{msg.text}</p>
                                        <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-red-100' : 'text-gray-600'
                                            }`}>
                                            {msg.time}
                                        </p>
                                        <input
                                            type="text"
                                            value={message}
                                            onChange={(e) => {
                                                setMessage(e.target.value);
                                                socket.emit('typing', {
                                                    to: selectedFriend.id,
                                                    from: 'You', // or use user's name
                                                });
                                            }}
                                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 bg-orange-100/50 backdrop-blur-lg border-t border-orange-300/50">
                            <div className="flex space-x-3">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="Type your message, nakama..."
                                    className="flex-1 px-4 py-3 rounded-xl bg-white border-2 border-orange-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={sendMessage}
                                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
                                >
                                    🏴‍☠️ Send
                                </motion.button>
                            </div>
                        </div>
                    </>
                ) : (
                    /* No Chat Selected */
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-8xl mb-4">🏴‍☠️</div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Welcome to the Grand Line!
                            </h2>
                            <p className="text-gray-700 text-lg">
                                Select a nakama to start your adventure
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Friend Modal */}
            <AnimatePresence>
                {showAddFriend && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                        onClick={() => setShowAddFriend(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gradient-to-br from-orange-200 to-orange-300 p-8 rounded-2xl border-2 border-orange-400/50 max-w-md w-full mx-4 shadow-2xl"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                                🏴‍☠️ Add New Crew Member
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-800 font-semibold mb-2">
                                        Pirate Code
                                    </label>
                                    <input
                                        type="text"
                                        value={newFriendCode}
                                        onChange={(e) => setNewFriendCode(e.target.value)}
                                        placeholder="Enter their pirate code..."
                                        className="w-full px-4 py-3 rounded-xl bg-white border-2 border-orange-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                    />
                                </div>

                                <div className="flex space-x-3">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowAddFriend(false)}
                                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-bold transition-colors"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={sendFriendRequest}
                                        className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg"
                                    >
                                        Send Request
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating pirate elements */}
            <div className="fixed top-10 right-10 text-2xl animate-bounce opacity-20">⚓</div>
            <div className="fixed bottom-20 left-10 text-xl animate-pulse opacity-20">💀</div>
        </div>
    );
};

export default ChatRoom;