import type { SVGProps } from "react";

export const FIELD_ICON_CLASS =
  "inline-flex size-4 shrink-0 items-center justify-center align-middle leading-none text-[#93b4f0] [&>svg]:pointer-events-none [&>svg]:block [&>svg]:h-full [&>svg]:w-full [&>svg]:max-h-4 [&>svg]:max-w-4 [&>svg]:shrink-0";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

function baseProps(props: IconProps) {
  const { className, ...rest } = props;
  return {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...rest,
  };
}

export function IconTvl(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12h6" />
    </svg>
  );
}

export function IconMcTvlRatio(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M7 5v14M7 19h3M17 5v14M17 19h-3" />
      <path d="M10 9h4M10 15h4" />
    </svg>
  );
}

export function IconBurned(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 2.25c-1.2 2.8-2.8 5.1-4.2 7.6-1.2 2.1-1.8 4-1.8 5.65a6 6 0 1 0 12 0c0-1.65-.6-3.55-1.8-5.65-1.4-2.5-3-4.8-4.2-7.6z" />
    </svg>
  );
}

export function IconHolderBalance(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}

export function IconLpSwap(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M7 16V4M7 4 3 8M17 8v12M17 20l4-4" />
    </svg>
  );
}

export function IconLpListing(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}

export function IconLaunchpad(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4.5 16.5c1.5 1.5 6 2 8.5-1 2.5-3 2-7.5-1.5-10S3 15 4.5 16.5Z" />
      <path d="m9 11 3 3M7.5 13.5 6 15M10.5 10.5 12 9" />
    </svg>
  );
}

export function IconBtc(props: IconProps) {
  const { className, ...rest } = props;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...rest}
    >
      <path d="M14.24 10.56c.31.16.64.29.92.47.98.62 1.6 1.7 1.6 2.97 0 2.03-1.75 3.68-3.92 3.68h-.33v2.1H9.5v-2.1H7.74v-1.94h1.76v-9.74H7.74V4.99h2.76V2.9h2.01v2.09h.33c2.17 0 3.92 1.65 3.92 3.68 0 .67-.18 1.3-.5 1.89zM11.5 14.5h1.22c.85 0 1.54-.64 1.54-1.43s-.69-1.43-1.54-1.43H11.5v2.86zm0-4.12h1.07c.74 0 1.34-.56 1.34-1.25s-.6-1.25-1.34-1.25H11.5v2.5z" />
    </svg>
  );
}

export function IconSaas(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z" />
      <path d="M8 18h8M10 14v4M14 14v4" />
    </svg>
  );
}

export function IconStackValue(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 7h16M4 12h12M4 17h8" />
    </svg>
  );
}

export function IconImpliedPrice(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

export function IconScenarioMc(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M3 17 9 11l4 4 8-8" />
      <path d="M14 7h7v7" />
    </svg>
  );
}

export function IconCirculatingSupply(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v6h-6M3 21v-6h6" />
    </svg>
  );
}

export function IconFdv(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

export function IconModeSimple(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
    </svg>
  );
}

export function IconModeAdvanced(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 7h16M4 17h16" />
      <path d="M10 3v8M16 13v8" />
    </svg>
  );
}

export function IconScreenshotHint(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.5l1.7-2.55A2 2 0 0 1 8.28 2h7.44a2 2 0 0 1 1.66.9L18.5 6H21a2 2 0 0 1 2 2v11z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

export function IconSocialNetworks(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M13 8.5c1.5 1 3.5 1 5 0M6 11.5c1.5 2 4 3 6 3s4.5-1 6-3" />
    </svg>
  );
}

export function IconShareUpload(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
    </svg>
  );
}
