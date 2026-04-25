import { Badge } from "@/components/ui/badge";
import React from "react";
import { Link } from "react-router-dom";

const SearchResult = ({ course }) => {
   
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border/50 py-4 gap-3 sm:gap-4 hover:bg-muted/30 transition-colors duration-200 rounded-lg px-2 -mx-2">
      <Link
        to={`/course-detail/${course._id}`}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
      >
        <img
          src={course.courseThumbnail}
          alt={course.courseTitle}
          className="h-32 sm:h-28 w-full sm:w-48 md:w-56 object-cover rounded-lg sm:rounded-xl flex-shrink-0"
        />
        <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0">
          <h1 className="font-bold text-base sm:text-lg md:text-xl text-foreground line-clamp-2">{course.courseTitle}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{course.subTitle}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Instructor: <span className="font-semibold text-foreground">{course.creator?.name}</span>{" "}
          </p>
          <Badge className="w-fit text-[10px] sm:text-xs">{course.courseLevel}</Badge>
        </div>
      </Link>
      <div className="sm:text-right w-full sm:w-auto flex-shrink-0">
        <h1 className="font-bold text-lg sm:text-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
          {(!course.coursePrice || course.coursePrice === 0) ? 'FREE' : `₹${course.coursePrice}`}
        </h1>
      </div>
    </div>
  );
};

export default SearchResult;