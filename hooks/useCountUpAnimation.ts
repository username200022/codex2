import { useEffect, type RefObject } from 'react';

/**
 * A custom hook that finds all `<code>` elements within a container
 * and applies a "count up" animation to any numbers they contain.
 *
 * @param ref A React ref to the container element whose children will be animated.
 * @param dependency The dependency that should trigger the animation, e.g., the node data.
 */
export const useCountUpAnimation = (ref: RefObject<HTMLElement>, dependency: any) => {
    useEffect(() => {
        if (!ref.current || !dependency) return;

        const elements = ref.current.querySelectorAll('code');

        elements.forEach(element => {
            const el = element as HTMLElement;
            // Store original content to restore formatting (e.g., currency symbols)
            const originalContent = el.textContent || '';
            
            // Extract the first number found in the text content
            const match = originalContent.match(/([\d,]+\.?\d*)/);
            if (!match) return;

            const endValue = parseFloat(match[1].replace(/,/g, ''));
            if (isNaN(endValue)) return;
            
            const duration = 1500; // Animation duration in ms
            let startTime: number | null = null;
            
            const animate = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const progress = timestamp - startTime;
                
                const percentage = Math.min(progress / duration, 1);
                const currentValue = Math.floor(percentage * endValue);
                
                // Restore the original formatting around the new number
                el.textContent = originalContent.replace(match[1], currentValue.toLocaleString());
                
                if (progress < duration) {
                    requestAnimationFrame(animate);
                } else {
                    // Ensure the final value is exact and has original formatting
                    el.textContent = originalContent.replace(match[1], endValue.toLocaleString());
                }
            };

            requestAnimationFrame(animate);
        });

    // We want this effect to re-run whenever the content it depends on changes.
    }, [dependency, ref]);
};
