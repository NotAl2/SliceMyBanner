import React, { useState } from 'react';
import { X, Coffee, Heart, Check, Sparkles, ExternalLink } from 'lucide-react';
import { triggerConfetti } from '../utils/animations';

// Customizable Buy Me a Coffee creator profile URL
export const BUY_ME_A_COFFEE_URL = 'https://buymeacoffee.com/notal';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  isImageDone?: boolean;
  onDonated?: () => void;
}

interface TierOption {
  amount: number;
  label: string;
  coffees: number;
  description: string;
  badge?: string;
}

const DONATION_TIERS: TierOption[] = [
  {
    amount: 2,
    label: '$2',
    coffees: 1,
    description: 'Espresso shot tip',
  },
  {
    amount: 5,
    label: '$5',
    coffees: 1,
    description: 'A warm latte',
    badge: 'Popular',
  },
  {
    amount: 10,
    label: '$10',
    coffees: 2,
    description: 'Double brew power',
    badge: 'Super Tip',
  },
  {
    amount: 15,
    label: '$15',
    coffees: 3,
    description: 'Coffee feast sponsor',
  },
];

export const DonateModal: React.FC<DonateModalProps> = ({
  isOpen,
  onClose,
  isImageDone = false,
  onDonated,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(5);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentAmount = isCustom ? (parseFloat(customAmount) || 5) : selectedAmount;

  const handleSelectTier = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
  };

  const handleSupportClick = () => {
    triggerConfetti();
    if (onDonated) onDonated();

    // Construct BMC URL with selected amount or coffees
    const coffeesCount = Math.max(1, Math.round(currentAmount / 5));
    const targetUrl = `${BUY_ME_A_COFFEE_URL}?coffees=${coffeesCount}&amount=${currentAmount}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#261A66]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-[0_20px_60px_rgba(38,26,102,0.18)] border border-[#E6E4EC] relative overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 sm:p-7 pb-4 flex items-center justify-between border-b border-[#E6E4EC] shrink-0 bg-white">
          <div className="flex items-center gap-3.5 pr-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#EF5F18] border border-[#EF5F18] flex items-center justify-center text-white shadow-xs shrink-0">
              <Coffee className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#261A66] tracking-tight">
                  Buy Me a Coffee
                </h3>
              </div>
              <p className="text-xs text-[#261A66]/75 font-medium">
                Support SliceMyBanner & keep it 100% free
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F5F4F8] text-[#261A66]/50 hover:text-[#261A66] transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 sm:p-7 flex-1 space-y-5">
          {/* Celebratory Banner if image just finished */}
          {isImageDone && (
            <div className="bg-[#EF5F18]/10 border border-[#EF5F18]/40 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#EF5F18] flex items-center justify-center text-white shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs text-[#261A66]">
                <p className="font-extrabold text-sm text-[#261A66]">
                  Your banner is sliced & ready! 🎉
                </p>
                <p className="text-[#261A66]/75 font-medium mt-0.5">
                  If this tool saved you time designing in Canva, consider buying a coffee!
                </p>
              </div>
            </div>
          )}

          {/* Value Pitch */}
          <div>
            <p className="text-xs sm:text-sm text-[#261A66]/80 leading-relaxed font-medium">
              SliceMyBanner is <strong>100% free, private, and ad-free</strong>. There are no paywalls or sign-ups. Your tips directly support server costs and new features!
            </p>
          </div>

          {/* Tier Selection Grid (2$, 5$, 10$, 15$) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#261A66]">
                Choose an amount:
              </span>
              <span className="text-xs font-semibold text-[#EF5F18]">
                {isCustom ? `$${currentAmount}` : `$${selectedAmount}`} selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {DONATION_TIERS.map((tier) => {
                const isSelected = !isCustom && selectedAmount === tier.amount;
                return (
                  <button
                    key={tier.amount}
                    type="button"
                    onClick={() => handleSelectTier(tier.amount)}
                    className={`relative p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between h-24 ${
                      isSelected
                        ? 'border-[#EF5F18] bg-[#EF5F18]/10 shadow-xs scale-[1.02]'
                        : 'border-[#E6E4EC] bg-[#F5F4F8] hover:border-[#EF5F18]/50 hover:bg-white'
                    }`}
                  >
                    {/* Badge */}
                    {tier.badge && (
                      <span className="absolute -top-2.5 bg-[#EF5F18] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                        {tier.badge}
                      </span>
                    )}

                    <div className="flex items-center gap-1 text-[#261A66]/70 mt-1">
                      {Array.from({ length: tier.coffees }).map((_, i) => (
                        <Coffee key={i} className={`w-3.5 h-3.5 ${isSelected ? 'text-[#EF5F18]' : ''}`} />
                      ))}
                    </div>

                    <span className="font-number font-extrabold text-xl text-[#261A66]">
                      ${tier.amount}
                    </span>

                    <span className="text-[10px] text-[#261A66]/70 font-semibold truncate w-full">
                      {tier.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Amount Toggle */}
          <div className="pt-1">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsCustom(!isCustom)}
                className="text-xs font-bold text-[#261A66] hover:text-[#EF5F18] transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>{isCustom ? '← Back to standard amounts' : 'Or enter custom amount ($)'}</span>
              </button>
            </div>

            {isCustom && (
              <div className="mt-2.5 flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-number font-bold text-base text-[#261A66]">
                    $
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    placeholder="20"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-[#F5F4F8] border border-[#E6E4EC] focus:border-[#EF5F18] rounded-xl text-sm font-number font-bold text-[#261A66] outline-hidden"
                    autoFocus
                  />
                </div>
                <span className="text-xs text-[#261A66]/70 font-medium">USD</span>
              </div>
            )}
          </div>

          {/* Impact note */}
          <div className="bg-[#F5F4F8] border border-[#E6E4EC] rounded-2xl p-3.5 flex items-center gap-3">
            <Heart className="w-4 h-4 text-[#EF5F18] fill-[#EF5F18] shrink-0" />
            <p className="text-xs text-[#261A66]/75 font-medium">
              Every coffee directly helps cover hosting and keeping SliceMyBanner 100% free with no watermark.
            </p>
          </div>
        </div>

        {/* Modal Sticky Footer */}
        <div className="p-4 sm:p-6 border-t border-[#E6E4EC] bg-white flex flex-col gap-2.5 shrink-0">
          <button
            onClick={handleSupportClick}
            className="btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Coffee className="w-4 h-4 stroke-[2.2]" />
            <span>
              Support with ${currentAmount} on Buy Me a Coffee
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>

          <div className="flex items-center justify-between text-[11px] text-[#261A66]/60 px-1">
            <span className="flex items-center gap-1">
              <Check className="w-3 h-3 text-[#EF5F18]" />
              Secure payment via Buy Me a Coffee
            </span>
            <button
              onClick={onClose}
              className="hover:text-[#261A66] font-semibold transition-colors cursor-pointer"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
