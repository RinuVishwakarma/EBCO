import { customColors } from '@/styles/MuiThemeRegistry/theme';
import { Box, Modal, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import "./AdModal.css"

interface AdModalProps {
    show: boolean;
    onClose: () => void;
    popupContent: string;
    popupContentMobile: string;
}

const AdModal: React.FC<AdModalProps> = ({ show, onClose, popupContent, popupContentMobile }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    if (!show) return null;
    if (isSmallScreen && popupContentMobile.length == 0) return null;
    if (!isSmallScreen && popupContent.length == 0) return null;
    return (
        <Modal
            open={show}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="ad-modal"
            sx={{
                height: '100vh',
                display: 'flex',
            }}
        >
            <Box
                sx={{
                    background: 'transparent',
                    outline: "none",
                    position: "relative",
                    borderRadius: "8px",
                    padding: "2rem",
                    maxWidth: "max-content",
                    width: "90%",
                    margin: "auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    boxShadow: "none",
                }}
                className="ad-modal-content"
            >
                <CancelOutlinedIcon
                    sx={{
                        color: customColors.whiteEbco,
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        width: "24px",
                        height: "24px",
                        cursor: "pointer",
                    }}
                    onClick={onClose}
                />
                <div
                    className='popupImage'
                    dangerouslySetInnerHTML={{
                        __html: isSmallScreen ? popupContentMobile : popupContent,

                    }}
                >

                </div>
            </Box>
        </Modal>
    );
};

export default AdModal;
