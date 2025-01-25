<!-- FamilyInfoModal.vue -->
<template>
  <div v-if="show" class="modal" @click="handleBackdropClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Thông tin chi tiết</h3>
        <button @click="close" class="close-button">&times;</button>
      </div>
      <div v-if="node" class="modal-body">
        <div class="info-section">
          <h4>Thông tin cá nhân</h4>
          <div class="info-row">
            <span class="info-label">Họ tên:</span>
            <span class="info-value">{{ node.name }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Năm sinh:</span>
            <span class="info-value">{{ node.birthYear }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Đời thứ:</span>
            <span class="info-value">{{ node.generation }}</span>
          </div>
        </div>

        <div class="spouse-section">
          <h4>Thông tin vợ/chồng</h4>
          <div v-if="node.spouses && node.spouses.length > 0">
            <div v-for="(spouse, index) in node.spouses"
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
          <div v-if="children.length > 0">
            <div v-for="child in children"
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
</template>

<script>
export default {
  name: 'FamilyInfoModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    node: {
      type: Object,
      default: null
    },
    children: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    handleBackdropClick() {
      this.close()
    },
    getMotherName(motherId) {
      if (!motherId) return 'Không có thông tin'
      if (this.node.spouses) {
        const spouse = this.node.spouses.find(s => s.id === motherId)
        if (spouse) return spouse.name
      }
      return 'Không có thông tin'
    }
  }
}
</script>

<style scoped>
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
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
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

.info-section,
.spouse-section,
.children-section {
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

.spouse-info,
.child-info {
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