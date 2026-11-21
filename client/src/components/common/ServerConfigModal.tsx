import React, { useState } from 'react';
import { Server, Check } from 'lucide-react';
import { getApiBaseUrl, setApiBaseUrl } from '@/api/client';
import { Button } from '@/components/ui/button';

export const ServerConfigModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [url, setUrl] = useState(getApiBaseUrl());
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiBaseUrl(url);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
      window.location.reload();
    }, 400);
  };

  const handleReset = (preset: string) => {
    setUrl(preset);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Backend Server URL</h3>
            <p className="text-xs text-slate-500">Android & Mobile API Connection</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
          Configure the API server endpoint for the MegaMart Android application:
        </p>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="http://10.0.2.2:5000/api/v1"
          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono mb-3"
        />

        <div className="space-y-1.5 mb-4">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Quick Presets</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleReset('http://10.0.2.2:5000/api/v1')}
              className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-md font-medium text-slate-700 transition"
            >
              Android Emulator (10.0.2.2)
            </button>
            <button
              type="button"
              onClick={() => handleReset('/api/v1')}
              className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-md font-medium text-slate-700 transition"
            >
              Web Default (/api/v1)
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="flex-1 text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            className="flex-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {saved ? <Check className="w-4 h-4 mr-1" /> : null}
            {saved ? 'Saved!' : 'Save & Connect'}
          </Button>
        </div>
      </div>
    </div>
  );
};
