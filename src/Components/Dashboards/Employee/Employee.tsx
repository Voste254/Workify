import React, { useState } from 'react';
import Topbar from './Topbar';
import FilterControls from './FilterControls';
import Joblist from './Joblist';
import Pagination from './Pagination';

interface Job {
  id: string;
  company: string;
  logo: string;
  title: string;
  location: string;
  daysLeft: number;
  categories: string[];
  salary: {
    min: number;
    max: number;
    period: string;
  };
  type: string;
  featured?: boolean;
}

const Employee: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Location');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filters, setFilters] = useState({
    jobType: 'All Job Types',
    category: 'All Job Categories',
    salary: 'All Salaries',
    posted: 'Posted Anytime',
    seniority: 'Seniority Levels'
  });

  const jobs: Job[] = [
    {
      id: '1',
      company: 'TechCorp Solutions',
      logo: '/logos/techcorp.png',
      title: 'Senior Full Stack Developer',
      location: 'San Francisco, CA',
      daysLeft: 2,
      categories: ['Engineering', 'Full-time'],
      salary: { min: 120000, max: 180000, period: 'year' },
      type: 'Remote',
      featured: true
    },
    {
      id: '2',
      company: 'Creative Studios',
      logo: '/logos/creative.png',
      title: 'UI/UX Product Designer',
      location: 'New York, NY',
      daysLeft: 5,
      categories: ['Design', 'Full-time'],
      salary: { min: 90000, max: 130000, period: 'year' },
      type: 'Hybrid'
    },
    {
      id: '3',
      company: 'DataFlow Inc',
      logo: '/logos/dataflow.png',
      title: 'Data Science Lead',
      location: 'Austin, TX',
      daysLeft: 3,
      categories: ['Data Science', 'Full-time'],
      salary: { min: 140000, max: 200000, period: 'year' },
      type: 'On-site',
      featured: true
    },
    {
      id: '4',
      company: 'MarketHub',
      logo: '/logos/markethub.png',
      title: 'Digital Marketing Manager',
      location: 'Los Angeles, CA',
      daysLeft: 7,
      categories: ['Marketing', 'Full-time'],
      salary: { min: 80000, max: 110000, period: 'year' },
      type: 'Remote'
    },
    {
      id: '5',
      company: 'CloudTech Systems',
      logo: '/logos/cloudtech.png',
      title: 'DevOps Engineer',
      location: 'Seattle, WA',
      daysLeft: 4,
      categories: ['Engineering', 'Full-time'],
      salary: { min: 110000, max: 160000, period: 'year' },
      type: 'Hybrid'
    },
    {
      id: '6',
      company: 'FinanceAI',
      logo: '/logos/financeai.png',
      title: 'Product Manager',
      location: 'Boston, MA',
      daysLeft: 6,
      categories: ['Product', 'Full-time'],
      salary: { min: 130000, max: 170000, period: 'year' },
      type: 'Remote',
      featured: true
    }
  ];

  const handleSearch = () => {
    console.log('Searching:', searchQuery, selectedLocation, filters);
  };

  const handleFilterApply = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Topbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Hero Section */}
        <div className="mb-8 lg:mb-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3">
              Find Your Dream Job
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Discover thousands of opportunities from top companies around the world
            </p>
          </div>

          <FilterControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            onSearch={handleSearch}
            onFilterClick={() => setShowFilterModal(true)}
            showFilterModal={showFilterModal}
            onCloseModal={() => setShowFilterModal(false)}
            filters={filters}
            onFilterApply={handleFilterApply}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </div>

        <Joblist 
          jobs={jobs} 
          totalResults={jobs.length}
          viewMode={viewMode}
        />

        <div className="mt-8 lg:mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={5}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
    </div>
  );
};

export default Employee;