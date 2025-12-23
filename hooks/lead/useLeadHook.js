'use client';
import { useState, useCallback } from 'react';

const COOKIE_NAME = 'fortune_lead';
const COOKIE_EXPIRY_DAYS = 30;

// Lead sources enum
export const LEAD_SOURCES = {
  BROCHURE_DOWNLOAD: 'brochure_download',
  VIEW_PLAN: 'view_plan',
  REQUEST_INFORMATION: 'request_information',
  REQUEST_PRICELIST: 'request_pricelist',
  GET_EXCLUSIVE_OFFER: 'get_exclusive_offer',
  GET_PRICE: 'get_price',
  WHATSAPP_INQUIRY: 'whatsapp_inquiry',
};

// ============ COOKIE UTILITIES ============

// Set cookie
const setCookie = (name, value, days) => {
  if (typeof window === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
};

// Get cookie
const getCookie = (name) => {
  if (typeof window === 'undefined') return null;
  
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      try {
        return JSON.parse(decodeURIComponent(cookie.substring(nameEQ.length)));
      } catch {
        return null;
      }
    }
  }
  return null;
};

// Delete cookie
const deleteCookie = (name) => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// ============ EXPORTED UTILITIES ============

// Check if lead already submitted (cookie check)
export const hasSubmittedLead = () => {
  const data = getCookie(COOKIE_NAME);
  return !!data;
};

// Get submitted lead data from cookie
export const getSubmittedLeadData = () => {
  return getCookie(COOKIE_NAME);
};

// Clear lead cookie (for testing/logout)
export const clearLeadCookie = () => {
  deleteCookie(COOKIE_NAME);
};

// Save lead to cookie
const saveLeadToCookie = (leadData) => {
  setCookie(COOKIE_NAME, {
    name: leadData.lead_name,
    phone: leadData.lead_phone,
    phone_ccode: leadData.lead_phone_ccode,
    email: leadData.lead_email,
    submitted_at: new Date().toISOString(),
  }, COOKIE_EXPIRY_DAYS);
};

// ============ HOOK ============

export function useLeadHook() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Submit lead to API
  const submitLead = useCallback(async (leadData) => {
    setIsSubmitting(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: leadData.project_id,
          project_name: leadData.project_name,
          lead_name: leadData.lead_name,
          lead_phone: leadData.lead_phone,
          lead_phone_ccode: leadData.lead_phone_ccode || null,
          lead_email: leadData.lead_email || null,
          lead_source: leadData.lead_source || null,
          comments: leadData.comments || null,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit lead');
      }

      // Save to cookie on success
      saveLeadToCookie(leadData);
      setIsSuccess(true);

      return {
        success: true,
        lead_id: result.data?.lead_id,
      };
    } catch (err) {
      const errorMessage = err.message || 'Something went wrong';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Reset states
  const resetState = useCallback(() => {
    setError(null);
    setIsSuccess(false);
  }, []);

  return {
    // States
    isSubmitting,
    error,
    isSuccess,
    
    // Methods
    submitLead,
    resetState,
    
    // Utility functions (also exported directly)
    hasSubmittedLead,
    getSubmittedLeadData,
    clearLeadCookie,
  };
}

export default useLeadHook;