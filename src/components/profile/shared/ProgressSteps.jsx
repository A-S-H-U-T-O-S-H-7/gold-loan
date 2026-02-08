import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function ProgressSteps({ steps = [], currentStep = 1 }) {
  return (
    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200">
        <div
          className="h-full bg-linear-to-b from-primary-500 to-primary-600 transition-all duration-500"
          style={{ height: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>

      <div className="space-y-8">
        {steps.map((step, index) => {
          const isCompleted = index + 1 < currentStep;
          const isCurrent = index + 1 === currentStep;

          return (
            <div key={step.id} className="relative flex items-start">
              <div
                className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                  isCompleted
                    ? 'bg-linear-to-br from-green-500 to-emerald-600'
                    : isCurrent
                    ? 'bg-linear-to-br from-primary-500 to-primary-600 animate-pulse'
                    : 'bg-gray-200'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="h-7 w-7 text-white" />
                ) : (
                  <step.icon className={`h-7 w-7 ${isCurrent ? 'text-white' : 'text-gray-500'}`} />
                )}
              </div>

              <div className="ml-6 flex-1 pt-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-bold text-lg ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.title}
                  </h4>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isCompleted
                        ? 'bg-green-100 text-green-700'
                        : isCurrent
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {isCompleted ? 'Completed' : isCurrent ? 'Current' : 'Pending'}
                  </div>
                </div>

                <p className={`${isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'} mb-3`}>
                  {step.description}
                </p>

                <div className="flex items-center text-sm">
                  <svg className={`h-4 w-4 mr-1 ${isCompleted || isCurrent ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className={isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'}>
                    {step.date} - {step.time}
                  </span>
                </div>

                {isCurrent && step.action && (
                  <button className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition">
                    {step.action}
                  </button>
                )}
              </div>

              <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white border-4 border-white rounded-full flex items-center justify-center shadow-md">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    isCompleted ? 'bg-green-500' : isCurrent ? 'bg-primary-500' : 'bg-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
