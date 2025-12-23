'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import { useLeadHook, hasSubmittedLead, LEAD_SOURCES } from '@/hooks/lead/useLeadHook';

const LeadCaptureContext = createContext(null);

// Pending action types
export const PENDING_ACTIONS = {
  OPEN_BROCHURE: 'open_brochure',
  OPEN_WHATSAPP: 'open_whatsapp',
  VIEW_FLOORPLAN: 'view_floorplan',
  CALL_PHONE: 'call_phone',
  NONE: 'none',
};

export function LeadCaptureProvider({ children, projectId, projectName }) {
  // Popup state
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [leadSource, setLeadSource] = useState(null);
  
  // Pending action - kya karna hai submit ke baad
  const [pendingAction, setPendingAction] = useState({
    type: PENDING_ACTIONS.NONE,
    data: null,
  });

  // Lead hook
  const leadHook = useLeadHook();

  // Check if lead already submitted
  const isLeadSubmitted = useCallback(() => {
    return hasSubmittedLead();
  }, []);

  // Open popup with source and pending action
  const openLeadPopup = useCallback((source, actionType = PENDING_ACTIONS.NONE, actionData = null) => {
    setLeadSource(source);
    setPendingAction({
      type: actionType,
      data: actionData,
    });
    setIsPopupOpen(true);
  }, []);

  // Close popup
  const closeLeadPopup = useCallback(() => {
    setIsPopupOpen(false);
    setLeadSource(null);
    setPendingAction({
      type: PENDING_ACTIONS.NONE,
      data: null,
    });
    leadHook.resetState();
  }, [leadHook]);

  // Execute pending action after successful lead submission
  const executePendingAction = useCallback(() => {
    const { type, data } = pendingAction;

    switch (type) {
      case PENDING_ACTIONS.OPEN_BROCHURE:
        if (data?.url) {
          window.open(data.url, '_blank');
        }
        break;

      case PENDING_ACTIONS.OPEN_WHATSAPP:
        if (data?.phone) {
          const message = data.message || `Hi, I'm interested in ${projectName}`;
          window.open(`https://wa.me/${data.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
        }
        break;

      case PENDING_ACTIONS.VIEW_FLOORPLAN:
        if (data?.configIndex !== undefined && data?.onView) {
          data.onView(data.configIndex);
        }
        break;

      case PENDING_ACTIONS.CALL_PHONE:
        if (data?.phone) {
          window.location.href = `tel:${data.phone}`;
        }
        break;

      default:
        break;
    }

    // Reset pending action
    setPendingAction({
      type: PENDING_ACTIONS.NONE,
      data: null,
    });
  }, [pendingAction, projectName]);

  // Handle lead form submission
  const handleLeadSubmit = useCallback(async (formData) => {
    const result = await leadHook.submitLead({
      project_id: projectId,
      project_name: projectName,
      lead_name: formData.name,
      lead_phone: formData.phone,
      lead_phone_ccode: formData.phoneCountryCode,
      lead_email: formData.email,
      lead_source: leadSource,
      comments: formData.comments,
    });

    if (result.success) {
      // Execute pending action after short delay
      setTimeout(() => {
        executePendingAction();
        closeLeadPopup();
      }, 1500);
    }

    return result;
  }, [projectId, projectName, leadSource, leadHook, executePendingAction, closeLeadPopup]);

  // ============ ACTION HANDLERS ============

  // Handle brochure download
  const handleBrochureClick = useCallback((brochureUrl) => {
    if (isLeadSubmitted()) {
      window.open(brochureUrl, '_blank');
    } else {
      openLeadPopup(LEAD_SOURCES.BROCHURE_DOWNLOAD, PENDING_ACTIONS.OPEN_BROCHURE, { url: brochureUrl });
    }
  }, [isLeadSubmitted, openLeadPopup]);

  // Handle View Plan click
  const handleViewPlanClick = useCallback((configIndex, onViewCallback) => {
    if (isLeadSubmitted()) {
      if (onViewCallback) onViewCallback(configIndex);
    } else {
      openLeadPopup(LEAD_SOURCES.VIEW_PLAN, PENDING_ACTIONS.VIEW_FLOORPLAN, { configIndex, onView: onViewCallback });
    }
  }, [isLeadSubmitted, openLeadPopup]);

  // Handle Request Price List click
  const handleRequestPriceList = useCallback(() => {
    if (isLeadSubmitted()) {
      return true;
    } else {
      openLeadPopup(LEAD_SOURCES.REQUEST_PRICELIST, PENDING_ACTIONS.NONE, null);
      return false;
    }
  }, [isLeadSubmitted, openLeadPopup]);

  // Handle Get Exclusive Offer click
  const handleGetExclusiveOffer = useCallback(() => {
    if (isLeadSubmitted()) {
      return true;
    } else {
      openLeadPopup(LEAD_SOURCES.GET_EXCLUSIVE_OFFER, PENDING_ACTIONS.NONE, null);
      return false;
    }
  }, [isLeadSubmitted, openLeadPopup]);

  // Handle Request Information (sidebar form)
  const handleRequestInformation = useCallback(() => {
    if (isLeadSubmitted()) {
      return true;
    } else {
      openLeadPopup(LEAD_SOURCES.REQUEST_INFORMATION, PENDING_ACTIONS.NONE, null);
      return false;
    }
  }, [isLeadSubmitted, openLeadPopup]);

  // Handle Get Price (mobile CTA)
  const handleGetPrice = useCallback(() => {
    if (isLeadSubmitted()) {
      return true;
    } else {
      openLeadPopup(LEAD_SOURCES.GET_PRICE, PENDING_ACTIONS.NONE, null);
      return false;
    }
  }, [isLeadSubmitted, openLeadPopup]);

  // Handle WhatsApp click
  const handleWhatsAppClick = useCallback((phone, message) => {
    if (isLeadSubmitted()) {
      window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message || `Hi, I'm interested in ${projectName}`)}`, '_blank');
    } else {
      openLeadPopup(LEAD_SOURCES.WHATSAPP_INQUIRY, PENDING_ACTIONS.OPEN_WHATSAPP, { phone, message });
    }
  }, [isLeadSubmitted, openLeadPopup, projectName]);

  const value = {
    // State
    isPopupOpen,
    leadSource,
    pendingAction,
    projectId,
    projectName,
    
    // Lead hook states
    isSubmitting: leadHook.isSubmitting,
    submitError: leadHook.error,
    isSuccess: leadHook.isSuccess,
    
    // Methods
    openLeadPopup,
    closeLeadPopup,
    handleLeadSubmit,
    isLeadSubmitted,
    
    // Action handlers
    handleBrochureClick,
    handleViewPlanClick,
    handleRequestPriceList,
    handleGetExclusiveOffer,
    handleRequestInformation,
    handleGetPrice,
    handleWhatsAppClick,
  };

  return (
    <LeadCaptureContext.Provider value={value}>
      {children}
    </LeadCaptureContext.Provider>
  );
}

export function useLeadCapture() {
  const context = useContext(LeadCaptureContext);
  if (!context) {
    throw new Error('useLeadCapture must be used within a LeadCaptureProvider');
  }
  return context;
}

export { LEAD_SOURCES };
export default LeadCaptureContext;