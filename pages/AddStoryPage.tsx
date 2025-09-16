
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const AddStoryPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser, addStory } = useAuth();
  const navigate = useNavigate();
  
  const ALLOWED_TYPES = [
    'application/pdf',
    'text/plain',
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (ALLOWED_TYPES.includes(selectedFile.type) || selectedFile.type.startsWith('audio/')) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please upload a valid PDF, DOC, TXT, or audio file.');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !shortDescription || !file) {
      setError('Please fill in all fields and select a file.');
      return;
    }
    if (!currentUser) {
      setError('You must be logged in to add a story.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await addStory({ title, category, shortDescription, file });
      navigate('/profile');
    } catch (err) {
      console.error("Error adding story:", err);
      setError("There was an unexpected error uploading your story. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!currentUser) {
    return (
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-brand-blue">Login Required</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-2 mb-4">You need to be logged in to add your story.</p>
            <Link 
              to="/auth"
              className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
            >
              Go to Login
            </Link>
        </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue mb-2">Add Your Story</h1>
          <p className="text-slate-600 dark:text-slate-300">Fill out the details below and upload your document or audio file. We'll handle the content extraction and summarization.</p>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Story Title</label>
          <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-brand-blue focus:border-brand-blue bg-white dark:bg-slate-700 text-slate-900 dark:text-white" required />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
          <input type="text" id="category" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g., Personal, Fiction, History" className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-brand-blue focus:border-brand-blue bg-white dark:bg-slate-700 text-slate-900 dark:text-white" required />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Short Description</label>
          <textarea id="description" value={shortDescription} onChange={e => setShortDescription(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-brand-blue focus:border-brand-blue bg-white dark:bg-slate-700 text-slate-900 dark:text-white" required />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Story File (Document or Audio)</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-slate-600 dark:text-slate-400">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-slate-700 rounded-md font-medium text-brand-blue hover:text-brand-orange focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-blue">
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf,.doc,.docx,text/plain,audio/*" onChange={handleFileChange} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-slate-500">PDF, DOC, TXT, MP3, WAV up to 25MB</p>
            </div>
          </div>
          {file && <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Selected file: <span className="font-medium">{file.name}</span></p>}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange disabled:bg-slate-400">
          {isLoading ? <LoadingSpinner /> : 'Upload Story'}
        </button>
      </form>
    </div>
  );
};

export default AddStoryPage;