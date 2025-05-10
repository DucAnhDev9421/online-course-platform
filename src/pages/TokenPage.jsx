import React from 'react';
import TokenDisplay from '../components/TokenDisplay';

const TokenPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">API Token</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <TokenDisplay />
      </div>
    </div>
  );
};

export default TokenPage; 