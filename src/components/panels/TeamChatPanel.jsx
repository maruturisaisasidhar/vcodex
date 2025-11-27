// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { useAuth } from '../../context/useAuth';
// import { useFileSystem } from '../../hooks/useFileSystem';
// // ✅ FIX: Import the correct, unified hook
// import { useProjectSession } from '../../hooks/useProjectSession';

// const TeamChatPanel = () => {
//     const { projectId } = useParams();
//     const { currentUser } = useAuth();
    
//     // ✅ FIX: Use the state and logic from our specialized hook
//     const { loading, team, messages, sendMessage, removeMember } = useProjectSession(projectId);
//     const { manageVCodeXId, getUserByVCodeXId, sendCollaborationInvite } = useFileSystem();

//     // Internal state for the component's UI
//     const [messageText, setMessageText] = useState('');
//     const [inviteId, setInviteId] = useState('');
//     const [vcodexId, setVcodexId] = useState('');
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const getVCodeXId = async () => {
//             if (currentUser) {
//                 const id = await manageVCodeXId(currentUser);
//                 setVcodexId(id);
//             }
//         };
//         getVCodeXId();
//     }, [currentUser, manageVCodeXId]);

//     const handleSendMessage = (e) => {
//         e.preventDefault();
//         if (messageText.trim()) {
//             sendMessage(messageText);
//             setMessageText('');
//         }
//     };

//     const handleSendInvite = async (e) => {
//         e.preventDefault();
//         setError('');
//         if (!inviteId.trim()) return;

//         const toUser = await getUserByVCodeXId(inviteId);
//         if (!toUser) {
//             setError('User with that V-CodeX ID not found.');
//             return;
//         }

//         if (toUser.id === currentUser.uid) {
//             setError("You can't invite yourself.");
//             return;
//         }

//         try {
//             const currentUserWithId = { ...currentUser, vcodexId };
//             await sendCollaborationInvite(projectId, currentUserWithId, toUser);
//             alert(`Invite sent to ${inviteId}!`);
//             setInviteId('');
//         } catch (err) {
//             console.error("Error sending invite:", err);
//             setError('Failed to send invite.');
//         }
//     };

//     if (loading) {
//         return <div className="p-4 text-gray-400">Loading Team...</div>;
//     }

//     const isLeader = team?.leader === currentUser?.uid;

//     return (
//         <div className="h-full flex flex-col bg-gray-800 text-white">
//             <div className="p-3 border-b border-gray-700">
//                 <h3 className="font-bold text-lg">Team Collaboration</h3>
//             </div>

//             <div className="p-3 border-b border-gray-700">
//                 <h4 className="font-semibold mb-2 text-gray-300">Team Members</h4>
//                 <ul className="space-y-2">
//                     {team?.members?.map(member => (
//                         <li key={member.uid} className="flex items-center justify-between">
//                             <div className="flex items-center">
//                                 <img src={member.photoURL} alt={member.name} className="w-6 h-6 rounded-full mr-2" />
//                                 <span className="text-sm">{member.name}</span>
//                                 {team.leader === member.uid && <span className="ml-2 text-xs bg-yellow-500 text-black px-1.5 py-0.5 rounded">Leader</span>}
//                             </div>
//                             {isLeader && member.uid !== currentUser.uid && (
//                                 <button onClick={() => removeMember(member.uid)} className="text-red-500 hover:text-red-400 text-xs">
//                                     Remove
//                                 </button>
//                             )}
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             <div className="p-3 border-b border-gray-700">
//                 <h4 className="font-semibold mb-2 text-gray-300">Invite a Friend</h4>
//                 <p className="text-xs text-gray-400 mb-2">Your V-CodeX ID: <span className="font-mono bg-gray-700 px-1 rounded">{vcodexId || 'Generating...'}</span></p>
//                 <form onSubmit={handleSendInvite} className="flex gap-2">
//                     <input
//                         type="text"
//                         value={inviteId}
//                         onChange={(e) => setInviteId(e.target.value)}
//                         placeholder="Enter friend's V-CodeX ID"
//                         className="flex-grow bg-gray-900 text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-sm font-semibold px-3 py-1 rounded-md">Send</button>
//                 </form>
//                 {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
//             </div>

//             <div className="flex-1 p-3 overflow-y-auto">
//                 <ul className="space-y-3">
//                     {messages.map(msg => (
//                         <li key={msg.id} className={`flex flex-col ${msg.senderId === currentUser.uid ? 'items-end' : 'items-start'}`}>
//                             <div className={`p-2 rounded-lg max-w-xs ${msg.senderId === currentUser.uid ? 'bg-blue-700' : 'bg-gray-600'}`}>
//                                 <p className="text-sm">{msg.text}</p>
//                             </div>
//                             <span className="text-xs text-gray-500 mt-1">{msg.senderName}</span>
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-700 flex gap-2">
//                 <input
//                     type="text"
//                     value={messageText}
//                     onChange={(e) => setMessageText(e.target.value)}
//                     placeholder="Type a message..."
//                     className="flex-grow bg-gray-900 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <button type="submit" className="bg-green-600 hover:bg-green-500 font-semibold px-4 py-2 rounded-md">Send</button>
//             </form>
//         </div>
//     );
// };

// export default TeamChatPanel;


import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useFileSystem } from '../../hooks/useFileSystem';
import useProjectSession from '../../hooks/useProjectSession'; // Using default export

