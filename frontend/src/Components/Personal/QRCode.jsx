import styles from './personal.module.scss'
import yastudent from '../../assets/yastudent_logo.svg'
import QRCodeStyling from "qr-code-styling";
import {useEffect, useRef, useState} from "react";
import {Button} from "../UIKit/Button/Button";

const qrCode = new QRCodeStyling({
    width: 250,
    height: 250,
    image: yastudent,
    dotsOptions: {
        color: "#000000",
        type: "extra-rounded"
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 0
    },
    cornersDotOptions: {
        type: "extra-rounded"
    },
    cornersSquareOptions: {
        type: "extra-rounded"
    }
});

export const QRCode = ({ userId }) => {
    const [url, setUrl] = useState("https://schedule.darksecrets.ru/invite/"+userId);
    const [fileExt, setFileExt] = useState("png");
    const ref = useRef(null);

    useEffect(() => {
        qrCode.append(ref.current);
    }, []);

    useEffect(() => {
        qrCode.update({
            data: url
        });
    }, [url]);

    const onDownloadClick = () => {
        qrCode.download({
            extension: fileExt
        });
    };

    return (
        <>
            <div className={styles.qrcode} ref={ref} />
            <Button onClick={onDownloadClick}>Скачать QR код</Button>
        </>
    )
}