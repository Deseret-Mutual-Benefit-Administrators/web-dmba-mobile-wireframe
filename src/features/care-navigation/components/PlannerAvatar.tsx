import { useState } from "react";
import type { Planner } from "../types";

const AVATAR_SIZE = 64;

interface PlannerAvatarProps {
  planner: Planner;
}

/** Photo avatar with an initials-circle fallback (the wireframe has no photos). */
export function PlannerAvatar({ planner }: PlannerAvatarProps) {
  const [failed, setFailed] = useState(!planner.photo);

  if (failed || !planner.photo) {
    return (
      <div
        style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 }}
        className="bg-info-tint items-center justify-center"
      >
        <span className="text-brand-accent font-bold text-base">{planner.initials}</span>
      </div>
    );
  }

  return (
    <img
      src={planner.photo}
      style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2, objectFit: "cover" }}
      onError={() => setFailed(true)}
      alt=""
    />
  );
}
