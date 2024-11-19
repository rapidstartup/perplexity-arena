import React from 'react';
import { Model } from '../types';

interface ModelSelectProps {
  models: Model[];
  selectedModel: string;
  otherSelected: string;
  onChange: (model: string) => void;
  label: string;
}

export function ModelSelect({ models, selectedModel, otherSelected, onChange, label }: ModelSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
      <select
        value={selectedModel}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select a model</option>
        {models.map((model) => (
          <option
            key={model.Model}
            value={model.Model}
            disabled={model.Model === otherSelected}
          >
            {model.Model} ({model['Parameter Count']})
          </option>
        ))}
      </select>
    </div>
  );
}