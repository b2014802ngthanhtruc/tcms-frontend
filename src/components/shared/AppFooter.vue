<script setup lang="ts">
import { defineComponent } from 'vue'

defineComponent({ name: 'AppFooter' })
</script>

<template>
  <footer class="flex-auto divide-y-2 bg-white py-4 align-middle">
    <div class="grid grid-flow-col-dense justify-around gap-4">
      <ul class="footer-groups">
        <li class="text-lg font-medium"><h5>Thông tin liên lạc</h5></li>
        <li class="footer-group-items"><a href="#">Email: daybreak@mailinator.com</a></li>
        <li class="footer-group-items"><a href="#">Phone: +84 123 456 789</a></li>
        <li class="footer-group-items">
          <a href="#">Địa chỉ: 123, Hung Loi, Ninh Kieu, Can Tho</a>
        </li>
      </ul>
      <ul class="footer-groups">
        <li class="text-lg font-medium"><h5>Danh mục</h5></li>
        <li class="footer-group-items"><a href="#">Trang chủ</a></li>
        <li class="footer-group-items"><a href="#">Lớp học</a></li>
        <li class="footer-group-items"><a href="#">Gia sư</a></li>
      </ul>
      <ul class="footer-groups">
        <li class="text-lg font-medium"><h5>Liên kết</h5></li>
        <li class="footer-group-items">
          <font-awesome-icon :icon="['fab', 'facebook']" style="color: #225bbf" />
          <a href="#">Facebook</a>
        </li>
        <li class="footer-group-items">
          <a href="#"
            ><font-awesome-icon :icon="['fab', 'square-instagram']" style="color: #225bbf" />
            Instagram</a
          >
        </li>
        <li class="footer-group-items">
          <a href="#"
            ><font-awesome-icon :icon="['fab', 'twitter']" style="color: #225bbf" /> Twitter</a
          >
        </li>
      </ul>
    </div>
    <div class="mt-4 block py-4 align-middle">
      <p class="text-center font-sans text-xl">
        ©2024 Day Break Tutor Center. All Rights Reserved.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer-groups {
  @apply grid grid-flow-row-dense content-start gap-2 font-sans;
}

.footer-group-items {
  @apply font-sans text-sm;
}
</style>
