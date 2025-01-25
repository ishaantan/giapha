<!-- FamilyTreeLayout.vue -->
<template>
  <div class="tree-container">
    <div class="zoom-controls">
      <button @click="zoomIn">+</button>
      <button @click="zoomOut">-</button>
    </div>

    <div class="scroll-container" :style="{ transform: `scale(${zoom})` }">
      <v-network-graph
          :nodes="nodes"
          :edges="edges"
          :layouts="layouts"
          :configs="configs"
          :width="2000"
          :height="1500"
          @node-click="handleNodeClick"
      />
    </div>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Thông tin chi tiết</h3>
          <button @click="closeModal" class="close-button">&times;</button>
        </div>
        <div v-if="selectedNode" class="modal-body">
          <div class="info-section">
            <h4>Thông tin cá nhân</h4>
            <div class="info-row">
              <span class="info-label">Họ tên:</span>
              <span class="info-value">{{ selectedNode.name }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Năm sinh:</span>
              <span class="info-value">{{ selectedNode.birthYear }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Đời thứ:</span>
              <span class="info-value">{{ selectedNode.generation }}</span>
            </div>
          </div>

          <div class="spouse-section">
            <h4>Thông tin vợ/chồng</h4>
            <div v-if="selectedNode.spouses && selectedNode.spouses.length > 0">
              <div v-for="(spouse, index) in selectedNode.spouses"
                   :key="index"
                   class="spouse-info">
                <div class="info-row">
                  <span class="info-label">Họ tên:</span>
                  <span class="info-value">{{ spouse.name }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Năm sinh:</span>
                  <span class="info-value">{{ spouse.birthYear }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Năm cưới:</span>
                  <span class="info-value">{{ spouse.marriageYear }}</span>
                </div>
              </div>
            </div>
            <div v-else class="no-data">Chưa có thông tin vợ/chồng</div>
          </div>

          <div class="children-section">
            <h4>Thông tin con cái</h4>
            <div v-if="getChildren(selectedNode.id).length > 0">
              <div v-for="child in getChildren(selectedNode.id)"
                   :key="child.id"
                   class="child-info">
                <div class="info-row">
                  <span class="info-label">Họ tên:</span>
                  <span class="info-value">{{ child.name }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Năm sinh:</span>
                  <span class="info-value">{{ child.birthYear }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Mẹ:</span>
                  <span class="info-value">{{ getMotherName(child.motherId) }}</span>
                </div>
              </div>
            </div>
            <div v-else class="no-data">Chưa có thông tin con cái</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { VNetworkGraph } from 'v-network-graph'
import 'v-network-graph/lib/style.css'

export default {
  name: 'FamilyTreeLayout',
  components: { VNetworkGraph },
  data() {
    return {
      zoom: 1,
      showModal: false,
      selectedNode: null,
      nodes: {
        // Đời 1 (1 người)
        N1: {
          id: 'N1',
          name: 'Nguyễn Văn A',
          birthYear: 1900,
          generation: 1,
          spouses: [{
            id: 'SP1',
            name: 'Trần Thị B',
            birthYear: 1902,
            marriageYear: 1920
          }]
        },
        // Đời 2 (3 người)
        N2: {
          id: 'N2',
          name: 'Nguyễn Văn C',
          birthYear: 1925,
          generation: 2,
          motherId: 'SP1',
          spouses: [{
            id: 'SP2',
            name: 'Lê Thị D',
            birthYear: 1928,
            marriageYear: 1945
          }]
        },
        N3: {
          id: 'N3',
          name: 'Nguyễn Thị E',
          birthYear: 1927,
          generation: 2,
          motherId: 'SP1'
        },
        N4: {
          id: 'N4',
          name: 'Nguyễn Văn F',
          birthYear: 1930,
          generation: 2,
          motherId: 'SP1',
          spouses: [{
            id: 'SP3',
            name: 'Phạm Thị G',
            birthYear: 1932,
            marriageYear: 1950
          }]
        },
        // Đời 3 (8 người)
        N5: { id: 'N5', name: 'Nguyễn Văn H', birthYear: 1950, generation: 3, motherId: 'SP2' },
        N6: { id: 'N6', name: 'Nguyễn Thị I', birthYear: 1952, generation: 3, motherId: 'SP2' },
        N7: { id: 'N7', name: 'Nguyễn Văn K', birthYear: 1953, generation: 3, motherId: 'SP2',
          spouses: [{
            id: 'SP4',
            name: 'Hoàng Thị L',
            birthYear: 1955,
            marriageYear: 1975
          }]
        },
        N8: { id: 'N8', name: 'Nguyễn Văn M', birthYear: 1951, generation: 3, motherId: 'SP3' },
        N9: { id: 'N9', name: 'Nguyễn Thị N', birthYear: 1953, generation: 3, motherId: 'SP3' },
        N10: { id: 'N10', name: 'Nguyễn Văn O', birthYear: 1955, generation: 3, motherId: 'SP3' },
        N11: { id: 'N11', name: 'Nguyễn Văn P', birthYear: 1957, generation: 3, motherId: 'SP3' },
        N12: { id: 'N12', name: 'Nguyễn Thị Q', birthYear: 1959, generation: 3, motherId: 'SP3' },
        // Đời 4 (10 người)
        ...Array(10).fill().reduce((acc, _, i) => ({
          ...acc,
          [`N${13+i}`]: {
            id: `N${13+i}`,
            name: `Nguyễn ${['Văn', 'Thị'][i%2]} ${String.fromCharCode(82+i)}`,
            birthYear: 1975 + Math.floor(i/2),
            generation: 4,
            motherId: i < 5 ? 'SP4' : 'SP5'
          }
        }), {}),
        // Đời 5 (8 người)
        ...Array(8).fill().reduce((acc, _, i) => ({
          ...acc,
          [`N${23+i}`]: {
            id: `N${23+i}`,
            name: `Nguyễn ${['Văn', 'Thị'][i%2]} ${String.fromCharCode(92+i)}`,
            birthYear: 2000 + Math.floor(i/2),
            generation: 5,
            motherId: `SP${6+Math.floor(i/3)}`
          }
        }), {})
      },
      edges: {},
      layouts: {
        nodes: {}
      },
      configs: {
        node: {
          normal: {
            type: 'circle',
            radius: 35, // Increased radius
            color: (node) => {
              const colors = ['#4169E1', '#1E90FF', '#00BFFF', '#87CEEB', '#87CEFA']
              return colors[node.generation - 1] || '#4169E1'
            },
            label: {
              visible: true,
              fontSize: 16, // Increased font size
              color: '#FFFFFF',
              direction: 'center',
              formatter: (node) => `${node.name.split(' ').pop()}\n(${node.birthYear})`
            }
          },
          hover: {
            scale: 1.2,
          }
          },
        edge: {
          normal: {
            width: 2,
            color: '#808080',
            linecap: 'round'
          },
          hover: {
            width: 3,
            color: '#404040'
          }
        }
      }
    }
  },
  created() {
    // Tạo edges tự động dựa trên motherId
    Object.values(this.nodes).forEach(node => {
      if (node.motherId) {
        // Tìm node cha (chồng của mẹ)
        const father = Object.values(this.nodes).find(n =>
            n.spouses && n.spouses.some(s => s.id === node.motherId)
        )
        if (father) {
          this.edges[`${father.id}-${node.id}`] = {
            source: father.id,
            target: node.id,
            type: 'parent-child'
          }
        }
      }
    })

    // Tính toán layout
    const generations = {}
    Object.values(this.nodes).forEach(node => {
      if (!generations[node.generation]) generations[node.generation] = []
      generations[node.generation].push(node)
    })

    const levelHeight = 120
    const nodeSpacing = 100
    Object.entries(generations).forEach(([gen, nodes]) => {
      const y = (parseInt(gen) - 1) * levelHeight + 50
      const totalWidth = (nodes.length - 1) * nodeSpacing
      const startX = (1000 - totalWidth) / 2

      nodes.forEach((node, index) => {
        this.layouts.nodes[node.id] = {
          x: startX + index * nodeSpacing,
          y: y
        }
      })
    })
  },
  methods: {
    handleNodeClick(nodeId) {
      this.selectedNode = this.nodes[nodeId]
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.selectedNode = null
    },
    getChildren(nodeId) {
      return Object.values(this.nodes).filter(node =>
          Object.values(this.edges).some(edge =>
              edge.type === 'parent-child' &&
              edge.source === nodeId &&
              edge.target === node.id
          )
      )
    },
    getMotherName(motherId) {
      if (!motherId) return 'Không có thông tin'
      for (const nodeId in this.nodes) {
        const node = this.nodes[nodeId]
        if (node.spouses) {
          const spouse = node.spouses.find(s => s.id === motherId)
          if (spouse) return spouse.name
        }
      }
      return 'Không có thông tin'
    },
    zoomIn() {
      this.zoom = Math.min(2, this.zoom + 0.1)
    },
    zoomOut() {
      this.zoom = Math.max(0.5, this.zoom - 0.1)
    }
  }
}
</script>

<style scoped>
.tree-container {
  width: 100%;
  min-height: 100vh; /* Tối thiểu bằng chiều cao màn hình */
  background-color: #FFFFFF;
  position: relative;
  display: flex;
  flex-direction: column;
}

.scroll-container {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  overflow: auto;
  transform-origin: top left;
}

.nodes-container {
  width: fit-content;
  min-width: 100%;
  padding: 20px;
  margin: 0 auto;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 16px;
}

.info-section, .spouse-section, .children-section {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  margin: 8px 0;
}

.info-label {
  width: 100px;
  font-weight: bold;
  color: #666;
}

.info-value {
  flex: 1;
  color: #333;
}

h4 {
  margin: 16px 0 8px 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.spouse-info, .child-info {
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin: 8px 0;
}

.no-data {
  color: #666;
  font-style: italic;
  padding: 8px;
}
</style>