import React from 'react';
import { Files } from 'react-bootstrap-icons';

interface FileUploadProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onChange }) => {
    const handleFileClick = () => {
        const fileInput = document.getElementById("file-input") as HTMLInputElement;
        if (fileInput) {
            fileInput.click();
        }
    };

    return (
        <div className="file-upload-container" style={{marginRight: '5px'}}>
            <button type='button' onClick={handleFileClick} className="btn btn-outline-primary">
                <Files size={18} />
            </button>

            <input
                id="file-input"
                type="file"
                style={{ display: 'none' }}
                onChange={onChange}
            />
        </div>
    );
};

export default FileUpload;