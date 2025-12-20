import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSearchParams } from 'react-router-dom';

const socket = io.connect("http://localhost:5000");

const Chat = () => {
    const [searchParams] = useSearchParams();
    const room = searchParams.get('room');
    const username = searchParams.get('name') || 'User'; // In real app, get from auth context

    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    useEffect(() => {
        if (room) {
            socket.emit("join_room", room);
        }
    }, [room]);

    useEffect(() => {
        const handler = (data) => {
            setMessageList((list) => [...list, data]);
        };
        socket.on("receive_message", handler);
        return () => socket.off("receive_message", handler);
    }, []);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    return (
        <div className="flex justify-center items-center h-[80vh]">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-[600px]">
                <div className="bg-indigo-600 text-white p-4">
                    <h3 className="font-bold text-lg">Live Chat {room ? `- Room: ${room}` : ''}</h3>
                </div>

                <div className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-4">
                    {messageList.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex flex-col ${username === msg.author ? 'items-end' : 'items-start'}`}
                        >
                            <div
                                className={`max-w-[80%] px-4 py-2 rounded-lg ${username === msg.author
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                    }`}
                            >
                                <p>{msg.message}</p>
                            </div>
                            <div className="text-xs text-gray-400 mt-1 flex gap-1">
                                <span className="font-bold">{msg.author}</span>
                                <span>{msg.time}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-white border-t flex gap-2">
                    <input
                        type="text"
                        value={currentMessage}
                        placeholder="Type a message..."
                        className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={(event) => setCurrentMessage(event.target.value)}
                        onKeyPress={(event) => {
                            event.key === "Enter" && sendMessage();
                        }}
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
