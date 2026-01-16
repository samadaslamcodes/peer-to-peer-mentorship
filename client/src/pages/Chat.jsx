import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Send, User, Clock, ArrowLeft } from 'lucide-react';

const socket = io.connect("http://localhost:5000");

const Chat = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const room = searchParams.get('room');

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef();

    useEffect(() => {
        if (!room) {
            navigate('/dashboard');
            return;
        }

        fetchHistory();

        socket.emit("join_room", room);

        const messageHandler = (data) => {
            setMessageList((list) => [...list, data]);
        };

        socket.on("receive_message", messageHandler);

        return () => {
            socket.off("receive_message", messageHandler);
        };
    }, [room]);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("✅ Socket connected to server:", socket.id);
        });

        socket.on("disconnect", () => {
            console.log("❌ Socket disconnected from server");
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
        };
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messageList]);

    const fetchHistory = async () => {
        try {
            console.log('Fetching history for room:', room);
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/chat/history/${room}`, {
                headers: { 'x-auth-token': token }
            });

            console.log('History received:', res.data.length, 'messages');
            const history = res.data.map(m => ({
                room: m.room,
                author: m.senderName,
                message: m.message,
                time: m.time,
                senderId: m.sender
            }));

            setMessageList(history);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching chat history:', err);
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        try {
            if (currentMessage.trim() === "") return;
            if (!user) {
                console.error('No user found in localStorage');
                return;
            }

            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const messageData = {
                room: room,
                author: user.name,
                senderId: user.id || user._id,
                message: currentMessage,
                time: timeStr,
            };

            console.log('Attempting to emit send_message:', messageData);

            if (!socket.connected) {
                console.warn('Socket is not connected! Attempting to reconnect...');
                socket.connect();
            }

            socket.emit("send_message", messageData);
            console.log('Message emitted successfully');

            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        } catch (err) {
            console.error('Error in sendMessage:', err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-6 px-4 pb-10">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition"
            >
                <ArrowLeft className="w-5 h-5" />
                Back
            </button>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col h-[75vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 text-white flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold">Live Mentorship Chat</h3>
                            <p className="text-xs text-primary-100 opacity-80">Room ID: {room}</p>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-grow p-6 overflow-y-auto bg-slate-50 space-y-4 custom-scrollbar">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                    ) : messageList.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-slate-400 text-sm">No messages yet. Send a message to start the conversation!</p>
                        </div>
                    ) : (
                        messageList.map((msg, index) => {
                            const isMe = user && (msg.senderId === user.id || msg.author === user.name);
                            return (
                                <div
                                    key={index}
                                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                >
                                    <div className={`flex items-center gap-2 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                            {isMe ? 'You' : msg.author}
                                        </span>
                                    </div>
                                    <div
                                        className={`max-w-[75%] px-4 py-2 shadow-sm ${isMe
                                            ? 'bg-primary-600 text-white rounded-2xl rounded-tr-none'
                                            : 'bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-tl-none'
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed">{msg.message}</p>
                                    </div>
                                    <div className={`flex items-center gap-1 mt-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                                        <Clock className="w-3 h-3 text-slate-400" />
                                        <span className="text-[10px] text-slate-400 uppercase">{msg.time}</span>
                                    </div>
                                    <div ref={scrollRef} />
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="flex gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
                        <input
                            type="text"
                            value={currentMessage}
                            placeholder="Type your message here..."
                            className="flex-grow px-4 py-2 bg-transparent focus:outline-none text-slate-700 text-sm"
                            onChange={(event) => setCurrentMessage(event.target.value)}
                            onKeyPress={(event) => {
                                event.key === "Enter" && sendMessage();
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!currentMessage.trim()}
                            className="bg-primary-600 text-white p-2.5 rounded-xl hover:bg-primary-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 shadow-lg shadow-primary-500/30"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
