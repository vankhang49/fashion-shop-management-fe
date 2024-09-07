import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import CSS cho react-quill

const Editor = ({ value, onChange, className }) => {
  return (
    <div className={className}>
      <ReactQuill value={value} onChange={onChange}  />
    </div>
  );
};

export default Editor;
