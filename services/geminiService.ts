const API_BASE_URL = 'http://localhost:3001/api';

// Helper to convert a File to a base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

export const summarizeText = async (text: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error("Error summarizing text:", error);
    return "Sorry, I couldn't generate a summary via the backend. Please try again later.";
  }
};

export const processFileContent = async (file: File, token: string): Promise<{ content: string; tags: string[] }> => {
  try {
    const fileData = await fileToBase64(file);
    const response = await fetch(`${API_BASE_URL}/process-file`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ fileData, mimeType: file.type }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error("Error processing file:", error);
    return {
      content: "Sorry, I couldn't process the file via the backend. Please try again.",
      tags: [],
    };
  }
};

export const getChatResponse = async (history: { role: string, parts: { text: string }[] }[], message: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history, message }),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error("Error getting chat response:", error);
        return "I'm sorry, but I encountered an error connecting to the server. Please try again.";
    }
};