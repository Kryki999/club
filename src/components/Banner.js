import React, { useState, useRef, useEffect } from 'react';
import './Banner.css';

const Banner = () => {
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.error("Error playing video:", error);
            });
        }
    }, []);

    return (
        <section className="banner">
            <div className="video-container">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="background-video"
                    onLoadedData={() => setIsVideoLoaded(true)}
                    onError={(e) => console.error("Video error:", e)}
                >
                    <source
                        src="/videos/banner.mp4"
                        type="video/mp4"
                    />
                    Twoja przeglądarka nie wspiera tagu video.
                </video>
                {!isVideoLoaded && (
                    <div className="video-loading">
                        Ładowanie video...
                    </div>
                )}
                <div className="video-overlay"></div>
            </div>
            <div className="banner-content">
                <h1 className="banner-title">Letnia Strefa</h1>
                <p className="banner-subtitle">Najlepsze miejsce na nocną imprezę</p>
                <button className="banner-button">Wydarzenia</button>
            </div>
        </section>
    );
};

export default Banner; 