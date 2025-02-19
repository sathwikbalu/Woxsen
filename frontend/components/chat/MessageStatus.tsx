import React from "react";
import { Check } from "lucide-react";

interface MessageStatusProps {
  status: "sent" | "delivered" | "seen";
  className?: string;
}

export const MessageStatus: React.FC<MessageStatusProps> = ({
  status,
  className = "",
}) => {
  if (status === "sent") {
    return <Check className={`w-3 h-3 ${className}`} />;
  }

  return (
    <div className="relative">
      <Check className={`w-3 h-3 ${className}`} />
      <Check className={`w-3 h-3 absolute -right-1 top-0 ${className}`} />
    </div>
  );
};
