/**
 * Web stand-in for React Native's `Alert.alert(title, message, buttons)` when it
 * is used as a small action list (attach menu, conversation menu). Rendered as
 * an iOS-style alert over the phone screen. Not a port of an app component.
 */
export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "cancel" | "default" | "destructive";
}

interface ActionSheetAlertProps {
  title: string;
  message?: string;
  buttons: AlertButton[];
  onDismiss: () => void;
}

export function ActionSheetAlert({ title, message, buttons, onDismiss }: ActionSheetAlertProps) {
  return (
    <div className="absolute inset-0 items-center justify-center bg-black/30" style={{ zIndex: 60 }} role="alertdialog" aria-label={title}>
      <div className="bg-brand-surface rounded-2xl overflow-hidden" style={{ width: 270 }}>
        <div className="px-4 pt-4 pb-3 items-center">
          <span className="text-[17px] font-semibold text-brand-primary text-center">{title}</span>
          {message ? <span className="text-[13px] text-gray-600 text-center mt-1">{message}</span> : null}
        </div>
        {buttons.map((button) => (
          <button
            key={button.text}
            type="button"
            onClick={() => {
              onDismiss();
              button.onPress?.();
            }}
            className="border-t border-gray-200 items-center justify-center active:opacity-70"
            style={{ height: 44 }}
          >
            <span className={`text-[17px] text-brand-accent ${button.style === "cancel" ? "font-semibold" : ""}`}>{button.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
