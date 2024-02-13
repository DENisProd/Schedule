import { useEffect } from 'react';

function usePreventPullToRefresh() {
    useEffect(() => {
        const preventPullToRefresh = (e) => {
            const deltaY = e.touches[0].clientY - startY;
            if (deltaY > 0) {
                // e.preventDefault();
            }
        };

        const touchStartHandler = (e) => {
            startY = e.touches[0].clientY;
            document.addEventListener('touchmove', preventPullToRefresh);
        };

        const touchEndHandler = () => {
            document.removeEventListener('touchmove', preventPullToRefresh);
        };

        let startY;

        document.addEventListener('touchstart', touchStartHandler);
        document.addEventListener('touchend', touchEndHandler);

        return () => {
            document.removeEventListener('touchstart', touchStartHandler);
            document.removeEventListener('touchend', touchEndHandler);
        };
    }, []);

    return null; // Нет необходимости возвращать компонент, поэтому вернем null
}

export default usePreventPullToRefresh;
