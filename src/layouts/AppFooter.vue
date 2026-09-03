<template>
  <footer class="app-footer">
    <div class="app-footer__inner">
      <div class="app-footer__brand">
        <h2 class="app-footer__logo">POWER CAFE</h2>
        <p class="app-footer__tagline">Every cup begins with a journey.</p>
        <p class="app-footer__tagline-zh">每一杯咖啡，都從一段旅程開始。</p>
      </div>

      <nav aria-label="頁尾導覽" class="app-footer__nav">
        <h3>導覽</h3>
        <RouterLink to="/">首頁</RouterLink>
        <RouterLink to="/menu">開始點餐</RouterLink>
        <RouterLink to="/processing#coffee-journey">咖啡旅程</RouterLink>
        <RouterLink to="/order-status">訂單狀態</RouterLink>
      </nav>

      <div class="app-footer__contact">
        <h3>聯絡我們</h3>
        <p>電話資訊</p>
        <p>Email 資訊</p>
      </div>

      <div class="app-footer__hours">
        <h3>營業時間</h3>
        <p>09:00 – 18:00</p>
      </div>
    </div>

    <div class="app-footer__bottom">
      © 2026 Power Cafe. All rights reserved.
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: #2f1d14;
  color: #f1dfc4;
}

.app-footer__inner {
  width: min(1500px, calc(100% - 96px));
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.4fr 0.8fr 1fr 0.8fr;
  gap: clamp(40px, 5vw, 90px);
  padding: 72px 0 56px;
}

.app-footer__logo {
  margin: 0;
  font-size: clamp(28px, 2vw, 38px);
  font-weight: 400;
  letter-spacing: 0.08em;
}

.app-footer__tagline {
  margin-top: 28px;
  color: rgb(241 223 196 / 78%);
  font-size: 15px;
}

.app-footer__tagline-zh {
  margin-top: 8px;
  color: rgb(241 223 196 / 58%);
  font-size: 14px;
}

.app-footer h3 {
  margin: 0 0 22px;
  color: #f0d6b0;
  font-size: 15px;
  font-weight: 500;
}

.app-footer a {
  display: block;
  margin-bottom: 12px;
  color: rgb(241 223 196 / 68%);
  text-decoration: none;
  transition: color 0.2s ease;
}

.app-footer a:hover {
  color: #f4dfbd;
}

.app-footer a:focus-visible {
  outline: 2px solid #f4dfbd;
  outline-offset: 4px;
}

.app-footer__contact p,
.app-footer__hours p {
  margin: 0 0 12px;
  color: rgb(241 223 196 / 68%);
  font-size: 14px;
}

.app-footer__bottom {
  width: min(1500px, calc(100% - 96px));
  margin: 0 auto;
  border-top: 1px solid rgb(241 223 196 / 12%);
  padding: 22px 0 26px;
  color: rgb(241 223 196 / 46%);
  font-size: 12px;
  text-align: center;
}

@media (max-width: 1100px) and (min-width: 769px) {
  .app-footer__inner {
    grid-template-columns: 1.2fr 1fr;
  }
}

@media (max-width: 768px) {
  .app-footer__inner {
    width: calc(100% - 40px);
    grid-template-columns: 1fr;
    gap: 36px;
    padding: 52px 0 40px;
  }

  .app-footer__bottom {
    width: calc(100% - 40px);
  }
}
</style>
