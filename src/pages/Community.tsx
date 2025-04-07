import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Users, 
  MessageSquare, 
  Search, 
  Filter,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  Plus,
  Hash
} from 'lucide-react';

const Community = () => {
  const darkMode = useStore((state) => state.darkMode);
  const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'discussions'>('feed');

  const posts = [
    {
      id: 1,
      author: {
        name: 'Sarah Johnson',
        role: 'Nutrition Director',
        district: 'Springfield USD',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      content: "Just implemented a new farm-to-school program that has been a huge success! Happy to share our implementation guide with anyone interested.",
      likes: 24,
      comments: 8,
      time: '2h ago',
      tags: ['#FarmToSchool', '#BestPractices']
    },
    {
      id: 2,
      author: {
        name: 'Michael Chen',
        role: 'Kitchen Manager',
        district: 'Riverside Schools',
        avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      content: 'Looking for advice on reducing food waste in our kitchen. What strategies have worked for your schools?',
      likes: 15,
      comments: 12,
      time: '4h ago',
      tags: ['#FoodWaste', '#Sustainability']
    }
  ];

  const groups = [
    {
      id: 1,
      name: 'Menu Planning Professionals',
      members: 1250,
      description: 'Share and discuss menu planning strategies and compliance',
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 2,
      name: 'School Nutrition Directors',
      members: 850,
      description: 'Network with other nutrition directors across the country',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Community
        </h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Create Post
        </button>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b mb-6`}>
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'feed', label: 'Feed', icon: MessageSquare },
                { id: 'groups', label: 'Groups', icon: Users },
                { id: 'discussions', label: 'Discussions', icon: MessageCircle }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                    ${activeTab === id
                      ? `${darkMode ? 'border-indigo-400 text-indigo-400' : 'border-indigo-600 text-indigo-600'}`
                      : `${darkMode ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
                <div className="flex space-x-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {post.author.name}
                      </h3>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        · {post.time}
                      </span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {post.author.role} at {post.author.district}
                    </p>
                  </div>
                </div>

                <p className={`mt-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {post.content}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center text-xs ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-600'
                      } px-2 py-1 rounded-full`}
                    >
                      <Hash className="w-3 h-3 mr-1" />
                      {tag.slice(1)}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex space-x-4">
                    <button className={`flex items-center space-x-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </button>
                    <button className={`flex items-center space-x-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <button className={`p-1 rounded hover:bg-gray-100 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className={`p-1 rounded hover:bg-gray-100 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-80 flex-shrink-0 space-y-6">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Popular Groups
            </h2>
            <div className="space-y-4">
              {groups.map((group) => (
                <div key={group.id} className="flex items-start space-x-3">
                  <img
                    src={group.image}
                    alt={group.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {group.name}
                    </h3>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {group.members.toLocaleString()} members
                    </p>
                  </div>
                  <button className="ml-auto">
                    <Plus className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Trending Topics
            </h2>
            <div className="space-y-2">
              {['#MenuPlanning', '#FoodSafety', '#Sustainability', '#USDA'].map((topic) => (
                <div
                  key={topic}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  } cursor-pointer`}
                >
                  <Hash className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    {topic.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;