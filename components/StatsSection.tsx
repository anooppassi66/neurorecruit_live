// StatsSection.tsx
import React from 'react';

// Define the structure for a statistic block
interface Stat {
  percentage: string;
  type: 'Reduction' | 'Increase';
  descriptionTop: string;
  descriptionBottom: string;
}

const stats: Stat[] = [
  {
    percentage: '70%',
    type: 'Reduction',
    descriptionTop: 'time-to-hire by streamlining the',
    descriptionBottom: 'candidate experience.',
  },
  {
    percentage: '97%',
    type: 'Reduction',
    descriptionTop: 'in scheduling administration work,',
    descriptionBottom: 'freeing resources.',
  },
  {
    percentage: '50%',
    type: 'Increase',
    descriptionTop: 'in hiring velocity in high-volume',
    descriptionBottom: 'high-turnover roles.',
  },
];

const StatsSection: React.FC = () => {
  // Green color used for the statistics in the image
  const statColor = '#3a53a5'; 
  const boldTextColor = 'text-gray-800';

  return (
    <div className="bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col items-center justify-start h-full px-4">
            
            {/* Percentage/Change */}
            <h2 
              className="text-7xl font-extrabold mb-1" 
              style={{ color: statColor }} // Inline style for precise color match
            >
              {stat.percentage}
            </h2>
            <h3 className="text-4xl font-normal text-gray-800 mb-8">
              {stat.type}
            </h3>

            {/* Description - Mimicking the line breaks and bold/italic style */}
            <div className="text-base text-gray-600 leading-relaxed max-w-xs mx-auto">
                {/* First line of description */}
                <p className='mb-0 text-lg'>{stat.descriptionTop}</p>
                {/* Second line, which is bolded/italicized in the image */}
                <p className={`mt-0 text-lg font-bold italic ${boldTextColor}`}>
                    {stat.descriptionBottom}
                </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;