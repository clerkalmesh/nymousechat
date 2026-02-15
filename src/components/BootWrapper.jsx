import { useState } from "react";
import ProtocolBootLoader from "./BooLoader"

export default function BootWrapper({ children }) {
  const [bootComplete, setBootComplete] = useState(false);

  if (!bootComplete) {
    return <ProtocolBootLoader onComplete={() => setBootComplete(true)} />;
  }

  return <>{children}</>;
}
