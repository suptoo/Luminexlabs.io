/**
 * LumenAI Explainer - Main JavaScript
 * LuminexLabs © 2024
 */

// ============================================
// DOM Ready
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initConceptBars();
    initFlowNodes();
    initImageSlots();
    initAnimations();
    initDataFlow();
});

// ============================================
// Navigation
// ============================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Scroll spy
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ============================================
// Concept Bars Animation
// ============================================
function initConceptBars() {
    const conceptBars = document.querySelectorAll('.concept-bar');
    
    // Initial animation
    conceptBars.forEach((bar, index) => {
        const fill = bar.querySelector('.concept-bar-fill');
        const targetWidth = fill.dataset.value || fill.style.width;
        
        fill.style.width = '0%';
        setTimeout(() => {
            fill.style.width = targetWidth;
        }, 100 + index * 100);
    });
    
    // Live updates (simulated)
    setInterval(() => {
        updateConceptValues();
    }, 3000);
}

function updateConceptValues() {
    const concepts = document.querySelectorAll('.concept-bar');
    
    concepts.forEach(concept => {
        const valueEl = concept.querySelector('.concept-value');
        const fillEl = concept.querySelector('.concept-bar-fill');
        
        if (!valueEl || !fillEl) return;
        
        const currentValue = parseFloat(valueEl.textContent);
        const variation = (Math.random() - 0.5) * 0.05;
        const newValue = Math.max(0.1, Math.min(0.99, currentValue + variation));
        
        valueEl.textContent = newValue.toFixed(2);
        fillEl.style.width = (newValue * 100) + '%';
        
        // Update color class
        fillEl.classList.remove('high', 'medium', 'low');
        if (newValue > 0.7) fillEl.classList.add('high');
        else if (newValue > 0.4) fillEl.classList.add('medium');
        else fillEl.classList.add('low');
    });
}

// ============================================
// Flow Nodes Interaction
// ============================================
function initFlowNodes() {
    const flowNodes = document.querySelectorAll('.flow-node');
    
    flowNodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            node.classList.add('active');
            showNodeTooltip(node);
        });
        
        node.addEventListener('mouseleave', () => {
            if (!node.dataset.keepActive) {
                node.classList.remove('active');
            }
            hideNodeTooltip();
        });
        
        node.addEventListener('click', () => {
            flowNodes.forEach(n => {
                n.dataset.keepActive = '';
                n.classList.remove('active');
            });
            node.dataset.keepActive = 'true';
            node.classList.add('active');
        });
    });
}

function showNodeTooltip(node) {
    const tooltipData = {
        'input-node': {
            title: 'Multi-View Input',
            content: 'Upload 3-4 dermoscopic images of the same lesion from different angles for comprehensive analysis.'
        },
        'backbone-node': {
            title: 'EfficientNet-B0 Backbone',
            content: 'Pretrained CNN that extracts 1280 visual features from each image using ImageNet knowledge.'
        },
        'attention-node': {
            title: 'Multi-Head Attention',
            content: 'Learns which views are most informative and weights them accordingly for final prediction.'
        },
        'concept-node': {
            title: 'Concept Bottleneck',
            content: 'Predicts 12 clinical concepts (ABCDE criteria) before final classification for interpretability.'
        },
        'output-node': {
            title: 'Classification Head',
            content: 'Final layer that predicts one of 8 skin disease classes based on concept activations.'
        }
    };
    
    const data = tooltipData[node.id];
    if (!data) return;
    
    let tooltip = document.getElementById('node-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'node-tooltip';
        tooltip.className = 'tooltip';
        document.body.appendChild(tooltip);
    }
    
    tooltip.innerHTML = `
        <div class="tooltip-title">${data.title}</div>
        <div class="tooltip-content">${data.content}</div>
    `;
    
    const rect = node.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.bottom + 10 + 'px';
    tooltip.style.opacity = '1';
    tooltip.style.visibility = 'visible';
}

function hideNodeTooltip() {
    const tooltip = document.getElementById('node-tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
    }
}

// ============================================
// Image Slots
// ============================================
function initImageSlots() {
    const slots = document.querySelectorAll('.image-slot');
    
    slots.forEach(slot => {
        slot.addEventListener('mouseenter', () => {
            const badge = slot.querySelector('.image-slot-badge');
            if (badge) {
                badge.style.transform = 'scale(1.1)';
            }
        });
        
        slot.addEventListener('mouseleave', () => {
            const badge = slot.querySelector('.image-slot-badge');
            if (badge) {
                badge.style.transform = 'scale(1)';
            }
        });
        
        // Simulate upload
        slot.addEventListener('click', () => {
            if (!slot.classList.contains('filled')) {
                slot.classList.add('filled');
                slot.innerHTML = `
                    <div class="image-slot-icon">✓</div>
                    <div class="image-slot-label">Uploaded</div>
                    <div class="image-slot-badge">${Math.floor(Math.random() * 10 + 20)}%</div>
                `;
            }
        });
    });
}

// ============================================
// Scroll Animations
// ============================================
function initAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.card, .flow-node, .concepts-panel, .prediction-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
    
    // Add animate-in class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// Data Flow Visualization
// ============================================
function initDataFlow() {
    const flowContainer = document.getElementById('data-flow-svg');
    if (!flowContainer) return;
    
    drawDataFlowPaths(flowContainer);
    
    window.addEventListener('resize', () => {
        flowContainer.innerHTML = '';
        drawDataFlowPaths(flowContainer);
    });
}

function drawDataFlowPaths(container) {
    const svg = container;
    const parent = svg.parentElement;
    const rect = parent.getBoundingClientRect();
    
    svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
    svg.style.width = '100%';
    svg.style.height = '100%';
    
    // Create gradient
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'flowGradient');
    gradient.innerHTML = `
        <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:0.3"/>
        <stop offset="50%" style="stop-color:#7c3aed;stop-opacity:0.5"/>
        <stop offset="100%" style="stop-color:#10b981;stop-opacity:0.3"/>
    `;
    defs.appendChild(gradient);
    svg.appendChild(defs);
    
    // Get columns
    const columns = parent.querySelectorAll('.flow-column');
    if (columns.length < 3) return;
    
    const col1Items = columns[0].querySelectorAll('.flow-item');
    const col2Items = columns[1].querySelectorAll('.flow-item');
    const col3Items = columns[2].querySelectorAll('.flow-item');
    
    // Draw paths
    drawPathsBetweenColumns(svg, col1Items, col2Items, parent);
    drawPathsBetweenColumns(svg, col2Items, col3Items, parent);
}

function drawPathsBetweenColumns(svg, sourceItems, targetItems, container) {
    const containerRect = container.getBoundingClientRect();
    
    sourceItems.forEach(source => {
        targetItems.forEach(target => {
            const sourceRect = source.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            
            const startX = sourceRect.right - containerRect.left;
            const startY = sourceRect.top + sourceRect.height / 2 - containerRect.top;
            const endX = targetRect.left - containerRect.left;
            const endY = targetRect.top + targetRect.height / 2 - containerRect.top;
            const midX = (startX + endX) / 2;
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`);
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', 'url(#flowGradient)');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('opacity', Math.random() > 0.5 ? '0.6' : '0.3');
            
            if (Math.random() > 0.5) {
                path.setAttribute('stroke-dasharray', '5, 5');
                path.style.animation = 'dash 1s linear infinite';
            }
            
            svg.appendChild(path);
        });
    });
}

// ============================================
// Utility Functions
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// Export for module use
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigation,
        initConceptBars,
        initFlowNodes,
        updateConceptValues
    };
}
