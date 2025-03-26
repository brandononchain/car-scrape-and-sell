
import { FacebookAuth } from '@/types';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Facebook OAuth
export async function initiateFacebookAuth(): Promise<{ authUrl: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/facebook/init`, {
      method: 'GET',
      credentials: 'include', // Important for maintaining session
    });
    
    if (!response.ok) {
      throw new Error('Failed to initiate Facebook authentication');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Facebook auth initiation error:', error);
    throw error;
  }
}

export async function getFacebookAuthStatus(): Promise<FacebookAuth> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/facebook/status`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      return { isConnected: false };
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Facebook auth status:', error);
    return { isConnected: false };
  }
}

export async function disconnectFacebook(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/facebook/disconnect`, {
      method: 'POST',
      credentials: 'include',
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error disconnecting Facebook:', error);
    return false;
  }
}

// Google Sheets OAuth
export async function initiateGoogleAuth(): Promise<{ authUrl: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google/init`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to initiate Google authentication');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Google auth initiation error:', error);
    throw error;
  }
}

export async function getGoogleAuthStatus(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google/status`, {
      method: 'GET',
      credentials: 'include',
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error fetching Google auth status:', error);
    return false;
  }
}

export async function disconnectGoogle(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google/disconnect`, {
      method: 'POST',
      credentials: 'include',
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error disconnecting Google:', error);
    return false;
  }
}
