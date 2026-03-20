/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "sand-primary": "#F9F7F2",   // 메인 베이지/샌드 배경
                "sand-secondary": "#F0EDE4", // 뎁스 구분을 위한 약간 어두운 베이지
                "sand-tertiary": "#E2DAC8",  // 보더 및 디바이더 박스
                "gold-primary": "#A68B5C",   // 활성화, 액센트 색상 (Gita)
                "gold-dim": "#D6C7A2",       // 텍스트 보조 골드
                "gold-deep": "#8C6D45",      // 깊은 골드 액센트
                "charcoal-main": "#1A1A1A",  // 기본 정규 텍스트 및 주조색
                "charcoal-muted": "#4A4A4A", // 설명 텍스트 (Secondary)
                // Gita specific colors
                "gold-bg": "#FDFBF7",
                "gold-surface": "#F5EFE6",
                "gold-border": "#E5E0D8",
                "gold-light": "#C5AE87",
                "gold-muted": "#846F4B",
                "gold-glow": "rgba(166, 139, 92, 0.15)",
                "dark-bg": "#0A0A0A",
                "dark-surface": "#141414",
                "dark-border": "#2A2A2A",
                "dark-surface-elevated": "#1C1C1C", // 레이어 구분을 위한 고밀도 다크
                "text-primary": "#182229",
                "text-secondary": "#5B636A",
                "dark-text-primary": "#EDE8DB",
                "dark-text-secondary": "#9E9685",
            },
            transitionTimingFunction: {
                "premium": "cubic-bezier(0.19, 1, 0.22, 1)", // Awwwards-style ultra-smooth easing
                "premium-in": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
                "premium-out": "cubic-bezier(0.19, 1, 0.22, 1)",
            },
            fontFamily: {
                "sans": ["Inter", "sans-serif"],
                "serif": ["Cormorant Garamond", "serif"],
                "crimson": ["Crimson Pro", "Noto Serif", "serif"],
                "noto": ["Noto Serif", "serif"],
                "noto-kr": ["Noto Serif KR", "serif"],
                "korean": ["Pretendard Variable", "Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui", "Roboto", "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "sans-serif"],
                "inter": ["Inter", "sans-serif"],
            },
            borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1rem", "full": "9999px" },
        },
    },
    plugins: [],
}
