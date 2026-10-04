'use client';

import React from 'react';
import { PanelProduct } from '@/data/types';
import ContactForm from './ContactForm';

export interface GetQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePanel?: PanelProduct;
  allPanels?: PanelProduct[];
  seriesLabel?: string;
  initialQuantity?: number;
  whatsappNumber?: string;
  source?: string;
}

export default function GetQuoteModal({
  isOpen,
  onClose,
  activePanel,
  seriesLabel = 'Wholesale Architectural Panels',
  source,
}: GetQuoteModalProps) {
  if (!isOpen) return null;

  const effectiveSource = source || (activePanel ? `${seriesLabel} - ${activePanel.code}` : seriesLabel);

  return (
    <ContactForm
      isModal={true}
      onClose={onClose}
      initialPanelCode={activePanel?.code}
      source={effectiveSource}
      title={activePanel ? `Get Quote: ${activePanel.name} (${activePanel.code})` : 'Request Wholesale Quote'}
      subtitle={`Direct factory pricing & specifications for ${seriesLabel}`}
    />
  );
}