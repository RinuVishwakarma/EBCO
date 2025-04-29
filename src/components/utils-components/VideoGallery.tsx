import React from 'react';
import { Box } from '@mui/material';

interface VideoGalleryProps {
    videoLink: string;
    ytLink: string;
    videoId: string;
    extractVideoUrl: (url: string) => string;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({
    videoLink,
    ytLink,
    videoId,
    extractVideoUrl,
}) => {
    return (
        <>
            {videoLink.length > 0 && (
                <Box
                    className="product-video-container"
                    sx={{
                        position: 'relative',
                        width: '100%',
                        paddingTop: '57%',
                        overflow: 'hidden',
                        height: '0',
                        marginBottom: '1rem',
                    }}
                >
                    <video
                        className="product-video product-image"
                        autoPlay
                        muted
                        loop
                        controlsList="nodownload"
                        style={{
                            width: '100%',
                            height: '100% !important',
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            objectFit: 'fill',
                        }}
                    >
                        <source src={videoLink} type="video/mp4" />
                    </video>
                </Box>
            )}

            {ytLink.length > 0 && videoId.length === 0 && (
                <Box
                    className="product-video-container"
                    sx={{
                        position: 'relative',
                        width: '100%',
                        paddingTop: '57%',
                        overflow: 'hidden',
                        height: '0',
                        marginBottom: '1rem',
                    }}
                >
                    <iframe
                        width="853"
                        height="480"
                        src={extractVideoUrl(ytLink)}
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Embedded YouTube"
                        className="product-video product-image"
                        style={{
                            width: '100%',
                            height: '100% !important',
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            objectFit: 'fill',
                            border: 'none',
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#000',
                            opacity: 0,
                            zIndex: 1,
                        }}
                    />
                </Box>
            )}
        </>
    );
};

export default VideoGallery;
