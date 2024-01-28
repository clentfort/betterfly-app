import { useEffect, useState } from "react";

import { Duration } from "./duration";

export default function Timer({ duration }: { duration: number }) {
  const [seconds, setSeconds] = useState(duration);
  useEffect(() => {
    setSeconds(duration);
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [duration]);

  return <Duration duration={seconds} />;
}
