// ResourceCategories.tsx
import React from 'react';
// Assuming you have installed lucide-react for icons: npm install lucide-react
import { Factory, DollarSign, ShoppingCart, Utensils, TrendingUp } from 'lucide-react'; 

// --- Data Structure Definition ---

// Define the structure for a category button
interface Category {
    name: string;
    Icon: React.ElementType;
}

// Colors derived from the image:
// Background: Dark Teal (using #124D4A)
// Pills/Highlight: Light Green (using #6AA84F)
// Text/Icon on Pills: Darker Teal (using #124D4A)
const categories: Category[] = [
    { name: 'Manufacturing', Icon: Factory }, 
    { name: 'Healthcare', Icon: DollarSign }, 
    { name: 'Retail', Icon: ShoppingCart }, 
    { name: 'Hospitality', Icon: Utensils }, 
    { name: 'Professional Services', Icon: TrendingUp }, 
];

// --- React Component ---

const ResourceCategories: React.FC = () => {
    const bgColor = 'bg-[#3a53a5]';
    const pillColor = 'bg-[#fff]';
    // The correct dark teal color from the screenshot
    const textColor = 'text-[#000]'; 
    const highlightColor = 'text-[#fff]';

    // ✨ FIX for the TypeScript error (Property 'categories' does not exist...):
    // Destructure the Icon and name for the 5th item (Professional Services).
    // This allows us to use 'ProfessionalServicesIcon' as a capitalized JSX tag.
    const { Icon: ProfessionalServicesIcon, name: professionalServicesName } = categories[4];

    return (
        <div className={`${bgColor} min-h-screen flex flex-col items-center justify-center p-8`}>
            {/* Header Text */}
            <div className="text-center mb-10 max-w-4xl">
                <p className="text-xl md:text-2xl text-white font-normal">
                    Whether you're a seasoned recruiter or hiring your first employee,
                    <br />
                    <span className={`${highlightColor} font-semibold`}>We have helpful resources just for you.</span>
                </p>
            </div>

            {/* Categories Grid (4 items on top row, 1 item on bottom row) */}
            <div className="flex flex-col items-center space-y-4">
                
                {/* Top Row: 4 Categories */}
                <div className="flex flex-wrap justify-center gap-4">
                    {categories.slice(0, 4).map((category) => (
                        <button
                            key={category.name}
                            className={`flex items-center space-x-2 px-6 py-3 ${pillColor} ${textColor} rounded-full text-lg font-semibold hover:bg-[#93C47D] transition-colors`}
                        >
                            {/* Correct dynamic component usage inside a map */}
                            <category.Icon className={`w-5 h-5 ${textColor}`} />
                            <span>{category.name}</span>
                        </button>
                    ))}
                </div>

                {/* Bottom Row: 1 Category (Uses the destructured variables) */}
                <div className="mt-4">
                    <button
                        key={professionalServicesName}
                        className={`flex items-center space-x-2 px-6 py-3 ${pillColor} ${textColor} rounded-full text-lg font-semibold hover:bg-[#93C47D] transition-colors`}
                    >
                        {/* ✅ Correct usage: Use the capitalized variable 'ProfessionalServicesIcon' */}
                        <ProfessionalServicesIcon className={`w-5 h-5 ${textColor}`} />
                        <span>{professionalServicesName}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResourceCategories;