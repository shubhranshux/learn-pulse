import React, { useState } from 'react'
import Filter from "./Filter";
import SearchResult from "./SearchResult";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, Search, Loader2, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetSearchCourseQuery } from '../../features/api/courseApi';

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useGetSearchCourseQuery({
    searchQuery: query,
    categories: selectedCategories,
    sortByPrice
  });

  const isEmpty = !isLoading && data?.courses.length === 0;

  const handleFilterChange = (categories, price) => {
    setSelectedCategories(categories);
    setSortByPrice(price);
  }
  return (
    <div className='max-w-7xl mx-auto p-4 sm:p-6 md:p-8'>
      <div className='my-4 sm:my-6'>
        <div className='flex items-center gap-2 sm:gap-3 mb-2'>
          <div className='h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-lg'>
            <Search size={16} className='text-white' />
          </div>
          <h1 className='font-bold text-lg sm:text-xl md:text-2xl'>Search Results</h1>
        </div>
        <p className='text-muted-foreground text-sm'>
          Showing results for{" "}
          <span className='text-[#6366f1] font-bold'>"{query}"</span>
          {data?.courses && !isLoading && (
            <span className='text-xs sm:text-sm ml-1 sm:ml-2'>({data.courses.length} courses found)</span>
          )}
        </p>
      </div>

      {/* Mobile filter toggle */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setShowFilters(!showFilters)}
        className="md:hidden mb-4 rounded-lg text-xs"
      >
        {showFilters ? <X size={14} className="mr-1.5" /> : <SlidersHorizontal size={14} className="mr-1.5" />}
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </Button>

      <div className='flex flex-col md:flex-row gap-6 sm:gap-10'>
        <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
          <Filter handleFilterChange={handleFilterChange} />
        </div>
        <div className='flex-1'>
          {
            isLoading ? (
              <div>
                <div className='flex items-center gap-2 mb-4 sm:mb-6 text-muted-foreground'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <span className='text-xs sm:text-sm font-medium'>Searching courses...</span>
                </div>
                {Array.from({ length: 3 }).map((_, idx) =>
                  <CourseSkeleton key={idx} />
                )}
              </div>
            ) : isEmpty ? (<CourseNotFound query={query} />) : (
              data?.courses?.map((course) =>
                <SearchResult key={course._id} course={course} />
              )
            )
          }
        </div>
      </div>
    </div>
  )
}

export default SearchPage

const CourseNotFound = ({ query }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[250px] sm:min-h-[300px] rounded-xl sm:rounded-2xl border-2 border-dashed border-border bg-card/50 p-6 sm:p-8">
      <div className='h-14 w-14 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-destructive/10 flex items-center justify-center mb-3 sm:mb-4'>
        <AlertCircle className="text-destructive h-7 w-7 sm:h-8 sm:w-8" />
      </div>
      <h1 className="font-bold text-lg sm:text-xl text-foreground mb-2 text-center">
        No courses found
      </h1>
      <p className="text-muted-foreground text-center max-w-md mb-4 sm:mb-6 text-sm">
        We couldn't find any courses matching "<span className='font-semibold'>{query}</span>". Try a different search term.
      </p>
      <Link to="/">
        <Button className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white border-0 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold px-6 text-sm">
          Browse All Courses
        </Button>
      </Link>
    </div>
  );
};

const CourseSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col sm:flex-row justify-between border-b border-border/50 py-4 sm:py-5 animate-pulse">
      <div className="h-32 sm:h-36 w-full sm:w-56 md:w-64 rounded-lg sm:rounded-xl overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="flex flex-col gap-2 sm:gap-3 flex-1 px-0 sm:px-4 py-2 mt-3 sm:mt-0">
        <Skeleton className="h-4 sm:h-5 w-3/4 rounded-lg" />
        <Skeleton className="h-3 sm:h-4 w-1/2 rounded-lg" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 sm:h-4 w-1/3 rounded-lg" />
        </div>
        <Skeleton className="h-5 sm:h-6 w-20 mt-1 sm:mt-2 rounded-lg" />
      </div>
    </div>
  );
};