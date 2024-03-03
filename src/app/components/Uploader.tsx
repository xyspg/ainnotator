import { useEffect, useState } from "react";
import { useUser } from "@/lib/hooks/use-user";
import { useRouter } from "next/navigation";
import { Dropzone, FileWithPath, MIME_TYPES } from "@mantine/dropzone";
import { Group, rem, Text } from "@mantine/core";
import { IconFile, IconUpload, IconX } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useOpenAIKeyStore } from "@/app/store";
import { Input } from "@/app/components/ui/input";
import {AuthModal} from "@/app/(main)/[locale]/(auth)/Auth";

export default function Uploader() {
  const [fileUUID, setFileUUID] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useUser()

  const router = useRouter();
  const t = useTranslations("Hero");
  const handleUpload = async (file: FileWithPath[]) => {
    if (file[0].size >= 32 * 1024 * 1024) {
      toast.error("File is too large. Max size is 32MB.");
      return;
    }
    setLoading(true);
    const body = new FormData();
    body.append("file", file[0], file[0].name);

    try {
      const response = await fetch("/api/file", {
        method: "POST",
        body,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const { uuid } = await response.json();
      setFileUUID(uuid);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.toString());
    }
  };

  useEffect(() => {
    if (fileUUID) {
      router.push(`/pdf/${fileUUID}`);
    }
  }, [fileUUID]);

  return (
    <>
      <Toaster />
      {/*
      <Input
          className='py-2'
        placeholder="OpenAI API Key"
        value={apiKey}
        onChange={(event) => {
          useOpenAIKeyStore.setState({ apiKey: event.currentTarget.value });
        }}

        />

        */}
      <AuthModal showModal={modalOpen} setShowModal={()=>{setModalOpen(false)}} />
      <Dropzone
        onDrop={(file) => {
          if (!user) {
            toast("Please log in first.");
            setModalOpen(true)
            return;
          }
          handleUpload(file);
        }}
        accept={[MIME_TYPES.pdf]}
        loading={loading}
      >
        <Group
          justify="center"
          gap="xl"
          mih={220}
          style={{ pointerEvents: "none" }}
        >
          <Dropzone.Accept>
            <IconUpload
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-blue-6)",
              }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-red-6)",
              }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconFile
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-dimmed)",
              }}
              stroke={1.5}
            />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              {t("upload")}{" "}
            </Text>
          </div>
        </Group>
      </Dropzone>
    </>
  );
}
