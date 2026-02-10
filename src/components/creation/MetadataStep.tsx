import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export interface MetadataField {
  name: string;
  values: string[];
  allowMultiple: boolean;
}

// Pre-suggested fields for professional services
const SUGGESTED_FIELDS: { name: string; placeholder: string }[] = [
  { name: 'Industry', placeholder: 'e.g. Healthcare, Financial Services, Retail' },
  { name: 'Region', placeholder: 'e.g. EMEA, North America, APAC' },
  { name: 'Segment', placeholder: 'e.g. Enterprise, Mid-Market, SMB' },
  { name: 'Methodology', placeholder: 'e.g. Focus Groups, Surveys, Interviews' },
  { name: 'Stakeholder Type', placeholder: 'e.g. C-Suite, Operations, End Users' },
];

interface MetadataStepProps {
  metadataFields: MetadataField[];
  setMetadataFields: (fields: MetadataField[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const MetadataStep = ({
  metadataFields,
  setMetadataFields,
  onBack,
  onNext,
}: MetadataStepProps) => {
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');

  const addField = () => {
    if (!newFieldName.trim()) return;
    const existing = metadataFields.find(f => f.name.toLowerCase() === newFieldName.trim().toLowerCase());
    if (existing && newFieldValue.trim()) {
      // Add value to existing field
      setMetadataFields(metadataFields.map(f =>
        f.name.toLowerCase() === newFieldName.trim().toLowerCase()
          ? { ...f, values: [...f.values, newFieldValue.trim()] }
          : f
      ));
    } else if (!existing) {
      setMetadataFields([
        ...metadataFields,
        { name: newFieldName.trim(), values: newFieldValue.trim() ? [newFieldValue.trim()] : [], allowMultiple: false },
      ]);
    }
    setNewFieldName('');
    setNewFieldValue('');
  };

  const addSuggestedField = (name: string) => {
    if (metadataFields.some(f => f.name.toLowerCase() === name.toLowerCase())) return;
    setMetadataFields([...metadataFields, { name, values: [], allowMultiple: false }]);
  };

  const removeField = (idx: number) => {
    setMetadataFields(metadataFields.filter((_, i) => i !== idx));
  };

  const toggleMultiple = (idx: number) => {
    setMetadataFields(metadataFields.map((f, i) =>
      i === idx ? { ...f, allowMultiple: !f.allowMultiple } : f
    ));
  };

  const addValueToField = (idx: number, value: string) => {
    if (!value.trim()) return;
    setMetadataFields(metadataFields.map((f, i) =>
      i === idx ? { ...f, values: [...f.values, value.trim()] } : f
    ));
  };

  const removeValueFromField = (fieldIdx: number, valueIdx: number) => {
    setMetadataFields(metadataFields.map((f, i) =>
      i === fieldIdx ? { ...f, values: f.values.filter((_, vi) => vi !== valueIdx) } : f
    ));
  };

  const unusedSuggestions = SUGGESTED_FIELDS.filter(
    sf => !metadataFields.some(f => f.name.toLowerCase() === sf.name.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Info Banner */}
      <div className="bg-card border border-border p-5">
        <p className="text-sm text-foreground mb-2">
          Use metadata fields to organize and filter your sources during analysis.
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong>Field names</strong> describe context not visible in the data itself (e.g. <em>Focus Group Location</em>).{' '}
          <strong>Values</strong> define specific segments, such as <em>Travelers</em>, <em>Buyers</em>, or <em>Gen Z</em>.
        </p>
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
          💡 Tip: Use this to separate different groups or research settings for easier comparison later.
        </p>
      </div>

      {/* Suggested Fields */}
      {unusedSuggestions.length > 0 && (
        <div>
          <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
            Suggested Fields
          </label>
          <div className="flex flex-wrap gap-2">
            {unusedSuggestions.map((sf) => (
              <button
                key={sf.name}
                onClick={() => addSuggestedField(sf.name)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-primary/40 text-xs text-primary hover:bg-primary/5 transition-colors"
              >
                <Plus className="w-3 h-3" />
                {sf.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Added Fields */}
      {metadataFields.length > 0 && (
        <div className="space-y-4">
          {metadataFields.map((field, idx) => (
            <FieldCard
              key={idx}
              field={field}
              onRemove={() => removeField(idx)}
              onToggleMultiple={() => toggleMultiple(idx)}
              onAddValue={(val) => addValueToField(idx, val)}
              onRemoveValue={(vi) => removeValueFromField(idx, vi)}
            />
          ))}
        </div>
      )}

      {/* Add Custom Field */}
      <div>
        <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
          Add Custom Field
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            placeholder="Field name"
            className="flex-1 px-4 py-2.5 bg-card border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
          />
          <input
            type="text"
            value={newFieldValue}
            onChange={(e) => setNewFieldValue(e.target.value)}
            placeholder="Enter a value"
            className="flex-1 px-4 py-2.5 bg-card border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            onKeyDown={(e) => e.key === 'Enter' && addField()}
          />
          <Button variant="outline" onClick={addField} disabled={!newFieldName.trim()} className="gap-1.5">
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="font-mono text-[11px] uppercase tracking-widest gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        <Button
          onClick={onNext}
          size="lg"
          className={cn(
            "relative px-12 py-6 bg-foreground text-background hover:bg-primary hover:text-primary-foreground",
            "font-mono text-[11px] font-bold tracking-[0.3em] uppercase",
            "transition-all duration-500 group"
          )}
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

// Individual field card with values
const FieldCard = ({
  field,
  onRemove,
  onToggleMultiple,
  onAddValue,
  onRemoveValue,
}: {
  field: MetadataField;
  onRemove: () => void;
  onToggleMultiple: () => void;
  onAddValue: (val: string) => void;
  onRemoveValue: (idx: number) => void;
}) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="bg-card border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium text-sm text-foreground">{field.name}</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={field.allowMultiple}
              onCheckedChange={onToggleMultiple}
              className="scale-75"
            />
            <span className="text-xs text-muted-foreground">Allow multiple</span>
          </div>
          <button onClick={onRemove} className="text-muted-foreground hover:text-destructive transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Values */}
      <div className="flex flex-wrap gap-2 mb-2">
        {field.values.map((val, vi) => (
          <span key={vi} className="flex items-center gap-1 px-2.5 py-1 bg-muted text-xs text-foreground">
            {val}
            <button onClick={() => onRemoveValue(vi)} className="hover:text-destructive transition-colors">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      
      {/* Add value input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a value..."
          className="flex-1 px-3 py-1.5 bg-background border border-border rounded-sm text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && inputValue.trim()) {
              onAddValue(inputValue);
              setInputValue('');
            }
          }}
        />
        <button
          onClick={() => {
            if (inputValue.trim()) {
              onAddValue(inputValue);
              setInputValue('');
            }
          }}
          className="text-xs text-primary hover:text-primary/80 font-medium px-2"
        >
          + Add
        </button>
      </div>
    </div>
  );
};

export default MetadataStep;
