import React from 'react'
import Course from './Course';
import { useLoadUserQuery } from "@/features/api/authApi";
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function MyLearning() {
  const { data, isLoading } = useLoadUserQuery();
  const myLearning = data?.user.enrolledCourses || [];
  const navigate = useNavigate();

  return (
    <div className='max-w-6xl mx-auto my-8 sm:my-12 px-4 sm:px-6'>
      <div className='mb-6 sm:mb-8'>
        <h1 className='font-extrabold text-2xl sm:text-3xl tracking-tight'>My Learning</h1>
        <p className='text-muted-foreground mt-1 text-sm sm:text-base'>Continue where you left off</p>
      </div>
      <div>
        {
          isLoading ? (
            <MyLearningSkeleton />
          ) : myLearning.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16 sm:py-20 bg-muted/30 rounded-xl sm:rounded-2xl border border-border/50 px-4'>
              <div className='h-14 w-14 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4'>
                <BookOpen size={24} className='text-primary' />
              </div>
              <h3 className='font-semibold text-base sm:text-lg'>No courses yet</h3>
              <p className='text-muted-foreground mt-1 mb-3 sm:mb-4 text-sm text-center'>Start learning by enrolling in a course</p>
              <Button onClick={() => navigate('/')} className='gradient-bg text-white border-0 rounded-xl shadow-lg text-sm'>
                Browse Courses
              </Button>
            </div>
          ) : (
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6'>
              {
                myLearning.map((course, index) => <Course key={index} course={course} />)
              }
            </div>
          )
        }
      </div>
    </div>
  )
}

export default MyLearning

//Skeleton component for loading state
const MyLearningSkeleton = () => (
  <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6'>
    {[...Array(4)].map((_, index) => (
      <div key={index} className='bg-card border border-border/50 rounded-xl sm:rounded-2xl overflow-hidden'>
        <Skeleton className='h-36 sm:h-40 w-full' />
        <div className='p-3 sm:p-4 space-y-2 sm:space-y-3'>
          <Skeleton className='h-4 sm:h-5 w-3/4 rounded-lg' />
          <Skeleton className='h-3 sm:h-4 w-1/2 rounded-lg' />
          <Skeleton className='h-3 sm:h-4 w-1/4 rounded-lg' />
        </div>
      </div>
    ))}
  </div>
);