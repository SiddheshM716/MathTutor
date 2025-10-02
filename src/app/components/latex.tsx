"use client";

import { useState, useEffect } from 'react';

// This component safely renders raw HTML/LaTeX on the client only
export default function Latex({ content }: { content: string }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // This effect runs only on the client, after the initial render
        setIsMounted(true);
    }, []);

    // Render nothing on the server to prevent a mismatch
    if (!isMounted) {
        return null;
    }

    // After mounting on the client, render the actual content
    return <span dangerouslySetInnerHTML={{ __html: content }} />;
}