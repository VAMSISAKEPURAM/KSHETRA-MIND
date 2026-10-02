import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ShieldAlert, 
  ArrowRight 
} from 'lucide-react';

export const AlertsModal: React.FC = () => {
  const { 
    alerts, 
    markAlertRead, 
    showAlertsModal, 
    setShowAlertsModal, 
    t, 
    setCurrentScreen 
  } = useApp();

  if (!showAlertsModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-emerald-100 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-[#133E2F] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-300" />
            <h2 className="text-lg font-bold text-white">
              {t.alertsTooltip}
            </h2>
          </div>
          <button 
            onClick={() => setShowAlertsModal(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-emerald-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {alerts.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-xs">
              ప్రస్తుతం ఎలాంటి హెచ్చరికలు లేవు / No active alerts.
            </div>
          ) : (
            alerts.map((alert) => {
              const isWarning = alert.severity === 'warning';
              return (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    alert.is_read 
                      ? 'bg-gray-50 border-gray-200 opacity-60' 
                      : (isWarning ? 'bg-amber-50/80 border-amber-200 shadow-sm' : 'bg-emerald-50/80 border-emerald-200 shadow-sm')
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                      isWarning ? 'bg-amber-200/80 text-amber-800' : 'bg-emerald-200/80 text-emerald-800'
                    }`}>
                      {isWarning ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          isWarning ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {alert.alert_type}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {alert.source}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-gray-900">
                        {alert.title}
                      </h4>

                      <p className="text-xs text-gray-700 leading-relaxed">
                        {alert.description}
                      </p>

                      <div className="pt-2 flex items-center justify-between">
                        <button
                          onClick={() => markAlertRead(alert.id)}
                          className={`text-xs font-bold px-3 py-1 rounded-lg transition ${
                            alert.is_read 
                              ? 'text-gray-400 hover:text-gray-600' 
                              : 'bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs'
                          }`}
                        >
                          {alert.is_read ? '✓ Reviewed' : t.markReviewedBtn}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-right">
          <button
            onClick={() => setShowAlertsModal(false)}
            className="px-5 min-h-[44px] rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs"
          >
            {t.closeBtn}
          </button>
        </div>

      </div>
    </div>
  );
};
