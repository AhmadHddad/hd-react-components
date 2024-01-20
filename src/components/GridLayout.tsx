import React from 'react';

interface BreakpointValues {
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  [key: string]: string | undefined;
}

type GridLayoutOptions<K extends keyof JSX.IntrinsicElements = 'div'> = {
  container?: boolean;
  item?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  sx?: React.CSSProperties;
  spacing?: number;
  gap?: number;
  display?: React.CSSProperties['display'];
  flexDirection?: React.CSSProperties['flexDirection'];
  flexWrap?: React.CSSProperties['flexWrap'];
  justifyContent?: React.CSSProperties['justifyContent'];
  alignItems?: React.CSSProperties['alignItems'];
  alignContent?: React.CSSProperties['alignContent'];
  width?: React.CSSProperties['width'];
  height?: React.CSSProperties['height'];
  maxWidth?: React.CSSProperties['maxWidth'];
  maxHeight?: React.CSSProperties['maxHeight'];
  minWidth?: React.CSSProperties['minWidth'];
  minHeight?: React.CSSProperties['minHeight'];
  margin?: React.CSSProperties['margin'];
  padding?: React.CSSProperties['padding'];
  breakpoints?: BreakpointValues;
  component?: K;
} & React.ComponentProps<K>;

let uniqueId = 0;

function createDynamicStyleSheet(): CSSStyleSheet {
  const style = document.createElement('style');
  style.type = 'text/css';
  document.head.appendChild(style);
  return style.sheet as CSSStyleSheet;
}

function generateClassName(): string {
  return `dynamic-style-${uniqueId++}`;
}

const dynamicStyleSheet = createDynamicStyleSheet();

function GridLayout<K extends keyof JSX.IntrinsicElements = 'div'>(
  props: GridLayoutOptions<K>
) {
  const {
    container,
    item,
    xs,
    sm,
    md,
    lg,
    sx,
    spacing,
    gap,
    display,
    flexWrap,
    flexDirection,
    justifyContent,
    alignItems,
    alignContent,
    width,
    height,
    maxWidth,
    maxHeight,
    minWidth,
    minHeight,
    margin,
    padding,
    children,
    component = 'div',
    breakpoints,
    ...otherProps
  } = props;
  const className = generateClassName();
  const defaultBreakpoints: BreakpointValues = {
    xs: '0px',
    sm: '600px',
    md: '960px',
    lg: '1280px',
  };
  const activeBreakpoints = breakpoints || defaultBreakpoints;

  React.useEffect(() => {
    let baseStyles = '';
    if (container) {
      baseStyles += `display: ${display || 'flex'}; flex-wrap: ${flexWrap ||
        'wrap'}; `;
      if (spacing) {
        baseStyles += `padding-top: ${spacing * 8}px; padding-left: ${spacing *
          8}px; `;
      }
    }
    if (item) {
      baseStyles += 'flex-grow: 1; ';
      if (spacing) {
        baseStyles += `margin-top: -${spacing * 4}px; margin-left: -${spacing *
          4}px; `;
      }
    }
    if (gap) {
      baseStyles += `gap: ${gap}px; `;
    }
    if (flexDirection) {
      baseStyles += `flex-direction: ${flexDirection}; `;
    }
    if (justifyContent) {
      baseStyles += `justify-content: ${justifyContent}; `;
    }
    if (alignItems) {
      baseStyles += `align-items: ${alignItems}; `;
    }
    if (alignContent) {
      baseStyles += `align-content: ${alignContent}; `;
    }
    if (width) {
      baseStyles += `width: ${width}; `;
    }
    if (height) {
      baseStyles += `height: ${height}; `;
    }
    if (maxWidth) {
      baseStyles += `max-width: ${maxWidth}; `;
    }
    if (maxHeight) {
      baseStyles += `max-height: ${maxHeight}; `;
    }
    if (minWidth) {
      baseStyles += `min-width: ${minWidth}; `;
    }
    if (minHeight) {
      baseStyles += `min-height: ${minHeight}; `;
    }
    if (margin) {
      baseStyles += `margin: ${margin}; `;
    }
    if (padding) {
      baseStyles += `padding: ${padding}; `;
    }
    if (sx) {
      baseStyles += Object.entries(sx)
        .map(([key, value]) => `${key}: ${value};`)
        .join(' ');
    }

    const rules: string[] = [`.${className} { ${baseStyles} }`];

    const breakpointSizes: Record<string, number | undefined> = {
      xs,
      sm,
      md,
      lg,
    };
    for (const [breakpoint, value] of Object.entries(breakpointSizes)) {
      if (value !== undefined) {
        const minWidth =
          activeBreakpoints[breakpoint] || defaultBreakpoints[breakpoint];
        if (minWidth) {
          rules.push(
            `@media (min-width: ${minWidth}) { .${className} { flex-basis: calc(${(value /
              12) *
              100}% - 16px); max-width: calc(${(value / 12) *
              100}% - 16px); } }`
          );
        }
      }
    }

    for (const rule of rules) {
      dynamicStyleSheet.insertRule(rule, dynamicStyleSheet.cssRules.length);
    }
  }, [
    container,
    item,
    xs,
    sm,
    md,
    flexWrap,
    lg,
    sx,
    spacing,
    gap,
    display,
    flexDirection,
    justifyContent,
    alignItems,
    alignContent,
    width,
    height,
    maxWidth,
    maxHeight,
    minWidth,
    minHeight,
    margin,
    padding,
    className,
    activeBreakpoints,
  ]);

  return React.createElement(component, { className, ...otherProps }, children);
}

export default GridLayout;
