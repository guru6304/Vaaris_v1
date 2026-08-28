import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { ToastContainer } from '../common/Toast';
import { VaarisGuide } from '../ai/VaarisGuide';
import { InvestorGuideBar } from '../investor/InvestorGuideBar';
import { AddAssetModal } from '../modals/AddAssetModal';
import { EditAssetModal } from '../modals/EditAssetModal';
import { AddFamilyMemberModal } from '../modals/AddFamilyMemberModal';
import { UploadDocumentModal } from '../modals/UploadDocumentModal';
import { ReviewNomineeModal } from '../modals/ReviewNomineeModal';
import { DocumentPreviewModal } from '../modals/DocumentPreviewModal';
import { ContactProfessionalModal } from '../modals/ContactProfessionalModal';
import { StartEmergencyCaseModal } from '../modals/StartEmergencyCaseModal';
import { AuthModal } from '../modals/AuthModal';
import { useApp } from '../../context/AppContext';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    activeModal,
    closeModal,
    selectedAssetId,
    editingAsset,
    assets,
    selectedDocId,
    documents,
    selectedProfessionalId,
    professionals
  } = useApp();

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || null;
  const targetEditAsset = editingAsset || selectedAsset;
  const selectedDoc = documents.find((d) => d.id === selectedDocId) || null;
  const selectedPro = professionals.find((p) => p.id === selectedProfessionalId) || null;

  return (
    <div className="min-h-screen bg-[#0B132B] text-slate-100 flex flex-col font-['Inter',sans-serif]">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Slide-Over Navigation */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Body Column */}
      <div className="lg:pl-64 xl:pl-72 flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Contextual AI Copilot */}
      <VaarisGuide />

      {/* 5-Min Guided Investor Tour Modal */}
      <InvestorGuideBar />

      {/* Global Modals */}
      <AddAssetModal isOpen={activeModal === 'addAsset'} onClose={closeModal} />
      <EditAssetModal isOpen={activeModal === 'editAsset'} onClose={closeModal} asset={targetEditAsset} />
      <AddFamilyMemberModal isOpen={activeModal === 'addFamily'} onClose={closeModal} />
      <UploadDocumentModal isOpen={activeModal === 'uploadDoc'} onClose={closeModal} />
      <ReviewNomineeModal
        isOpen={activeModal === 'reviewNominee'}
        onClose={closeModal}
        asset={selectedAsset}
      />
      <DocumentPreviewModal
        isOpen={activeModal === 'docPreview'}
        onClose={closeModal}
        document={selectedDoc}
      />
      <ContactProfessionalModal
        isOpen={activeModal === 'contactPro'}
        onClose={closeModal}
        professional={selectedPro}
      />
      <StartEmergencyCaseModal
        isOpen={activeModal === 'startEmergencyCase'}
        onClose={closeModal}
      />
      <AuthModal />

      {/* Floating Notifications */}
      <ToastContainer />
    </div>
  );
};
