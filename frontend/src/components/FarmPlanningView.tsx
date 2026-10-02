import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FarmTask } from '../types';
import { 
  CalendarCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Calendar, 
  Check,
  AlertCircle
} from 'lucide-react';

export const FarmPlanningView: React.FC = () => {
  const { t, setCurrentScreen, tasks, toggleTaskStatus, farmer } = useApp();

  const [activeStage, setActiveStage] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newStage, setNewStage] = useState('Flowering & Fruiting');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const stages = [
    { id: 'All', label: t.allStages },
    { id: 'Before Planting', label: t.stageBeforePlanting },
    { id: 'Early Growth', label: t.stageEarlyGrowth },
    { id: 'Crop Development', label: t.stageDevelopment },
    { id: 'Flowering & Fruiting', label: t.stageFlowering },
    { id: 'Crop Protection', label: t.stageProtection },
    { id: 'Harvest Preparation', label: t.stageHarvestPrep },
    { id: 'After Harvest', label: t.stageAfterHarvest }
  ];

  const filteredTasks = tasks.filter((task) => {
    if (activeStage === 'All') return true;
    return task.stage.toLowerCase().includes(activeStage.toLowerCase()) || activeStage.toLowerCase().includes(task.stage.toLowerCase());
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
          {t.farmPlanTitle}
        </span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CalendarCheck className="w-5 h-5 text-[#2E7D32]" />
              <h2 className="text-lg font-bold text-[#192E20]">
                {t.farmPlanTitle}
              </h2>
            </div>
            <p className="text-xs text-gray-500">
              {farmer.current_crop} • {farmer.district}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="min-h-[42px] px-3 py-1.5 bg-[#2E7D32] hover:bg-[#256628] text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>పని జోడించండి / Add Task</span>
          </button>
        </div>

        {/* 7 Crop Stage Selector Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto pt-4 pb-1 no-scrollbar border-t border-gray-100 mt-4">
          {stages.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStage(s.id)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                activeStage === s.id 
                  ? 'bg-[#133E2F] text-white shadow-sm' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-200">
            <p className="text-xs text-gray-500">ఈ దశకు సంబంధించి ఏ పనులూ లేవు / No tasks in this stage.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.status === 'completed';
            return (
              <div 
                key={task.id}
                className={`bg-white rounded-3xl p-5 border transition-all shadow-sm ${
                  isDone 
                    ? 'border-gray-200 opacity-60 bg-gray-50/50' 
                    : 'border-emerald-100 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button 
                    onClick={() => toggleTaskStatus(task.id)}
                    className="mt-1 text-[#2E7D32] active:scale-90 transition-transform"
                    aria-label={isDone ? t.completedBtn : t.markDone}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300 hover:text-emerald-500" />
                    )}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800">
                        {task.stage}
                      </span>
                      <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{task.due_date}</span>
                      </span>
                    </div>

                    <h4 className={`text-sm font-bold ${isDone ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </h4>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {task.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className={`text-xs font-bold px-3 py-1 rounded-lg transition ${
                          isDone 
                            ? 'bg-gray-100 text-gray-600' 
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isDone ? t.completedBtn : t.markDone}
                      </button>

                      {task.priority === 'high' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                          ముఖ్యమైనది / High Priority
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reminder Notice */}
      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-500 text-[11px] leading-relaxed flex items-center gap-2">
        <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
        <span>{t.reminderNotice}</span>
      </div>

    </div>
  );
};
