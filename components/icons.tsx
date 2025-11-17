import React from 'react';

interface IconProps {
  className?: string;
}

export const PlayIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const PauseIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

export const MinusIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
  </svg>
);

export const EditIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

export const TextSizeIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M6.75 3.5a.75.75 0 000 1.5h1.75v8.5a.75.75 0 001.5 0V5h1.75a.75.75 0 000-1.5H6.75z" />
        <path fillRule="evenodd" d="M3 3a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H3.75A.75.75 0 013 3z" clipRule="evenodd" />
    </svg>
);

export const SpeedIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M5.5 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM14.5 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        <path fillRule="evenodd" d="M8.32 3.655A.75.75 0 019 4.309v3.642l1.68-1.344a.75.75 0 11.94 1.176l-3 2.4a.75.75 0 01-.94 0l-3-2.4a.75.75 0 11.94-1.176L8.25 7.95V4.31a.75.75 0 01.07-.355zM11.68 3.655a.75.75 0 01.63.654v3.642l1.68-1.344a.75.75 0 11.94 1.176l-3 2.4a.75.75 0 01-.94 0l-3-2.4a.75.75 0 11.94-1.176L11.5 7.95V4.31a.75.75 0 01.18-.5z" clipRule="evenodd" />
    </svg>
);

export const MicrophoneIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
        <path d="M5.5 8.5a.5.5 0 01.5.5v1.5a4 4 0 004 4h0a4 4 0 004-4V9a.5.5 0 011 0v1.5a5 5 0 01-5 5h0a5 5 0 01-5-5V9a.5.5 0 01.5-.5z" />
        <path d="M10 18a.5.5 0 00.5-.5v-2.09a.5.5 0 00-1 0V17.5a.5.5 0 00.5.5zM10 2a.5.5 0 00-1 0v1a.5.5 0 001 0V2z" />
        <path d="M13.89 4.11a.5.5 0 00-.707-.707l-.707.707a.5.5 0 10.707.707l.707-.707zM6.818 13.182a.5.5 0 00.707.707l.707-.707a.5.5 0 10-.707-.707l-.707.707z" />
        <path d="M13.182 6.818a.5.5 0 00.707-.707l-.707-.707a.5.5 0 00-.707.707l.707.707zM6.11 4.11a.5.5 0 00.707.707l-.707-.707a.5.5 0 10-.707.707l.707-.707z" />
    </svg>
);

export const MicrophoneOffIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 18a.5.5 0 00.5-.5v-2.09a.5.5 0 00-1 0V17.5a.5.5 0 00.5.5zM10 2a.5.5 0 00-1 0v1a.5.5 0 001 0V2z" />
    <path d="M13.89 4.11a.5.5 0 00-.707-.707l-.707.707a.5.5 0 10.707.707l.707-.707zM6.818 13.182a.5.5 0 00.707.707l.707-.707a.5.5 0 10-.707-.707l-.707.707z" />
    <path d="M13.182 6.818a.5.5 0 00.707-.707l-.707-.707a.5.5 0 00-.707.707l.707.707zM6.11 4.11a.5.5 0 00.707.707l-.707-.707a.5.5 0 10-.707.707l.707-.707z" />
    <path fillRule="evenodd" d="M10 3a3 3 0 00-3 3v6a3 3 0 005.465 1.597l-6.172-6.172A2.986 2.986 0 0010 3zM4.21 4.21a.5.5 0 00-.707.707L14.793 16.2a.5.5 0 00.707-.707L4.21 4.21zM5.5 9.5A.5.5 0 016 9v1.5a4 4 0 004 4h0a3.982 3.982 0 002.502-1.006l-1.5-1.5A2.5 2.5 0 0110 13a2.5 2.5 0 01-2.5-2.5V9a.5.5 0 01.5-.5z" clipRule="evenodd" />
  </svg>
);

export const VolumeIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const BackIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);