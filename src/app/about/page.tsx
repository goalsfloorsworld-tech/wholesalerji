import React from 'react';
import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'From Panel to Project | WholesalerJi',
  description: 'WholesalerJi connects project requirements with the right wall-panel solutions, designed for contractors, retailers, designers and projects.',
};

export default function AboutPage() {
  return <AboutClient />;
}
