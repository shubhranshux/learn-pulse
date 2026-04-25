import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, CheckCircle2, CirclePlay, Loader2, PlayCircle, AlertCircle, Video, ChevronDown, ChevronUp } from 'lucide-react';
import { useCompleteCourseMutation, useGetCourseProgressQuery, useInCompleteCourseMutation, useUpdateLectureProgressMutation } from '../../features/api/courseProgressApi';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

function CourseProgress() {
    const params = useParams();
    const courseId = params.courseId;
    const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);
    const [updateLectureProgress] = useUpdateLectureProgressMutation();
    const [completeCourse, { data: markCompleteData, isSuccess: completedSuccess }] = useCompleteCourseMutation();
    const [inCompleteCourse, { data: markInCompleteData, isSuccess: inCompletedSuccess }] = useInCompleteCourseMutation();

    const [currentLecture, setCurrentLecture] = useState(null);
    const [showLectures, setShowLectures] = useState(false);

    useEffect(() => {
        if (completedSuccess) {
            refetch();
            toast.success(markCompleteData.message);
        }
        if (inCompletedSuccess) {
            refetch()
            toast.success(markInCompleteData.message);
        }
    }, [completedSuccess, inCompletedSuccess]);

    if (isLoading) return (
        <div className='flex items-center justify-center min-h-[60vh]'>
            <div className='flex flex-col items-center gap-3'>
                <Loader2 className='h-8 w-8 animate-spin text-[#6366f1]' />
                <p className='text-muted-foreground text-sm'>Loading course...</p>
            </div>
        </div>
    );
    if (isError) return (
        <div className='flex items-center justify-center min-h-[60vh]'>
            <p className='text-destructive font-medium'>Failed to load course details</p>
        </div>
    );

    const { courseDetails, progress, completed } = data.data;
    const { courseTitle } = courseDetails;

    // Initialize the first lecture if not selected
    const initialLecture = currentLecture || (courseDetails.lectures && courseDetails.lectures[0]);

    const activeLecture = currentLecture || initialLecture;
    const activeVideoUrl = activeLecture?.videoUrl;

    const isLectureCompleted = (lectureId) => {
        return progress.some((prog) => prog.lectureId === lectureId && prog.viewed)
    }

    const handleLectureProgress = async (lectureId) => {
        await updateLectureProgress({ courseId, lectureId });
        refetch();
    }

    const handleSelectLecture = (lecture) => {
        setCurrentLecture(lecture);
        handleLectureProgress(lecture._id);
        // Auto-hide lecture list on mobile after selection
        setShowLectures(false);
    }

    const handleCompleteCourse = async () => {
        await completeCourse(courseId);
    }
    const handleInCompleteCourse = async () => {
        await inCompleteCourse(courseId);
    }

    return (
        <div className='bg-background min-h-screen'>
            {/* Top bar */}
            <div className='bg-[#1e1b4b] text-white px-4 sm:px-6 py-3 sm:py-4'>
                <div className='max-w-7xl mx-auto flex items-center justify-between gap-3'>
                    <h1 className='font-bold text-sm sm:text-lg truncate'>{courseTitle}</h1>
                    <Button
                        onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
                        size="sm"
                        className={`flex-shrink-0 text-xs sm:text-sm ${completed 
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg" 
                            : "bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg"}`}
                    >
                        {completed ? (
                            <><CheckCircle className='h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5' /> <span className='hidden sm:inline'>Completed</span><span className='sm:hidden'>Done</span></>
                        ) : <span className='hidden sm:inline'>Mark as completed</span>}
                        {!completed && <span className='sm:hidden'>Complete</span>}
                    </Button>
                </div>
            </div>

            <div className='max-w-7xl mx-auto flex flex-col lg:flex-row'>
                {/* Video section */}
                <div className='flex-1 p-3 sm:p-4 lg:p-6'>
                    <div className='bg-black rounded-lg sm:rounded-xl overflow-hidden shadow-xl'>
                        {activeVideoUrl ? (
                            <video
                                key={activeVideoUrl}
                                src={activeVideoUrl}
                                controls
                                className='w-full aspect-video'
                                onPlay={() => handleLectureProgress(activeLecture?._id)}
                            />
                        ) : (
                            <div className='w-full aspect-video flex flex-col items-center justify-center bg-[#1e1b4b]'>
                                <AlertCircle size={32} className='text-white/30 mb-2 sm:mb-3' />
                                <p className='text-white/50 font-medium text-sm'>No video uploaded for this lecture</p>
                                <p className='text-white/30 text-xs mt-1'>The instructor hasn't uploaded a video yet</p>
                            </div>
                        )}
                    </div>
                    {/* Current lecture title */}
                    <div className='mt-3 sm:mt-4'>
                        <h3 className='font-semibold text-base sm:text-lg'>
                            Lecture {courseDetails.lectures.findIndex((lec) => lec._id === activeLecture?._id) + 1}: {activeLecture?.lectureTitle}
                        </h3>
                    </div>

                    {/* Mobile lecture toggle */}
                    <button 
                        onClick={() => setShowLectures(!showLectures)}
                        className='lg:hidden flex items-center justify-between w-full mt-4 px-4 py-3 bg-card border border-border rounded-xl text-sm font-medium'
                    >
                        <span>Course Content ({courseDetails.lectures.length} lectures)</span>
                        {showLectures ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>

                {/* Lecture sidebar - hidden on mobile by default, shown via toggle */}
                <div className={`w-full lg:w-[360px] border-t lg:border-t-0 lg:border-l border-border bg-card ${showLectures ? 'block' : 'hidden lg:block'}`}>
                    <div className='p-3 sm:p-4 border-b border-border'>
                        <h2 className='font-bold text-sm sm:text-base'>Course Content</h2>
                        <p className='text-[10px] sm:text-xs text-muted-foreground mt-0.5'>{courseDetails.lectures.length} lectures</p>
                    </div>
                    <div className='overflow-y-auto max-h-[50vh] lg:max-h-[calc(100vh-200px)]'>
                        {courseDetails?.lectures.map((lecture, idx) => (
                            <div
                                key={lecture._id}
                                className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-3.5 cursor-pointer border-b border-border/50 transition-colors duration-200 ${
                                    lecture._id === activeLecture?._id 
                                        ? 'bg-[#6366f1]/10 border-l-2 border-l-[#6366f1]' 
                                        : 'hover:bg-muted/50'
                                }`}
                                onClick={() => handleSelectLecture(lecture)}
                            >
                                <div className='flex-shrink-0'>
                                    {isLectureCompleted(lecture._id) ? (
                                        <CheckCircle2 size={16} className='text-emerald-500' />
                                    ) : (
                                        <CirclePlay size={16} className='text-muted-foreground' />
                                    )}
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className={`text-xs sm:text-sm font-medium truncate ${
                                        lecture._id === activeLecture?._id ? 'text-[#6366f1]' : ''
                                    }`}>
                                        {idx + 1}. {lecture.lectureTitle}
                                    </p>
                                    <div className='flex items-center gap-2 mt-0.5'>
                                        {lecture.videoUrl ? (
                                            <span className='text-[9px] sm:text-[10px] text-muted-foreground flex items-center gap-0.5'>
                                                <Video size={9} /> Video
                                            </span>
                                        ) : (
                                            <span className='text-[9px] sm:text-[10px] text-amber-500'>No video</span>
                                        )}
                                    </div>
                                </div>
                                {isLectureCompleted(lecture._id) && (
                                    <Badge variant='outline' className='text-[9px] sm:text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-1.5 py-0 flex-shrink-0'>Done</Badge>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseProgress
