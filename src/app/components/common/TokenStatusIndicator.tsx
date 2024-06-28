import React from 'react';
import { Spinner, Tooltip } from "@nextui-org/react";

type TokenStatus = 'loading' | 'valid' | 'invalid';

interface TokenStatusIndicatorProps {
  status: TokenStatus;
}

const TokenStatusIndicator: React.FC<TokenStatusIndicatorProps> = ({ status }) => {
  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <Tooltip 
            content="Checking token status..." 
            classNames={{
              content: ["text-green-text"]
            }}
          >
            <div>
              <Spinner size="sm" />
            </div>
          </Tooltip>
        );
      case 'valid':
        return (
          <Tooltip 
            content="Your token is valid. You can proceed with ingredient extraction." 
            classNames={{
              content: ["text-green-text"]
            }}
          >
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </Tooltip>
        );
      case 'invalid':
        return (
          <Tooltip 
            content="Your token is invalid or has expired. Please authenticate to continue." 
            classNames={{
              content: ["text-green-text"]
            }}
          >
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
          </Tooltip>
        );
    }
  };

  return (
    <div className="flex items-center justify-center w-8 h-8">
      {renderContent()}
    </div>
  );
};

export default TokenStatusIndicator;