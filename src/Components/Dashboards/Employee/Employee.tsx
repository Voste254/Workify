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
}

const Employee: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Location');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    jobType: 'All Job Types',
    category: 'All Job Categories',
    salary: 'All Salaries',
    posted: 'Posted Anytime',
    seniority: 'Seniority Levels'
  });

  // Sample job data
  const jobs: Job[] = [
    {
      id: '1',
      company: 'Rockstar Games New York',
      logo: '/logos/rockstar.png',
      title: 'Senior UI/UX Designer',
      location: 'Las Vegas, NV 89107, USA',
      daysLeft: 2,
      categories: ['Accounting', 'Sales & Marketing'],
      salary: { min: 1000, max: 2000, period: 'year' }
    },
    {
      id: '2',
      company: 'Rockstar Games New York',
      logo: '/logos/microsoft.png',
      title: 'Project Manager',
      location: 'Las Vegas, NV 89107, USA',
      daysLeft: 5,
      categories: ['UI UX Design', 'Accounting'],
      salary: { min: 1000, max: 1300, period: 'year' }
    },
    {
      id: '3',
      company: 'Rockstar Games New York',
      logo: '/logos/ibm.png',
      title: 'Senior UI/UX Designer',
      location: 'Las Vegas, NV 89107, USA',
      daysLeft: 6,
      categories: ['UI UX Design', 'Project Manager', 'Accounting'],
      salary: { min: 2000, max: 2400, period: 'year' }
    },
    {
      id: '4',
      company: 'Rockstar Games New York',
      logo: '/logos/netflix.png',
      title: 'Full Stack Development',
      location: 'Las Vegas, NV 89107, USA',
      daysLeft: 7,
      categories: ['UI UX Design', 'Project Manager'],
      salary: { min: 1100, max: 1500, period: 'year' }
    }
  ];

  const handleSearch = () => {
    console.log('Searching for:', searchQuery, 'in location:', selectedLocation);
  };

  const handleFilterApply = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  };

  const totalResults = jobs.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        />

        <div className="mt-8">
          <Joblist jobs={jobs} totalResults={totalResults} />
        </div>

        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={5}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Employee;