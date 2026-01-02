/**
 * LumenAI Explainer - Visualization Module
 * Interactive D3.js visualizations
 * LuminexLabs © 2024
 */

// ============================================
// Neural Network Visualization
// ============================================
class NetworkVisualization {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.width = this.container.clientWidth;
        this.height = 400;
        this.layers = [
            { name: 'Input', nodes: 4, color: '#00d4ff' },
            { name: 'Conv1', nodes: 8, color: '#00b8d4' },
            { name: 'Conv2', nodes: 16, color: '#7c3aed' },
            { name: 'Features', nodes: 12, color: '#a78bfa' },
            { name: 'Concepts', nodes: 12, color: '#f59e0b' },
            { name: 'Output', nodes: 8, color: '#10b981' }
        ];
        
        this.init();
    }
    
    init() {
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('class', 'network-svg');
        
        this.drawNetwork();
        this.animate();
    }
    
    drawNetwork() {
        const layerWidth = this.width / (this.layers.length + 1);
        const nodeRadius = 8;
        
        // Draw connections first (behind nodes)
        for (let i = 0; i < this.layers.length - 1; i++) {
            const layer1 = this.layers[i];
            const layer2 = this.layers[i + 1];
            const x1 = layerWidth * (i + 1);
            const x2 = layerWidth * (i + 2);
            
            for (let j = 0; j < layer1.nodes; j++) {
                const y1 = this.getNodeY(layer1.nodes, j);
                
                for (let k = 0; k < layer2.nodes; k++) {
                    const y2 = this.getNodeY(layer2.nodes, k);
                    
                    this.svg.append('line')
                        .attr('class', 'network-connection')
                        .attr('x1', x1)
                        .attr('y1', y1)
                        .attr('x2', x2)
                        .attr('y2', y2)
                        .attr('stroke', '#333')
                        .attr('stroke-width', 0.5)
                        .attr('opacity', 0.2);
                }
            }
        }
        
        // Draw nodes
        this.layers.forEach((layer, i) => {
            const x = layerWidth * (i + 1);
            
            for (let j = 0; j < layer.nodes; j++) {
                const y = this.getNodeY(layer.nodes, j);
                
                // Node glow
                this.svg.append('circle')
                    .attr('class', 'node-glow')
                    .attr('cx', x)
                    .attr('cy', y)
                    .attr('r', nodeRadius + 4)
                    .attr('fill', layer.color)
                    .attr('opacity', 0.2)
                    .attr('filter', 'blur(4px)');
                
                // Node
                this.svg.append('circle')
                    .attr('class', 'network-node')
                    .attr('cx', x)
                    .attr('cy', y)
                    .attr('r', nodeRadius)
                    .attr('fill', layer.color)
                    .attr('data-layer', i)
                    .attr('data-node', j);
            }
            
            // Layer label
            this.svg.append('text')
                .attr('x', x)
                .attr('y', this.height - 20)
                .attr('text-anchor', 'middle')
                .attr('fill', '#666')
                .attr('font-size', '11px')
                .text(layer.name);
        });
    }
    
    getNodeY(totalNodes, index) {
        const padding = 60;
        const availableHeight = this.height - padding * 2 - 40;
        const spacing = availableHeight / (totalNodes + 1);
        return padding + spacing * (index + 1);
    }
    
    animate() {
        const nodes = this.svg.selectAll('.network-node');
        
        setInterval(() => {
            // Random activation pulse
            const randomNode = nodes.nodes()[Math.floor(Math.random() * nodes.size())];
            if (randomNode) {
                d3.select(randomNode)
                    .transition()
                    .duration(200)
                    .attr('r', 12)
                    .transition()
                    .duration(400)
                    .attr('r', 8);
            }
        }, 100);
    }
}

// ============================================
// Attention Heatmap
// ============================================
class AttentionHeatmap {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.width = 200;
        this.height = 200;
        this.gridSize = 14;
        
        this.init();
    }
    
    init() {
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);
        
        this.generateHeatmap();
    }
    
    generateHeatmap() {
        const cellSize = this.width / this.gridSize;
        const data = this.generateAttentionData();
        
        const colorScale = d3.scaleSequential(d3.interpolateInferno)
            .domain([0, 1]);
        
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                this.svg.append('rect')
                    .attr('x', j * cellSize)
                    .attr('y', i * cellSize)
                    .attr('width', cellSize - 1)
                    .attr('height', cellSize - 1)
                    .attr('fill', colorScale(data[i][j]))
                    .attr('rx', 2);
            }
        }
    }
    
    generateAttentionData() {
        const data = [];
        const centerX = this.gridSize / 2 + (Math.random() - 0.5) * 4;
        const centerY = this.gridSize / 2 + (Math.random() - 0.5) * 4;
        
        for (let i = 0; i < this.gridSize; i++) {
            data[i] = [];
            for (let j = 0; j < this.gridSize; j++) {
                const dist = Math.sqrt((i - centerY) ** 2 + (j - centerX) ** 2);
                const value = Math.exp(-dist / 4) + Math.random() * 0.2;
                data[i][j] = Math.min(1, value);
            }
        }
        return data;
    }
    
    update() {
        this.svg.selectAll('rect').remove();
        this.generateHeatmap();
    }
}

// ============================================
// Concept Radar Chart
// ============================================
class ConceptRadar {
    constructor(containerId, data) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.width = 300;
        this.height = 300;
        this.margin = 50;
        this.data = data || this.getDefaultData();
        
