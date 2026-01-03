import { RefObject } from 'react';

//!! Scroll functions for navigation buttons
//!! Accepts a ref to the scroll container element
export const scrollLeft = (scrollContainerRef: RefObject<HTMLDivElement | null>) => {
    if (scrollContainerRef.current) {
        const cardWidth = 300 + 24; // card width + gap
        scrollContainerRef.current.scrollBy({
            left: -cardWidth,
            behavior: 'smooth',
        });
    }
};

export const scrollRight = (scrollContainerRef: RefObject<HTMLDivElement | null>) => {
    if (scrollContainerRef.current) {
        const cardWidth = 300 + 24; // card width + gap
        scrollContainerRef.current.scrollBy({
            left: cardWidth,
            behavior: 'smooth',
        });
    }
};

