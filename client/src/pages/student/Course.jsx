import React from 'react'
import { Card, CardContent } from '@/components/ui/card';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Link } from 'react-router-dom'
import { Users } from 'lucide-react';

function Course({ course }) {
    return (
        <Link to={`/course-detail/${course._id}`}>
            <Card className="overflow-hidden rounded-xl sm:rounded-2xl bg-card border border-border/60 shadow-sm hover:shadow-2xl hover:shadow-[#6366f1]/10 transform hover:scale-[1.02] sm:hover:scale-[1.03] hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-400 group cursor-pointer">
                <div className='relative overflow-hidden'>
                    <img src={course.courseThumbnail}
                        alt={course.courseTitle}
                        className="w-full h-36 sm:h-44 object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                    {/* Overlay gradient */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400' />
                    {course.courseLevel && (
                        <Badge className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 text-[#312e81] backdrop-blur-sm text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-lg border-0 px-2 py-0.5 sm:px-2.5 sm:py-1">
                            {course.courseLevel}
                        </Badge>
                    )}
                    {/* Play button on hover */}
                    <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400'>
                        <div className='h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/90 flex items-center justify-center shadow-xl transform scale-50 group-hover:scale-100 transition-transform duration-400'>
                            <div className='w-0 h-0 border-t-[6px] sm:border-t-[8px] border-t-transparent border-l-[10px] sm:border-l-[14px] border-l-[#312e81] border-b-[6px] sm:border-b-[8px] border-b-transparent ml-0.5 sm:ml-1' />
                        </div>
                    </div>
                </div>
                <CardContent className="px-3 py-3 sm:px-5 sm:py-4 space-y-2 sm:space-y-3">
                    <h1 className='font-bold text-[13px] sm:text-[15px] line-clamp-2 leading-snug group-hover:text-[#6366f1] transition-colors duration-300'>{course.courseTitle}</h1>
                    <div className='flex items-center gap-2'>
                        <Avatar className="h-5 w-5 sm:h-6 sm:w-6 ring-2 ring-[#6366f1]/10">
                            <AvatarImage src={course.creator?.photoUrl || "https://github.com/shadcn.png"} />
                            <AvatarFallback className="bg-[#6366f1]/10 text-[#6366f1] text-[8px] sm:text-[10px] font-bold">{course.creator?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className='font-medium text-[10px] sm:text-xs text-muted-foreground truncate'>{course.creator?.name}</span>
                    </div>
                    <div className='flex items-center justify-between pt-2 sm:pt-2.5 border-t border-border/50'>
                        <span className='text-lg sm:text-xl font-black bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent'>
                            {(!course.coursePrice || course.coursePrice === 0) ? 'FREE' : `₹${course.coursePrice}`}
                        </span>
                        <div className='flex items-center gap-1 text-muted-foreground'>
                            <Users size={11} />
                            <span className='text-[10px] sm:text-[11px] font-medium'>{course.enrolledStudents?.length || 0} enrolled</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default Course
