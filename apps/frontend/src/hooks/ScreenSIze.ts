import { useEffect, useState } from "react";


interface ScreeSize {
    width: number,
    height: number
}

const useScreenSize = (): ScreeSize => {
    const [screenSize, setScreenSize] = useState<ScreeSize>({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return screenSize;

}

export default useScreenSize;