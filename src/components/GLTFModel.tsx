import React, { useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Asset } from 'expo-asset';

export interface GLTFModelProps {
  /** Asset require reference (e.g. require('../assets/models/car.glb')) or HTTPS URL */
  source: number | string;
  scale?: number | [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  castShadow?: boolean;
  receiveShadow?: boolean;
  colorTint?: string;
  onLoaded?: (gltf: THREE.Object3D) => void;
}

export const GLTFModel: React.FC<GLTFModelProps> = ({
  source,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  castShadow = true,
  receiveShadow = true,
  colorTint,
  onLoaded,
}) => {
  const [scene, setScene] = useState<THREE.Group | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadModel() {
      try {
        let uri = '';
        if (typeof source === 'number') {
          const asset = Asset.fromModule(source);
          if (!asset.localUri) {
            await asset.downloadAsync();
          }
          uri = asset.localUri || asset.uri;
        } else {
          uri = source;
        }

        const loader = new GLTFLoader();
        loader.load(
          uri,
          (gltf) => {
            if (!mounted) return;
            const clonedScene = gltf.scene.clone(true);

            clonedScene.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.castShadow = castShadow;
                mesh.receiveShadow = receiveShadow;

                if (colorTint && mesh.material) {
                  const mat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
                  if ('color' in mat) {
                    mat.color.set(colorTint);
                  }
                  mesh.material = mat;
                }
              }
            });

            if (onLoaded) {
              onLoaded(clonedScene);
            }

            setScene(clonedScene);
          },
          undefined,
          (err: any) => {
            if (!mounted) return;
            console.warn('[GLTFModel] Error loading 3D GLB model:', err);
            setError(err?.message || 'Failed to load model');
          }
        );
      } catch (err: any) {
        if (mounted) {
          console.warn('[GLTFModel] Failed to resolve asset:', err);
          setError(err?.message || 'Asset resolution error');
        }
      }
    }

    loadModel();

    return () => {
      mounted = false;
    };
  }, [source, castShadow, receiveShadow, colorTint]);

  const scaleVector = useMemo<[number, number, number]>(() => {
    return typeof scale === 'number' ? [scale, scale, scale] : scale;
  }, [scale]);

  if (error || !scene) {
    return null;
  }

  return (
    <primitive
      object={scene}
      position={position}
      rotation={rotation}
      scale={scaleVector}
    />
  );
};
