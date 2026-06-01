/**
 * LAYER 3 — COMPONENT TOKENS
 * Component-specific tokens that combine aliases for UI elements.
 */
export declare const component: {
    button: {
        padding: {
            sm: string;
            base: string;
            lg: string;
        };
        fontSize: {
            sm: string;
            base: string;
            lg: string;
        };
        fontWeight: string;
        borderRadius: string;
        gap: string;
        variants: {
            primary: {
                backgroundColor: string;
                color: string;
                hoverBackgroundColor: string;
                activeBackgroundColor: string;
                focusRing: string;
            };
            secondary: {
                backgroundColor: string;
                color: string;
                hoverBackgroundColor: string;
                activeBackgroundColor: string;
                focusRing: string;
            };
            ghost: {
                backgroundColor: string;
                color: string;
                hoverBackgroundColor: string;
                activeBackgroundColor: string;
                focusRing: string;
            };
            destructive: {
                backgroundColor: string;
                color: string;
                hoverBackgroundColor: string;
                activeBackgroundColor: string;
                focusRing: string;
            };
            link: {
                backgroundColor: string;
                color: string;
                hoverColor: string;
                activeColor: string;
                focusRing: string;
            };
        };
    };
    card: {
        backgroundColor: string;
        borderRadius: string;
        padding: string;
        shadow: string;
        border: string;
        variants: {
            elevated: {
                shadow: string;
                border: string;
            };
            bordered: {
                border: string;
                shadow: string;
            };
            ghost: {
                border: string;
                shadow: string;
                backgroundColor: string;
            };
        };
    };
    input: {
        height: string;
        padding: string;
        fontSize: string;
        borderRadius: string;
        border: string;
        backgroundColor: string;
        color: string;
        states: {
            focus: {
                border: string;
                boxShadow: string;
            };
            error: {
                border: string;
                boxShadow: string;
            };
            disabled: {
                backgroundColor: string;
                color: string;
                cursor: string;
            };
        };
    };
    modal: {
        backgroundColor: string;
        borderRadius: string;
        padding: string;
        shadow: string;
        overlay: {
            backgroundColor: string;
        };
        variants: {
            sm: {
                maxWidth: string;
            };
            base: {
                maxWidth: string;
            };
            lg: {
                maxWidth: string;
            };
            xl: {
                maxWidth: string;
            };
            full: {
                maxWidth: string;
                maxHeight: string;
                borderRadius: number;
            };
        };
    };
    badge: {
        padding: string;
        fontSize: string;
        fontWeight: string;
        borderRadius: string;
        variants: {
            default: {
                backgroundColor: string;
                color: string;
            };
            primary: {
                backgroundColor: string;
                color: string;
            };
            success: {
                backgroundColor: string;
                color: string;
            };
            warning: {
                backgroundColor: string;
                color: string;
            };
            error: {
                backgroundColor: string;
                color: string;
            };
            info: {
                backgroundColor: string;
                color: string;
            };
        };
    };
    tooltip: {
        backgroundColor: string;
        color: string;
        fontSize: string;
        padding: string;
        borderRadius: string;
        shadow: string;
        arrow: {
            size: string;
            color: string;
        };
    };
    table: {
        backgroundColor: string;
        color: string;
        border: string;
        header: {
            backgroundColor: string;
            color: string;
            fontWeight: string;
            padding: string;
            borderBottom: string;
        };
        row: {
            padding: string;
            borderBottom: string;
        };
        rowHover: {
            backgroundColor: string;
        };
        rowStriped: {
            even: {
                backgroundColor: string;
            };
            odd: {
                backgroundColor: string;
            };
        };
    };
    alert: {
        padding: string;
        borderRadius: string;
        border: string;
        variants: {
            default: {
                backgroundColor: string;
                borderColor: string;
                color: string;
            };
            success: {
                backgroundColor: string;
                borderColor: string;
                color: string;
            };
            warning: {
                backgroundColor: string;
                borderColor: string;
                color: string;
            };
            error: {
                backgroundColor: string;
                borderColor: string;
                color: string;
            };
            info: {
                backgroundColor: string;
                borderColor: string;
                color: string;
            };
        };
    };
    skeleton: {
        backgroundColor: string;
        borderRadius: string;
        animation: string;
    };
};
export type Component = typeof component;
//# sourceMappingURL=component.d.ts.map