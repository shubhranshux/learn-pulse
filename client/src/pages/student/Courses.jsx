import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import Course from './Course';
import { useGetPublishedCoursesQuery } from '../../features/api/courseApi';
import { AlertCircle, BookOpen, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function Courses() {
    const { data, isLoading, isError } = useGetPublishedCoursesQuery();
    const navigate = useNavigate();

    if (isError) return (
        <div className='flex flex-col items-center justify-center py-16 sm:py-20 px-4'>
            <AlertCircle className='h-10 w-10 sm:h-12 sm:w-12 text-destructive mb-4' />
            <h2 className='text-lg sm:text-xl font-semibold text-foreground text-center'>Something went wrong</h2>
            <p className='text-muted-foreground mt-2 text-sm text-center'>We couldn't load courses. Please try again later.</p>
        </div>
    )

    const hasCourses = data?.courses && data.courses.length > 0;

    return (
        <div className='bg-background relative'>
            {/* Subtle pattern */}
            <div className='absolute inset-0 opacity-[0.02]' style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)`,
                backgroundSize: '32px 32px'
            }} />

            <div className='max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative'>
                <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 sm:mb-12 gap-3 sm:gap-4'>
                    <div>
                        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366f1]/10 text-[#6366f1] text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2 sm:mb-3'>
                            <TrendingUp size={12} />
                            Featured Courses
                        </div>
                        <h2 className='font-black text-2xl sm:text-3xl md:text-4xl tracking-tight text-foreground'>Explore Our Top Courses</h2>
                        <p className='text-muted-foreground mt-1.5 sm:mt-2 max-w-lg text-sm sm:text-base'>Handpicked courses from expert instructors to help you reach your goals</p>
                    </div>
                    {hasCourses && (
                        <Button 
                            onClick={() => navigate('/course/search?query')}
                            variant="outline" 
                            size="sm"
                            className="rounded-xl self-start sm:self-auto border-[#6366f1]/30 text-[#6366f1] hover:bg-[#6366f1]/5 font-semibold text-xs sm:text-sm"
                        >
                            View All Courses
                        </Button>
                    )}
                </div>

                {isLoading ? (
                    <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6'>
                        {Array.from({ length: 8 }).map((_, index) => (
                            <CourseSkeleton key={index} />
                        ))}
                    </div>
                ) : hasCourses ? (
                    <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6'>
                        {data.courses.map((course, index) => <Course key={index} course={course} />)}
                    </div>
                ) : (
                    /* Empty state - when no courses are published yet */
                    <div className='flex flex-col items-center justify-center py-16 sm:py-20 rounded-2xl sm:rounded-3xl border-2 border-dashed border-border bg-card/50 px-4'>
                        <div className='h-16 w-16 sm:h-20 sm:w-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-xl shadow-[#6366f1]/20 mb-4 sm:mb-6'>
                            <BookOpen size={28} className='text-white' />
                        </div>
                        <h3 className='font-bold text-lg sm:text-xl text-foreground mb-2 text-center'>No courses published yet</h3>
                        <p className='text-muted-foreground text-center max-w-md mb-4 sm:mb-6 text-sm'>
                            Courses will appear here once instructors publish them. Check back soon for exciting new content!
                        </p>
                        <Button 
                            onClick={() => navigate('/course/search?query')}
                            className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white border-0 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold px-6 text-sm"
                        >
                            Browse All Categories
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Courses;

const CourseSkeleton = () => {
    return (
        <div className='bg-card border border-border/50 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm'>
            <Skeleton className="w-full h-36 sm:h-44" />
            <div className='px-3 py-3 sm:px-5 sm:py-4 space-y-2 sm:space-y-3'>
                <Skeleton className="h-4 sm:h-5 w-3/4 rounded-lg" />
                <div className='flex items-center gap-2 sm:gap-3'>
                    <Skeleton className="h-5 w-5 sm:h-7 sm:w-7 rounded-full" />
                    <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 rounded-lg" />
                </div>
                <div className='flex items-center justify-between pt-2 sm:pt-3 border-t border-border/30'>
                    <Skeleton className="h-5 sm:h-6 w-14 sm:w-16 rounded-lg" />
                    <Skeleton className="h-3 w-16 sm:w-20 rounded-lg" />
                </div>
            </div>
        </div>
    )
}
