"use client";

import { Switch } from "@/app/components/ui/switch";
import { Label } from "@/app/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";

export function CustomPrompt() {
  const [checked, setChecked] = useState(false);
  const [prompt, setPrompt] = useState("");
  const handleSubmit = async () => {
    await fetch(`/api/settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ setting: "custom_prompt", prompt: prompt }),
    });
  };
  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch
          id="custom-prompt"
          onClick={() => setChecked(!checked)}
          checked={checked}
        />
        <Label htmlFor="custom-api-key">Custom Prompt</Label>
      </div>
      {checked && (
        <>
          <Textarea
            placeholder="You are a translator..."
            content={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
          />
          <Button onClick={handleSubmit} className="w-1/3">
            Save
          </Button>
        </>
      )}
    </>
  );
}
