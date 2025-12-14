"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

const ModelViewer = dynamic(
  () => import("@/components/model-viewer").then((m) => m.ModelViewer),
  { ssr: false }
);

export default function UploadClient() {
  const { data } = useSession();
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.file as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file || !data?.user) return toast.error("Login and choose a file");
    const body = new FormData();
    body.append("file", file);
    body.append("userId", data.user.id as string);
    const res = await fetch("/api/upload", { method: "POST", body });
    if (!res.ok) return toast.error("Upload failed");
    const json = await res.json();
    setFileId(json.id);
    setPreview(`/uploads/${json.storageKey}`);
    toast.success("Uploaded! Configure next.");
    router.push(`/configurator?model=${json.id}`);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 space-y-6">
      <h1 className="text-3xl font-bold">Upload your 3D model</h1>
      <form onSubmit={handleUpload} className="card p-6 space-y-4">
        <input type="file" name="file" accept=".stl,.obj,.3mf" className="block w-full" />
        <button className="btn-primary" type="submit">Upload & configure</button>
      </form>
      {preview && <ModelViewer src={preview} />}
    </div>
  );
}
