type BreakpointValues = {
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  [key: string]: string | undefined;
};
type StyleOptions = {
  display?: CSSStyleDeclaration['display'];
  flexDirection?: CSSStyleDeclaration['flexDirection'];
  justifyContent?: CSSStyleDeclaration['justifyContent'];
  alignItems?: CSSStyleDeclaration['alignItems'];
  alignContent?: CSSStyleDeclaration['alignContent'];
  width?: CSSStyleDeclaration['width'];
  gap?: CSSStyleDeclaration['gap'];
  height?: CSSStyleDeclaration['height'];
  maxWidth?: CSSStyleDeclaration['maxWidth'];
  maxHeight?: CSSStyleDeclaration['maxHeight'];
  minWidth?: CSSStyleDeclaration['minWidth'];
  minHeight?: CSSStyleDeclaration['minHeight'];
  margin?: CSSStyleDeclaration['margin'];
  padding?: CSSStyleDeclaration['padding'];
};

type GridOptions<K extends keyof HTMLElementTagNameMap> = {
  container?: boolean;
  item?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  spacing?: number;
  gap?: number;
  style?: StyleOptions;
  breakpoints?: BreakpointValues;
  component: K;
} & Omit<HTMLElementTagNameMap[K], 'style'>;

const stylesheet = createStylesheet();

function createStylesheet(): CSSStyleSheet {
  const style = document.createElement('style');
  document.head.appendChild(style);
  return style.sheet as CSSStyleSheet;
}

function addCSSRule(
  sheet: CSSStyleSheet,
  selector: string,
  rules: string,
  index: number = sheet.cssRules.length
) {
  sheet.insertRule(`${selector} { ${rules} }`, index);
}

function createDynamicElement<K extends keyof HTMLElementTagNameMap>(
  options: GridOptions<K>
): HTMLElement {
  const { breakpoints, item, container, spacing, style: sx } = options;
  const element = document.createElement(options.component);

  const className = generateClassName();
  const defaultBreakpoints: BreakpointValues = {
    xs: '0px',
    sm: '600px',
    md: '960px',
    lg: '1280px',
  };
  const activeBreakpoints = breakpoints || defaultBreakpoints;

  let baseStyles = '';
  if (container) {
    baseStyles += `display: ${'flex'}; flex-wrap: ${'wrap'}; `;
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

  if (sx) {
    baseStyles += Object.entries(sx)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ');
  }

  const rules: string[] = [`.${className} { ${baseStyles} }`];

  if (options.breakpoints) {
    for (const [breakpoint, value] of Object.entries(options.breakpoints)) {
      if (typeof value === 'number') {
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
  }

  for (const rule of rules) {
    stylesheet.insertRule(rule, stylesheet.cssRules.length);
  }

  // Apply base styles and other HTML attributes
  // ... (previous logic)

  // Apply base styles
  if (options.style) {
    Object.assign(element.style, options.style);
  }

  // Handle container-specific styles
  if (options.container) {
    element.style.display = 'flex';
    element.style.flexWrap = 'wrap';
    if (options.spacing !== undefined) {
      const spacingValue = `${options.spacing * 8}px`;
      element.style.marginTop = `-${spacingValue}`;
      element.style.marginLeft = `-${spacingValue}`;
    }
  }

  // Handle item-specific styles
  if (options.item) {
    element.style.flexGrow = '1';
    if (options.spacing !== undefined) {
      const spacingValue = `${options.spacing * 4}px`;
      element.style.paddingTop = spacingValue;
      element.style.paddingLeft = spacingValue;
    }
  }

  // Handle breakpoints
  if (options.breakpoints) {
    for (const [breakpoint, value] of Object.entries(options.breakpoints)) {
      if (typeof value !== 'number') continue;
      const minWidth = getMinWidthForBreakpoint(breakpoint);
      const flexBasis = `calc(${(value / 12) * 100}% - ${
        options.spacing ? options.spacing * 8 : 0
      }px)`;
      addCSSRule(
        stylesheet,
        `.${className}`,
        `flex-basis: ${flexBasis}; max-width: ${flexBasis};`,
        stylesheet.cssRules.length
      );
      addCSSRule(
        stylesheet,
        `@media (min-width: ${minWidth})`,
        `.${className} { flex-basis: ${flexBasis}; max-width: ${flexBasis}; }`,
        stylesheet.cssRules.length
      );
    }
  }

  // Apply other HTML attributes
  Object.entries(options).forEach(([key, value]) => {
    if (
      key !== 'component' &&
      key !== 'style' &&
      key !== 'container' &&
      key !== 'item' &&
      key !== 'spacing' &&
      key in element
    ) {
      (element as any)[key] = value;
    }
  });

  element.className = className;
  return element;
}

function getMinWidthForBreakpoint(breakpoint: string): string {
  const breakpoints: Record<string, string> = {
    xs: '0px',
    sm: '600px',
    md: '960px',
    lg: '1280px',
  };
  return breakpoints[breakpoint];
}

function generateClassName(): string {
  return `grid-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
}
