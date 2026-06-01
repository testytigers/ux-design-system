/**
 * LAYER 3 — COMPONENT TOKENS
 * Component-specific tokens that combine aliases for UI elements.
 */
import { alias } from "./alias.js";
export const component = {
    // ─── BUTTON TOKENS ──────────────────────────────────────────────
    button: {
        padding: {
            sm: "0.5rem 1rem",
            base: "0.625rem 1.25rem",
            lg: "0.75rem 1.5rem",
        },
        fontSize: {
            sm: alias.typography.fontSize.sm,
            base: alias.typography.fontSize.base,
            lg: alias.typography.fontSize.lg,
        },
        fontWeight: alias.typography.fontWeight.semibold,
        borderRadius: alias.radius.default,
        gap: alias.spacing[2],
        // Variants
        variants: {
            primary: {
                backgroundColor: alias.color.brand[600],
                color: alias.color.text.onPrimary,
                hoverBackgroundColor: alias.color.brand[700],
                activeBackgroundColor: alias.color.brand[800],
                focusRing: `0 0 0 2px ${alias.color.bg.primary}, 0 0 0 4px ${alias.color.border.focus}`,
            },
            secondary: {
                backgroundColor: alias.color.bg.secondary,
                color: alias.color.text.primary,
                hoverBackgroundColor: alias.color.bg.tertiary,
                activeBackgroundColor: alias.color.bg.subtle,
                focusRing: `0 0 0 2px ${alias.color.bg.primary}, 0 0 0 4px ${alias.color.border.focus}`,
            },
            ghost: {
                backgroundColor: "transparent",
                color: alias.color.text.primary,
                hoverBackgroundColor: alias.color.bg.subtle,
                activeBackgroundColor: alias.color.bg.secondary,
                focusRing: `0 0 0 2px ${alias.color.bg.primary}, 0 0 0 4px ${alias.color.border.focus}`,
            },
            destructive: {
                backgroundColor: alias.color.status.error,
                color: alias.color.text.onPrimary,
                hoverBackgroundColor: "#b91c1c",
                activeBackgroundColor: "#991b1b",
                focusRing: `0 0 0 2px ${alias.color.bg.primary}, 0 0 0 4px ${alias.color.border.focus}`,
            },
            link: {
                backgroundColor: "transparent",
                color: alias.color.text.link,
                hoverColor: alias.color.brand[700],
                activeColor: alias.color.brand[800],
                focusRing: `0 0 0 2px ${alias.color.bg.primary}, 0 0 0 4px ${alias.color.border.focus}`,
            },
        },
    },
    // ─── CARD TOKENS ─────────────────────────────────────────────────
    card: {
        backgroundColor: alias.color.bg.primary,
        borderRadius: alias.radius.lg,
        padding: alias.spacing[6],
        shadow: alias.shadow.lg,
        border: `1px solid ${alias.color.border.subtle}`,
        // Variants
        variants: {
            elevated: {
                shadow: alias.shadow.xl,
                border: `1px solid ${alias.color.border.default}`,
            },
            bordered: {
                border: `1px solid ${alias.color.border.default}`,
                shadow: alias.shadow.sm,
            },
            ghost: {
                border: "none",
                shadow: "none",
                backgroundColor: alias.color.bg.ghost,
            },
        },
    },
    // ─── INPUT TOKENS ────────────────────────────────────────────────
    input: {
        height: "2.5rem",
        padding: `${alias.spacing[2]} ${alias.spacing[3]}`,
        fontSize: alias.typography.fontSize.base,
        borderRadius: alias.radius.default,
        border: `1px solid ${alias.color.border.default}`,
        backgroundColor: alias.color.bg.primary,
        color: alias.color.text.primary,
        // States
        states: {
            focus: {
                border: `2px solid ${alias.color.border.focus}`,
                boxShadow: `0 0 0 3px ${alias.color.bg.brandSubtle}`,
            },
            error: {
                border: `2px solid ${alias.color.status.error}`,
                boxShadow: `0 0 0 3px ${alias.color.status.errorLight}`,
            },
            disabled: {
                backgroundColor: alias.color.bg.secondary,
                color: alias.color.text.muted,
                cursor: "not-allowed",
            },
        },
    },
    // ─── MODAL TOKENS ────────────────────────────────────────────────
    modal: {
        backgroundColor: alias.color.bg.primary,
        borderRadius: alias.radius.xl,
        padding: alias.spacing[8],
        shadow: alias.shadow["2xl"],
        // Overlay
        overlay: {
            backgroundColor: alias.color.bg.overlay,
        },
        // Variants
        variants: {
            sm: {
                maxWidth: "384px",
            },
            base: {
                maxWidth: "480px",
            },
            lg: {
                maxWidth: "640px",
            },
            xl: {
                maxWidth: "768px",
            },
            full: {
                maxWidth: "100vw",
                maxHeight: "100vh",
                borderRadius: 0,
            },
        },
    },
    // ─── BADGE TOKENS ────────────────────────────────────────────────
    badge: {
        padding: `${alias.spacing[0.5]} ${alias.spacing[2]}`,
        fontSize: alias.typography.fontSize.sm,
        fontWeight: alias.typography.fontWeight.medium,
        borderRadius: alias.radius.full,
        // Variants
        variants: {
            default: {
                backgroundColor: alias.color.bg.secondary,
                color: alias.color.text.secondary,
            },
            primary: {
                backgroundColor: alias.color.brand[100],
                color: alias.color.brand[700],
            },
            success: {
                backgroundColor: alias.color.status.successLight,
                color: alias.color.status.success,
            },
            warning: {
                backgroundColor: alias.color.status.warningLight,
                color: alias.color.status.warning,
            },
            error: {
                backgroundColor: alias.color.status.errorLight,
                color: alias.color.status.error,
            },
            info: {
                backgroundColor: alias.color.status.infoLight,
                color: alias.color.status.info,
            },
        },
    },
    // ─── TOOLTIP TOKENS ──────────────────────────────────────────────
    tooltip: {
        backgroundColor: alias.color.text.primary,
        color: alias.color.text.inverted,
        fontSize: alias.typography.fontSize.sm,
        padding: `${alias.spacing[1]} ${alias.spacing[2]}`,
        borderRadius: alias.radius.sm,
        shadow: alias.shadow.sm,
        // Arrow
        arrow: {
            size: "0.5rem",
            color: alias.color.text.primary,
        },
    },
    // ─── TABLE TOKENS ────────────────────────────────────────────────
    table: {
        backgroundColor: alias.color.bg.primary,
        color: alias.color.text.primary,
        border: `1px solid ${alias.color.border.default}`,
        header: {
            backgroundColor: alias.color.bg.secondary,
            color: alias.color.text.primary,
            fontWeight: alias.typography.fontWeight.semibold,
            padding: `${alias.spacing[3]} ${alias.spacing[4]}`,
            borderBottom: `2px solid ${alias.color.border.default}`,
        },
        row: {
            padding: `${alias.spacing[3]} ${alias.spacing[4]}`,
            borderBottom: `1px solid ${alias.color.border.subtle}`,
        },
        rowHover: {
            backgroundColor: alias.color.bg.subtle,
        },
        rowStriped: {
            even: {
                backgroundColor: alias.color.bg.primary,
            },
            odd: {
                backgroundColor: alias.color.bg.secondary,
            },
        },
    },
    // ─── ALERT TOKENS ────────────────────────────────────────────────
    alert: {
        padding: alias.spacing[4],
        borderRadius: alias.radius.md,
        border: `1px solid`,
        // Variants
        variants: {
            default: {
                backgroundColor: alias.color.bg.secondary,
                borderColor: alias.color.border.default,
                color: alias.color.text.primary,
            },
            success: {
                backgroundColor: alias.color.status.successLight,
                borderColor: alias.color.status.success,
                color: alias.color.status.success,
            },
            warning: {
                backgroundColor: alias.color.status.warningLight,
                borderColor: alias.color.status.warning,
                color: alias.color.status.warning,
            },
            error: {
                backgroundColor: alias.color.status.errorLight,
                borderColor: alias.color.status.error,
                color: alias.color.status.error,
            },
            info: {
                backgroundColor: alias.color.status.infoLight,
                borderColor: alias.color.status.info,
                color: alias.color.status.info,
            },
        },
    },
    // ─── SKELETON TOKENS ────────────────────────────────────────────
    skeleton: {
        backgroundColor: alias.color.bg.tertiary,
        borderRadius: alias.radius.sm,
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    },
};
//# sourceMappingURL=component.js.map