import {useRef, useState} from "react";
import styles from "./tasks.module.scss";

export default function ImagePicker({setParentImage}) {
    const [imageURL, setImageURL] = useState('');
    const [selectedFile, setSelectedFile] = useState(null)

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        // Ваш код для обработки выбранного файла
        console.log('Выбранный файл:', file.name);
        setSelectedFile(file); // Сохраняем выбранный файл в состоянии


        // Чтение файла и преобразование в Data URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageURL(reader.result);
            setParentImage && setParentImage(reader.result)
        };
        reader.readAsDataURL(file);
    };

    const clearFileInput = () => {
        fileInputRef.current.value = ''; // Очищаем значение input
        setSelectedFile(null); // Сбрасываем выбранный файл в состоянии
        setImageURL(''); // Очищаем URL изображения
    };

    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className={styles.file_select}>
            <div className={styles.customFileButton} onClick={handleButtonClick}>
                {selectedFile ? selectedFile.name : 'Выберите файл'}
            </div>
            <input
                type="file"
                id="fileInput"
                ref={fileInputRef}
                className={styles.hiddenInput}
                onChange={handleFileChange}
            />
            {imageURL && <img src={imageURL} alt="Выбранное изображение" className={styles.imagePreview} />}
            {selectedFile && (
                <button className={styles.clearButton} onClick={clearFileInput}>
                    Х
                </button>
            )}
        </div>
    )
}