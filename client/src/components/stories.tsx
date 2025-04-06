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
    imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    viewed: false,
    isCurrentUser: true
  },
  {
    id: 2,
    username: "sophie",
    imageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
    viewed: false
  },
  {
    id: 3,
    username: "alex_dev",
    imageUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    viewed: false
  },
  {
    id: 4,
    username: "maria_p",
    imageUrl: "https://randomuser.me/api/portraits/women/4.jpg",
    viewed: false
  },
  {
    id: 5,
    username: "james_t",
    imageUrl: "https://randomuser.me/api/portraits/men/5.jpg",
    viewed: false
  },
  {
    id: 6,
    username: "olivia",
    imageUrl: "https://randomuser.me/api/portraits/women/6.jpg",
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
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm transition-colors duration-300">
      <div className="flex space-x-4">
        {stories.map((story) => (
          <div 
            key={story.id}
            className="flex flex-col items-center space-y-1 flex-shrink-0"
            onClick={() => handleStoryClick(story.id)}
          >
            <div className={`w-16 h-16 rounded-full ${
              story.viewed 
                ? 'bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-600' 
                : 'bg-gradient-to-r from-[#0095f6] to-[#E1306C]'
            } p-[2px] cursor-pointer transition-all hover:scale-105`}>
              <div className="bg-white dark:bg-gray-800 rounded-full p-[2px] h-full">
                <img 
                  src={story.imageUrl} 
                  alt={`${story.username}'s story`} 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            <span className="text-xs truncate w-16 text-center">{story.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
