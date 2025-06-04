import React from 'react';

const SkeletonCourseCard = () => (
  <div className="bg-white rounded-lg shadow p-4 animate-pulse flex flex-col gap-3">
    <div className="w-full h-40 bg-gray-200 rounded mb-2" />
    <div className="h-5 bg-gray-200 rounded w-3/4 mb-1" />
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
    <div className="flex items-center gap-2 mt-auto">
      <div className="h-8 w-8 bg-gray-200 rounded-full" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
    </div>
    <div className="h-4 bg-gray-200 rounded w-1/4 mt-2" />
  </div>
);

export default SkeletonCourseCard; 