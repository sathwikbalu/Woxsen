import React from 'react';

export const GoogleFitConnect: React.FC = () => {
  const handleConnect = (): void => {
    window.open('http://LOCALHOST:5000/api/google-fit-auth', '_blank');
  };

  return (
    <button onClick={handleConnect}>
      Connect Google Fit
    </button>
  );
};


