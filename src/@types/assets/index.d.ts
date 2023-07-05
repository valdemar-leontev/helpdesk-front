declare module '*.svg' {
    import React = require('react');
    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
}

declare module '*.json' {
    const value: string;
    export default value;
}

declare module '*.scss' {
    const styles: { [className: string]: string };
    export default styles;
}
