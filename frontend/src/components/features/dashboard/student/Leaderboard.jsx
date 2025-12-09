import { useState } from 'react';
import { Trophy, Medal, Star, TrendingUp, Award, Crown, Users } from 'lucide-react';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';
import Card from '@/components/common/ui/cards/Card';
import StatsCard from '@/components/common/ui/cards/StatsCard';

export default function Leaderboard() {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';

  const [timeFilter, setTimeFilter] = useState('month');
  const [categoryFilter, setCategoryFilter] = useState('overall');

  const leaderboardData = [
    {
      id: 1,
      rank: 1,
      name: 'Alex Johnson',
      points: 2450,
      level: 15,
      avatar: 'AJ',
      progress: 85,
      badges: 12,
      streak: 28,
      change: 2,
      courses: ['MATH101', 'CS101', 'PHY101']
    },
    {
      id: 2,
      rank: 2,
      name: 'Sarah Miller',
      points: 2320,
      level: 14,
      avatar: 'SM',
      progress: 78,
      badges: 10,
      streak: 14,
      change: 1,
      courses: ['MATH101', 'ENG201']
    },
    {
      id: 3,
      rank: 3,
      name: 'Mike Chen',
      points: 2180,
      level: 13,
      avatar: 'MC',
      progress: 92,
      badges: 8,
      streak: 21,
      change: 3,
      courses: ['CS101', 'PHY101']
    },
    {
      id: 4,
      rank: 4,
      name: 'You',
      points: 1950,
      level: 12,
      avatar: 'ME',
      progress: 65,
      badges: 6,
      streak: 7,
      change: -1,
      courses: ['MATH101', 'CS101', 'ENG201'],
      isCurrentUser: true
    },
    {
      id: 5,
      rank: 5,
      name: 'Emma Davis',
      points: 1820,
      level: 11,
      avatar: 'ED',
      progress: 88,
      badges: 5,
      streak: 35,
      change: 0,
      courses: ['PHY101', 'ENG201']
    }
  ];

  const stats = [
    {
      title: "Your Rank",
      value: "4th",
      subtitle: "Top 20% of class",
      icon: Trophy,
      color: "orange"
    },
    {
      title: "Total Points",
      value: "1,950",
      subtitle: "+150 this week",
      icon: Star,
      color: "blue"
    },
    {
      title: "Current Level",
      value: "12",
      subtitle: "85% to next level",
      icon: TrendingUp,
      color: "green"
    },
    {
      title: "Active Streak",
      value: "7 days",
      subtitle: "Keep going!",
      icon: Award,
      color: "purple"
    }
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-500" />;
      case 2: return <Medal className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-400" />;
      case 3: return <Medal className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-amber-600" />;
      default: return <span className="text-sm sm:text-base lg:text-lg font-bold">{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300';
      case 2: return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300';
      case 3: return 'bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300';
      default: return 'bg-slate-100 dark:bg-slate-900/20 text-slate-800 dark:text-slate-300';
    }
  };

 return (
  <div className={`min-h-screen space-y-4 sm:space-y-6 p-4 sm:p-6 ${darkMode ? '' : ''}`}>
    {/* Header */}
    <div>
      <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${darkMode ? '' : ''}`}>
        Learning Leaderboard
      </h1>
      <p className={`text-sm sm:text-base ${darkMode ? '' : ''}`}>
        Compete with peers and track your academic progress
      </p>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {stats.map((stat, index) => (
        <div key={stat.title} className={`rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className={`p-1.5 sm:p-2 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${darkMode ? 'text-white' : 'text-slate-900'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'} truncate`}>{stat.title}</p>
              <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} truncate`}>{stat.value}</p>
              <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'} truncate`}>{stat.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Filters */}
    <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          {['week', 'month', 'semester', 'all'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeFilter(period)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none min-w-[60px] ${
                timeFilter === period
                  ? 'bg-orange-500 text-white'
                  : darkMode
                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs sm:text-sm ${
            darkMode 
              ? 'bg-slate-700 border-slate-600 text-white' 
              : 'bg-white border-slate-300 text-slate-900'
          }`}
        >
          <option value="overall">Overall</option>
          <option value="assignments">Assignments</option>
          <option value="quizzes">Quizzes</option>
          <option value="participation">Participation</option>
        </select>
      </div>
    </div>

    {/* Leaderboard */}
    <div className={`rounded-lg sm:rounded-xl p-4 sm:p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
      <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
        <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
        <h2 className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Top Performers - {timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)}
        </h2>
      </div>
      <div className="space-y-2 sm:space-y-3">
        {leaderboardData.map((student) => (
          <div
            key={student.id}
            className={`flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all duration-300 ${
              student.isCurrentUser
                ? darkMode
                  ? 'bg-orange-900/20 border-orange-800'
                  : 'bg-orange-50 border-orange-200'
                : darkMode
                ? 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            {/* Left Section - Rank and User Info */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-1 min-w-0">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${getRankColor(student.rank)}`}>
                {getRankIcon(student.rank)}
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm ${
                  student.isCurrentUser
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                }`}>
                  {student.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-sm sm:text-base truncate ${
                    student.isCurrentUser
                      ? 'text-orange-600 dark:text-orange-400'
                      : darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {student.name} {student.isCurrentUser && '(You)'}
                  </h3>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'} truncate`}>
                    Level {student.level} • {student.badges} badges
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section - Points and Progress */}
            <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
              {/* Points */}
              <div className="text-right hidden sm:block">
                <p className={`text-base sm:text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {student.points.toLocaleString()}
                </p>
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Points</p>
              </div>

              {/* Progress Bar */}
              <div className="w-16 sm:w-20 lg:w-24">
                <div className="flex justify-between text-xs mb-1">
                  <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Progress</span>
                  <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{student.progress}%</span>
                </div>
                <div className={`w-full rounded-full h-1.5 sm:h-2 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <div
                    className="bg-gradient-to-r from-orange-500 to-amber-500 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                    style={{ width: `${student.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Rank Change */}
              <div className="text-right hidden lg:block">
                <div className={`flex items-center space-x-1 text-sm ${
                  student.change > 0
                    ? 'text-green-600 dark:text-green-400'
                    : student.change < 0
                    ? 'text-red-600 dark:text-red-400'
                    : darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <TrendingUp className={`w-3 h-3 sm:w-4 sm:h-4 ${student.change <= 0 && 'hidden'}`} />
                  <span>{student.change > 0 ? `+${student.change}` : student.change}</span>
                </div>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Rank change</p>
              </div>

              {/* Mobile Points Display */}
              <div className="text-right sm:hidden">
                <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {student.points.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Achievements and Milestones */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Achievements */}
      <div className={`rounded-lg sm:rounded-xl p-4 sm:p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <h3 className={`font-semibold text-base sm:text-lg mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Your Achievements
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {[
            { name: 'Quick Learner', icon: '⚡', earned: true },
            { name: 'Perfect Attendance', icon: '📅', earned: true },
            { name: 'Assignment Master', icon: '📝', earned: false },
            { name: 'Quiz Champion', icon: '🏆', earned: true },
          ].map((badge, index) => (
            <div
              key={index}
              className={`p-2 sm:p-3 rounded-lg border text-center transition-all ${
                badge.earned
                  ? darkMode
                    ? 'bg-green-900/20 border-green-800'
                    : 'bg-green-50 border-green-200'
                  : darkMode
                  ? 'bg-slate-900/20 border-slate-700 opacity-50'
                  : 'bg-slate-50 border-slate-200 opacity-50'
              }`}
            >
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{badge.icon}</div>
              <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'} truncate`}>
                {badge.name}
              </p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {badge.earned ? 'Earned' : 'Locked'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className={`rounded-lg sm:rounded-xl p-4 sm:p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <h3 className={`font-semibold text-base sm:text-lg mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Next Milestones
        </h3>
        <div className="space-y-2 sm:space-y-3">
          {[
            { goal: 'Reach Level 13', progress: 85, reward: '500 points' },
            { goal: 'Complete 10 assignments', progress: 70, reward: 'Gold Badge' },
            { goal: '30-day streak', progress: 23, reward: 'Special Avatar' },
          ].map((milestone, index) => (
            <div key={index} className="space-y-1 sm:space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className={darkMode ? 'text-white' : 'text-slate-900'}>{milestone.goal}</span>
                <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{milestone.reward}</span>
              </div>
              <div className={`w-full rounded-full h-1.5 sm:h-2 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                  style={{ width: `${milestone.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
}