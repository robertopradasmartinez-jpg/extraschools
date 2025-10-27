'use client';

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import ContactModal from '@/components/messages/ContactModal';

interface ContactButtonProps {
  activityId: string;
  activityTitle: string;
  companyName: string;
}

export default function ContactButton({
  activityId,
  activityTitle,
  companyName,
}: ContactButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-600 transition mb-3 flex items-center justify-center gap-2"
      >
        <MessageSquare className="w-5 h-5" />
        Contactar con la empresa
      </button>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activityId={activityId}
        activityTitle={activityTitle}
        companyName={companyName}
      />
    </>
  );
}
