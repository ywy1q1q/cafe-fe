<template>
  <footer class="processing-footer">
    <div class="processing-footer__inner">
      <div>
        <p>POWER CAFE</p>
        <strong>From fruit to flavor.</strong>
      </div>

      <nav aria-label="咖啡旅程後續導覽" class="processing-footer__links">
        <RouterLink to="/order-status">
          訂單狀態
          <span aria-hidden="true">↗</span>
        </RouterLink>

        <RouterLink to="/menu">
          查看菜單
          <span aria-hidden="true">↗</span>
        </RouterLink>

        <RouterLink to="/">
          回到首頁
          <span aria-hidden="true">↗</span>
        </RouterLink>
      </nav>
    </div>

    <div class="processing-footer__meta">
      <span>PROCESSING NOTES</span>
      <span>Natural · Washed · Honey</span>
    </div>
  </footer>
</template>

<style scoped>
.processing-footer {
  background: var(--processing-primary, #6f4e37);
  color: #fff8ee;
  padding: clamp(56px, 7vw, 88px) clamp(24px, 5vw, 72px) 28px;
}

.processing-footer__inner,
.processing-footer__meta {
  margin-inline: auto;
  max-width: 1320px;
}

.processing-footer__inner {
  align-items: end;
  display: flex;
  justify-content: space-between;
}

.processing-footer p {
  color: rgb(255 248 238 / 68%);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  margin: 0 0 12px;
}

.processing-footer strong {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(2.6rem, 5vw, 5.2rem);
  font-weight: 400;
  letter-spacing: -0.04em;
  line-height: 0.9;
}

.processing-footer a {
  border-bottom: 1px solid rgb(255 248 238 / 52%);
  color: inherit;
  display: inline-flex;
  font-size: 0.82rem;
  font-weight: 700;
  gap: 10px;
  letter-spacing: 0.08em;
  padding-bottom: 7px;
  text-decoration: none;
}

.processing-footer__links {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 18px clamp(24px, 3vw, 44px);
  justify-content: flex-end;
}

.processing-footer a:focus-visible {
  outline: 2px solid #fff8ee;
  outline-offset: 5px;
}

.processing-footer__meta {
  border-top: 1px solid rgb(255 248 238 / 20%);
  color: rgb(255 248 238 / 56%);
  display: flex;
  font-size: 0.66rem;
  justify-content: space-between;
  letter-spacing: 0.12em;
  margin-top: clamp(44px, 6vw, 72px);
  padding-top: 20px;
}

@media (max-width: 560px) {
  .processing-footer__inner {
    align-items: flex-start;
    flex-direction: column;
    gap: 38px;
  }

  .processing-footer__links {
    justify-content: flex-start;
  }

  .processing-footer__meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
