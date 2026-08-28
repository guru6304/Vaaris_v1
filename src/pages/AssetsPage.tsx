import React, { useState, useMemo } from 'react';
import {
  WalletCards,
  Plus,
  Search,
  Landmark,
  ShieldCheck,
  TrendingUp,
  HeartHandshake,
  Briefcase,
  LineChart,
  Home,
  Coins,
  CreditCard,
  Edit,
  UserCheck,
  TrendingDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Asset } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { Drawer } from '../components/common/Drawer';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const AssetsPage: React.FC = () => {
  const {
    assets,
    openModal,
    setSelectedAssetId,
    setEditingAsset,
    totalAssetValue,
    totalLiabilities,
    netWorth,
    totalInsuranceCoverage,
    organizedAssetsCount
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerAsset, setDrawerAsset] = useState<Asset | null>(null);

  const categories: { key: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'all', label: 'All Holdings', icon: WalletCards },
    { key: 'bank_accounts', label: 'Bank Accounts', icon: Landmark },
    { key: 'fixed_deposits', label: 'Fixed Deposits', icon: ShieldCheck },
    { key: 'mutual_funds', label: 'Mutual Funds', icon: TrendingUp },
    { key: 'insurance', label: 'Life Insurance', icon: HeartHandshake },
    { key: 'epf_retirement', label: 'EPF & Retirement', icon: Briefcase },
    { key: 'stocks_investments', label: 'Stocks & Demat', icon: LineChart },
    { key: 'property', label: 'Real Estate', icon: Home },
    { key: 'gold_other', label: 'Gold & Assets', icon: Coins },
    { key: 'loans_liabilities', label: 'Liabilities', icon: CreditCard }
  ];

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesCategory = activeCategory === 'all' || asset.category === activeCategory;
      const matchesSearch =
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.accountNumberMasked.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [assets, activeCategory, searchQuery]);

  const handleEdit = (asset: Asset, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingAsset(asset);
    setSelectedAssetId(asset.id);
    openModal('editAsset');
  };

  const handleReviewNominee = (asset: Asset, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedAssetId(asset.id);
    openModal('reviewNominee');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
              Assets & Liabilities Inventory
            </h1>
            <span className="text-xs bg-teal-950/80 text-teal-300 font-semibold px-2.5 py-0.5 rounded-full border border-teal-800/60">
              {assets.length} Total Accounts
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete registry of bank accounts, investments, insurance policies, properties, and liabilities.
          </p>
        </div>

        <button
          onClick={() => openModal('addAsset')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Asset</span>
        </button>
      </div>

      {/* Summary KPI Valuation Cards with True Net Worth Math */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-teal-500/30">
          <span className="text-xs text-slate-400 uppercase font-semibold">Net Liquid Estate</span>
          <div className="text-2xl font-bold text-teal-400 font-mono mt-1">
            ₹{(netWorth / 100000).toFixed(1)} Lakhs
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Gross Assets minus Debts</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Gross Personal Assets</span>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            ₹{(totalAssetValue / 100000).toFixed(1)} Lakhs
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">{organizedAssetsCount} items verified</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-rose-500/30 bg-rose-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-rose-300 uppercase font-semibold">Total Liabilities</span>
            <TrendingDown className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-300 font-mono mt-1">
            ₹{(totalLiabilities / 100000).toFixed(1)} Lakhs
          </div>
          <p className="text-[10px] text-rose-400/80 mt-0.5">Deducted from estate valuation</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-sky-500/30 bg-sky-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-sky-300 uppercase font-semibold">Insurance Protection</span>
            <HeartHandshake className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-sky-300 font-mono mt-1">
            ₹{(totalInsuranceCoverage / 10000000).toFixed(2)} Cr
          </div>
          <p className="text-[10px] text-sky-400/80 mt-0.5">Contingent Term Sum Assured</p>
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets by name, institution, or account number..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <span className="text-xs text-slate-400 self-center">
            {filteredAssets.length} accounts found
          </span>
        </div>

        {/* Scrollable Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-500 text-slate-950 shadow-xs'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map((asset) => {
          const isDebt = asset.category === 'loans_liabilities' || asset.value < 0;
          return (
            <div
              key={asset.id}
              onClick={() => setDrawerAsset(asset)}
              className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/40 shadow-lg flex flex-col justify-between space-y-4 transition-all duration-200 cursor-pointer group hover:-translate-y-0.5"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                      {asset.institution}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                      {asset.name}
                    </h3>
                  </div>
                  <StatusBadge status={asset.nomineeStatus} size="sm" />
                </div>

                {/* Valuation / Protection Amount */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {asset.isInsurance ? 'Term Sum Assured:' : isDebt ? 'Outstanding Debt:' : 'Current Balance:'}
                  </span>
                  <span
                    className={`font-mono font-bold text-sm ${
                      asset.isInsurance
                        ? 'text-sky-400'
                        : isDebt
                        ? 'text-rose-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {asset.isInsurance
                      ? `₹${((asset.insuranceCoverage || 0) / 100000).toFixed(1)} Lakhs`
                      : isDebt
                      ? `-₹${(Math.abs(asset.value) / 100000).toFixed(1)} Lakhs`
                      : `₹${(asset.value / 100000).toFixed(2)} Lakhs`}
                  </span>
                </div>

                {/* Nominee Share Allocation Display */}
                <div className="text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Nominee(s):</span>
                    {asset.nominees.length > 0 ? (
                      <span className="text-slate-300 truncate max-w-[160px] font-medium">
                        {asset.nominees.map((n) => `${n.name} (${n.sharePercentage}%)`).join(', ')}
                      </span>
                    ) : (
                      <span className="text-amber-400 font-semibold">Not Registered</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Account / Folio:</span>
                    <span className="font-mono text-slate-300">{asset.accountNumberMasked}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => handleEdit(asset, e)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors"
                >
                  <Edit className="w-3 h-3 text-slate-400" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleReviewNominee(asset, e)}
                  className="flex items-center gap-1 text-[11px] font-bold text-teal-300 hover:text-teal-200 px-2.5 py-1 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 transition-colors"
                >
                  <UserCheck className="w-3 h-3 text-teal-400" />
                  <span>Nominee</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Asset Detail Slide-Over Drawer */}
      <Drawer
        isOpen={Boolean(drawerAsset)}
        onClose={() => setDrawerAsset(null)}
        title={drawerAsset?.name || 'Asset Details'}
        subtitle={`${drawerAsset?.institution} • ${drawerAsset?.category.replace('_', ' ')}`}
      >
        {drawerAsset && (
          <div className="space-y-6 text-xs">
            {/* Header Value Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {drawerAsset.isInsurance ? 'Insurance Sum Assured' : 'Asset Valuation / Balance'}
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {drawerAsset.isInsurance
                  ? `₹${((drawerAsset.insuranceCoverage || 0) / 100000).toFixed(2)} Lakhs`
                  : `₹${(drawerAsset.value / 100000).toFixed(2)} Lakhs`}
              </div>
              <p className="text-[11px] text-slate-400">
                Account / Folio: <span className="font-mono text-white">{drawerAsset.accountNumberMasked}</span>
              </p>
            </div>

            {/* Nominees Breakdown */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Beneficiary Nominee Split
                </h4>
                <StatusBadge status={drawerAsset.nomineeStatus} size="sm" />
              </div>

              {drawerAsset.nominees.length > 0 ? (
                <div className="space-y-2">
                  {drawerAsset.nominees.map((nom, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800"
                    >
                      <div>
                        <p className="font-semibold text-white">{nom.name}</p>
                        <p className="text-[10px] text-slate-400">{nom.relationship}</p>
                      </div>
                      <span className="font-mono font-bold text-teal-400">{nom.sharePercentage}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-amber-400 font-medium">No nominee registered on institutional record.</p>
              )}
            </div>

            {/* Notes & Actions */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Family & Branch Directives
              </h4>
              <p className="text-slate-300 leading-relaxed text-xs">
                {drawerAsset.notes || 'No specific guidance specified for this account.'}
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  const ast = drawerAsset;
                  setDrawerAsset(null);
                  handleEdit(ast);
                }}
                className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Edit Asset Record
              </button>
            </div>
          </div>
        )}
      </Drawer>

      <DisclaimerBanner type="legal" />
    </div>
  );
};
