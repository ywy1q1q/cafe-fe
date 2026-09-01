<template>
  <section
    ref="sectionRef"
    aria-labelledby="coffee-process-title"
    class="coffee-process"
  >
    <div ref="stageRef" class="process-stage">
      <header class="process-heading">
        <p class="process-eyebrow">Our process</p>

        <h2 id="coffee-process-title">
          <span>From bean</span>
          <span>to cup.</span>
        </h2>

        <p class="process-intro">
          一杯咖啡的風味，從挑選豆子開始，在每一道細節裡慢慢成形。
        </p>
      </header>

      <div class="process-visual">
        <figure
          v-for="(step, index) in steps"
          :key="step.number"
          :aria-hidden="activeStep !== index"
          class="process-image-layer"
        >
          <img
            :alt="step.imageAlt"
            :loading="index === 0 ? 'eager' : 'lazy'"
            :src="step.image"
          >
        </figure>

        <span aria-hidden="true" class="process-visual-mark">Brewed slowly</span>
      </div>

      <div aria-live="polite" class="process-copy">
        <div
          v-for="(step, index) in steps"
          :key="step.title"
          :aria-hidden="activeStep !== index"
          class="process-copy-layer"
        >
          <span class="process-number">{{ step.number }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.subtitle }}</p>
        </div>
      </div>

      <ol aria-label="咖啡製作流程" class="process-index">
        <li
          v-for="(step, index) in steps"
          :key="`${step.number}-index`"
          class="process-index-item"
          :class="{ 'process-index-item--active': activeStep === index }"
        >
          <span>{{ step.number }}</span>
          <span>{{ step.title }}</span>
        </li>
      </ol>

      <div class="process-progress">
        <span>{{ currentStep.number }} / {{ totalSteps }}</span>

        <div
          aria-label="咖啡製作進度"
          :aria-valuemax="steps.length"
          :aria-valuenow="activeStep + 1"
          class="process-progress-track"
          role="progressbar"
        >
          <span
            class="process-progress-fill"
            :style="{ transform: progressScale }"
          />
        </div>
      </div>
    </div>

    <div class="process-static">
      <header class="process-static-heading">
        <p class="process-eyebrow">Our process</p>
        <h2>From bean to cup.</h2>
      </header>

      <article
        v-for="step in steps"
        :key="`${step.number}-static`"
        class="process-static-step"
      >
        <img :alt="step.imageAlt" loading="lazy" :src="step.image">

        <div>
          <span>{{ step.number }} / {{ totalSteps }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.subtitle }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { gsap } from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'
  import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
  import beansImg from '@/assets/coffee-process/01-beans.png'
  import grindingImg from '@/assets/coffee-process/02-grinding.png'
  import espressoImg from '@/assets/coffee-process/03-espresso.png'
  import latteArtImg from '@/assets/coffee-process/04-latte-art.png'
  import finishedImg from '@/assets/coffee-process/05-finished.png'

  gsap.registerPlugin(ScrollTrigger)

  const SCROLL_TRIGGER_ID = 'coffee-process-story'
  const DESKTOP_SCROLL_PER_STEP = 720
  const MOBILE_SCROLL_PER_STEP = 540

  const steps = [
    {
      number: '01',
      title: 'Coffee Beans',
      subtitle: '挑選香氣飽滿的咖啡豆',
      image: beansImg,
      imageAlt: '麻布袋中盛裝著新鮮烘焙的咖啡豆',
    },
    {
      number: '02',
      title: 'Grinding',
      subtitle: '依沖煮方式精準研磨',
      image: grindingImg,
      imageAlt: '咖啡磨豆機正在研磨咖啡豆',
    },
    {
      number: '03',
      title: 'Espresso',
      subtitle: '萃取濃郁而平衡的 Espresso',
      image: espressoImg,
      imageAlt: '義式咖啡機正在萃取濃縮咖啡',
    },
    {
      number: '04',
      title: 'Latte Art',
      subtitle: '注入牛奶，完成細緻拉花',
      image: latteArtImg,
      imageAlt: '咖啡師將牛奶倒入咖啡中製作拉花',
    },
    {
      number: '05',
      title: 'Enjoy',
      subtitle: '慢慢享受剛完成的一杯咖啡',
      image: finishedImg,
      imageAlt: '自然光下完成的葉形拉花拿鐵',
    },
  ]

  const sectionRef = ref<HTMLElement | null>(null)
  const stageRef = ref<HTMLElement | null>(null)
  const activeStep = ref(0)
  const totalSteps = String(steps.length).padStart(2, '0')
  const currentStep = computed(() => steps[activeStep.value] ?? steps[0])
  const progressScale = computed(() => (
    `scaleX(${(activeStep.value + 1) / steps.length})`
  ))

  let mediaContext: ReturnType<typeof gsap.matchMedia> | undefined
  let processTimeline: gsap.core.Timeline | undefined
  let refreshFrame: number | undefined

  onMounted(async () => {
    await nextTick()

    const section = sectionRef.value
    const stage = stageRef.value
    if (!section || !stage) return

    ScrollTrigger.getById(SCROLL_TRIGGER_ID)?.kill(true)
    mediaContext = gsap.matchMedia()
    mediaContext.add(
      {
        isDesktop: '(min-width: 961px)',
        isMobile: '(max-width: 960px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      context => {
        const conditions = context.conditions as {
          isDesktop: boolean
          isMobile: boolean
          reduceMotion: boolean
        }

        if (conditions.reduceMotion) {
          activeStep.value = 0
          return
        }

        const imageLayers = gsap.utils.toArray<HTMLElement>(
          '.process-image-layer',
          section,
        )
        const copyLayers = gsap.utils.toArray<HTMLElement>(
          '.process-copy-layer',
          section,
        )

        gsap.set(imageLayers, { autoAlpha: 0, scale: 1.035 })
        gsap.set(copyLayers, { autoAlpha: 0, y: 15 })
        gsap.set(imageLayers[0], { autoAlpha: 1, scale: 1 })
        gsap.set(copyLayers[0], { autoAlpha: 1, y: 0 })

        const scrollPerStep = conditions.isDesktop
          ? DESKTOP_SCROLL_PER_STEP
          : MOBILE_SCROLL_PER_STEP
        const timelineClock = { value: 0 }
        const timeline = gsap.timeline({
          scrollTrigger: {
            id: SCROLL_TRIGGER_ID,
            trigger: section,
            start: 'top top',
            end: () => `+=${scrollPerStep * steps.length}`,
            // Keep the component root in place so Vue can unmount it cleanly.
            pin: stage,
            pinSpacing: true,
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        processTimeline = timeline

        timeline.eventCallback('onUpdate', () => {
          const nextStep = Math.min(
            Math.floor(timeline.time() + 0.25),
            steps.length - 1,
          )

          if (activeStep.value !== nextStep) activeStep.value = nextStep
        })

        timeline.to(timelineClock, {
          value: 1,
          duration: steps.length,
          ease: 'none',
        }, 0)

        for (let index = 1; index < steps.length; index += 1) {
          const transitionStart = index - 0.52

          timeline
            .to(imageLayers[index - 1], {
              autoAlpha: 0,
              scale: 0.985,
              duration: 0.42,
              ease: 'power2.inOut',
            }, transitionStart)
            .fromTo(imageLayers[index], {
              autoAlpha: 0,
              scale: 1.035,
            }, {
              autoAlpha: 1,
              scale: 1,
              duration: 0.47,
              ease: 'power2.inOut',
              immediateRender: false,
            }, transitionStart + 0.05)
            .to(copyLayers[index - 1], {
              autoAlpha: 0,
              y: -12,
              duration: 0.3,
              ease: 'power2.inOut',
            }, transitionStart)
            .fromTo(copyLayers[index], {
              autoAlpha: 0,
              y: 15,
            }, {
              autoAlpha: 1,
              y: 0,
              duration: 0.36,
              ease: 'power2.out',
              immediateRender: false,
            }, transitionStart + 0.12)
        }

        return () => {
          timeline.scrollTrigger?.kill(true)
          timeline.kill()
          if (processTimeline === timeline) processTimeline = undefined
          activeStep.value = 0
        }
      },
      section,
    )

    refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh())
  })

  onUnmounted(() => {
    if (refreshFrame !== undefined) window.cancelAnimationFrame(refreshFrame)
    mediaContext?.revert()
    processTimeline?.scrollTrigger?.kill(true)
    processTimeline?.kill()
  })
</script>

<style scoped>
.coffee-process {
  --process-bg: var(--story-bg, #faecd3);
  --process-ink: var(--story-ink, #3f3027);
  --process-muted: var(--story-muted, #806b5c);
  --process-accent: var(--story-accent, #9b643c);
  --process-line: var(--story-line, rgb(111 78 55 / 16%));
  background:
    radial-gradient(circle at 76% 24%, rgb(197 145 88 / 10%), transparent 28%),
    var(--process-bg);
  color: var(--process-ink);
  margin-left: calc(50% - 50vw);
  min-height: 100vh;
  overflow: hidden;
  width: 100vw;
}

.process-stage {
  box-sizing: border-box;
  display: grid;
  gap: clamp(24px, 3vw, 52px);
  grid-template-columns: minmax(210px, 0.78fr) minmax(420px, 1.35fr) minmax(190px, 0.65fr);
  grid-template-rows: 1fr auto;
  height: 100svh;
  margin: 0 auto;
  max-width: 1540px;
  min-height: 680px;
  overflow: hidden;
  padding: clamp(44px, 6vh, 76px) clamp(28px, 6vw, 104px) clamp(30px, 4vh, 50px);
  padding-left: clamp(48px, 7.5vw, 128px);
  position: relative;
}

.process-heading {
  align-self: center;
  grid-column: 1;
  grid-row: 1;
  left: clamp(-24px, -1.4vw, -14px);
  position: relative;
  z-index: 2;
}

.process-eyebrow {
  align-items: center;
  color: var(--process-accent);
  display: flex;
  font-size: 0.72rem;
  font-weight: 700;
  gap: 12px;
  letter-spacing: 0.22em;
  margin: 0 0 24px;
  text-transform: uppercase;
}

.process-eyebrow::before {
  background: currentColor;
  content: "";
  height: 1px;
  width: 34px;
}

.process-heading h2,
.process-static-heading h2 {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(3.6rem, 5.4vw, 6.8rem);
  font-weight: 500;
  letter-spacing: -0.045em;
  line-height: 0.78;
  margin: 0;
  text-transform: uppercase;
}

.process-heading h2 span {
  display: block;
  white-space: nowrap;
}

.process-intro {
  color: var(--process-muted);
  font-family: "Noto Sans TC", sans-serif;
  font-size: 0.86rem;
  line-height: 1.9;
  margin: 34px 0 0;
  max-width: 255px;
}

.process-visual {
  align-self: center;
  border-radius: 48% 48% 22px 22px;
  box-shadow: 0 28px 70px rgb(71 42 24 / 17%);
  grid-column: 2;
  grid-row: 1;
  height: min(70vh, 780px);
  min-height: 480px;
  overflow: hidden;
  position: relative;
}

.process-image-layer {
  height: 100%;
  inset: 0;
  margin: 0;
  position: absolute;
  visibility: hidden;
  will-change: opacity, transform;
}

.process-image-layer:first-child {
  opacity: 1;
  visibility: visible;
}

.process-image-layer img {
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.process-image-layer:nth-child(4) img {
  object-position: 53% center;
}

.process-visual::after {
  background: linear-gradient(180deg, transparent 64%, rgb(42 27 18 / 20%));
  content: "";
  inset: 0;
  pointer-events: none;
  position: absolute;
  z-index: 2;
}

.process-visual-mark {
  bottom: 24px;
  color: rgb(255 250 240 / 88%);
  font-family: Georgia, serif;
  font-size: 0.72rem;
  font-style: italic;
  left: 28px;
  letter-spacing: 0.16em;
  position: absolute;
  text-transform: uppercase;
  z-index: 3;
}

.process-copy {
  align-self: center;
  grid-column: 3;
  grid-row: 1;
  min-height: 190px;
  position: relative;
  z-index: 2;
}

.process-copy-layer {
  inset: 0;
  position: absolute;
  visibility: hidden;
  will-change: opacity, transform;
}

.process-copy-layer:first-child {
  opacity: 1;
  visibility: visible;
}

.process-number {
  color: var(--process-accent);
  display: block;
  font-family: Georgia, serif;
  font-size: 1rem;
  letter-spacing: 0.12em;
  margin-bottom: 22px;
}

.process-copy h3,
.process-static-step h3 {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(2.1rem, 3vw, 3.5rem);
  font-weight: 500;
  letter-spacing: -0.035em;
  line-height: 0.92;
  margin: 0;
}

.process-copy p,
.process-static-step p {
  color: var(--process-muted);
  font-family: "Noto Sans TC", sans-serif;
  font-size: 0.9rem;
  line-height: 1.75;
  margin: 18px 0 0;
}

.process-index {
  align-self: end;
  display: flex;
  gap: 9px;
  grid-column: 1;
  grid-row: 1;
  list-style: none;
  margin: 0 0 4px;
  padding: 0;
}

.process-index-item {
  color: rgb(61 40 29 / 32%);
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  transition: color 300ms ease;
}

.process-index-item span:last-child {
  display: none;
}

.process-index-item--active {
  color: var(--process-accent);
}

.process-progress {
  align-items: center;
  display: grid;
  gap: 20px;
  grid-column: 1 / -1;
  grid-row: 2;
  grid-template-columns: auto 1fr;
}

.process-progress > span {
  color: var(--process-muted);
  font-family: Georgia, serif;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  white-space: nowrap;
}

.process-progress-track {
  background: var(--process-line);
  height: 1px;
  overflow: hidden;
}

.process-progress-fill {
  background: var(--process-accent);
  display: block;
  height: 100%;
  transform-origin: left center;
  transition: transform 420ms ease;
  width: 100%;
}

.process-static {
  display: none;
}

@media (max-width: 960px) {
  .process-stage {
    gap: 15px 20px;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto minmax(0, 1fr) auto auto;
    min-height: 620px;
    padding: 86px 22px 24px;
    padding-left: 30px;
  }

  .process-heading {
    grid-column: 1 / -1;
    grid-row: 1;
    left: 0;
  }

  .process-eyebrow {
    font-size: 0.62rem;
    margin-bottom: 10px;
  }

  .process-heading h2 {
    font-size: clamp(2.25rem, 10vw, 4rem);
    line-height: 0.9;
  }

  .process-heading h2 span {
    display: inline;
  }

  .process-heading h2 span + span::before {
    content: " ";
  }

  .process-intro,
  .process-index {
    display: none;
  }

  .process-visual {
    border-radius: 48% 48% 18px 18px;
    grid-column: 1 / -1;
    grid-row: 2;
    height: 100%;
    max-height: 58svh;
    min-height: 0;
    width: 100%;
  }

  .process-copy {
    align-self: end;
    grid-column: 1 / -1;
    grid-row: 3;
    min-height: 90px;
  }

  .process-copy-layer {
    align-items: end;
    display: grid;
    gap: 4px 14px;
    grid-template-columns: auto 1fr;
  }

  .process-number {
    align-self: center;
    grid-column: 1;
    grid-row: 1 / 3;
    margin: 0;
  }

  .process-copy h3 {
    font-size: clamp(1.9rem, 8vw, 2.8rem);
    grid-column: 2;
    margin: 0;
  }

  .process-copy p {
    font-size: 0.78rem;
    grid-column: 2;
    margin: 0;
  }

  .process-progress {
    gap: 14px;
    grid-column: 1 / -1;
    grid-row: 4;
  }
}

@media (max-width: 420px), (max-height: 700px) {
  .process-stage {
    gap: 10px 16px;
    min-height: 560px;
    padding: 82px 20px 20px;
    padding-left: 26px;
  }

  .process-eyebrow {
    margin-bottom: 7px;
  }

  .process-copy {
    min-height: 78px;
  }

  .process-visual-mark {
    bottom: 16px;
    left: 18px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .process-stage {
    display: none;
  }

  .process-static {
    display: grid;
    gap: 56px;
    margin: 0 auto;
    max-width: 1120px;
    padding: 76px 24px 96px;
  }

  .process-static-heading h2 {
    font-size: clamp(3rem, 8vw, 5.5rem);
    line-height: 0.9;
  }

  .process-static-step {
    align-items: center;
    border-bottom: 1px solid var(--process-line);
    display: grid;
    gap: 28px;
    grid-template-columns: minmax(0, 1.25fr) minmax(220px, 0.75fr);
    padding-bottom: 56px;
  }

  .process-static-step img {
    border-radius: 180px 180px 18px 18px;
    height: min(62vh, 620px);
    object-fit: cover;
    width: 100%;
  }

  .process-static-step span {
    color: var(--process-accent);
    display: block;
    font-family: Georgia, serif;
    font-size: 0.78rem;
    letter-spacing: 0.12em;
    margin-bottom: 18px;
  }

  .process-progress-fill,
  .process-index-item {
    transition: none;
  }
}

@media (max-width: 680px) and (prefers-reduced-motion: reduce) {
  .process-static-step {
    grid-template-columns: 1fr;
  }

  .process-static-step img {
    height: 52vh;
  }
}
</style>
