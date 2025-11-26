import { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, BookOpen } from 'lucide-react';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';
import Card from '@/components/common/ui/cards/Card';
import { useApi } from '@/contexts/ApiContext';

export default function GradePredictor() {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  const { getDashboardStats } = useApi();

  const [predictions, setPredictions] = useState([]);
  const [wellBeing, setWellBeing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    try {
      const mockPredictions = [
        {
          course: 'Mathematics',
          currentGrade: 85,
          predictedGrade: 88,
          confidence: 92,
          risk: 'low',
          recommendations: ['Complete assignment 3', 'Review chapter 5']
        },
        {
          course: 'Computer Science',
          currentGrade: 78,
          predictedGrade: 82,
          confidence: 85,
          risk: 'medium',
          recommendations: ['Attend office hours', 'Practice coding exercises']
        },
        {
          course: 'Physics',
          currentGrade: 92,
          predictedGrade: 90,
          confidence: 95,
          risk: 'low',
          recommendations: ['Maintain current study habits']
        }
      ];

      const mockWellBeing = {
        score: 7.2,
        status: 'moderate',
        factors: ['Sleep quality', 'Study load', 'Social engagement'],
        recommendations: ['Take regular breaks', 'Maintain sleep schedule']
      };

      setPredictions(mockPredictions);
      setWellBeing(mockWellBeing);
      setLoading(false);
    } catch (error) {
      console.error('Error loading predictions:', error);
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-orange-600 dark:text-orange-400';
      case 'high': return 'text-red-600 dark:text-red-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getRiskBgColor = (risk) => {
    switch (risk) {
      case 'low': return 'bg-green-100 dark:bg-green-900/20';
      case 'medium': return 'bg-orange-100 dark:bg-orange-900/20';
      case 'high': return 'bg-red-100 dark:bg-red-900/20';
      default: return 'bg-slate-100 dark:bg-slate-900/20';
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen space-y-6 p-6 ${darkMode ? '' : ''}`}>
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${darkMode ? '' : ''}`}>
          AI Predictions & Analytics
        </h1>
        <p className={darkMode ? '' : ''}>
          Machine learning insights for academic success and well-being
        </p>
      </div>

      {/* Grade Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={`p-6 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className={`w-6 h-6 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Grade Predictions
            </h2>
          </div>
          
          <div className="space-y-4">
            {predictions.map((prediction, index) => (
              <div key={index} className={`border rounded-lg p-4 ${
                darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {prediction.course}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getRiskBgColor(prediction.risk)} ${getRiskColor(prediction.risk)}`}>
                    {prediction.risk.toUpperCase()} RISK
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Current</p>
                    <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {prediction.currentGrade}%
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Predicted</p>
                    <p className={`text-lg font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                      {prediction.predictedGrade}%
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className={`text-sm mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Confidence: {prediction.confidence}%
                  </p>
                  <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${prediction.confidence}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Recommendations:
                  </p>
                  <ul className={`text-sm space-y-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {prediction.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Well-being Analysis */}
        <Card className={`p-6 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className={`w-6 h-6 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Well-being Analysis
            </h2>
          </div>

          {wellBeing && (
            <div className="space-y-4">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {wellBeing.score}/10
                </div>
                <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                  Overall Well-being Score
                </p>
              </div>

              <div className={`p-4 rounded-lg ${
                wellBeing.status === 'good' 
                  ? darkMode 
                    ? 'bg-green-900/20 text-green-300' 
                    : 'bg-green-100 text-green-800'
                  : wellBeing.status === 'moderate'
                  ? darkMode
                    ? 'bg-orange-900/20 text-orange-300'
                    : 'bg-orange-100 text-orange-800'
                  : darkMode
                  ? 'bg-red-900/20 text-red-300'
                  : 'bg-red-100 text-red-800'
              }`}>
                <p className="font-medium">Status: {wellBeing.status.toUpperCase()}</p>
              </div>

              <div>
                <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Key Factors:
                </h4>
                <ul className={`text-sm space-y-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {wellBeing.factors.map((factor, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Recommendations:
                </h4>
                <ul className={`text-sm space-y-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {wellBeing.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}