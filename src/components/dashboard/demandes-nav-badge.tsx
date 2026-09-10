"use client";

import { useEffect, useState } from "react";
import { listDemandes } from "@/services/demandeService";
import { DemandeStatus } from "@/types";

export function DemandesNavBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;
    const load = () => {
      listDemandes()
        .then((d) => {
          if (active) setCount(d.filter((x) => x.status === DemandeStatus.NOUVELLE).length);
        })
        .catch(() => {});
    };
    load();
    const t = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, []);

  if (count === 0) return null;

  return (
    <span className="ml-auto rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-ink">
      {count}
    </span>
  );
}
