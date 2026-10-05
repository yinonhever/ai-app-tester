<template>
  <header class="header">
    <div class="header__container">
      <Logo class="header__logo" @click="showMobileMenu = false" />
      <div class="header__content">
        <nav :class="['header__navigation', { active: showMobileMenu }]">
          <ul class="header__nav-list">
            <NavItem
              v-for="item in navItems"
              :key="item.link"
              :link="item.link"
              :text="item.text"
              @click="showMobileMenu = false"
            />
          </ul>
        </nav>
        <NavToggle
          :active="showMobileMenu"
          @click="showMobileMenu = !showMobileMenu"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { NavItem } from "../../utils/types";

const showMobileMenu = ref(false);

const navItems: NavItem[] = [
  { link: "/", text: "New Scan" },
  { link: "/scans", text: "My Scans" }
];

const handleResize = () => {
  if (window.innerWidth > 600) showMobileMenu.value = false;
};

onMounted(() => window.addEventListener("resize", handleResize));
onBeforeUnmount(() => window.removeEventListener("resize", handleResize));

watch(showMobileMenu, value => {
  document.body.style.overflow = value ? "hidden" : "initial";
});
</script>

<style lang="scss">
.header {
  padding: 5px 50px;
  background-color: $color4;
  color: #fff;
  z-index: 999;

  @include respond(tablet) {
    padding: 5px 25px;
  }

  @include respond(mobile) {
    padding: 8px 12px;
  }

  &__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    position: relative;
    z-index: 9999;
  }

  &__content {
    display: flex;
    align-items: center;
    gap: 50px;

    @include respond(tablet) {
      gap: 30px;
    }

    @include respond(mobile) {
      gap: 15px;
    }
  }

  &__navigation {
    font-size: 17px;
    font-weight: 500;

    @include respond(tablet) {
      font-size: 16px;
    }

    @include respond(mobile) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      background-color: rgba(3, 15, 78, 0.9);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s;

      &.active {
        opacity: 1;
        visibility: visible;
      }
    }
  }

  &__nav-list {
    list-style: none;
    display: flex;
    gap: 50px;
    padding: 0;

    @include respond(tablet) {
      gap: 30px;
    }

    @include respond(mobile) {
      display: grid;
      grid-template-columns: 1fr;
      gap: 30px;
    }
  }

  &__nav-link {
    display: block;
    width: 100%;
  }

  &__nav-item:hover &__nav-link {
    color: $color2;
  }
}
</style>
