---
title: "Fixa locale.Error: unsupported locale setting i Docker och CI"
description: "Den riktiga orsaken till locale.Error och de två lösningarna som faktiskt funkar: installera locales, eller använd C.UTF-8."
publishedAt: 2026-01-21
draft: false
---

Det här felet är nästan aldrig ett Python-problem. Det är en mismatch mellan vad dina miljövariabler _säger_ och vad OS:et faktiskt _har installerat_.

## Vad som händer

Någonstans i Python-koden anropas `setlocale(..., '')`, vilket betyder "använd den locale som `LANG`/`LC_*` anger". I minimala miljöer (slim-containers, vissa CI-images, nykonfigurerade servrar) finns de localerna oftast inte installerade.

Resultatet: `LANG=en_US.UTF-8` är satt, men det finns ingen `en_US.UTF-8`-definition på disken.

## Två lösningar

### 1) Använd `C.UTF-8`

Om du inte behöver locale-specifik sortering eller formattering och bara vill ha korrekt UTF-8-hantering, är `C.UTF-8` det enklaste alternativet. Det fungerar stabilt i containers och CI.

```dockerfile
ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8
```

### 2) Installera den locale du behöver

Om du verkligen behöver locale-medveten formatering, installera localen i din OS-image och sätt `LANG`/`LC_ALL` så det stämmer överens. Det viktiga är konsistens: miljövariablerna måste matcha det som faktiskt är installerat.

## Var du applicerar lösningen

- **I containers**: använd `C.UTF-8` om du inte har ett specifikt skäl att inte göra det.
- **På VM:er**: installera locales en gång vid uppstart.
- **I CI**: förlita dig inte på standardvärden, sätt `LANG`/`LC_ALL` explicit.

När du börjar konfigurera locale explicit istället för att anta att den finns, slutar det här felet dyka upp.
