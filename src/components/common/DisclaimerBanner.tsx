import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface DisclaimerBannerProps {
  type?: 'legal' | 'privacy' | 'workflow' | 'demo';
  customText?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  type = 'legal',
  customText
}) => {
  const getBannerContent = () => {
    if (customText) return customText;

    switch (type) {
      case 'legal':
        return 'Nominee information helps with claim and settlement workflows. Legal ownership and inheritance may depend on applicable succession laws, registered wills, and estate documents.';
      case 'privacy':
        return 'Designed with privacy in mind. Sensitive information access can be controlled and restricted until emergency verification workflows are completed.';
      case 'workflow':
        return 'VAARIS provides structured workflow guidance and coordination support. Requirements may vary by individual financial institution.';
      case 'demo':
        return 'Fictional demo data presented for investor evaluation. All figures, names, and simulated workflows reflect benchmark prototypes.';
    }
  };

  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-slate-700/60 bg-slate-900/60 p-3.5 text-xs text-slate-400 leading-relaxed">
      <div className="rounded-md bg-slate-800 p-1 text-slate-300 shrink-0 mt-0.5">
        {type === 'privacy' ? (
          <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
        ) : (
          <Info className="h-3.5 w-3.5 text-amber-400" />
        )}
      </div>
      <p className="flex-1">{getBannerContent()}</p>
    </div>
  );
};
