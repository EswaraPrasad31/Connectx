import { useState } from 'react';

type Story = {
  id: number;
  username: string;
  imageUrl: string;
  viewed: boolean;
  isCurrentUser?: boolean;
};

// Sample story data
const storiesData: Story[] = [
  {
    id: 1,
    username: "Your story",
    imageUrl: "https://randomuser.me/api/portraits/men/1.jpg", // Keep current user's image
    viewed: false,
    isCurrentUser: true
  },
  {
    id: 2,
    username: "jaideep",
    imageUrl: "https://randomuser.me/api/portraits/men/82.jpg",
    viewed: false
  },
  {
    id: 3,
    username: "shiva",
    imageUrl: "https://randomuser.me/api/portraits/men/83.jpg",
    viewed: false
  },
  {
    id: 4,
    username: "abhiram",
    imageUrl: "https://randomuser.me/api/portraits/men/84.jpg",
    viewed: false
  },
  {
    id: 5,
    username: "sarfraz",
    imageUrl: "https://randomuser.me/api/portraits/men/85.jpg",
    viewed: false
  },
  {
    id: 6,
    username: "maharshith",
    imageUrl: "https://randomuser.me/api/portraits/men/86.jpg",
    viewed: false
  },
  {
    id: 7,
    username: "anjali",
    imageUrl: "https://randomuser.me/api/portraits/women/82.jpg",
    viewed: false
  },
  {
    id: 8,
    username: "priya",
    imageUrl: "https://randomuser.me/api/portraits/women/83.jpg",
    viewed: false
  },
  {
    id: 9,
    username: "divya",
    imageUrl: "https://randomuser.me/api/portraits/women/84.jpg",
    viewed: true
  },
  {
    id: 10,
    username: "meera",
    imageUrl: "https://randomuser.me/api/portraits/women/85.jpg",
    viewed: true
  }
];

export default function Stories() {
  const [stories, setStories] = useState<Story[]>(storiesData);

  const handleStoryClick = (id: number) => {
    // Mark a story as viewed when clicked
    setStories(prev => 
      prev.map(story => 
        story.id === id ? { ...story, viewed: true } : story
      )
    );
    
    // In a real app, this would open the story in a modal or fullscreen view
    console.log(`Viewing story ${id}`);
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg p-3 mb-4 shadow-sm transition-colors duration-300 border border-gray-100 dark:border-gray-700">
      <div className="flex space-x-3">
        {stories.map((story) => (
          <div 
            key={story.id}
            className="flex flex-col items-center space-y-1 flex-shrink-0"
            onClick={() => handleStoryClick(story.id)}
          >
            <div className={`w-14 h-14 rounded-full ${
              story.viewed 
                ? 'bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-600' 
                : story.isCurrentUser
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                  : 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500'
            } p-[2px] cursor-pointer transition-all hover:scale-105 duration-200`}>
              <div className="bg-white dark:bg-gray-800 rounded-full p-[2px] h-full w-full flex items-center justify-center">
                <img 
                  src={story.imageUrl} 
                  alt={`${story.username}'s story`} 
                  className="w-full h-full object-cover rounded-full"
                />
                {story.isCurrentUser && (
                  <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-xs border-2 border-white dark:border-gray-800">
                    +
                  </div>
                )}
              </div>
            </div>
            <span className={`text-xs font-medium truncate w-14 text-center ${story.isCurrentUser ? 'text-primary' : ''}`}>
              {story.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
