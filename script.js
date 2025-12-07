// ========================================
        // SLIDE DATA
        // ========================================
        const gifsCollection = ["assets/pictures/gif/qiBoeLEaT.gif", "assets/pictures/gif/pcqrGqRXi.gif", "assets/pictures/gif/6Tro9gA7c.gif"];

        const slideData = [
            {
                title: "",
                description: "",
                video: "assets/videos/slides/1.mp4",
                gradient: "linear-gradient(135deg, #f2d638 0%, #f2d638 100%)",
                gif: gifsCollection[Math.floor(Math.random() * gifsCollection.length)],
                onTransition: true
            },
            {
                title: "",
                description: "",
                video: "assets/videos/slides/2.mp4",
                gradient: "linear-gradient(135deg, #f2d638 0%, #f2d638 100%)",
                gif: gifsCollection[Math.floor(Math.random() * gifsCollection.length)],
                onTransition: true
            },
            {
                title: "",
                description: "",
                video: "assets/videos/slides/3.mp4",
                gradient: "linear-gradient(135deg, #f2d638 0%, #f2d638 100%)",
                gif: gifsCollection[Math.floor(Math.random() * gifsCollection.length)],
                onTransition: true
            },
            {
                title: "",
                description: "",
                video: "assets/videos/slides/4.mp4",
                gradient: "linear-gradient(135deg, #f2d638 0%, #f2d638 100%)",
                gif: gifsCollection[Math.floor(Math.random() * gifsCollection.length)],
                onTransition: true
            },
            {
                title: "",
                description: "",
                video: "assets/videos/slides/5.mp4",
                gradient: "linear-gradient(135deg, #f2d638 0%, #f2d638 100%)",
                gif: gifsCollection[Math.floor(Math.random() * gifsCollection.length)],
                onTransition: true
            },
            {
                title: "",
                description: "",
                video: "assets/videos/slides/6.mp4",
                gradient: "linear-gradient(135deg, #f2d638 0%, #f2d638 100%)",
                gif: gifsCollection[Math.floor(Math.random() * gifsCollection.length)],
                onTransition: false
            },
            {
                title: "",
                description: "",
                video: "assets/videos/slides/7.mp4",
                gradient: "linear-gradient(135deg, #f2d638 0%, #f2d638 100%)",
                gif: gifsCollection[Math.floor(Math.random() * gifsCollection.length)],
                onTransition: false
            },
            {
                title: "",
                description: "",
                video: "assets/videos/slides/8.mp4",
                gradient: "linear-gradient(135deg, #f2d638 0%, #f2d638 100%)",
                gif: gifsCollection[Math.floor(Math.random() * gifsCollection.length)],
                onTransition: false
            }
            
        ];


        // ========================================
        // INITIALIZATION
        // ========================================
        const sliderContainer = document.getElementById('sliderContainer');
        const canvas = document.getElementById('pixelCanvas');
        const ctx = canvas.getContext('2d');
        const effectsCanvas = document.getElementById('effectsCanvas');
        const effectsCtx = effectsCanvas.getContext('2d');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const indicator = document.getElementById('indicator');
        const backgroundVideo = document.getElementById('backgroundVideo');

        let slides;
        let currentSlide = 0;
        let isTransitioning = false;
        let boxSize = 40;

        // Function to calculate responsive box size
        function getResponsiveBoxSize() {
            const width = window.innerWidth;
            if (width <= 480) return 20;
            if (width <= 768) return 25;
            if (width <= 1024) return 30;
            return 40;
        }

        // Initialize box size
        boxSize = getResponsiveBoxSize();

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        effectsCanvas.width = window.innerWidth;
        effectsCanvas.height = window.innerHeight;

        // Generate slides dynamically
        function generateSlides() {
            slideData.forEach((data, index) => {
                const slide = document.createElement('div');
                slide.className = 'slide' + (index === 0 ? ' active' : '');
                slide.dataset.gradient = data.gradient;
                slide.dataset.video = data.video;
                
                slide.innerHTML = `
                    <div class="slide-content">
                        <h1>${data.title}</h1>
                        <p>${data.description}</p>
                    </div>
                `;
                
                sliderContainer.appendChild(slide);
            });
            
            slides = document.querySelectorAll('.slide');
        }

        // Generate indicator dots
        function generateIndicators() {
            slideData.forEach((data, i) => {
                const dot = document.createElement('div');
                dot.className = 'dot' + (i === 0 ? ' active' : '');
                dot.dataset.gif = data.gif;
                dot.addEventListener('click', () => goToSlide(i));
                indicator.appendChild(dot);

                if (i === 0) {
                    dot.style.backgroundImage = `url(${dot.dataset.gif})`;
                    dot.style.backgroundSize = "cover";
                    dot.style.backgroundColor = "transparent";
                }
            });
        }

        // Initialize
        generateSlides();
        generateIndicators();

        // Function to change video source
        function changeVideoSource(videoSrc, shouldPlay = true) {
            if (!videoSrc) return;
            
            backgroundVideo.pause();
            
            if (backgroundVideo.src.endsWith(videoSrc)) {
                backgroundVideo.currentTime = 0;
                if (shouldPlay) {
                    backgroundVideo.play().catch(err => console.log('Video play error:', err));
                }
                return;
            }
            
            backgroundVideo.src = videoSrc;
            backgroundVideo.load();
            if (shouldPlay) {
                backgroundVideo.play().catch(err => console.log('Video play error:', err));
            }
        }

        // Load first video
        const firstVideoSrc = slides[0].dataset.video;
        if (firstVideoSrc) {
            changeVideoSource(firstVideoSrc);
        }

        function hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : {r: 242, g: 214, b: 56};
        }

        function getSlideColors(slide) {
            const gradient = slide.dataset.gradient;
            if (gradient) {
                const colorMatches = gradient.match(/#[0-9a-f]{6}|rgb\([^)]+\)/gi);
                if (colorMatches && colorMatches.length >= 2) {
                    return [colorMatches[0], colorMatches[1]];
                }
            }
            return ['#f2d638', '#f2d638'];
        }

        function interpolateColor(color1, color2, factor) {
            const c1 = hexToRgb(color1);
            const c2 = hexToRgb(color2);
            
            const r = Math.round(c1.r + (c2.r - c1.r) * factor);
            const g = Math.round(c1.g + (c2.g - c1.g) * factor);
            const b = Math.round(c1.b + (c2.b - c1.b) * factor);
            
            return `rgb(${r}, ${g}, ${b})`;
        }

        function generateColorVariations(baseColors) {
            const variations = [];
            const [color1, color2] = baseColors;
            
            for (let i = 0; i < 12; i++) {
                variations.push(interpolateColor(color1, color2, i / 11));
            }
            
            return variations;
        }

        function animateCornerEffects(colors, duration) {
            const particles = [];
            const corners = [
                {x: 0, y: 0, dirX: 1, dirY: 1},
                {x: effectsCanvas.width, y: 0, dirX: -1, dirY: 1},
                {x: 0, y: effectsCanvas.height, dirX: 1, dirY: -1},
                {x: effectsCanvas.width, y: effectsCanvas.height, dirX: -1, dirY: -1}
            ];

            const isMobile = window.innerWidth <= 768;
            const particlesPerCorner = isMobile ? 4 : 8;

            corners.forEach(corner => {
                const particleCount = particlesPerCorner + Math.floor(Math.random() * (isMobile ? 2 : 5));
                for (let i = 0; i < particleCount; i++) {
                    const rand = Math.random();
                    let type, shardPoints = null;
                    
                    if (rand > 0.66) {
                        type = 'shard';
                        shardPoints = generateShardPoints();
                    } else if (rand > 0.33) {
                        type = 'box';
                    } else {
                        type = 'circle';
                    }
                    
                    particles.push({
                        x: corner.x + (Math.random() - 0.5) * 100,
                        y: corner.y + (Math.random() - 0.5) * 100,
                        vx: corner.dirX * (1 + Math.random() * 2),
                        vy: corner.dirY * (1 + Math.random() * 2),
                        size: type === 'circle' ? 6 + Math.random() * 12 : 8 + Math.random() * 20,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        rotation: Math.random() * Math.PI * 2,
                        rotationSpeed: (Math.random() - 0.5) * 0.1,
                        life: 1.0,
                        decay: 0.008 + Math.random() * 0.005,
                        type: type,
                        shardPoints: shardPoints
                    });
                }
            });

            const startTime = Date.now();

            function animate() {
                const elapsed = Date.now() - startTime;
                if (elapsed > duration) {
                    effectsCtx.clearRect(0, 0, effectsCanvas.width, effectsCanvas.height);
                    return;
                }

                effectsCtx.clearRect(0, 0, effectsCanvas.width, effectsCanvas.height);

                particles.forEach(p => {
                    if (p.life <= 0) return;

                    p.x += p.vx;
                    p.y += p.vy;
                    p.rotation += p.rotationSpeed;
                    p.life -= p.decay;

                    effectsCtx.save();
                    effectsCtx.translate(p.x, p.y);
                    effectsCtx.rotate(p.rotation);
                    effectsCtx.globalAlpha = p.life;
                    effectsCtx.fillStyle = p.color;
                    
                    if (p.type === 'shard') {
                        effectsCtx.beginPath();
                        p.shardPoints.forEach((point, i) => {
                            const px = point.x * p.size;
                            const py = point.y * p.size;
                            if (i === 0) effectsCtx.moveTo(px, py);
                            else effectsCtx.lineTo(px, py);
                        });
                        effectsCtx.closePath();
                        effectsCtx.fill();
                        effectsCtx.strokeStyle = 'rgba(255,255,255,0.4)';
                        effectsCtx.lineWidth = 1.5;
                        effectsCtx.stroke();
                    } else if (p.type === 'circle') {
                        effectsCtx.beginPath();
                        effectsCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                        effectsCtx.strokeStyle = p.color;
                        effectsCtx.lineWidth = 2;
                        effectsCtx.stroke();
                        effectsCtx.strokeStyle = 'rgba(255,255,255,0.5)';
                        effectsCtx.lineWidth = 1;
                        effectsCtx.stroke();
                    } else {
                        effectsCtx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
                        ctx.lineWidth = 4;
                        ctx.shadowColor = 'rgba(255,255,255,0.9)';
                        ctx.shadowBlur = 12;
                        effectsCtx.strokeRect(-p.size/2, -p.size/2, p.size, p.size);
                    }
                    
                    effectsCtx.restore();
                });

                requestAnimationFrame(animate);
            }

            animate();
        }

        function generateShardPoints() {
            const numPoints = 4 + Math.floor(Math.random() * 3);
            const points = [];
            
            for (let i = 0; i < numPoints; i++) {
                const angle = (i / numPoints) * Math.PI * 2;
                const radius = 0.3 + Math.random() * 0.4;
                points.push({
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius
                });
            }
            
            return points;
        }

        function generateLetterPattern(letter) {
            const patterns = {
                'L': [
                    [1,0,0,0],
                    [1,0,0,0],
                    [1,0,0,0],
                    [1,0,0,0],
                    [1,1,1,1]
                ],
                'O': [
                    [0,1,1,0],
                    [1,0,0,1],
                    [1,0,0,1],
                    [1,0,0,1],
                    [0,1,1,0]
                ],
                'A': [
                    [0,1,1,0],
                    [1,0,0,1],
                    [1,1,1,1],
                    [1,0,0,1],
                    [1,0,0,1]
                ],
                'D': [
                    [1,1,1,0],
                    [1,0,0,1],
                    [1,0,0,1],
                    [1,0,0,1],
                    [1,1,1,0]
                ],
                'I': [
                    [1,1,1],
                    [0,1,0],
                    [0,1,0],
                    [0,1,0],
                    [1,1,1]
                ],
                'N': [
                    [1,0,0,1],
                    [1,1,0,1],
                    [1,0,1,1],
                    [1,0,0,1],
                    [1,0,0,1]
                ],
                'G': [
                    [0,1,1,1],
                    [1,0,0,0],
                    [1,0,1,1],
                    [1,0,0,1],
                    [0,1,1,0]
                ],
                '.': [
                    [0,0],
                    [0,0],
                    [0,0],
                    [0,0],
                    [1,1]
                ]
            };
            return patterns[letter] || patterns['.'];
        }

        function drawTextWithBoxes(text, centerX, centerY, colors) {
            const letters = text.toUpperCase().split('');
            const letterSpacing = 1;
            
            let totalWidth = 0;
            letters.forEach(letter => {
                const pattern = generateLetterPattern(letter);
                totalWidth += pattern[0].length + letterSpacing;
            });
            totalWidth -= letterSpacing;
            
            let currentX = centerX - (totalWidth * boxSize) / 2;
            
            letters.forEach(letter => {
                const pattern = generateLetterPattern(letter);
                const patternWidth = pattern[0].length;
                const patternHeight = pattern.length;
                
                const startY = centerY - (patternHeight * boxSize) / 2;
                
                pattern.forEach((row, y) => {
                    row.forEach((cell, x) => {
                        if (cell === 1) {
                            const px = currentX + x * boxSize;
                            const py = startY + y * boxSize;
                            
                            const color = colors[colors.length - 1 - (Math.floor(Math.random() * 3))];
                            ctx.fillStyle = color;
                            ctx.fillRect(px, py, boxSize, boxSize);
                            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                            ctx.lineWidth = 2;
                            ctx.strokeRect(px, py, boxSize, boxSize);
                        }
                    });
                });
                
                currentX += (patternWidth + letterSpacing) * boxSize;
            });
        }

        function drawTextProgressive(text, centerX, centerY, colors, frameCount) {
            const letters = text.toUpperCase().split('');
            const isMobile = window.innerWidth <= 768;
            const lettersPerFrame = isMobile ? 2 : 3;
            const lettersToDraw = Math.min((frameCount + 1) * lettersPerFrame, letters.length);
            
            const letterSpacing = 1;

            let totalWidth = 0;
            letters.forEach(letter => {
                const pattern = generateLetterPattern(letter);
                totalWidth += pattern[0].length + letterSpacing;
            });
            totalWidth -= letterSpacing;

            let currentX = centerX - (totalWidth * boxSize) / 2;

            letters.forEach((letter, i) => {
                if (i >= lettersToDraw) return;

                const pattern = generateLetterPattern(letter);
                const patternWidth = pattern[0].length;
                const patternHeight = pattern.length;
                const startY = centerY - (patternHeight * boxSize) / 2;

                pattern.forEach((row, y) => {
                    row.forEach((cell, x) => {
                        if (cell === 1) {
                            const px = currentX + x * boxSize;
                            const py = startY + y * boxSize;
                            const color = colors[Math.floor(Math.random() * colors.length)];
                            ctx.fillStyle = color;
                            ctx.fillRect(px, py, boxSize, boxSize);
                            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                            ctx.lineWidth = 2;
                            ctx.strokeRect(px, py, boxSize, boxSize);
                        }
                    });
                });

                currentX += (patternWidth + letterSpacing) * boxSize;
            });
        }

        function pixelTransition(fromSlide, toSlide, callback) {
            isTransitioning = true;
            
            sliderContainer.classList.add('transitioning');
            
            const cols = Math.ceil(canvas.width / boxSize);
            const rows = Math.ceil(canvas.height / boxSize);
            const totalBoxes = cols * rows;
            
            const toColors = getSlideColors(toSlide);
            const colorVariations = generateColorVariations(toColors);
            
            const singleColor = toColors[0];
            
            animateCornerEffects(colorVariations, 6000);
            
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            
            const boxes = [];
            for (let i = 0; i < totalBoxes; i++) {
                const col = i % cols;
                const row = Math.floor(i / cols);
                const x = col * boxSize;
                const y = row * boxSize;
                boxes.push({
                    x, y, 
                    col, row,
                    drawn: false,
                    scale: 0,
                    animationProgress: 0,
                    removing: false,
                    removeProgress: 0
                });
            }
            
            // Calculate center point
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            // Sort boxes by distance from center (farthest first for filling)
            const drawOrder = boxes
                .map((box, i) => {
                    const boxCenterX = box.x + boxSize / 2;
                    const boxCenterY = box.y + boxSize / 2;
                    const distance = Math.sqrt(
                        Math.pow(boxCenterX - centerX, 2) + 
                        Math.pow(boxCenterY - centerY, 2)
                    );
                    return { index: i, distance };
                })
                .sort((a, b) => b.distance - a.distance) 
                .map(item => item.index);

            let drawn = 0;
            const batchSize = Math.ceil(totalBoxes / 10); // batching
            let frameCount = 0;
            let phase = 'filling';
            let slideChanged = false;

            function animate() {
                // Clear canvas at the start of each frame
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                if (phase === 'filling' && drawn < totalBoxes) {
                    const end = Math.min(drawn + batchSize, totalBoxes);
                    
                    for (let i = drawn; i < end; i++) {
                        const box = boxes[drawOrder[i]];
                        box.drawn = true;
                        box.scale = 0; 
                        box.animationProgress = 0;
                    }
                    
                    drawn = end;
                    
                    if (drawn >= totalBoxes) {
                        // Only switch slides after all boxes are placed
                        setTimeout(() => {
                            fromSlide.classList.remove('active');
                            toSlide.classList.add('active');
                        }, 300); 
                        slideChanged = true;
                        phase = 'animating';
                        frameCount = 0;
                    }
                }
                
                // Animate all drawn boxes with bounce effect
                if (phase === 'filling' || phase === 'animating' || phase === 'removing') {
                    boxes.forEach(box => {
                        // Removal animation (scale out)
                        if (box.removing && box.removeProgress < 1) {
                            box.removeProgress += 0.25; 
                            
                            if (box.removeProgress >= 1) {
                                box.removeProgress = 1;
                                box.scale = 0;
                            } else {
                                // Scale down with ease-out
                                const t = box.removeProgress;
                                box.scale = (1 - t) * (1 - t); 
                            }
                            
                            ctx.save();
                            ctx.globalAlpha = 1 - box.removeProgress;
                            
                            const centerX = box.x + boxSize / 2;
                            const centerY = box.y + boxSize / 2;
                            ctx.translate(centerX, centerY);
                            ctx.scale(box.scale, box.scale);
                            ctx.translate(-centerX, -centerY);
                            
                            ctx.shadowColor = singleColor;
                            ctx.shadowBlur = 10;
                            ctx.fillStyle = singleColor;
                            ctx.fillRect(box.x, box.y, boxSize, boxSize);
                            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
                            ctx.lineWidth = 2;
                            ctx.strokeRect(box.x, box.y, boxSize, boxSize);
                            
                            ctx.restore();
                        }
                        // Scale in animation
                        else if (box.drawn && box.animationProgress < 1 && !box.removing) {
                            box.animationProgress += 0.5; 
                            
                            if (box.animationProgress >= 1) {
                                box.animationProgress = 1;
                                box.scale = 1;
                            } else {
                                // Elastic easing (overshoot and bounce back)
                                const t = box.animationProgress;
                                const elastic = Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
                                box.scale = Math.max(0.1, elastic);
                            }
                            
                            ctx.save();
                            ctx.globalAlpha = 0.5 + (box.animationProgress * 0.5);
                            
                            const centerX = box.x + boxSize / 2;
                            const centerY = box.y + boxSize / 2;
                            ctx.translate(centerX, centerY);
                            ctx.scale(box.scale, box.scale);
                            ctx.translate(-centerX, -centerY);
                            
                            ctx.shadowColor = singleColor;
                            ctx.shadowBlur = 10;
                            ctx.fillStyle = singleColor;
                            ctx.fillRect(box.x, box.y, boxSize, boxSize);
                            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
                            ctx.lineWidth = 2;
                            ctx.strokeRect(box.x, box.y, boxSize, boxSize);

                            const gridSize = 10;
                            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                            ctx.lineWidth = 1;
                            for (let gx = gridSize; gx < boxSize; gx += gridSize) {
                                ctx.beginPath();
                                ctx.moveTo(box.x + gx, box.y);
                                ctx.lineTo(box.x + gx, box.y + boxSize);
                                ctx.stroke();
                            }
                            for (let gy = gridSize; gy < boxSize; gy += gridSize) {
                                ctx.beginPath();
                                ctx.moveTo(box.x, box.y + gy);
                                ctx.lineTo(box.x + boxSize, box.y + gy);
                                ctx.stroke();
                            }
                            
                            ctx.restore();
                        } 
                        // Static full scale
                        else if (box.drawn && box.scale === 1 && !box.removing) {
                            ctx.globalAlpha = 1;
                            ctx.shadowColor = singleColor;
                            ctx.shadowBlur = 10;
                            ctx.fillStyle = singleColor;
                            ctx.fillRect(box.x, box.y, boxSize, boxSize);
                            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
                            ctx.lineWidth = 2;
                            ctx.strokeRect(box.x, box.y, boxSize, boxSize);

                            const gridSize = 10;
                            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                            ctx.lineWidth = 1;
                            for (let gx = gridSize; gx < boxSize; gx += gridSize) {
                                ctx.beginPath();
                                ctx.moveTo(box.x + gx, box.y);
                                ctx.lineTo(box.x + gx, box.y + boxSize);
                                ctx.stroke();
                            }
                            for (let gy = gridSize; gy < boxSize; gy += gridSize) {
                                ctx.beginPath();
                                ctx.moveTo(box.x, box.y + gy);
                                ctx.lineTo(box.x + boxSize, box.y + gy);
                                ctx.stroke();
                            }
                            ctx.globalAlpha = 1;
                        }
                    });
                }
                
                if (phase === 'animating') {
                    const textY = canvas.height / 2 + 10; 
                    const whiteColors = ['#FFFFFF']; 
                    drawTextProgressive('LOADING', canvas.width / 2, textY, whiteColors, frameCount);

                    if (frameCount % 2 === 0) {
                        drawTextWithBoxes('LOADING...', canvas.width / 2, textY, whiteColors);
                    }

                    frameCount++;

                    if (frameCount >= 4) {
                        phase = 'removing';
                        frameCount = 0;
                        
                        // Re-sort for removal (center to corners)
                        const centerX = canvas.width / 2;
                        const centerY = canvas.height / 2;
                        const removeOrder = boxes
                            .map((box, i) => {
                                const boxCenterX = box.x + boxSize / 2;
                                const boxCenterY = box.y + boxSize / 2;
                                const distance = Math.sqrt(
                                    Math.pow(boxCenterX - centerX, 2) + 
                                    Math.pow(boxCenterY - centerY, 2)
                                );
                                return { index: i, distance };
                            })
                            .sort((a, b) => a.distance - b.distance) 
                            .map(item => item.index);
                        
                        // Update drawOrder for removal phase
                        drawOrder.length = 0;
                        drawOrder.push(...removeOrder);
                    }
                }
                
                else if (phase === 'removing') {
                    const removeCount = Math.ceil(totalBoxes / 30); 
                    
                    for (let i = 0; i < removeCount && frameCount < totalBoxes; i++) {
                        const box = boxes[drawOrder[frameCount]];
                        ctx.clearRect(box.x - 2, box.y - 2, boxSize + 4, boxSize + 4); 
                        box.drawn = false; 
                        frameCount++;
                    }
                    
                    if (frameCount >= totalBoxes) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        
                        // Remove transitioning class to hide vignette
                        sliderContainer.classList.remove('transitioning');
                        
                        callback();
                        return;
                    }
                }
                
                requestAnimationFrame(animate);
            }

            animate();
        }

        function spawnRandomShapes(slideElement) {
            const isMobile = window.innerWidth <= 768;
            const maxShapes = isMobile ? 8 : 12;
            limitSlideShapes(slideElement, maxShapes);
            const oldShapes = slideElement.querySelectorAll('.random-shape');
            oldShapes.forEach(s => s.remove());

            const shapeCount = (isMobile ? 3 : 6) + Math.floor(Math.random() * (isMobile ? 3 : 6));

            for (let i = 0; i < shapeCount; i++) {
                const shape = document.createElement('div');
                shape.classList.add('random-shape');

                const size = 40 + Math.random() * 70;
                const x = Math.random() * 90;
                const y = Math.random() * 90;
                const type = Math.floor(Math.random() * 4);
                const animationType = Math.floor(Math.random() * 4);

                shape.dataset.type = type;
                shape.dataset.animation = animationType;

                shape.style.left = `${x}%`;
                shape.style.top = `${y}%`;

                if (type !== 3) {
                    shape.style.width = `${size}px`;
                    shape.style.height = `${size}px`;
                }

                switch (animationType) {
                    case 0: shape.classList.add("draw-outline"); break;
                    case 1: shape.classList.add("scale-in"); break;
                    case 2: shape.classList.add("stretch"); break;
                    case 3: shape.classList.add("fade"); break;
                }

                slideElement.appendChild(shape);

                setTimeout(() => {
                    shape.classList.add("visible");

                    if (animationType === 2 && type !== 3) {
                        shape.style.width = `${size}px`;
                        shape.style.height = `${size}px`;
                    }
                }, 80 + i * 100);
            }
        }

        function goToSlide(index) {
            if (isTransitioning) {
                return;
            }
            
            if (index < 0) {
                index = slides.length - 1;
            } else if (index >= slides.length) {
                index = 0;
            }
            
            if (index === currentSlide) {
                return;
            }

            const fromSlide = slides[currentSlide];
            const toSlide = slides[index];

            const activeSlide = slides[index];
            clearSlideShapes(fromSlide);
            spawnRandomShapes(activeSlide);

            // Check if transition should be enabled for this slide
            const shouldTransition = slideData[index].onTransition !== false;

            // Prepare video
            const newVideoSrc = toSlide.dataset.video;
            if (newVideoSrc) {
                changeVideoSource(newVideoSrc, !shouldTransition); // Play immediately if no transition
            }

            if (shouldTransition) {
                // Use pixel transition
                pixelTransition(fromSlide, toSlide, () => {
                    currentSlide = index;
                    updateControls();
                    isTransitioning = false;
                    
                    // Start playing video after transition is complete
                    if (newVideoSrc) {
                        backgroundVideo.play().catch(err => console.log('Video play error:', err));
                    }
                });
            } else {
                // Instant switch without transition
                fromSlide.classList.remove('active');
                toSlide.classList.add('active');
                currentSlide = index;
                updateControls();
            }

            document.querySelectorAll('.dot').forEach((d, i) => {
                if (i === index) {
                    d.classList.add("active");
                    d.style.backgroundImage = `url(${d.dataset.gif})`;
                    d.style.backgroundColor = "transparent";
                } else {
                    d.classList.remove("active");
                    d.style.backgroundImage = "";
                    d.style.backgroundColor = "rgba(255,255,255,0.3)";
                }
            });
        }

        function updateControls() {
            prevBtn.disabled = currentSlide === 0;
            nextBtn.disabled = currentSlide === slides.length - 1;
        }

        prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === "a") goToSlide(currentSlide - 1);
            if (e.key === 'ArrowRight' || e.key === "d") goToSlide(currentSlide + 1);
        });

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            effectsCanvas.width = window.innerWidth;
            effectsCanvas.height = window.innerHeight;
            
            // Update box size on resize
            boxSize = getResponsiveBoxSize();
        });

        updateControls();

        function spawnShapeShards(shape, size) {
            const slide = shape.closest('.slide');
            const shardCount = 6 + Math.floor(Math.random() * 6);

            for (let i = 0; i < shardCount; i++) {
                const shard = document.createElement("div");
                shard.classList.add("shard");
                slide.appendChild(shard);

                const shapeRect = shape.getBoundingClientRect();
                const slideRect = slide.getBoundingClientRect();

                shard.style.left = `${shapeRect.left + shapeRect.width / 2 - slideRect.left}px`;
                shard.style.top = `${shapeRect.top + shapeRect.height / 2 - slideRect.top}px`;

                const angle = Math.random() * 2 * Math.PI;
                const distance = size / 2 + Math.random() * size;
                const dx = Math.cos(angle) * distance;
                const dy = Math.sin(angle) * distance;

                setTimeout(() => {
                    shard.style.opacity = .2 + Math.random() * 0.4;
                    shard.style.transform = `translate(${dx}px, ${dy}px) scale(${0.5 + Math.random() * 0.5}) rotate(${Math.random()*360}deg)`;
                }, 20);

                setTimeout(() => {
                    shard.style.opacity = 0;
                    setTimeout(() => shard.remove(), 400 + Math.random() * 200);
                }, 500 + Math.random() * 300);
            }
        }

        function spawnContinuousShape() {
            const slide = document.querySelectorAll('.slide')[currentSlide];
            if (!slide) return;

            limitSlideShapes(slide, 25);
            const shape = document.createElement("div");
            shape.classList.add("random-shape", "pop");

            const type = Math.floor(Math.random() * 5);
            shape.dataset.type = type;

            const animationType = Math.floor(Math.random() * 4);
            switch (animationType) {
                case 0: shape.classList.add("draw-outline"); break;
                case 1: shape.classList.add("scale-in"); break;
                case 2: shape.classList.add("stretch"); break;
                case 3: shape.classList.add("fade"); break;
            }

            let size;
            if (type === 4) size = 60 + Math.random() * 60;
            else if (type === 3) size = 50;
            else size = 25 + Math.random() * 35;

            if (type !== 3) {
                shape.style.width = `${size}px`;
                shape.style.height = `${size}px`;
            }

            const x = Math.random() * 90;
            const y = Math.random() * 90;
            shape.style.left = `${x}%`;
            shape.style.top = `${y}%`;

            slide.appendChild(shape);

            setTimeout(() => {
                shape.classList.add("visible");
                if (animationType === 2 && type !== 3) {
                    shape.style.width = `${size}px`;
                    shape.style.height = `${size}px`;
                }

                spawnShapeShards(shape, size);
            }, 20);

            setTimeout(() => {
                shape.style.opacity = 0;
                shape.style.transform = "scale(0.7)";
                setTimeout(() => shape.remove(), 500);
            }, 2000 + Math.random() * 2000);
        }

        setInterval(spawnContinuousShape, 350);

        function spawnGrainParticle() {
            const zone = document.querySelector(".grain-zone");
            const grain = document.createElement("div");
            grain.classList.add("grain");

            if (Math.random() > 0.6) {
                grain.classList.add("sparkle");
            }

            const size = 2 + Math.random() * 2;
            grain.style.width = `${size}px`;
            grain.style.height = `${size}px`;

            const x = Math.random() * 100;
            const y = 80 + Math.random() * 20;
            grain.style.left = `${x}%`;
            grain.style.top = `${y}%`;

            zone.appendChild(grain);

            setTimeout(() => {
                grain.classList.add("visible");

                const windX = (Math.random() * 40 - 20); 
                const windY = -(5 + Math.random() * 15);
                grain.style.transform = `translateX(${windX}px) translateY(${windY}px)`;
            }, 10);

            setTimeout(() => {
                grain.style.opacity = 0;
                setTimeout(() => grain.remove(), 400);
            }, 1500 + Math.random() * 1200);
        }

        setInterval(spawnGrainParticle, 75);

        function clearSlideShapes(slide) {
            slide.querySelectorAll('.random-shape').forEach(s => s.remove());
            slide.querySelectorAll('.shard').forEach(s => s.remove());
        }

        function limitSlideShapes(slide, maxShapes = 20) {
            const shapes = slide.querySelectorAll('.random-shape, .shard');
            if (shapes.length <= maxShapes) return;

            const excess = shapes.length - maxShapes;
            for (let i = 0; i < excess; i++) {
                shapes[i].remove();
            }
        }

        function spawnShootingStar() {
            const canvas = document.getElementById('effectsCanvas');
            const ctx = canvas.getContext('2d');

            const star = {
                x: Math.random() < 0.5 ? 0 : canvas.width - 20,
                y: Math.random() * 50 + 10,
                length: 80 + Math.random() * 40,
                speedX: Math.random() * 8 + 6,
                speedY: Math.random() * 4 + 2,
                opacity: 1
            };

            if (star.x > 0) star.speedX *= -1;

            function animateStar() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.beginPath();
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(star.x + star.length * (star.speedX / 10), star.y + star.length * (star.speedY / 10));
                ctx.strokeStyle = `rgba(255,255,255,${star.opacity})`;
                ctx.lineWidth = 2;
                ctx.stroke();

                star.x += star.speedX;
                star.y += star.speedY;
                star.opacity -= 0.01;

                if (star.opacity > 0) {
                    requestAnimationFrame(animateStar);
                }
            }

            animateStar();
        }

        function scheduleShootingStars() {
            setTimeout(() => {
                const count = 1 + Math.floor(Math.random() * 2);
                for (let i = 0; i < count; i++) spawnShootingStar();
                scheduleShootingStars();
            }, 5000);
        }

        scheduleShootingStars();
