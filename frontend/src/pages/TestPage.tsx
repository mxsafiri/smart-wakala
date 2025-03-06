import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Test Page</h1>
        <p className="text-gray-600 mb-4">
          This is a simple test page to check if React is rendering correctly.
        </p>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => alert('Button clicked!')}
        >
          Click Me
        </button>
      </div>
    </div>
  );
};

export default TestPage;
