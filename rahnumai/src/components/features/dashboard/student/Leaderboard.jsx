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
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-lg font-bold">{rank}</span>;
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Learning Leaderboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Compete with peers and track your academic progress
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            {['week', 'month', 'semester', 'all'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeFilter(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeFilter === period
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="overall">Overall</option>
            <option value="assignments">Assignments</option>
            <option value="quizzes">Quizzes</option>
            <option value="participation">Participation</option>
          </select>
        </div>
      </Card>

      {/* Leaderboard */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Trophy className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Top Performers - {timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)}
          </h2>
        </div>

        <div className="space-y-3">
          {leaderboardData.map((student) => (
            <div
              key={student.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                student.isCurrentUser
                  ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center space-x-4 flex-1">
                {/* Rank */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${getRankColor(student.rank)}`}>
                  {getRankIcon(student.rank)}
                </div>

                {/* Avatar and Info */}
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    student.isCurrentUser
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                  }`}>
                    {student.avatar}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      student.isCurrentUser
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-slate-900 dark:text-slate-100'
                    }`}>
                      {student.name} {student.isCurrentUser && '(You)'}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Level {student.level} • {student.badges} badges
                    </p>
                  </div>
                </div>
              </div>

              {/* Points and Progress */}
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {student.points.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Points</p>
                </div>

                <div className="w-24">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                    <span>Progress</span>
                    <span>{student.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${student.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`flex items-center space-x-1 text-sm ${
                    student.change > 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : student.change < 0 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    <TrendingUp className={`w-4 h-4 ${student.change <= 0 && 'hidden'}`} />
                    <span>{student.change > 0 ? `+${student.change}` : student.change}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Rank change</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Badges and Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Your Achievements
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Quick Learner', icon: '⚡', earned: true },
              { name: 'Perfect Attendance', icon: '📅', earned: true },
              { name: 'Assignment Master', icon: '📝', earned: false },
              { name: 'Quiz Champion', icon: '🏆', earned: true },
            ].map((badge, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border text-center transition-all ${
                  badge.earned
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-700 opacity-50'
                }`}
              >
                <div className="text-2xl mb-2">{badge.icon}</div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {badge.name}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {badge.earned ? 'Earned' : 'Locked'}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Next Milestones
          </h3>
          <div className="space-y-3">
            {[
              { goal: 'Reach Level 13', progress: 85, reward: '500 points' },
              { goal: 'Complete 10 assignments', progress: 70, reward: 'Gold Badge' },
              { goal: '30-day streak', progress: 23, reward: 'Special Avatar' },
            ].map((milestone, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-900 dark:text-slate-100">{milestone.goal}</span>
                  <span className="text-slate-600 dark:text-slate-400">{milestone.reward}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${milestone.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}