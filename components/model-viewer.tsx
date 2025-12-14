"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh, BufferGeometry, Material, MeshStandardMaterial } from "three";

function Model({ url, wireframe }: { url: string; wireframe: boolean }) {
  const [mesh, setMesh] = useState<Mesh>();

  useEffect(() => {
    async function load() {
      const ext = url.split(".").pop()?.toLowerCase();
      let geometry: BufferGeometry | null = null;
      if (ext === "stl") {
        geometry = await new STLLoader().loadAsync(url);
      } else if (ext === "obj") {
        const obj = await new OBJLoader().loadAsync(url);
        const g = obj.children.find((c) => (c as Mesh).isMesh) as Mesh;
        geometry = (g?.geometry as BufferGeometry) || null;
      } else if (ext === "3mf" || ext === "gltf") {
        const gltf = await new GLTFLoader().loadAsync(url);
        const g = gltf.scene.children.find((c) => (c as Mesh).isMesh) as Mesh;
        geometry = (g?.geometry as BufferGeometry) || null;
      }
      if (geometry) setMesh(new Mesh(geometry, new MeshStandardMaterial({ color: "#7B61FF", wireframe })));
    }
    load();
  }, [url, wireframe]);

  if (!mesh) return null;
  return <primitive object={mesh} />;
}

export function ModelViewer({ src }: { src: string }) {
  const [wireframe, setWireframe] = useState(false);
  return (
    <div className="space-y-2">
      <div className="h-80 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <Canvas camera={{ position: [2, 2, 2] }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 2, 2]} intensity={1} />
          <Suspense fallback={null}>
            <Model url={src} wireframe={wireframe} />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>
      <label className="inline-flex items-center gap-2 text-sm text-slate-200">
        <input type="checkbox" checked={wireframe} onChange={(e) => setWireframe(e.target.checked)} /> Wireframe
      </label>
    </div>
  );
}
