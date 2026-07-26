import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sentinel AI — Behavioural Anomaly Detection Platform',
  description: 'Enterprise Cybersecurity SOC Platform built for Honeywell Problem Statement. Real-time access logging, Isolation Forest anomaly scoring, XGBoost classification, SHAP explainability, and attack replay simulation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
