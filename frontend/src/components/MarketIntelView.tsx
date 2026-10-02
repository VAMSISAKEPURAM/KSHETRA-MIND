import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Store, 
  ArrowLeft, 
  Filter, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';

export const MarketIntelView: React.FC = () => {
  const { t, setCurrentScreen, mandiItems, farmer } = useApp();

  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');

  const commodities = ['All', 'Chilli', 'Cotton', 'Paddy', 'Tomato', 'Maize', 'Groundnut', 'Soybean', 'Wheat'];
  const states = ['All', 'Telangana', 'Andhra Pradesh', 'Karnataka', 'Maharashtra', 'Uttar Pradesh'];

  // Filter items
  const filtered = mandiItems.filter((item) => {
    if (selectedCrop !== 'All' && item.commodity.toLowerCase() !== selectedCrop.toLowerCase()) {
      return false;
    }
    if (selectedState !== 'All' && item.state.toLowerCase() !== selectedState.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-24 pt-2 animate-in fade-in duration-200">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('home')}
          className="min-h-[44px] px-3 py-1.5 rounded-xl bg-white border border-gray-200 font-bold text-gray-700 flex items-center gap-1.5 text-xs hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backBtn}</span>
        </button>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {t.marketScreenTitle}
        </span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Store className="w-5 h-5 text-[#2E7D32]" />
          <h2 className="text-lg font-bold text-[#192E20]">
            {t.marketScreenTitle}
          </h2>
        </div>
        <p className="text-xs text-gray-500">
          {t.marketScreenSubtitle}
        </p>

        {/* Filter Pills */}
        <div className="space-y-3 mt-4 pt-3 border-t border-gray-100">
          
          {/* Crop Filter */}
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              {t.filterByCrop}
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {commodities.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCrop(c)}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                    selectedCrop === c 
                      ? 'bg-[#133E2F] text-white shadow-sm' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* State Filter */}
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              {t.filterByState}
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {states.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedState(s)}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                    selectedState === s 
                      ? 'bg-[#2E7D32] text-white shadow-sm' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Mandi Cards List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-200">
            <p className="text-xs text-gray-500">{t.noMarketData}</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-base text-[#192E20]">
                      {item.commodity}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      ({item.variety})
                    </span>
                  </div>
                  <div className="text-xs font-bold text-emerald-800 mt-0.5">
                    📍 {item.market}, {item.district} ({item.state})
                  </div>
                </div>

                {/* Trend Badge */}
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  item.trend === 'up' ? 'bg-emerald-100 text-emerald-800' : (item.trend === 'down' ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-700')
                }`}>
                  {item.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-700" />}
                  {item.trend === 'down' && <TrendingDown className="w-3 h-3 text-rose-700" />}
                  {item.trend === 'stable' && <Minus className="w-3 h-3 text-gray-600" />}
                  <span>{item.trend === 'up' ? 'Rising' : (item.trend === 'down' ? 'Falling' : 'Stable')}</span>
                </span>
              </div>

              {/* Price Metrics */}
              <div className="grid grid-cols-3 gap-2 bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100/70 text-center">
                <div>
                  <div className="text-[10px] text-gray-500 font-medium">{t.minPriceLabel}</div>
                  <div className="text-xs font-bold text-gray-800 mt-0.5">
                    ₹{item.min_price.toLocaleString()}
                  </div>
                </div>

                <div className="border-x border-emerald-200/50">
                  <div className="text-[10px] text-emerald-800 font-bold uppercase">{t.modalPriceLabel}</div>
                  <div className="text-base font-extrabold text-[#133E2F] mt-0.5">
                    ₹{item.modal_price.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-gray-500 font-medium">{t.maxPriceLabel}</div>
                  <div className="text-xs font-bold text-gray-800 mt-0.5">
                    ₹{item.max_price.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Footer info: Date & Arrivals */}
              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                <span>{t.observedOnLabel}: <strong className="text-gray-600">{item.observation_date}</strong></span>
                <span>{t.arrivalsLabel}: <strong className="text-gray-600">{item.arrival_tonnes} MT</strong></span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Official Agmarknet Disclaimer */}
      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-500 text-[11px] leading-relaxed flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <span>{t.mandiSourceNotice}</span>
      </div>

    </div>
  );
};
