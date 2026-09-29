import { Asterisk } from "lucide-react";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";

interface SpecialtyAutocompleteProps {
  query: string;
  specialties: string[];
  onSelect: (specialty: string) => void;
  visible: boolean;
}

export function SpecialtyAutocomplete({ query, specialties, onSelect, visible }: SpecialtyAutocompleteProps) {
  if (!visible || !query || query.length < 1) return null;

  const filtered = specialties.filter((s) => s.toLowerCase().includes(query.toLowerCase())).slice(0, 5);

  if (filtered.length === 0) return null;

  return (
    <div className="bg-brand-surface rounded-xl border border-gray-200 shadow-lg mt-1 overflow-hidden" style={{ zIndex: 100 }}>
      {filtered.map((specialty, index) => (
        <button
          type="button"
          key={specialty}
          onClick={() => onSelect(specialty)}
          className={`flex-row items-center px-3 py-2.5 active:bg-gray-50 ${index < filtered.length - 1 ? "border-b border-gray-100" : ""}`}
          aria-label={specialty}
        >
          <Asterisk size={16} color={colors.searchSlate.base} aria-hidden="true" />
          <span className="text-sm text-gray-700 ml-2 flex-1 text-left">{specialty}</span>
          <Icon name="arrow-forward" size={14} color={colors.neutral[500]} />
        </button>
      ))}
    </div>
  );
}
