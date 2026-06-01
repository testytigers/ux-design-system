/**
 * LAYER 2 — ALIAS TOKENS (Semantic Tokens)
 * These map to primitive tokens but use semantic names.
 * Components should reference these, not primitives.
 */
export declare const alias: {
    color: {
        brand: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
            950: string;
        };
        bg: {
            primary: string;
            secondary: string;
            tertiary: string;
            subtle: string;
            elevated: string;
            inverted: string;
            overlay: string;
            ghost: string;
            brand: string;
            brandSubtle: string;
        };
        text: {
            primary: string;
            secondary: string;
            tertiary: string;
            muted: string;
            inverted: string;
            link: string;
            onPrimary: string;
            onAccent: string;
            brand: string;
            brandSubtle: string;
        };
        border: {
            default: string;
            strong: string;
            subtle: string;
            focus: string;
            destructive: string;
            brand: string;
            brandStrong: string;
        };
        status: {
            success: string;
            successLight: string;
            warning: string;
            warningLight: string;
            error: string;
            errorLight: string;
            info: string;
            infoLight: string;
        };
        accent: {
            primary: string;
            primaryLight: string;
        };
    };
    typography: {
        fontFamily: {
            heading: string;
            body: string;
            mono: string;
            system: string;
        };
        fontSize: {
            xs: string;
            sm: string;
            base: string;
            lg: string;
            xl: string;
            "2xl": string;
            "3xl": string;
            "4xl": string;
            "5xl": string;
        };
        fontWeight: {
            normal: string;
            medium: string;
            semibold: string;
            bold: string;
        };
        lineHeight: {
            tight: string;
            normal: string;
            relaxed: string;
        };
        letterSpacing: {
            tight: string;
            normal: string;
            wide: string;
        };
    };
    spacing: {
        0: string;
        0.5: string;
        1: string;
        1.5: string;
        2: string;
        2.5: string;
        3: string;
        3.5: string;
        4: string;
        5: string;
        6: string;
        7: string;
        8: string;
        9: string;
        10: string;
        12: string;
        14: string;
        16: string;
        20: string;
        24: string;
        none: string;
    };
    radius: {
        none: string;
        sm: string;
        default: string;
        md: string;
        lg: string;
        xl: string;
        "2xl": string;
        "3xl": string;
        full: string;
    };
    shadow: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
        "2xl": string;
        inner: string;
        none: string;
    };
    zIndex: {
        hide: number;
        base: number;
        dropdown: number;
        sticky: number;
        modal: number;
        popover: number;
        tooltip: number;
    };
    transition: {
        fast: string;
        normal: string;
        slow: string;
        slower: string;
    };
    easing: {
        default: string;
        linear: string;
        in: string;
        out: string;
        inOut: string;
    };
    breakpoint: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
        "2xl": string;
    };
    animation: {
        "accordion-down": string;
        "accordion-up": string;
        "fade-in": string;
        "fade-out": string;
        "slide-in": string;
        "slide-out": string;
        "zoom-in": string;
        "zoom-out": string;
        spin: string;
        pulse: string;
        bounce: string;
    };
};
export type Alias = typeof alias;
//# sourceMappingURL=alias.d.ts.map