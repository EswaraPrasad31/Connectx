import { useState } from 'react';
import { X, Phone, Video, Info } from 'lucide-react';
import { 
  Dialog, 
  DialogContent,
  DialogClose
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type MessagesModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// Sample conversations data with names from stories section and default profile image
const conversationsData = [
  {
    id: 1,
    username: "jaideep",
    profileImage: "/images/default-profile.svg",
    status: "Active now",
    isSelected: false
  },
  {
    id: 2,
    username: "shiva",
    profileImage: "/images/default-profile.svg",
    status: "Sent you a message • 2h",
    isSelected: true
  },
  {
    id: 3,
    username: "abhiram",
    profileImage: "/images/default-profile.svg",
    status: "Active 5h ago",
    isSelected: false
  },
  {
    id: 4,
    username: "sarfraz",
    profileImage: "/images/default-profile.svg",
    status: "Sent you a post • 1d",
    isSelected: false
  },
  {
    id: 5,
    username: "maharshith",
    profileImage: "/images/default-profile.svg",
    status: "Seen 3h ago",
    isSelected: false
  }
];

// Sample messages data - matching the screenshot conversation
const messagesData = [
  {
    id: 1,
    senderId: 2, // shiva
    text: "Hey! How's your project coming along?",
    timestamp: new Date(Date.now() - 3600000 * 4), // 4 hours ago
    isSentByCurrentUser: false
  },
  {
    id: 2,
    senderId: 1, // current user
    text: "It's going great! Just implemented voice controls today 🎉",
    timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    isSentByCurrentUser: true
  },
  {
    id: 3,
    senderId: 2, // shiva
    text: "That sounds awesome! Can you show me a demo sometime?",
    timestamp: new Date(Date.now() - 1800000 * 2), // 1 hour ago
    isSentByCurrentUser: false
  },
  {
    id: 4,
    senderId: 1, // current user
    text: "Definitely! How about tomorrow?",
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    isSentByCurrentUser: true
  }
];

export default function MessagesModal({ isOpen, onClose }: MessagesModalProps) {
  const [selectedConversation, setSelectedConversation] = useState(conversationsData.find(c => c.isSelected)?.id || 2);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState(messagesData);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      senderId: 1, // current user
      text: messageText,
      timestamp: new Date(),
      isSentByCurrentUser: true
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl h-[600px] p-0 flex flex-col">
        <div className="flex h-full">
          {/* Messages Sidebar */}
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between w-full">
                <h3 className="text-lg font-semibold">Messages</h3>
                <DialogClose className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </div>
            </div>
            
            <div className="overflow-y-auto h-[calc(100%-69px)]">
              {conversationsData.map(conversation => (
                <div 
                  key={conversation.id}
                  className={`p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
                    selectedConversation === conversation.id ? 'bg-gray-100 dark:bg-gray-800' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.profileImage} alt={`${conversation.username}'s profile`} />
                      <AvatarFallback>{conversation.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="font-semibold text-sm">{conversation.username}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">{conversation.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Conversation Area */}
          <div className="w-2/3 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={conversationsData.find(c => c.id === selectedConversation)?.profileImage}
                  alt="Profile"
                />
                <AvatarFallback>
                  {conversationsData.find(c => c.id === selectedConversation)?.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="ml-3 font-semibold">
                {conversationsData.find(c => c.id === selectedConversation)?.username}
              </p>
              <div className="ml-auto flex">
                <Button variant="ghost" size="icon" className="text-gray-500 mr-2">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-500 mr-2">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-500">
                  <Info className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Message List */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map(message => (
                  <div key={message.id} className={`flex ${message.isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`py-2 px-3 max-w-[70%] rounded-lg ${
                      message.isSentByCurrentUser 
                        ? 'bg-[#0095f6] text-white' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Button type="button" variant="ghost" size="icon" className="text-gray-500 mr-2">
                  <i className="far fa-smile text-xl"></i>
                </Button>
                <Input 
                  type="text" 
                  placeholder="Message..." 
                  className="flex-1 bg-gray-100 dark:bg-gray-800 border-none rounded-full py-2 px-4" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <Button type="submit" variant="ghost" className="ml-2 text-primary font-semibold">
                  Send
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
