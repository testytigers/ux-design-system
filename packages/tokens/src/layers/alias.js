/**
 * LAYER 2 — ALIAS TOKENS (Semantic Tokens)
 * These map to primitive tokens but use semantic names.
 * Components should reference these, not primitives.
 */
import { primitive } from "./primitive.js";
export const alias = {
    // ─── COLOR ALIASES ──────────────────────────────────────────────
    color: {
        // Brand colors (purple spectrum)
        brand: {
            50: primitive.color.purple[50],
            100: primitive.color.purple[100],
            200: primitive.color.purple[200],
            300: primitive.color.purple[300],
            400: primitive.color.purple[400],
            500: primitive.color.purple[500],
            600: primitive.color.purple[600],
            700: primitive.color.purple[700],
            800: primitive.color.purple[800],
            900: primitive.color.purple[900],
            950: primitive.color.purple[950],
        },
        // Semantic background aliases
        bg: {
            primary: primitive.color.neutral[0],
            secondary: primitive.color.neutral[50],
            tertiary: primitive.color.neutral[100],
            subtle: primitive.color.neutral[50],
            elevated: primitive.color.neutral[0],
            inverted: primitive.color.neutral[950],
            overlay: "rgba(0, 0, 0, 0.5)",
            ghost: "transparent",
            // Brand backgrounds
            brand: primitive.color.purple[500],
            brandSubtle: primitive.color.purple[50],
        },
        // Semantic text aliases
        text: {
            primary: primitive.color.neutral[950],
            secondary: primitive.color.neutral[600],
            tertiary: primitive.color.neutral[500],
            muted: primitive.color.neutral[400],
            inverted: primitive.color.neutral[0],
            link: primitive.color.purple[600],
            onPrimary: primitive.color.neutral[0],
            onAccent: primitive.color.neutral[950],
            // Brand text
            brand: primitive.color.purple[600],
            brandSubtle: primitive.color.purple[500],
        },
        // Semantic border aliases
        border: {
            default: primitive.color.neutral[200],
            strong: primitive.color.neutral[300],
            subtle: primitive.color.neutral[100],
            focus: primitive.color.purple[500],
            destructive: primitive.color.status.error,
            // Brand borders
            brand: primitive.color.purple[200],
            brandStrong: primitive.color.purple[300],
        },
        // Semantic status aliases
        status: {
            success: primitive.color.status.success,
            successLight: primitive.color.status.successLight,
            warning: primitive.color.status.warning,
            warningLight: primitive.color.status.warningLight,
            error: primitive.color.status.error,
            errorLight: primitive.color.status.errorLight,
            info: primitive.color.status.info,
            infoLight: primitive.color.status.infoLight,
        },
        // Accent aliases
        accent: {
            primary: primitive.color.accent.primary,
            primaryLight: primitive.color.accent.primaryLight,
        },
    },
    // ─── TYPOGRAPHY ALIASES ─────────────────────────────────────────
    typography: {
        fontFamily: {
            heading: primitive.font.headings,
            body: primitive.font.body,
            mono: primitive.font.mono,
            system: primitive.font.system,
        },
        fontSize: {
            xs: primitive.fontSize.xs,
            sm: primitive.fontSize.sm,
            base: primitive.fontSize.base,
            lg: primitive.fontSize.lg,
            xl: primitive.fontSize.xl,
            "2xl": primitive.fontSize["2xl"],
            "3xl": primitive.fontSize["3xl"],
            "4xl": primitive.fontSize["4xl"],
            "5xl": primitive.fontSize["5xl"],
        },
        fontWeight: {
            normal: primitive.fontWeight.normal,
            medium: primitive.fontWeight.medium,
            semibold: primitive.fontWeight.semibold,
            bold: primitive.fontWeight.bold,
        },
        lineHeight: {
            tight: primitive.lineHeight.tight,
            normal: primitive.lineHeight.normal,
            relaxed: primitive.lineHeight.relaxed,
        },
        letterSpacing: {
            tight: primitive.letterSpacing.tight,
            normal: primitive.letterSpacing.normal,
            wide: primitive.letterSpacing.wide,
        },
    },
    // ─── SPACING ALIASES ────────────────────────────────────────────
    spacing: {
        none: primitive.spacing[0],
        ...primitive.spacing,
    },
    // ─── RADIUS ALIASES ─────────────────────────────────────────────
    radius: {
        none: primitive.radius.none,
        sm: primitive.radius.sm,
        default: primitive.radius.default,
        md: primitive.radius.md,
        lg: primitive.radius.lg,
        xl: primitive.radius.xl,
        "2xl": primitive.radius["2xl"],
        "3xl": primitive.radius["3xl"],
        full: primitive.radius.full,
    },
    // ─── SHADOW ALIASES ─────────────────────────────────────────────
    shadow: {
        sm: primitive.shadow.sm,
        md: primitive.shadow.md,
        lg: primitive.shadow.lg,
        xl: primitive.shadow.xl,
        "2xl": primitive.shadow["2xl"],
        inner: primitive.shadow.inner,
        none: primitive.shadow.none,
    },
    // ─── Z-INDEX ALIASES ────────────────────────────────────────────
    zIndex: {
        hide: primitive.zIndex.hide,
        base: primitive.zIndex.base,
        dropdown: primitive.zIndex.dropdown,
        sticky: primitive.zIndex.sticky,
        modal: primitive.zIndex.modal,
        popover: primitive.zIndex.popover,
        tooltip: primitive.zIndex.tooltip,
    },
    // ─── TRANSITION ALIASES ─────────────────────────────────────────
    transition: {
        fast: primitive.transition.fast,
        normal: primitive.transition.normal,
        slow: primitive.transition.slow,
        slower: primitive.transition.slower,
    },
    // ─── EASING ALIASES ─────────────────────────────────────────────
    easing: {
        default: primitive.easing.default,
        linear: primitive.easing.linear,
        in: primitive.easing.in,
        out: primitive.easing.out,
        inOut: primitive.easing.inOut,
    },
    // ─── BREAKPOINT ALIASES ─────────────────────────────────────────
    breakpoint: {
        sm: primitive.breakpoints.sm,
        md: primitive.breakpoints.md,
        lg: primitive.breakpoints.lg,
        xl: primitive.breakpoints.xl,
        "2xl": primitive.breakpoints["2xl"],
    },
    // ─── ANIMATION ALIASES ──────────────────────────────────────────
    animation: {
        ...primitive.animation,
    },
};
//# sourceMappingURL=alias.js.map