const TeamChatPanel = () => {
    const { projectId } = useParams();
    const { currentUser } = useAuth();
    
    const { loading, team, messages, sendMessage, removeMember } = useProjectSession(projectId);
    const { manageVCodeXId, getUserByVCodeXId, sendCollaborationInvite } = useFileSystem();

    // --- Component's Internal UI State ---
    const [messageText, setMessageText] = useState('');
    const [inviteId, setInviteId] = useState('');
    const [vcodexId, setVcodexId] = useState('');
    const [error, setError] = useState('');
    
    // ✅ NEW: State to manage the current chat context (group or direct message)
    const [chatTarget, setChatTarget] = useState({ type: 'group', name: 'Group Chat' });

    useEffect(() => {
        const getVCodeXId = async () => {
            if (currentUser) {
                const id = await manageVCodeXId(currentUser);
                setVcodexId(id);
            }
        };
        getVCodeXId();
    }, [currentUser, manageVCodeXId]);

    // ✅ UPDATED: This handler is now "smart" and sends DMs or group messages
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (messageText.trim()) {
            // If the chat target is a person, pass their UID as the recipientId
            const recipientId = chatTarget.type === 'dm' ? chatTarget.uid : null;
            sendMessage(messageText, recipientId);
            setMessageText('');
        }
    };

    const handleSendInvite = async (e) => {
        e.preventDefault();
        setError('');
        if (!inviteId.trim()) return;

        const toUser = await getUserByVCodeXId(inviteId);
        if (!toUser) {
            setError('User with that V-CodeX ID not found.');
            return;
        }
        if (toUser.id === currentUser.uid) {
            setError("You can't invite yourself.");
            return;
        }
        try {
            const currentUserWithId = { ...currentUser, vcodexId };
            await sendCollaborationInvite(projectId, currentUserWithId, toUser);
            alert(`Invite sent to ${inviteId}!`);
            setInviteId('');
        } catch (err) {
            console.error("Error sending invite:", err);
            setError('Failed to send invite.');
        }
    };

    // ✅ NEW: Memoized filtering of messages based on the chatTarget
    const filteredMessages = useMemo(() => {
        if (chatTarget.type === 'group') {
            // For group chat, show messages with no recipientId
            return messages.filter(msg => !msg.recipientId);
        }
        if (chatTarget.type === 'dm') {
            // For DMs, show messages between the current user and the target user
            return messages.filter(msg => 
                (msg.senderId === currentUser.uid && msg.recipientId === chatTarget.uid) ||
                (msg.senderId === chatTarget.uid && msg.recipientId === currentUser.uid)
            );
        }
        return [];
    }, [messages, chatTarget, currentUser.uid]);

    if (loading) {
        return <div className="p-4 text-gray-400">Loading Team...</div>;
    }

    const isLeader = team?.leader === currentUser?.uid;

    return (
        <div className="h-full flex flex-col bg-gray-800 text-white">
            <div className="p-3 border-b border-gray-700">
                {/* ✅ UPDATED: Dynamic header shows who you are chatting with */}
                <h3 className="font-bold text-lg">{chatTarget.name}</h3>
                {chatTarget.type === 'dm' && <p className="text-xs text-gray-400">Direct Message</p>}
            </div>

            <div className="p-3 border-b border-gray-700">
                <h4 className="font-semibold mb-2 text-gray-300">Team Members</h4>
                <ul className="space-y-1">
                    {/* ✅ NEW: Button to switch back to group chat */}
                    <li>
                        <button 
                            onClick={() => setChatTarget({ type: 'group', name: 'Group Chat' })}
                            className={`w-full text-left p-1 rounded-md text-sm ${chatTarget.type === 'group' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                        >
                            # Group Chat
                        </button>
                    </li>
                    {/* ✅ UPDATED: Team members are now clickable to start DMs */}
                    {team?.members?.map(member => (
                        <li key={member.uid} className="flex items-center justify-between">
                            <button 
                                onClick={() => setChatTarget({ type: 'dm', uid: member.uid, name: member.name })}
                                className={`w-full text-left p-1 rounded-md flex items-center ${chatTarget.uid === member.uid ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                            >
                                <img src={member.photoURL} alt={member.name} className="w-5 h-5 rounded-full mr-2" />
                                <span className="text-sm">{member.name}</span>
                                {team.leader === member.uid && <span className="ml-2 text-xs bg-yellow-500 text-black px-1.5 py-0.5 rounded">Leader</span>}
                            </button>
                            {isLeader && member.uid !== currentUser.uid && (
                                <button onClick={() => removeMember(member.uid)} className="text-red-500 hover:text-red-400 text-xs flex-shrink-0 ml-2">
                                    Remove
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="p-3 border-b border-gray-700">
                <h4 className="font-semibold mb-2 text-gray-300">Invite a Friend</h4>
                <p className="text-xs text-gray-400 mb-2">Your V-CodeX ID: <span className="font-mono bg-gray-700 px-1 rounded">{vcodexId || 'Generating...'}</span></p>
                <form onSubmit={handleSendInvite} className="flex gap-2">
                    <input
                        type="text"
                        value={inviteId}
                        onChange={(e) => setInviteId(e.target.value)}
                        placeholder="Enter friend's V-CodeX ID"
                        className="flex-grow bg-gray-900 text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-sm font-semibold px-3 py-1 rounded-md">Send</button>
                </form>
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            <div className="flex-1 p-3 overflow-y-auto">
                <ul className="space-y-3">
                    {/* ✅ UPDATED: Map over the filtered messages */}
                    {filteredMessages.map(msg => (
                        <li key={msg.id} className={`flex flex-col ${msg.senderId === currentUser.uid ? 'items-end' : 'items-start'}`}>
                            <div className={`p-2 rounded-lg max-w-xs ${msg.senderId === currentUser.uid ? 'bg-blue-700' : 'bg-gray-600'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                            <span className="text-xs text-gray-500 mt-1">{msg.senderName}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-700 flex gap-2">
                <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={`Message ${chatTarget.name}`}
                    className="flex-grow bg-gray-900 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="bg-green-600 hover:bg-green-500 font-semibold px-4 py-2 rounded-md">Send</button>
            </form>
        </div>
    );
};

export default TeamChatPanel;