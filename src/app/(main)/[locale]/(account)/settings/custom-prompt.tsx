"use client";

import { Switch } from "@/app/components/ui/switch";
import { Label } from "@/app/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import toast, { Toaster } from "react-hot-toast";

export function CustomPrompt({ prompt }: { prompt: string }) {
  const [checked, setChecked] = useState(!!prompt);
  const [promptValue, setPromptValue] = useState(prompt);
  console.log(promptValue);
  const handleSubmit = async () => {
    await fetch(`/api/settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ setting: "custom_prompt", prompt: promptValue }),
    });
    toast.success("Saved!");
  };
  const handleDelete = async () => {
    await fetch(`/api/settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ setting: "custom_prompt", prompt: "" }),
    });
  };

  const handleSwitch = () => {
    if (checked) {
      const shouldDelete = confirm(
        "Are you sure you want to delete this prompt?",
      );
      if (shouldDelete) {
        handleDelete();
      } else return;
    }
    setChecked(!checked);
  };
  return (
    <>
      <Toaster />
      <div className="flex items-center space-x-2">
        <Switch id="custom-prompt" onClick={handleSwitch} checked={checked} />
        <Label htmlFor="custom-api-key">Custom Prompt</Label>
      </div>
      {checked && (
        <>
          <Textarea
            value={promptValue}
            onChange={(e) => {
              setPromptValue(e.target.value);
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
