"use client";

import { useRouter } from 'next/navigation';

const BackButton = () => {

    const router = useRouter();

    const handleBack = () => {
        
        if (window.history.length > 1) {
            router.back(); // Using Next.js router for consistency
        } else {
            router.push('/webapp'); // Fallback to home if no history exists
        }
    };

    return (
        <button onClick={() => {handleBack()}} type="button"><i className="icofont-swoosh-left"></i></button>
    )
}

export default BackButton
