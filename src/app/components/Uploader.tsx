import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileWithPath } from "@mantine/dropzone";
import { Group, Text, rem } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";

export default function Uploader() {
  const [fileUUID, setFileUUID] = useState("");
  const router = useRouter();
  const handleUpload = async (file: FileWithPath[]) => {
    const body = new FormData();
    body.append("file", file[0], file[0].name);

    try {
      const response = await fetch("/api/file", {
        method: "POST",
        body,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { uuid } = await response.json();
      setFileUUID(uuid);
    } catch (error) {
      console.error("Error uploading files", error);
    }
  };

  useEffect(() => {
    if (fileUUID) {
      // sleep for 2 seconds
        setTimeout(() => {
            router.push(`/pdf/${fileUUID}`);
        }, 2000);
    }
  }, [fileUUID]);

  return (
    <>
      <Dropzone
        onDrop={(file) => {
          handleUpload(file);
        }}
        maxSize={3 * 1024 ** 2}
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
            <IconPhoto
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
              Drag images here or click to select files
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Attach as many files as you like, each file should not exceed 5mb
            </Text>
          </div>
        </Group>
      </Dropzone>
    </>
  );
}