        this.init();
    }
    
    getDefaultData() {
        return [
            { axis: 'Asymmetry', value: 0.92 },
            { axis: 'Border', value: 0.85 },
            { axis: 'Color', value: 0.78 },
            { axis: 'Diameter', value: 0.65 },
            { axis: 'Evolution', value: 0.71 },
            { axis: 'Veil', value: 0.45 },
            { axis: 'Network', value: 0.38 },
            { axis: 'Regression', value: 0.23 }
        ];
    }
    
    init() {
        this.radius = Math.min(this.width, this.height) / 2 - this.margin;
        
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .append('g')
            .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);
        
        this.drawRadar();
    }
    
    drawRadar() {
        const levels = 5;
        const angleSlice = (Math.PI * 2) / this.data.length;
        
        // Draw grid circles
        for (let level = 1; level <= levels; level++) {
            const r = (this.radius / levels) * level;
            this.svg.append('circle')
                .attr('r', r)
                .attr('fill', 'none')
                .attr('stroke', '#333')
                .attr('stroke-width', 0.5)
                .attr('opacity', 0.3);
        }
        
        // Draw axes
        this.data.forEach((d, i) => {
            const angle = angleSlice * i - Math.PI / 2;
            const x = Math.cos(angle) * this.radius;
            const y = Math.sin(angle) * this.radius;
            
            this.svg.append('line')
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', x)
                .attr('y2', y)
                .attr('stroke', '#333')
                .attr('stroke-width', 0.5)
                .attr('opacity', 0.3);
            
            // Axis labels
            const labelX = Math.cos(angle) * (this.radius + 20);
            const labelY = Math.sin(angle) * (this.radius + 20);
            
            this.svg.append('text')
                .attr('x', labelX)
                .attr('y', labelY)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('fill', '#888')
                .attr('font-size', '10px')
                .text(d.axis);
        });
        
        // Draw data polygon
        const lineGenerator = d3.lineRadial()
            .radius(d => d.value * this.radius)
            .angle((d, i) => i * angleSlice)
            .curve(d3.curveLinearClosed);
        
        // Gradient fill
        const gradient = this.svg.append('defs')
            .append('radialGradient')
            .attr('id', 'radarGradient');
        
        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#00d4ff')
            .attr('stop-opacity', 0.8);
        
        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#7c3aed')
            .attr('stop-opacity', 0.3);
        
        this.svg.append('path')
            .datum(this.data)
            .attr('d', lineGenerator)
            .attr('fill', 'url(#radarGradient)')
            .attr('stroke', '#00d4ff')
            .attr('stroke-width', 2);
        
        // Draw data points
        this.data.forEach((d, i) => {
            const angle = angleSlice * i - Math.PI / 2;
            const x = Math.cos(angle) * (d.value * this.radius);
            const y = Math.sin(angle) * (d.value * this.radius);
            
            this.svg.append('circle')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', 4)
                .attr('fill', '#00d4ff')
                .attr('stroke', '#fff')
                .attr('stroke-width', 1);
        });
    }
}

// ============================================
// Confidence Gauge
// ============================================
class ConfidenceGauge {
    constructor(containerId, value = 0.967) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.value = value;
        this.width = 200;
        this.height = 120;
        
        this.init();
    }
    
    init() {
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);
        
        this.drawGauge();
    }
    
    drawGauge() {
        const centerX = this.width / 2;
        const centerY = this.height - 20;
        const radius = 80;
        
        // Background arc
        const bgArc = d3.arc()
            .innerRadius(radius - 15)
            .outerRadius(radius)
            .startAngle(-Math.PI / 2)
            .endAngle(Math.PI / 2);
        
        this.svg.append('path')
            .attr('d', bgArc)
            .attr('transform', `translate(${centerX}, ${centerY})`)
            .attr('fill', '#1a1a24');
        
        // Gradient for value arc
        const gradient = this.svg.append('defs')
            .append('linearGradient')
            .attr('id', 'gaugeGradient')
            .attr('x1', '0%')
            .attr('x2', '100%');
        
        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#ef4444');
        
        gradient.append('stop')
            .attr('offset', '50%')
            .attr('stop-color', '#f59e0b');
        
        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#10b981');
        
        // Value arc
        const valueArc = d3.arc()
            .innerRadius(radius - 15)
            .outerRadius(radius)
            .startAngle(-Math.PI / 2)
            .endAngle(-Math.PI / 2 + Math.PI * this.value);
        
        this.svg.append('path')
            .attr('d', valueArc)
            .attr('transform', `translate(${centerX}, ${centerY})`)
            .attr('fill', 'url(#gaugeGradient)');
        
        // Center value text
        this.svg.append('text')
            .attr('x', centerX)
            .attr('y', centerY - 20)
            .attr('text-anchor', 'middle')
            .attr('fill', '#10b981')
            .attr('font-size', '28px')
            .attr('font-weight', '700')
            .attr('font-family', 'JetBrains Mono, monospace')
            .text(`${(this.value * 100).toFixed(1)}%`);
        
        // Label
        this.svg.append('text')
            .attr('x', centerX)
            .attr('y', centerY + 5)
            .attr('text-anchor', 'middle')
            .attr('fill', '#666')
            .attr('font-size', '11px')
            .text('Confidence');
    }
}

// ============================================
// Initialize Visualizations
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Network visualization
    if (document.getElementById('network-viz')) {
        new NetworkVisualization('network-viz');
    }
    
    // Attention heatmaps
    document.querySelectorAll('.attention-heatmap').forEach((el, i) => {
        new AttentionHeatmap(el.id || `heatmap-${i}`);
    });
    
    // Concept radar
    if (document.getElementById('concept-radar')) {
        new ConceptRadar('concept-radar');
    }
    
    // Confidence gauge
    if (document.getElementById('confidence-gauge')) {
        new ConfidenceGauge('confidence-gauge', 0.967);
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NetworkVisualization,
        AttentionHeatmap,
        ConceptRadar,
        ConfidenceGauge
    };
}
