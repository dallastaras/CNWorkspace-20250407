import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { getDietProfiles, getDietRecipes, getStudentDiets } from '../lib/api';
import { 
  Apple,
  User,
  Search,
  Filter,
  Plus,
  Bot,
  LayoutGrid,
  School,
  ChevronDown,
  TableIcon
} from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { DietProfileGrid } from '../components/special-diets/DietProfileGrid';
import { DietProfileTable } from '../components/special-diets/DietProfileTable';
import { SchoolSummary } from '../components/special-diets/SchoolSummary';
import { StudentList } from '../components/special-diets/StudentList';

const SpecialDiets = () => {
  const darkMode = useStore((state) => state.darkMode);
  const { user } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showSchoolieInsights, setShowSchoolieInsights] = useState(false);
  const [expandedSchools, setExpandedSchools] = useState<Record<string, boolean>>({});
  const [activeView, setActiveView] = useState<'profiles' | 'students'>('profiles');
  const [profiles, setProfiles] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<Record<string, any[]>>({});
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.district_id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [profilesData, recipesData, studentsData] = await Promise.all([
          getDietProfiles(user.district_id),
          getDietRecipes(user.district_id),
          getStudentDiets(user.district_id)
        ]);

        setProfiles(profilesData);
        setRecipes(recipesData);
        setStudents(studentsData);
      } catch (err) {
        console.error('Error fetching special diets data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load special diets data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.district_id]);


  // Calculate school summaries from student data
  const schoolSummaries = useMemo(() => {
    if (!students?.length) return [];

    const summaries = new Map();
    
    students.forEach(student => {
      const schoolId = student.school.id;
      if (!summaries.has(schoolId)) {
        summaries.set(schoolId, {
          id: schoolId,
          name: student.school.name,
          totalStudents: 0, // This would come from schools table
          dietaryStudents: 0,
          profiles: new Map()
        });
      }
      
      const summary = summaries.get(schoolId);
      summary.dietaryStudents++;
      
      const profileName = student.profile.name;
      const profileCount = summary.profiles.get(profileName) || 0;
      summary.profiles.set(profileName, profileCount + 1);
    });

    return Array.from(summaries.values()).map(summary => ({
      ...summary,
      profiles: Array.from(summary.profiles.entries()).map(([name, count]) => ({
        name,
        count
      }))
    }));
  }, [students]);

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || profile.category.id === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <LoadingSpinner 
          size="lg" 
          className={darkMode ? 'text-gray-400' : 'text-gray-500'} 
        />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Error Loading Special Diets"
        message={error}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Apple className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <div>
            <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Special Diets
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Manage dietary requirements and restrictions
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSchoolieInsights(!showSchoolieInsights)}
            className={`p-2 ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-lg`}
            title={showSchoolieInsights ? 'Hide Schoolie' : 'Show Schoolie'}
          >
            <Bot className="w-5 h-5" />
          </button>
          <button
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Diet Profile
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveView('profiles')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
              ${activeView === 'profiles'
                ? `${darkMode ? 'border-indigo-400 text-indigo-400' : 'border-indigo-600 text-indigo-600'}`
                : `${darkMode ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
              }
            `}
          >
            <Apple className="w-4 h-4" />
            <span>Diet Profiles</span>
          </button>
          <button
            onClick={() => setActiveView('students')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
              ${activeView === 'students'
                ? `${darkMode ? 'border-indigo-400 text-indigo-400' : 'border-indigo-600 text-indigo-600'}`
                : `${darkMode ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
              }
            `}
          >
            <User className="w-4 h-4" />
            <span>Students</span>
          </button>
        </nav>
      </div>

      {/* Schoolie Insights */}
      {showSchoolieInsights && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-50'} flex items-center justify-center`}>
                <Bot className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
            </div>
            <div className="flex-1">
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                Currently managing {dietProfiles.reduce((sum, p) => sum + p.studentCount, 0)} students with special dietary needs across {schoolSummaries.length} schools. 
                The most common dietary restrictions are for food allergies, particularly peanuts and dairy. 
                {schoolSummaries.some(s => s.dietaryStudents / s.totalStudents > 0.1) && 
                  " Some schools have a high concentration of dietary restrictions - consider specialized menu planning for these locations."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Total Students
              </h3>
            </div>
            <span className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {schoolSummaries.reduce((sum, s) => sum + s.totalStudents, 0).toLocaleString()}
            </span>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Apple className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Special Diets
              </h3>
            </div>
            <span className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {profiles.reduce((sum, p) => sum + p.studentCount, 0).toLocaleString()}
            </span>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Filter className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Diet Profiles
              </h3>
            </div>
            <span className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {profiles.length}
            </span>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <School className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Schools
              </h3>
            </div>
            <span className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {schoolSummaries.length}
            </span>
          </div>
        </div>
      </div>

      {activeView === 'profiles' && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Search diet profiles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 w-full rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                      : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                  } border focus:ring-2 focus:ring-indigo-500`}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center space-x-2 pl-4 pr-10 py-2 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-white text-gray-900 hover:bg-gray-50'
                  } border ${darkMode ? 'border-gray-600' : 'border-gray-300'} relative`}
                >
                  <Filter className="w-4 h-4" />
                  <span>{filterCategory === 'all' ? 'All Categories' : filterCategory}</span>
                  <ChevronDown className={`absolute right-3 w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                {isFilterOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden z-50 ${
                    darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
                  }`}>
                    {['all', 'Food Allergy', 'Religious', 'Medical', 'Lifestyle'].map(category => (
                      <button
                        key={category}
                        onClick={() => {
                          setFilterCategory(category);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full flex items-center px-4 py-2 text-left text-sm ${
                          filterCategory === category
                            ? darkMode
                              ? 'bg-gray-600 text-white'
                              : 'bg-indigo-50 text-indigo-600'
                            : darkMode
                              ? 'text-gray-300 hover:bg-gray-600'
                              : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg ${
                  viewMode === 'table'
                    ? 'bg-indigo-600 text-white'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Table View"
              >
                <TableIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* School Summary */}
          <SchoolSummary
            schools={schoolSummaries}
            expandedSchools={expandedSchools}
            onToggleSchool={(schoolId) => setExpandedSchools(prev => ({
              ...prev,
              [schoolId]: !prev[schoolId]
            }))}
          />

          {/* Diet Profiles */}
          {viewMode === 'table' ? (
            <DietProfileTable
              profiles={filteredProfiles}
              onSelectProfile={(profile) => console.log('Selected profile:', profile)}
              recipes={recipes}
            />
          ) : (
            <DietProfileGrid
              profiles={filteredProfiles}
              onSelectProfile={(profile) => console.log('Selected profile:', profile)}
              recipes={recipes}
            />
          )}
        </>
      )}

      {/* Student List */}
      {activeView === 'students' && (
        <StudentList students={students} />
      )}
    </div>
  );
};

export default SpecialDiets;