import React, { useEffect, useRef } from 'react';

export default function ParticleBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;
        
        let width, height, cx, cy;
        const nodes = [];
        const numNodes = 120;
        
        // 3D rotation angles
        let angleX = 0;
        let angleY = 0;

        // Constants
        const focalLength = 600;
        const connectionDistance = 250; // Max distance for lines

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            cx = width / 2;
            cy = height / 2;
        };

        class Node {
            constructor() {
                this.reset();
                // Randomize initial Z to fill space
                this.z = (Math.random() * 2 - 1) * 800; 
            }

            reset() {
                this.x = (Math.random() * 2 - 1) * 1000;
                this.y = (Math.random() * 2 - 1) * 1000;
                this.z = 800 + Math.random() * 400; // spawn far away
                
                // Movement velocities
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.vz = (Math.random() - 0.5) * 2 - 1; // drift towards viewer
                
                // Color assignment (Hot Pink or Cyan)
                this.isPrimary = Math.random() > 0.5;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.z += this.vz;

                // Wrap around logic
                if (this.z < -focalLength + 50) this.reset();
                if (this.x > 1500 || this.x < -1500) this.vx *= -1;
                if (this.y > 1500 || this.y < -1500) this.vy *= -1;
            }

            // Project 3D coordinates to 2D screen
            project(rotX, rotY) {
                // Rotate around Y
                let cosY = Math.cos(rotY);
                let sinY = Math.sin(rotY);
                let x1 = this.x * cosY - this.z * sinY;
                let z1 = this.z * cosY + this.x * sinY;

                // Rotate around X
                let cosX = Math.cos(rotX);
                let sinX = Math.sin(rotX);
                let y1 = this.y * cosX - z1 * sinX;
                let z2 = z1 * cosX + this.y * sinX;

                // Perspective projection
                let scale = focalLength / (focalLength + z2);
                let px = cx + x1 * scale;
                let py = cy + y1 * scale;
                
                return { px, py, scale, z2 };
            }
        }

        resize();
        window.addEventListener('resize', resize);

        // Initialize nodes
        for (let i = 0; i < numNodes; i++) {
            nodes.push(new Node());
        }

        const animate = () => {
            // Dark transparent background for trails
            ctx.fillStyle = 'rgba(5, 1, 10, 0.4)';
            ctx.fillRect(0, 0, width, height);

            // Slow global rotation
            angleY += 0.002;
            angleX += 0.001;

            // Project all nodes
            const projectedNodes = nodes.map(node => {
                node.update();
                const proj = node.project(angleX, angleY);
                return { node, ...proj };
            });

            // Sort by Z-index (painters algorithm)
            projectedNodes.sort((a, b) => b.z2 - a.z2);

            // Draw connections (Network Building)
            for (let i = 0; i < projectedNodes.length; i++) {
                const pA = projectedNodes[i];
                if (pA.z2 < -focalLength) continue; // Behind camera

                for (let j = i + 1; j < projectedNodes.length; j++) {
                    const pB = projectedNodes[j];
                    if (pB.z2 < -focalLength) continue;

                    // 3D distance check
                    const dx = pA.node.x - pB.node.x;
                    const dy = pA.node.y - pB.node.y;
                    const dz = pA.node.z - pB.node.z;
                    const distSq = dx*dx + dy*dy + dz*dz;

                    if (distSq < connectionDistance * connectionDistance) {
                        const dist = Math.sqrt(distSq);
                        const opacity = (1 - dist / connectionDistance) * 0.4;
                        
                        // Scale line width by depth
                        const avgScale = (pA.scale + pB.scale) / 2;
                        
                        ctx.beginPath();
                        ctx.moveTo(pA.px, pA.py);
                        ctx.lineTo(pB.px, pB.py);
                        
                        // Line color based on node colors
                        if (pA.node.isPrimary && pB.node.isPrimary) {
                            ctx.strokeStyle = `rgba(255, 16, 122, ${opacity * avgScale})`;
                        } else if (!pA.node.isPrimary && !pB.node.isPrimary) {
                            ctx.strokeStyle = `rgba(0, 229, 255, ${opacity * avgScale})`;
                        } else {
                            ctx.strokeStyle = `rgba(188, 19, 254, ${opacity * avgScale * 0.7})`; // Purple mix
                        }
                        
                        ctx.lineWidth = 1.5 * avgScale;
                        ctx.stroke();
                    }
                }
            }

            // Draw nodes
            projectedNodes.forEach(p => {
                if (p.z2 < -focalLength) return;

                const radius = Math.max(0.5, 3 * p.scale);
                const opacity = Math.min(1, Math.max(0, 1.5 - (p.z2 / 800)));

                ctx.beginPath();
                ctx.arc(p.px, p.py, radius, 0, Math.PI * 2);
                ctx.fillStyle = p.node.isPrimary 
                    ? `rgba(255, 16, 122, ${opacity})` 
                    : `rgba(0, 229, 255, ${opacity})`;
                ctx.fill();
                
                // Add a glow
                if (opacity > 0.5) {
                    ctx.shadowBlur = 10 * p.scale;
                    ctx.shadowColor = p.node.isPrimary ? '#ff107a' : '#00e5ff';
                    ctx.fill();
                    ctx.shadowBlur = 0; // reset
                }
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 1, filter: 'contrast(1.2)' }}
        />
    );
}
