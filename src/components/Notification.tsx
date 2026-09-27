interface NotificationProps {
  message: string;
  app?: string;
  onDismiss: () => void;
}

export function Notification({ message, app = 'System', onDismiss }: NotificationProps) {
  return (
    <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg z-40 animate-slide-down">
      <div className="flex items-center gap-3 p-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
          {app.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-800">{app}</p>
          <p className="text-xs text-gray-600 truncate">{message}</p>
        </div>
        <button
          onClick={onDismiss}
          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300"
        >
          ×
        </button>
      </div>
    </div>
  );
}
