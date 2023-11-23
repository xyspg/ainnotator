import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dropzone, FileWithPath, MIME_TYPES } from "@mantine/dropzone";
import { Group, rem, Text } from "@mantine/core";
import { IconFile, IconUpload, IconX } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";

export default function Uploader() {
  const [fileUUID, setFileUUID] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
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
      if (response.status === 413) {
        throw new Error("File is too large. Max size is 32MB.");
      }

      const { uuid } = await response.json();
      setFileUUID(uuid);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message);
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
      <Dropzone
        onDrop={(file) => {
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
              Drag PDF here or click to select files
            </Text>
          </div>
        </Group>
      </Dropzone>
    </>
  );
}
