import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy & Cookies | WareCode',
  description: 'WareCode privacy, data processing, and cookie policy.',
};

export default function PrivacyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
