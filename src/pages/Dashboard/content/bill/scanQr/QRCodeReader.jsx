import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';

const QRCodeReader = ({ handleScan, handleError }) => {
    const [isCameraConnected, setIsCameraConnected] = useState(true);

    const handleScanResult = (data) => {
        if (data) {
            try {
                const parsedData = JSON.parse(data.text);
                handleScan(parsedData);
                setIsCameraConnected(false); // Stop the camera after a successful scan
            } catch (error) {
                handleError(error);
            }
        }
    };

    const handleScanError = (error) => {
        handleError(error);
    };

    const previewStyle = {
        height: 240,
        width: 320,
    };

    return (
        <div>
            {isCameraConnected && (
                <QrScanner
                    delay={300}
                    style={previewStyle}
                    onError={handleScanError}
                    onScan={handleScanResult}
                />
            )}
        </div>
    );
};

export default QRCodeReader;
