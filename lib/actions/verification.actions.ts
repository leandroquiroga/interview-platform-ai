"use client";

export const sendVerificationCode = async (name: string, email: string) => {
  try {
    const response = await fetch('/api/auth/send-verification-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending verification code:', error);
    return { success: false, message: 'Network error. Please try again.' };
  }
};

export const verifyCode = async (email: string, code: string, password: string) => {
  try {
    const response = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, password }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error verifying code:', error);
    return { success: false, message: 'Network error. Please try again.' };
  }
};

export const resendVerificationCode = async (email: string) => {
  try {
    // Obtener datos del signup desde sessionStorage
    const signupDataStr = sessionStorage.getItem('signup-data');
    if (!signupDataStr) {
      return { success: false, message: 'Session expired. Please start registration again.' };
    }

    const signupData = JSON.parse(signupDataStr);
    const { name } = signupData;

    return await sendVerificationCode(name, email);
  } catch (error) {
    console.error('Error resending verification code:', error);
    return { success: false, message: 'Failed to resend code. Please try again.' };
  }
};
