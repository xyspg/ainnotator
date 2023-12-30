"use client";

import { Switch } from "@/app/components/ui/switch";
import { Label } from "@/app/components/ui/label";
import { useState } from "react";

export function CustomAPIKey() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex items-center space-x-2">
      <Switch id="custom-api-key" disabled />
      <Label htmlFor="custom-api-key">Custom API Key (Coming Soon)</Label>
    </div>
  );
}
