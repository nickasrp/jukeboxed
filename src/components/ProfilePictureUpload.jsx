import React, { useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAuth } from '../contexts/AuthContext';

const ProfilePictureUpload = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
        setError('Please select a valid image file (JPEG, PNG, or GIF)');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    if (!token) {
      setError('Not authenticated');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

    try {
      console.log('Uploading with token:', token); // Debug log
      const response = await fetch('/api/upload-profile-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Note: Don't set Content-Type header when sending FormData
          // The browser will set it automatically with the correct boundary
        },
        body: formData,
      });

      console.log('Upload response status:', response.status); // Debug log
      const data = await response.json();
      console.log('Upload response data:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      if (onUploadSuccess) {
        onUploadSuccess(data.profilePicture);
      }
      
      // Reset form
      setSelectedFile(null);
      setPreviewUrl('');
    } catch (err) {
      console.error('Upload error:', err); // Debug log
      setError(err.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="profile-picture-upload"
        type="file"
        onChange={handleFileSelect}
      />
      <label htmlFor="profile-picture-upload">
        <Button
          variant="contained"
          component="span"
          startIcon={<CloudUploadIcon />}
          disabled={uploading}
        >
          Select Image
        </Button>
      </label>

      {previewUrl && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
          />
        </Box>
      )}

      {selectedFile && !uploading && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={uploading}
        >
          Upload
        </Button>
      )}

      {uploading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} />
          <Typography>Uploading...</Typography>
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ProfilePictureUpload; 