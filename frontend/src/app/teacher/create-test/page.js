'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserDropdown } from '@/components/dashboard/UserDropdown';
import { isAuthenticated } from '@/utils/auth.js';
import { TestPublishConfirmationModal } from '@/components/teacher/create-test/TestPublishConfirmationModal';
import { useRouter } from 'next/navigation';
import { useError } from '@/contexts/ErrorContext.js';
import { publishTest } from '@/utils/test.js';
import { getClassesForTeacher } from '@/utils/class.js';


export default function CreateTest() {
  const [testData, setTestData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    duration: 30,
    classAssignment: '',
    passingScore: 70,
    isTimeLimited: true,
    questions: [],
    files: []
  });

  const [userData, setUserData] = useState({isLoggedIn: false, role: ''});
  const [activeTab, setActiveTab] = useState('details');
  const [classes, setClasses] = useState([]);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const router = useRouter();
  const { showError } = useError();

  useEffect(() => {
    const checkAuth = async () => {
      const userInfo = await isAuthenticated();
      setUserData(userInfo);
      
      if (!userInfo.isLoggedIn) {
        localStorage.setItem("notification", JSON.stringify({ type: "error", message: "Login to access protected pages!" }));
        window.location.href = '/';
      } else if (userInfo.role !== 'teacher') {
        localStorage.setItem("notification", JSON.stringify({ type: "error", message: "Students cannot access pages related to teacher!" }));
        window.location.href = '/';
      }
    };
  
    checkAuth();
  }, []);
  
  useEffect(() => {
    if (userData && userData.isLoggedIn) {
      const fetchClasses = async () => {
        const classes = await getClassesForTeacher();
        // console.log("Classes Data: ", classes);
        if (classes) setClasses(classes);
      };
  
      fetchClasses();
    }
  }, [userData]);
  

  // Calculate duration when start and end times change
  // useEffect(() => {
  //   if (testData.startTime && testData.endTime) {
  //     const start = new Date(testData.startTime);
  //     const end = new Date(testData.endTime);
  //     if (end > start) {
  //       const durationInMinutes = Math.round((end - start) / (1000 * 60));
  //       setTestData(prev => ({
  //         ...prev,
  //         duration: durationInMinutes
  //       }));
  //     }
  //   }
  // }, [testData.startTime, testData.endTime]);

  // Handle test details changes
  const handleTestDetailsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTestData({
      ...testData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Add a new question based on test type
  const addQuestion = () => {
    const newQuestion = {
      questionText: '',
      type: 'typed',
      maxMarks: 10,
      enableRubrics: false,
      rubric: {
        criteria: []
      },
      testcases: []
    };  
  
    setTestData({
      ...testData,
      questions: [...testData.questions, newQuestion]
    });
  };

  // Add rubric criterion to a specific question
const addQuestionRubricCriterion = (questionIndex) => {
  const newCriterion = {
    name: '',
    weight: 25,
    levels: [
      { label: 'Poor', score: 1, description: '' },
      { label: 'Fair', score: 2, description: '' },
      { label: 'Good', score: 3, description: '' },
      { label: 'Excellent', score: 4, description: '' }
    ]
  };

  const updatedQuestions = [...testData.questions];
  
  // Initialize rubric object if it doesn't exist
  if (!updatedQuestions[questionIndex].rubric) {
    updatedQuestions[questionIndex].rubric = { criteria: [] };
  }
  
  updatedQuestions[questionIndex].rubric.criteria = [
    ...(updatedQuestions[questionIndex].rubric.criteria || []),
    newCriterion
  ];
  
  setTestData({
    ...testData,
    questions: updatedQuestions
  });
};

// Remove a question rubric criterion
const removeQuestionRubricCriterion = (questionIndex, criterionIndex) => {
  const updatedQuestions = [...testData.questions];
  updatedQuestions[questionIndex].rubric.criteria = 
    updatedQuestions[questionIndex].rubric.criteria.filter((_, idx) => idx !== criterionIndex);
  
  setTestData({
    ...testData,
    questions: updatedQuestions
  });
};

// Update question rubric criterion
const updateQuestionRubricCriterion = (questionIndex, criterionIndex, field, value) => {
  const updatedQuestions = [...testData.questions];
  updatedQuestions[questionIndex].rubric.criteria[criterionIndex][field] = value;
  
  setTestData({
    ...testData,
    questions: updatedQuestions
  });
};

// Update question rubric level
const updateQuestionRubricLevel = (questionIndex, criterionIndex, levelIndex, field, value) => {
  const updatedQuestions = [...testData.questions];
  updatedQuestions[questionIndex].rubric.criteria[criterionIndex].levels[levelIndex][field] = value;
  
  setTestData({
    ...testData,
    questions: updatedQuestions
  });
};

// Add a test case to a coding question
const addTestCase = (questionIndex) => {
  const newTestCase = {
    input: '',
    output: '',
    isHidden: false
  };

  const updatedQuestions = [...testData.questions];
  
  // Initialize testCases array if it doesn't exist
  if (!updatedQuestions[questionIndex].testCases) {
    updatedQuestions[questionIndex].testCases = [];
  }
  
  updatedQuestions[questionIndex].testCases = [
    ...updatedQuestions[questionIndex].testCases,
    newTestCase
  ];
  
  setTestData({
    ...testData,
    questions: updatedQuestions
  });
};

// Remove a test case
const removeTestCase = (questionIndex, testCaseIndex) => {
  const updatedQuestions = [...testData.questions];
  updatedQuestions[questionIndex].testCases = 
    updatedQuestions[questionIndex].testCases.filter((_, idx) => idx !== testCaseIndex);
  
  setTestData({
    ...testData,
    questions: updatedQuestions
  });
};

// Update test case
const updateTestCase = (questionIndex, testCaseIndex, field, value) => {
  const updatedQuestions = [...testData.questions];
  updatedQuestions[questionIndex].testCases[testCaseIndex][field] = value;
  
  setTestData({
    ...testData,
    questions: updatedQuestions
  });
};

  // Handle question field changes
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...testData.questions];
    updatedQuestions[index][field] = value;
    setTestData({
      ...testData,
      questions: updatedQuestions
    });
  };

  // Remove a question
  const removeQuestion = (index) => {
    const updatedQuestions = testData.questions.filter((_, i) => i !== index);
    setTestData({
      ...testData,
      questions: updatedQuestions
    });
  };

  // Handle file uploads for handwritten tests
  const handleQuestionImageUpload = (questionIndex, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedQuestions = [...testData.questions];
      updatedQuestions[questionIndex].imageUrl = URL.createObjectURL(file);
      setTestData({
        ...testData,
        questions: updatedQuestions
      });
    }
  };

  // Handle general file uploads
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setTestData({
      ...testData,
      files: [...testData.files, ...files]
    });
  };

  // Remove a file
  const removeFile = (index) => {
    const updatedFiles = testData.files.filter((_, i) => i !== index);
    setTestData({
      ...testData,
      files: updatedFiles
    });
  };

  // Add a rubric criterion
  const addRubricCriterion = () => {
    const newCriterion = {
      name: '',
      weight: 25,
      levels: [
        { label: 'Poor', score: 1, description: '' },
        { label: 'Fair', score: 2, description: '' },
        { label: 'Good', score: 3, description: '' },
        { label: 'Excellent', score: 4, description: '' }
      ]
    };

    setTestData({
      ...testData,
      rubric: {
        ...testData.rubric,
        criteria: [...testData.rubric.criteria, newCriterion]
      }
    });
  };

  // Update rubric criterion
  const updateRubricCriterion = (index, field, value) => {
    const updatedCriteria = [...testData.rubric.criteria];
    updatedCriteria[index][field] = value;
    
    setTestData({
      ...testData,
      rubric: {
        ...testData.rubric,
        criteria: updatedCriteria
      }
    });
  };

  // Update rubric level
  const updateRubricLevel = (criterionIndex, levelIndex, field, value) => {
    const updatedCriteria = [...testData.rubric.criteria];
    updatedCriteria[criterionIndex].levels[levelIndex][field] = value;
    
    setTestData({
      ...testData,
      rubric: {
        ...testData.rubric,
        criteria: updatedCriteria
      }
    });
  };

  // Handle rubric details change
  const handleRubricChange = (e) => {
    const { name, value } = e.target;
    setTestData({
      ...testData,
      rubric: {
        ...testData.rubric,
        [name]: value
      }
    });
  };

  // Form submission
  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();
    
    if (isDraft) {
      try {
        // Draft saving logic
        console.log('Saving test as draft:', { ...testData, isDraft });
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Test saved as draft!');
      } catch (error) {
        console.error('Error saving draft:', error);
        alert('Failed to save draft. Please try again.');
      }
    } else {
      // For publishing, open the confirmation modal
      setIsPublishModalOpen(true);
    }
  };

  // Confirmation modal submission handler
  const handleConfirmPublish = async () => {
    try {
      // console.log('Publishing test:', { ...testData, isDraft: false });
      const updatedTestData = { ...testData, isDraft: false, classesAssignment: testData.classAssignment, createdBy: userData._id };
      console.log("Publishing test: ", updatedTestData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await publishTest(updatedTestData);
      if(response) {
        // Close modal and show success message
        setIsPublishModalOpen(false);
        localStorage.setItem("notification", JSON.stringify({ type: "success", message: "Successfully created test!" }));

        // Redirect to dashboard on success
        router.push('/');
      } else {
        showError("Failed to publish test. Please try again later.");
      }
    } catch (error) {
      console.error('Error publishing test:', error);
      // alert('Failed to publish test. Please try again.');
      showError("Failed to publish test. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8f1]">
      {/* Header */}
      <header className="bg-[#d56c4e] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" style={{ fontFamily: "'Rage Italic', sans-serif" }} className="text-4xl font-bold text-black">
            Gradia
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/teacher/tests" className="font-sans font-medium transition-transform transform hover:scale-110">
              Tests
            </Link>
            <Link href="/teacher/analysis" className="font-sans font-medium transition-transform transform hover:scale-110">
              Analysis
            </Link>
            <UserDropdown />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
      <div className="mb-6 flex flex-col space-y-2">
  <h1 className="text-3xl font-bold flex items-center">
    Create New Test
    <span className="ml-2 text-sm font-normal text-gray-500">
      {activeTab === 'details' && '(Step 1/3)'}
      {activeTab === 'questions' && '(Step 2/3)'}
      {activeTab === 'review' && '(Step 3/3)'}
    </span>
  </h1>
  
  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
    <div 
      className="bg-[#d97056] h-2 rounded-full transition-all duration-300"
      style={{ 
        width: 
          activeTab === 'details' ? '33%' : 
          activeTab === 'questions' ? '66%' : 
          '100%' 
      }}
    ></div>
  </div>
</div>

        <div className="bg-[#f5eee0] rounded-xl p-6 shadow-md">
          {/* Tabs */}
          <div className="flex mb-6 border-b border-gray-300">
            <button
              className={`px-4 py-2 ${activeTab === 'details' ? 'border-b-2 border-[#d97056] font-bold' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Test Details
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'questions' ? 'border-b-2 border-[#d97056] font-bold' : ''}`}
              onClick={() => setActiveTab('questions')}
            >
              Questions
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'review' ? 'border-b-2 border-[#d97056] font-bold' : ''}`}
              onClick={() => setActiveTab('review')}
            >
              Review & Finalize
            </button>
          </div>

          <form onSubmit={(e) => handleSubmit(e, false)}>
            {/* Step 1: Test Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Test Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="title"
                    value={testData.title}
                    onChange={handleTestDetailsChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g., Midterm Examination"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Description</label>
                  <textarea
                    name="description"
                    value={testData.description}
                    onChange={handleTestDetailsChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Provide test instructions and details"
                    rows="4"
                  />
                </div>

                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                  <div className="w-full md:w-1/2">
                    <label className="block mb-1 font-medium">Start Time <span className="text-red-500">*</span></label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      value={testData.startTime}
                      onChange={handleTestDetailsChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <label className="block mb-1 font-medium">End Time <span className="text-red-500">*</span></label>
                    <input
                      type="datetime-local"
                      name="endTime"
                      value={testData.endTime}
                      onChange={handleTestDetailsChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">Latest time students can submit the test</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label className="block mb-1 font-medium">Duration (minutes) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="duration"
                    value={testData.duration}
                    onChange={handleTestDetailsChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="1"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">Time allowed for each student to complete the test</p>
                </div>
                  
                  <div className="w-full md:w-1/2">
                    <label className="block mb-1 font-medium">Class Assignment <span className="text-red-500">*</span></label>
                    <select
                      name="classAssignment"
                      value={testData.classAssignment}
                      onChange={handleTestDetailsChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select a class</option>
                      {classes.map(cls => (
                        <option key={cls._id} value={cls._id}>{cls.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center mt-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="isTimeLimited"
                      checked={testData.isTimeLimited}
                      onChange={handleTestDetailsChange}
                      className="mr-2"
                    />
                    <span>Enable time limit</span>
                  </label>
                  <p className="text-sm text-gray-500 ml-4">When enabled, test will automatically submit after the duration time</p>
                </div>
              </div>
            )}

            {/* Step 2: Questions Tab */}
            {activeTab === 'questions' && (
  <div className="space-y-8">
    {testData.questions.length === 0 && (
      <div className="text-center p-8 bg-white rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500 mb-4">No questions added yet. Click the button below to add your first question.</p>
        <button
          type="button"
          onClick={addQuestion}
          className="px-4 py-2 bg-[#d97056] text-white rounded-md hover:bg-[#c5634c] transition"
        >
          + Add First Question
        </button>
      </div>
    )}
    
    {testData.questions.map((question, questionIndex) => (
      <div key={questionIndex} className="p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-medium">Question {questionIndex + 1}</h3>
          {question.type === 'typed' && (
            <div className="relative top-4 right-4 bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
              Text Response
            </div>
          )}
          {question.type === 'coding' && (
            <div className="relative top-4 right-4 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
              Code Editor
            </div>
          )}
          {question.type === 'handwritten' && (
            <div className="relative top-4 right-4 bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs font-medium">
              Handwritten
            </div>
          )}
          <button
            type="button"
            onClick={() => removeQuestion(questionIndex)}
            className="text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>

        {/* Common fields for all question types */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Question Text <span className="text-red-500">*</span></label>
          <textarea
            value={question.questionText}
            onChange={(e) => handleQuestionChange(questionIndex, 'questionText', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="3"
            required
          />
        </div>

        {/* Question Type Selection */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Question Type <span className="text-red-500">*</span></label>
          <select
            value={question.type}
            onChange={(e) => handleQuestionChange(questionIndex, 'type', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="typed">Typed (Rich Text Editor)</option>
            <option value="coding">Coding (Code Editor)</option>
            <option value="handwritten">Handwritten</option>
          </select>

          {/* Coding-specific options */}
          {question.type === 'coding' && (
            <div className="mt-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-orange-700 font-semibold flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Programming Language
                </h4>
              </div>
              
              <div className="mb-4">
                <select
                  value={question.codingLanguage || 'python'}
                  onChange={(e) => handleQuestionChange(questionIndex, 'codingLanguage', e.target.value)}
                  className="w-full p-3 border border-orange-300 rounded-md bg-white shadow-sm transition duration-200 focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="csharp">C#</option>
                </select>
              </div>

              {/* Test Cases Section with enhanced UI */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-orange-700 font-semibold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Test Cases
                  </h4>
                  <button
                    type="button"
                    onClick={() => addTestCase(questionIndex)}
                    className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition duration-200 flex items-center shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Test Case
                  </button>
                </div>

                {(!question.testCases || question.testCases.length === 0) ? (
                  <div className="text-center p-6 border-2 border-dashed border-orange-300 rounded-lg bg-white">
                    <div className="mx-auto w-16 h-16 mb-3 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-orange-700 font-medium mb-1">No test cases added yet</p>
                    <p className="text-orange-600 text-sm">Add test cases to automatically evaluate student code submissions</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {question.testCases.map((testCase, testCaseIndex) => (
                      <div key={testCaseIndex} className="bg-white rounded-lg shadow-sm border border-orange-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-50 to-white px-4 py-3 flex items-center justify-between border-b border-orange-100">
                          <h5 className="font-medium text-orange-800 flex items-center">
                            <span className="flex items-center justify-center bg-orange-100 text-orange-700 rounded-full h-6 w-6 mr-2 text-xs font-bold">
                              {testCaseIndex + 1}
                            </span>
                            Test Case {testCaseIndex + 1}
                            {testCase.isHidden && (
                              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                Hidden
                              </span>
                            )}
                          </h5>
                          <button
                            type="button"
                            onClick={() => removeTestCase(questionIndex, testCaseIndex)}
                            className="text-red-500 hover:text-red-700 transition duration-200"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                              <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                </svg>
                                Input
                              </span>
                            </label>
                            <textarea
                              value={testCase.input || ''}
                              onChange={(e) => updateTestCase(questionIndex, testCaseIndex, 'input', e.target.value)}
                              placeholder="Enter test input values..." 
                              className="w-full p-3 border border-gray-300 rounded-md text-sm font-mono bg-gray-50 h-24 focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                            ></textarea>
                          </div>

                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                              <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                                Expected Output
                              </span>
                            </label>
                            <textarea
                              value={testCase.output || ''}
                              onChange={(e) => updateTestCase(questionIndex, testCaseIndex, 'output', e.target.value)}
                              placeholder="Enter expected output..." 
                              className="w-full p-3 border border-gray-300 rounded-md text-sm font-mono bg-gray-50 h-24 focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                            ></textarea>
                          </div>
                        </div>

                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={testCase.isHidden || false}
                              onChange={(e) => updateTestCase(questionIndex, testCaseIndex, 'isHidden', e.target.checked)}
                              className="form-checkbox h-4 w-4 text-orange-600 transition duration-150 ease-in-out"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Hidden test case 
                              <span className="text-gray-500 text-xs ml-1">(not visible to students during test)</span>
                            </span>
                          </label>
                        </div>
                        
                        {/* Add additional "Add Test Case" button after each test case for better UX */}
                        <div className="px-4 py-3 bg-orange-50 border-t border-orange-100 flex justify-center">
                          <button
                            type="button"
                            onClick={() => addTestCase(questionIndex)}
                            className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition duration-200 flex items-center shadow-sm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Another Test Case
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Code hints/initial code section */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-orange-700 font-semibold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Starter Code
                  </h4>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-orange-200 overflow-hidden">
                  <textarea
                    value={question.starterCode || ''}
                    onChange={(e) => handleQuestionChange(questionIndex, 'starterCode', e.target.value)}
                    placeholder="# Provide starter code that will be visible to students in the code editor
          # Example:
          def solution(args):
              # Student will write code here
              pass"
                    className="w-full p-4 border-0 text-sm font-mono bg-gray-50 h-32 focus:ring-2 focus:ring-orange-300"
                  ></textarea>
                </div>
                
                <div className="mt-3 text-sm text-gray-600 flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Starter code provides a template or boilerplate for students to begin with.</span>
                </div>
              </div>

              {/* Execution Settings */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-orange-700 font-semibold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Execution Settings
                  </h4>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Time Limit (seconds)</label>
                      <input
                        type="number"
                        value={question.timeLimit || 5}
                        onChange={(e) => handleQuestionChange(questionIndex, 'timeLimit', Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                        max="30"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">Maximum execution time allowed (1-30 seconds)</p>
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Memory Limit (MB)</label>
                      <input
                        type="number"
                        value={question.memoryLimit || 128}
                        onChange={(e) => handleQuestionChange(questionIndex, 'memoryLimit', Math.max(16, parseInt(e.target.value) || 16))}
                        min="16"
                        max="512"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">Maximum memory usage allowed (16-512 MB)</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={question.allowInternetAccess || false}
                        onChange={(e) => handleQuestionChange(questionIndex, 'allowInternetAccess', e.target.checked)}
                        className="form-checkbox h-4 w-4 text-orange-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">Allow internet access during code execution</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="w-full sm:w-1/2">
            <label className="block mb-1 font-medium">Max Marks <span className="text-red-500">*</span></label>
            <input
              type="number"
              value={question.maxMarks}
              onChange={(e) => handleQuestionChange(questionIndex, 'maxMarks', parseInt(e.target.value, 10) || 0)}
              className="w-full p-2 border border-gray-300 rounded-md"
              min="1"
              required
            />
          </div>
          <div className="w-full sm:w-1/2 flex items-center">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={question.enableRubrics}
                onChange={(e) => handleQuestionChange(questionIndex, 'enableRubrics', e.target.checked)}
                className="mr-2"
              />
              <span>Enable Rubrics for this question</span>
            </label>
          </div>
        </div>

        {/* Question-specific Rubrics */}
        {question.enableRubrics && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-[#d97056]">Question Rubrics</h4>
              <button
                type="button"
                onClick={() => addQuestionRubricCriterion(questionIndex)}
                className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                + Add Criterion
              </button>
            </div>
            
            {(!question.rubric || !question.rubric.criteria || question.rubric.criteria.length === 0) ? (
              <div className="text-center p-4 border border-dashed border-gray-300 rounded-md">
                <p className="text-gray-500 text-sm">No criteria added yet. Add criteria to evaluate this question.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {question.rubric.criteria.map((criterion, criterionIndex) => (
                  <div key={criterionIndex} className="border border-gray-200 rounded-md p-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-sm font-medium">Criterion {criterionIndex + 1}</h5>
                      <button
                        type="button"
                        onClick={() => removeQuestionRubricCriterion(questionIndex, criterionIndex)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 mb-3">
                      <div className="w-full sm:w-3/4">
                        <label className="block mb-1 text-xs font-medium">Criterion Name</label>
                        <input 
                          type="text" 
                          value={criterion.name}
                          onChange={(e) => updateQuestionRubricCriterion(questionIndex, criterionIndex, 'name', e.target.value)}
                          placeholder="e.g., Content Quality" 
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div className="w-full sm:w-1/4">
                        <label className="block mb-1 text-xs font-medium">Weight (%)</label>
                        <input 
                          type="number" 
                          value={criterion.weight}
                          onChange={(e) => updateQuestionRubricCriterion(questionIndex, criterionIndex, 'weight', parseInt(e.target.value, 10) || 0)}
                          placeholder="25%" 
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                          min="1"
                          max="100" 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      {criterion.levels.map((level, levelIndex) => (
                        <div key={levelIndex} className="border border-gray-200 rounded p-2 bg-white">
                          <div className="text-xs font-medium text-center mb-1">{level.label} ({level.score})</div>
                          <textarea
                            value={level.description}
                            onChange={(e) => updateQuestionRubricLevel(questionIndex, criterionIndex, levelIndex, 'description', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-xs h-16"
                            placeholder={`Description for ${level.label} level...`}
                          ></textarea>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    ))}

    {testData.questions.length > 0 && (
      <button
        type="button"
        onClick={addQuestion}
        className="px-4 py-2 bg-[#d97056] text-white rounded-md hover:bg-[#c5634c] transition"
      >
        + Add Question
      </button>
    )}
  </div>
)}

            {/* Review & Finalize Tab */}
            {activeTab === 'review' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Test Summary</h2>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium mb-2 text-[#d97056]">Basic Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Title:</p>
                      <p className="font-medium">{testData.title || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Start Time:</p>
                      <p className="font-medium">{testData.startTime ? new Date(testData.startTime).toLocaleString() : "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End Time (Deadline):</p>
                      <p className="font-medium">{testData.endTime ? new Date(testData.endTime).toLocaleString() : "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration:</p>
                      <p className="font-medium">{testData.isTimeLimited ? `${testData.duration} minutes` : "No time limit"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Class:</p>
                      <p className="font-medium">
                        {testData.classAssignment ? 
                          classes.find(c => c._id.toString() === testData.classAssignment.toString())?.name || "Unknown class" 
                          : "Not assigned"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Description:</p>
                      <p>{testData.description || "No description provided"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-400">
                  <h3 className="font-medium mb-2">Important Notes</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Once published, you can make limited edits to the test</li>
                    <li>Students will be able to see this test once published</li>
                    <li>Make sure all required fields are filled before publishing</li>
                    <li>Test cannot be deleted after students have started taking it</li>
                  </ul>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="font-medium mb-2 text-[#d97056]">Questions & Rubrics Summary</h3>
      {testData.questions.length === 0 ? (
        <p className="text-gray-500 italic">No questions added yet</p>
      ) : (
        <div className="space-y-4">
          <p className="mb-2">Total Questions: <span className="font-medium">{testData.questions.length}</span></p>
          
          {testData.questions.map((q, i) => (
            <div key={i} className="p-3 border border-gray-200 rounded-md">
              <div className="flex justify-between">
                <h4 className="font-medium">Q{i+1}: {q.questionText.substring(0, 40)}{q.questionText.length > 40 ? '...' : ''}</h4>
                <span className="text-gray-600">{q.maxMarks} marks</span>
              </div>
              
              {q.type === 'coding' && q.testCases && q.testCases.length > 0 && (
                <div className="mt-2 pl-4 border-l-2 border-gray-200">
                  <p className="text-sm font-medium text-[#d97056]">Test Cases:</p>
                  <p className="text-sm text-gray-600">
                    {q.testCases.length} test case{q.testCases.length > 1 ? 's' : ''} 
                    ({q.testCases.filter(tc => tc.isHidden).length} hidden)
                  </p>
                </div>
              )}

              {q.enableRubrics && q.rubric && q.rubric.criteria && q.rubric.criteria.length > 0 ? (
                <div className="mt-2 pl-4 border-l-2 border-gray-200">
                  <p className="text-sm font-medium text-[#d97056]">Rubric Criteria:</p>
                  <ul className="list-disc pl-5 text-sm space-y-1 mt-1">
                    {q.rubric.criteria.map((c, idx) => (
                      <li key={idx}>
                        {c.name || `Criterion ${idx+1}`} ({c.weight}%)
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-1">No custom rubric</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>

                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium mb-2 text-[#d97056]">Attached Files</h3>
                  {testData.files.length === 0 ? (
                    <p className="text-gray-500 italic">No files attached</p>
                  ) : (
                    <ul className="list-disc pl-5">
                      {testData.files.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
                
                
                {/* File upload area */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium mb-2 text-[#d97056]">Attach Files (Optional)</h3>
                  <p className="text-sm text-gray-500 mb-2">Upload any supplementary files for students</p>
                  
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    multiple
                  />
                  
                  {testData.files.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-sm mb-2">Attached Files:</h4>
                      <ul className="space-y-2">
                        {testData.files.map((file, index) => (
                          <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="truncate">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Validation warnings */}
                {(!testData.title || !testData.startTime || !testData.endTime || !testData.classAssignment || testData.questions.length === 0) && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          <strong>Please complete the following before publishing:</strong>
                        </p>
                        <ul className="mt-1 text-sm text-yellow-700 list-disc list-inside">
                          {!testData.title && <li>Add a test title</li>}
                          {!testData.startTime && <li>Set a start time</li>}
                          {!testData.endTime && <li>Set an end time</li>}
                          {!testData.classAssignment && <li>Assign to a class</li>}
                          {testData.questions.length === 0 && <li>Add at least one question</li>}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
              {activeTab !== 'details' && (
                <button
                  type="button"
                  onClick={() => {
                    const tabOrder = ['details', 'questions', 'review'];
                    const currentIndex = tabOrder.indexOf(activeTab);
                    setActiveTab(tabOrder[currentIndex - 1]);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                >
                  Previous
                </button>
              )}
              
              <div className="ml-auto flex space-x-3">
                {activeTab !== 'review' ? (
                  <button
                    type="button"
                    onClick={() => {
                      const tabOrder = ['details', 'questions', 'review'];
                      const currentIndex = tabOrder.indexOf(activeTab);
                      setActiveTab(tabOrder[currentIndex + 1]);
                    }}
                    className="px-4 py-2 bg-[#d97056] text-white rounded-md hover:bg-[#c5634c] transition"
                  >
                    Next
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={(e) => handleSubmit(e, true)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                    >
                      Save as Draft
                    </button>
                    <button
                      type="submit"
                      disabled={
                        !testData.title || 
                        !testData.startTime || 
                        !testData.endTime || 
                        !testData.classAssignment || 
                        testData.questions.length === 0
                      }
                      className={`px-4 py-2 rounded-md transition ${
                        !testData.title || 
                        !testData.startTime || 
                        !testData.endTime || 
                        !testData.classAssignment || 
                        testData.questions.length === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      Publish Test
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f5eee0] py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">© {new Date().getFullYear()} Gradia. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <Link href="/about" className="text-gray-600 hover:text-[#d97056]">About</Link>
            <Link href="/help" className="text-gray-600 hover:text-[#d97056]">Help Center</Link>
            <Link href="/privacy" className="text-gray-600 hover:text-[#d97056]">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-600 hover:text-[#d97056]">Terms of Service</Link>
          </div>
        </div>
      </footer>

      {/* Confirmation Modal */}
      <TestPublishConfirmationModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onConfirm={handleConfirmPublish}
        testTitle={testData.title || 'Untitled Test'}
      />
    </div>
  );
}