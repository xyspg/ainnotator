"use client";

import { Switch } from "@/app/components/ui/switch";
import { Label } from "@/app/components/ui/label";
import { useState } from "react";
import {isDev} from "@/lib/utils";

export function CustomAPIKey() {
  const [checked, setChecked] = useState(false);
  if (!isDev()) {
    return null;
  }
  return (
    <div className="flex items-center space-x-2">
      <Switch id="custom-api-key" disabled />
      <Label htmlFor="custom-api-key">Custom API Key (Coming Soon)</Label>
    </div>
  );
}
