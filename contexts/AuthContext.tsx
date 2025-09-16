


import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
// FIX: Import modular Firebase auth functions directly.
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import type { User, Resource, Comment, Report } from '../types';
import { processFileContent } from '../services/geminiService';
import { auth } from '../services/firebase';
import LoadingSpinner from '../components/LoadingSpinner';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  stories: Resource[];
  comments: Comment[];
  likes: Record<string, string[]>;
  reports: Report[];
  login: (email:string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  signup: (email:string, pass: string) => Promise<any>;
  addStory: (storyData: Omit<Resource, 'id' | 'authorId' | 'authorName' | 'status' | 'content' | 'imageUrl' | 'fileName' | 'tags' | 'likes'> & { file: File }) => Promise<void>;
  updateStory: (storyId: string, updates: Partial<Omit<Resource, 'id'>>) => void;
  addComment: (resourceId: string, text: string) => void;
  toggleLike: (resourceId: string) => void;
  reportContent: (resourceId: string, resourceTitle: string) => void;
  updateUserProfile: (name: string, imageFile: File | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<Resource[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState<Record<string, string[]>>({});
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    // FIX: Use onAuthStateChanged directly.
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        const storedProfile = localStorage.getItem(`profile_${user.uid}`);
        let name = user.displayName || user.email?.split('@')[0] || 'User';
        let imageUrl = `https://picsum.photos/seed/${user.uid}/200/200`;

        if (storedProfile) {
            try {
                const customProfile = JSON.parse(storedProfile);
                name = customProfile.name || name;
                imageUrl = customProfile.imageUrl || imageUrl;
            } catch (e) {
                console.error("Failed to parse stored profile", e);
            }
        }

        setCurrentUser({
          uid: user.uid,
          email: user.email,
          name: name,
          imageUrl: imageUrl,
        });

        // Load user's stories from localStorage
        const storedStories = localStorage.getItem(`stories_${user.uid}`);
        if (storedStories) {
          try {
            setStories(JSON.parse(storedStories));
          } catch (e) {
            console.error("Failed to parse stories from localStorage", e);
            setStories([]);
          }
        } else {
            setStories([]);
        }
      } else {
        setCurrentUser(null);
        setStories([]); // Clear stories when user logs out
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Load global community data from localStorage on startup
  useEffect(() => {
    try {
      const storedCommunityData = localStorage.getItem('community_data');
      if (storedCommunityData) {
        const { comments: storedComments, likes: storedLikes, reports: storedReports } = JSON.parse(storedCommunityData);
        setComments(storedComments || []);
        setLikes(storedLikes || {});
        setReports(storedReports || []);
      }
    } catch (e) {
      console.error("Failed to parse community data from localStorage", e);
    }
  }, []);

  // Persist global community data to localStorage whenever it changes
  useEffect(() => {
    try {
      const communityData = { comments, likes, reports };
      localStorage.setItem('community_data', JSON.stringify(communityData));
    } catch (error) {
      console.error("Could not save community data to localStorage:", error);
    }
  }, [comments, likes, reports]);

  // Persist user-specific stories to localStorage whenever they change
  useEffect(() => {
    if (currentUser && !loading) {
      try {
        localStorage.setItem(`stories_${currentUser.uid}`, JSON.stringify(stories));
      } catch (error) {
        console.error("Could not save stories to localStorage:", error);
      }
    }
  }, [stories, currentUser, loading]);


  const login = (email: string, password: string) => {
    // FIX: Use signInWithEmailAndPassword directly.
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    if (currentUser) {
      // Clear localStorage for the user on logout.
      localStorage.removeItem(`stories_${currentUser.uid}`);
    }
    setStories([]); // Clear stories from state immediately
    // FIX: Use signOut directly.
    return signOut(auth);
  };
  
  const signup = (email: string, password: string) => {
    // FIX: Use createUserWithEmailAndPassword directly.
    return createUserWithEmailAndPassword(auth, email, password);
  }

  const addStory = useCallback(async (storyData: Omit<Resource, 'id' | 'authorId' | 'authorName' | 'status' | 'content' | 'imageUrl' | 'fileName' | 'tags' | 'likes'> & { file: File }) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const token = await user.getIdToken();

    const { file, ...rest } = storyData;

    const newStory: Resource = {
      ...rest,
      id: `story-${Date.now()}`,
      authorId: user.uid,
      authorName: user.displayName || user.email?.split('@')[0] || 'User',
      status: 'processing',
      content: 'Processing in progress...',
      fileName: file.name,
      imageUrl: `https://picsum.photos/seed/${Date.now()}/400/300`,
      tags: [],
    };

    setStories(prev => [...prev, newStory]);

    try {
      const { content, tags } = await processFileContent(file, token);
      setStories(prevStories => prevStories.map(s => 
        s.id === newStory.id 
          ? { 
              ...s, 
              status: 'pending_review', 
              content: content,
              tags: tags,
            } 
          : s
      ));
    } catch (error) {
      console.error("Failed to process story:", error);
      setStories(prevStories => prevStories.map(s => 
        s.id === newStory.id 
          ? { 
              ...s, 
              status: 'pending_review',
              content: 'There was an error processing this story. Please review and publish or try uploading again.'
            } 
          : s
      ));
      // Re-throw the error to be caught in the component
      throw error;
    }
  }, []);
  
  const updateStory = (storyId: string, updates: Partial<Omit<Resource, 'id'>>) => {
    setStories(prevStories => prevStories.map(s => 
      s.id === storyId ? { ...s, ...updates } : s
    ));
  };
  
  const addComment = useCallback((resourceId: string, text: string) => {
    if (!currentUser) {
      console.error("User must be logged in to comment.");
      return;
    }
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      resourceId,
      authorId: currentUser.uid,
      authorName: currentUser.name || 'Anonymous',
      authorImageUrl: currentUser.imageUrl,
      text,
      timestamp: Date.now(),
    };
    setComments(prev => [...prev, newComment]);
  }, [currentUser]);

  const toggleLike = useCallback((resourceId: string) => {
    if (!currentUser) {
      console.error("User must be logged in to like.");
      return;
    }
    setLikes(prev => {
      const currentLikes = prev[resourceId] || [];
      const userHasLiked = currentLikes.includes(currentUser.uid);
      
      const newLikes = userHasLiked
        ? currentLikes.filter(uid => uid !== currentUser.uid)
        : [...currentLikes, currentUser.uid];
      
      return {
        ...prev,
        [resourceId]: newLikes,
      };
    });
  }, [currentUser]);

  const reportContent = useCallback((resourceId: string, resourceTitle: string) => {
    if (!currentUser) {
      console.error("User must be logged in to report content.");
      return;
    }
    // Prevent duplicate reports by the same user for the same resource
    if (reports.some(r => r.resourceId === resourceId && r.reporterId === currentUser.uid)) {
      console.log("Content already reported by this user.");
      return;
    }

    const newReport: Report = {
      resourceId,
      reporterId: currentUser.uid,
      timestamp: Date.now(),
      resourceTitle,
    };
    setReports(prev => [...prev, newReport]);
  }, [currentUser, reports]);


  const updateUserProfile = async (name: string, imageFile: File | null) => {
    const user = auth.currentUser;
    if (!user || !currentUser) throw new Error("User not authenticated");

    let newImageUrl = currentUser.imageUrl;
    
    if (imageFile) {
        newImageUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile!);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    }
    
    // Update Firebase Auth displayName
    // FIX: Use updateProfile directly.
    await updateProfile(user, { displayName: name });

    const updatedUser = {
        ...currentUser,
        name: name,
        imageUrl: newImageUrl,
    };

    setCurrentUser(updatedUser);
    localStorage.setItem(`profile_${user.uid}`, JSON.stringify({ name: name, imageUrl: newImageUrl }));
  };


  const value = {
    currentUser,
    loading,
    stories,
    comments,
    likes,
    reports,
    login,
    logout,
    signup,
    addStory, 
    updateStory,
    addComment,
    toggleLike,
    reportContent,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
            <LoadingSpinner/>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};