import { BadgeInfo, PlayCircle, Lock, Users, Clock, Loader2, CheckCircle2, Star, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BuyCourseButton from '../../components/BuyCourseButton';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCourseDetailWithStatusQuery, useEnrollFreeMutation } from '../../features/api/purchaseApi';
import ReactPlayer from 'react-player';
import { useState } from 'react';
import { toast } from 'sonner';

function CourseDetail() {
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCourseDetailWithStatusQuery(courseId);
  const [selectedLecture, setSelectedLecture] = useState(null);

  if (isLoading) return (
    <div className='flex items-center justify-center min-h-[60vh]'>
      <div className='flex flex-col items-center gap-3'>
        <Loader2 className='h-8 w-8 animate-spin text-[#6366f1]' />
        <p className='text-muted-foreground text-sm'>Loading course details...</p>
      </div>
    </div>
  );
  if (isError) return (
    <div className='flex items-center justify-center min-h-[60vh]'>
      <p className='text-destructive font-medium'>Failed to load course details</p>
    </div>
  );

  const { course, purchased } = data;

  const handleContinueCourse = () => {
    if (purchased) {
      navigate(`/course-progress/${courseId}`)
    }
  }

  // Find the first lecture with a video for preview
  const previewLecture = selectedLecture || course.lectures?.find(l => l.isPreviewFree && l.videoUrl) || course.lectures?.[0];
  const previewVideoUrl = previewLecture?.videoUrl;

  return (
    <div className='bg-background min-h-screen'>
      {/* Top section - dark background */}
      <div className='bg-[#1e1b4b]'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10'>
          {/* Breadcrumb */}
          <button onClick={() => navigate(-1)} className='flex items-center gap-1.5 text-white/50 hover:text-white/80 text-xs sm:text-sm mb-4 sm:mb-5 transition-colors'>
            <ArrowLeft size={14} />
            Back to courses
          </button>

          <div className='flex flex-col lg:flex-row gap-6 sm:gap-10'>
            {/* Left - Course info */}
            <div className='flex-1'>
              <Badge className="bg-white/10 text-white/80 border-white/10 mb-3 sm:mb-4 text-[10px] sm:text-xs font-medium">
                {course?.category}
              </Badge>
              <h1 className='text-white font-bold text-xl sm:text-2xl md:text-3xl leading-tight mb-2 sm:mb-3'>{course?.courseTitle}</h1>
              <p className='text-white/60 text-sm sm:text-base mb-4 sm:mb-5'>{course?.subTitle}</p>
              
              <div className='flex flex-wrap items-center gap-x-3 sm:gap-x-5 gap-y-1.5 sm:gap-y-2 text-xs sm:text-sm text-white/50 mb-3 sm:mb-4'>
                <span>Created by <span className='text-[#a78bfa] font-medium'>{course?.creator?.name}</span></span>
                <span className='flex items-center gap-1'><Users size={12} /> {course?.enrolledStudents?.length || 0} students</span>
                <span className='flex items-center gap-1'><Clock size={12} /> {course?.lectures?.length || 0} lectures</span>
                <span className='flex items-center gap-1 hidden sm:flex'><BadgeInfo size={12} /> Updated {course?.createdAt?.split("T")[0]}</span>
              </div>

              {course?.courseLevel && (
                <Badge variant="outline" className="text-white/70 border-white/20 text-[10px] sm:text-xs">
                  {course.courseLevel} Level
                </Badge>
              )}
            </div>

            {/* Right - Video preview */}
            <div className='w-full lg:w-[420px] flex-shrink-0'>
              <div className='rounded-xl overflow-hidden shadow-2xl bg-black'>
                {previewVideoUrl ? (
                  <div className='aspect-video'>
                    <ReactPlayer
                      width="100%"
                      height="100%"
                      url={previewVideoUrl}
                      controls={true}
                      light={false}
                      config={{
                        file: {
                          attributes: { controlsList: 'nodownload' }
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className='aspect-video flex items-center justify-center bg-[#312e81]'>
                    {course?.courseThumbnail ? (
                      <img src={course.courseThumbnail} alt={course.courseTitle} className='w-full h-full object-cover opacity-60' />
                    ) : (
                      <div className='text-center'>
                        <PlayCircle size={40} className='text-white/30 mx-auto mb-2' />
                        <p className='text-white/40 text-xs sm:text-sm'>No preview available</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Price card */}
              <div className='bg-card border border-border rounded-xl p-4 sm:p-5 mt-3 sm:mt-4 shadow-lg'>
                <div className='flex items-baseline gap-2 sm:gap-3 mb-3 sm:mb-4'>
                  {(!course?.coursePrice || course?.coursePrice === 0) ? (
                    <span className='text-2xl sm:text-3xl font-bold text-emerald-600'>FREE</span>
                  ) : (
                    <>
                      <span className='text-2xl sm:text-3xl font-bold text-foreground'>₹{course?.coursePrice}</span>
                      <span className='text-base sm:text-lg text-muted-foreground line-through'>₹{Math.round(course?.coursePrice * 1.5)}</span>
                      <span className='text-xs sm:text-sm text-emerald-600 font-semibold'>33% off</span>
                    </>
                  )}
                </div>
                {purchased ? (
                  <Button onClick={handleContinueCourse} className="w-full h-10 sm:h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg transition-all duration-300 text-sm">
                    <PlayCircle size={16} className='mr-2' />
                    Continue Learning
                  </Button>
                ) : (!course?.coursePrice || course?.coursePrice === 0) ? (
                  <EnrollFreeButton courseId={courseId} />
                ) : (
                  <BuyCourseButton courseId={courseId} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section - details */}
      <div className='max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10'>
        <div className='flex flex-col lg:flex-row gap-6 sm:gap-10'>
          {/* Left content */}
          <div className='flex-1 space-y-6 sm:space-y-8'>
            {/* What you'll learn */}
            <div>
              <h2 className='font-bold text-lg sm:text-xl mb-3 sm:mb-4'>About This Course</h2>
              <div className='text-muted-foreground text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none' dangerouslySetInnerHTML={{ __html: course?.description || "<p>No description available</p>" }} />
            </div>

            {/* Course content */}
            <div>
              <h2 className='font-bold text-lg sm:text-xl mb-1'>Course Content</h2>
              <p className='text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4'>{course?.lectures?.length || 0} lectures</p>
              <div className='border border-border rounded-xl overflow-hidden'>
                {course?.lectures?.map((lecture, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => {
                      if (lecture.isPreviewFree || purchased) {
                        setSelectedLecture(lecture);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-3.5 text-sm border-b border-border last:border-b-0 transition-colors duration-200 ${
                      (lecture.isPreviewFree || purchased) ? 'hover:bg-muted/50 cursor-pointer' : ''
                    } ${selectedLecture?._id === lecture._id ? 'bg-[#6366f1]/5' : ''}`}
                  >
                    <span className='flex-shrink-0 h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-muted flex items-center justify-center text-[10px] sm:text-xs font-bold text-muted-foreground'>
                      {idx + 1}
                    </span>
                    {purchased || lecture.isPreviewFree ? (
                      <PlayCircle size={15} className='text-[#6366f1] flex-shrink-0' />
                    ) : (
                      <Lock size={13} className='text-muted-foreground flex-shrink-0' />
                    )}
                    <span className='font-medium flex-1 text-xs sm:text-sm truncate'>{lecture.lectureTitle}</span>
                    {lecture.isPreviewFree && !purchased && (
                      <span className='text-[10px] sm:text-xs text-[#6366f1] font-semibold bg-[#6366f1]/10 px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0'>Preview</span>
                    )}
                    {lecture.videoUrl && (purchased || lecture.isPreviewFree) && (
                      <span className='text-[10px] sm:text-xs text-muted-foreground hidden sm:inline'>Video</span>
                    )}
                  </div>
                ))}
                {(!course?.lectures || course.lectures.length === 0) && (
                  <div className='px-4 py-6 sm:py-8 text-center text-muted-foreground text-xs sm:text-sm'>
                    No lectures available yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right sidebar - instructor info */}
          <div className='w-full lg:w-[420px] flex-shrink-0'>
            <div className='bg-card border border-border rounded-xl p-4 sm:p-5 shadow-sm sticky top-20 sm:top-24'>
              <h3 className='font-bold text-xs sm:text-sm uppercase tracking-wider text-muted-foreground mb-2 sm:mb-3'>Instructor</h3>
              <div className='flex items-center gap-3 mb-3 sm:mb-4'>
                <img 
                  src={course?.creator?.photoUrl || 'https://github.com/shadcn.png'} 
                  alt={course?.creator?.name} 
                  className='h-10 w-10 sm:h-12 sm:w-12 rounded-full ring-2 ring-border object-cover'
                />
                <div>
                  <p className='font-semibold text-sm sm:text-base'>{course?.creator?.name}</p>
                  <p className='text-[10px] sm:text-xs text-muted-foreground'>Course Instructor</p>
                </div>
              </div>
              <Separator className='my-3 sm:my-4' />
              <h3 className='font-bold text-xs sm:text-sm uppercase tracking-wider text-muted-foreground mb-2 sm:mb-3'>This course includes</h3>
              <ul className='space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-muted-foreground'>
                <li className='flex items-center gap-2'><CheckCircle2 size={13} className='text-emerald-500 flex-shrink-0' /> {course?.lectures?.length || 0} video lectures</li>
                <li className='flex items-center gap-2'><CheckCircle2 size={13} className='text-emerald-500 flex-shrink-0' /> Full lifetime access</li>
                <li className='flex items-center gap-2'><CheckCircle2 size={13} className='text-emerald-500 flex-shrink-0' /> Certificate of completion</li>
                <li className='flex items-center gap-2'><CheckCircle2 size={13} className='text-emerald-500 flex-shrink-0' /> Access on mobile and desktop</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;

// Inline component for free course enrollment
function EnrollFreeButton({ courseId }) {
  const [enrollFree, { isLoading }] = useEnrollFreeMutation();

  const handleEnroll = async () => {
    try {
      const res = await enrollFree({ courseId }).unwrap();
      if (res?.success) {
        toast.success(res.message || "Enrolled successfully!");
        window.location.reload();
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to enroll.");
    }
  };

  return (
    <Button onClick={handleEnroll} disabled={isLoading} className="w-full h-10 sm:h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white border-0 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base">
      {isLoading ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enrolling...</>
      ) : (
        <><CheckCircle2 className="mr-2 h-4 w-4" /> Enroll for Free</>
      )}
    </Button>
  );
}
