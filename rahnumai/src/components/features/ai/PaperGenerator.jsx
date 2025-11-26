import { useState } from 'react';
import { FileText, Plus, Trash2, Download, Shuffle } from 'lucide-react';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';
import Card from '@/components/common/ui/cards/Card';
import { useApi } from '@/contexts/ApiContext';

export default function PaperGenerator() {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  const { chatWithAI } = useApi();

  const [paperConfig, setPaperConfig] = useState({
    subject: 'Mathematics',
    difficulty: 'medium',
    duration: '60',
    totalMarks: 100,
    sections: [
      {
        id: 1,
        name: 'Multiple Choice',
        marks: 20,
        questions: 5,
        description: 'Choose the correct option'
      }
    ]
  });

  const [generatedPaper, setGeneratedPaper] = useState(null);
  const [loading, setLoading] = useState(false);

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English'];
  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const addSection = () => {
    const newSection = {
      id: Date.now(),
      name: 'New Section',
      marks: 0,
      questions: 0,
      description: ''
    };
    setPaperConfig(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const removeSection = (id) => {
    setPaperConfig(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== id)
    }));
  };

  const updateSection = (id, field, value) => {
    setPaperConfig(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === id ? { ...section, [field]: value } : section
      )
    }));
  };

  const generatePaper = async () => {
    setLoading(true);
    try {
      // Simulate AI paper generation
      setTimeout(() => {
        const mockPaper = {
          id: Date.now(),
          title: `${paperConfig.subject} Examination`,
          instructions: 'Answer all questions. Show your working where necessary.',
          sections: paperConfig.sections.map(section => ({
            ...section,
            questions: Array.from({ length: section.questions }, (_, i) => ({
              id: i + 1,
              text: `Sample question ${i + 1} for ${section.name}`,
              marks: section.marks / section.questions,
              type: section.name.includes('Multiple') ? 'mcq' : 'descriptive'
            }))
          }))
        };
        setGeneratedPaper(mockPaper);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error generating paper:', error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          AI Paper Generator
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Create examination papers with AI assistance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Paper Configuration
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Subject
              </label>
              <select
                value={paperConfig.subject}
                onChange={(e) => setPaperConfig(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Difficulty
                </label>
                <select
                  value={paperConfig.difficulty}
                  onChange={(e) => setPaperConfig(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {difficulties.map(diff => (
                    <option key={diff.value} value={diff.value}>{diff.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={paperConfig.duration}
                  onChange={(e) => setPaperConfig(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Total Marks
              </label>
              <input
                type="number"
                value={paperConfig.totalMarks}
                onChange={(e) => setPaperConfig(prev => ({ ...prev, totalMarks: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Sections */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-slate-900 dark:text-slate-100">Sections</h3>
                <button
                  onClick={addSection}
                  className="flex items-center space-x-1 px-3 py-1 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Section</span>
                </button>
              </div>

              <div className="space-y-3">
                {paperConfig.sections.map((section) => (
                  <div key={section.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <input
                        type="text"
                        value={section.name}
                        onChange={(e) => updateSection(section.id, 'name', e.target.value)}
                        className="flex-1 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      <button
                        onClick={() => removeSection(section.id)}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <label className="text-xs text-slate-600 dark:text-slate-400">Marks</label>
                        <input
                          type="number"
                          value={section.marks}
                          onChange={(e) => updateSection(section.id, 'marks', parseInt(e.target.value))}
                          className="w-full px-2 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-600 dark:text-slate-400">Questions</label>
                        <input
                          type="number"
                          value={section.questions}
                          onChange={(e) => updateSection(section.id, 'questions', parseInt(e.target.value))}
                          className="w-full px-2 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-sm"
                        />
                      </div>
                    </div>

                    <input
                      type="text"
                      value={section.description}
                      onChange={(e) => updateSection(section.id, 'description', e.target.value)}
                      placeholder="Section description..."
                      className="w-full px-2 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={generatePaper}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating Paper...</span>
                </>
              ) : (
                <>
                  <Shuffle className="w-5 h-5" />
                  <span>Generate Paper</span>
                </>
              )}
            </button>
          </div>
        </Card>

        {/* Generated Paper Preview */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Paper Preview
            </h2>
            {generatedPaper && (
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            )}
          </div>

          {generatedPaper ? (
            <div className="space-y-6">
              <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-4">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {generatedPaper.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  Time: {paperConfig.duration} minutes | Total Marks: {paperConfig.totalMarks}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Instructions:
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {generatedPaper.instructions}
                </p>
              </div>

              {generatedPaper.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <h5 className="font-medium text-slate-900 dark:text-slate-100 mb-3">
                    {section.name} ({section.marks} marks)
                  </h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {section.description}
                  </p>
                  
                  <div className="space-y-3">
                    {section.questions.map((question, qIndex) => (
                      <div key={qIndex} className="text-sm">
                        <p className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                          Q{qIndex + 1}. {question.text} ({question.marks} marks)
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Configure and generate a paper to see preview</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}