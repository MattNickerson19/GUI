import { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { type OrientationMsg} from "../../ros/Topics/OrientationTopic";
import { Text } from "@react-three/drei";

const ringInner = 3;
const ringOuter = 3.5;
const ringMid = (ringInner + ringOuter) / 2;

interface Props {
  orientation: OrientationMsg | null;
}

function RobotMesh({ orientation }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);

  const width = 1.5;
  const height = 0.75;
  const length = 2.5;

  useEffect(() => {
    if (!meshRef.current || !orientation) return;

    // Convert degrees to radians
    const roll = THREE.MathUtils.degToRad(orientation.x || 0);
    const pitch = THREE.MathUtils.degToRad(orientation.y || 0);
    const yaw = THREE.MathUtils.degToRad(orientation.z || 0);

    meshRef.current.rotation.set(pitch, yaw, roll);
  }, [orientation]);

  return (
    <mesh ref={meshRef} position={[0, height / 2, 0]}>
      <boxGeometry args={[width, height, length]} />
      <meshStandardMaterial color="#4a90e2" />
    </mesh>
  );
}

export default function RobotOrientation3D({ orientation }: Props) {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Canvas camera={{ position: [0, 5, 4] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}  
          position={[0, -0.26, 0]}         
          receiveShadow
        >
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#444" />
        </mesh>

        {/* Cardinal Directions - Flat in Ring */}

        <Text
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.03, -ringMid]}   // North
        fontSize={1}
        color="red"
        anchorX="center"
        anchorY="middle"
        >
        N
        </Text>

        <Text
        rotation={[-Math.PI / 2, 0, 0]}
        position={[ringMid, 0.03, 0]}   // East
        fontSize={1}
        color="#4a90e2"
        anchorX="center"
        anchorY="middle"
        >
        E
        </Text>

        <Text
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.03, ringMid]}   // South
        fontSize={1}
        color="#4a90e2"
        anchorX="center"
        anchorY="middle"
        >
        S
        </Text>

        <Text
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-ringMid, 0.03, 0]}  // West
        fontSize={1}
        color="#4a90e2"
        anchorX="center"
        anchorY="middle"
        >
        W
        </Text>

        <axesHelper args={[3]} />
        <gridHelper args={[20, 20]} />
        <RobotMesh orientation={orientation} />
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}
