import React, { useEffect, useRef, useState, useCallback } from "react";
import CourseCard from "@/components/ui/dashboard/course-card";
import { Course } from "@/lib/definition";

export default function CardViewCourseList({ courses }: { courses: Course[] }) {
    const [visibleItems, setVisibleItems] = useState<Course[]>([]);
    const [lastVisibleItemIndex, setLastVisibleItemIndex] = useState(0);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = parseInt(
                            (entry.target as HTMLElement).dataset.index!,
                            10
                        );
                        setLastVisibleItemIndex((prevIndex) =>
                            index > prevIndex
                                ? Math.max(prevIndex, index)
                                : index
                        );
                    }
                });
            },
            { root: null, rootMargin: "0px", threshold: 0.9 }
        );

        observerRef.current = observer;

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        const start = Math.max(0, lastVisibleItemIndex - 4);
        const end = Math.min(courses.length, lastVisibleItemIndex + 6);
        setVisibleItems(courses.slice(start, end));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastVisibleItemIndex]);

    useEffect(() => {
        setLastVisibleItemIndex(0);
        setVisibleItems(courses.slice(0, 10));
    }, [courses]);

    const setObserver = useCallback((node: Element) => {
        if (node !== null && observerRef.current) {
            observerRef.current.observe(node);
        }
    }, []);

    const cleanupObserver = useCallback((node: Element) => {
        if (node !== null && observerRef.current) {
            observerRef.current.unobserve(node);
        }
    }, []);

    return (
        <div className="flex flex-col gap-4">
            {visibleItems.map((course, index) => {
                const dataIndex = Math.max(0, lastVisibleItemIndex - 4) + index;
                return (
                    <div
                        key={course.courseId + dataIndex}
                        data-index={dataIndex}
                        ref={(node) => {
                            if (node) {
                                cleanupObserver(node);
                                setObserver(node);
                            }
                        }}
                    >
                        <CourseCard course={course} />
                    </div>
                );
            })}
        </div>
    );
}
