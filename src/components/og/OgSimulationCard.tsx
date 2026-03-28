import type {
  ComponentType,
  CSSProperties,
  ReactNode,
  SVGProps,
} from "react";
import type { IxsSimulatorResult } from "@/lib/ixs-simulator";
import type { ShareUrlState } from "@/lib/share-url-state";
import {
  IconBurned,
  IconCirculatingSupply,
  IconFdv,
  IconHolderBalance,
  IconImpliedPrice,
  IconMcTvlRatio,
  IconScenarioMc,
  IconStackValue,
  IconTvl,
} from "@/components/icons/SimulatorUiIcons";
import {
  formatInteger,
  formatNumber,
  formatPercent,
  formatUsd,
  formatUsdCompact,
  formatUsdPrice,
} from "@/lib/format-numbers";
import { OgIxsLogo } from "@/components/og/OgIxsLogo";

const labelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: "#71717a",
  textTransform: "uppercase",
  letterSpacing: 2,
};

const valueStyle: CSSProperties = {
  fontSize: 15,
  color: "#f4f4f5",
};

const rowBorder: CSSProperties = {
  borderBottomWidth: 1,
  borderBottomStyle: "solid",
  borderBottomColor: "rgba(255,255,255,0.08)",
  paddingTop: 4,
  paddingBottom: 4,
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
};

const statRowSlot: CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  minHeight: 0,
};

const ogIconWrap: CSSProperties = {
  width: 15,
  height: 15,
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function OgGlyph({ children }: { children: ReactNode }) {
  return <span style={ogIconWrap}>{children}</span>;
}

function ogIcon(Icon: ComponentType<SVGProps<SVGSVGElement>>): ReactNode {
  return (
    <OgGlyph>
      <Icon width={15} height={15} style={{ color: "#93b4f0", display: "block" }} />
    </OgGlyph>
  );
}

function StatRow({
  label,
  value,
  valueLarge,
  hideBottomBorder,
  icon,
}: {
  label: string;
  value: string;
  valueLarge?: boolean;
  hideBottomBorder?: boolean;
  icon?: ReactNode;
}) {
  return (
    <div
      style={{
        ...rowBorder,
        ...(hideBottomBorder ? { borderBottomWidth: 0 } : {}),
      }}
    >
      <span
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          minWidth: 0,
          flexShrink: 1,
        }}
      >
        {icon}
        <span style={labelStyle}>{label}</span>
      </span>
      <span
        style={{
          ...valueStyle,
          fontSize: valueLarge ? 22 : 15,
          fontWeight: valueLarge ? 700 : 400,
          color: valueLarge ? "#ffffff" : "#f4f4f5",
          textAlign: "right",
          maxWidth: "58%",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function PairRow({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
  hideBottomBorder,
  leftIcon,
  rightIcon,
}: {
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
  hideBottomBorder?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}) {
  const half = (
    label: string,
    value: string,
    icon: ReactNode | undefined,
  ) => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
        minWidth: 0,
        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          minWidth: 0,
          flexShrink: 1,
        }}
      >
        {icon}
        <span style={labelStyle}>{label}</span>
      </div>
      <span
        style={{
          ...valueStyle,
          textAlign: "right",
          marginLeft: 8,
          flexShrink: 0,
        }}
      >
        {value}
      </span>
    </div>
  );

  return (
    <div
      style={{
        ...rowBorder,
        ...(hideBottomBorder ? { borderBottomWidth: 0 } : {}),
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 24,
        width: "100%",
      }}
    >
      {half(leftLabel, leftValue, leftIcon)}
      {half(rightLabel, rightValue, rightIcon)}
    </div>
  );
}

type OgSimulationCardProps = {
  result: IxsSimulatorResult;
  state: ShareUrlState;
};

export function OgSimulationCard({ result, state }: OgSimulationCardProps) {
  const totalSupply = state.totalSupply;
  const burnedTokens = totalSupply - result.circulatingSupply;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 44,
        backgroundImage:
          "linear-gradient(180deg, #12121a 0%, #0b0b0f 48%, #08080c 100%)",
        color: "#fafafa",
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: "rgba(37, 100, 221, 0.35)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          flexShrink: 0,
          paddingBottom: 14,
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
          borderBottomColor: "rgba(255,255,255,0.1)",
        }}
      >
        <OgIxsLogo width={240} />
        <div
          style={{
            marginTop: 14,
            fontSize: 11,
            fontWeight: 700,
            color: "#93b4f0",
            textTransform: "uppercase",
            letterSpacing: 4,
          }}
        >
          Simulation summary
        </div>
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div style={statRowSlot}>
          <StatRow
            label="Stack value"
            value={formatUsd(result.holderValueUsd)}
            valueLarge
            icon={ogIcon(IconStackValue)}
          />
        </div>
        <div style={statRowSlot}>
          <PairRow
            leftLabel="Implied IXS price"
            leftValue={formatUsdPrice(result.priceUsd)}
            rightLabel="Scenario MC"
            rightValue={formatUsdCompact(result.marketCapUsd)}
            leftIcon={ogIcon(IconImpliedPrice)}
            rightIcon={ogIcon(IconScenarioMc)}
          />
        </div>
        <div style={statRowSlot}>
          <PairRow
            leftLabel="TVL"
            leftValue={formatUsdCompact(result.tvlUsd)}
            rightLabel="MC/TVL"
            rightValue={formatNumber(result.mcToTvlRatio)}
            leftIcon={ogIcon(IconTvl)}
            rightIcon={ogIcon(IconMcTvlRatio)}
          />
        </div>
        <div style={statRowSlot}>
          <PairRow
            leftLabel="Balance"
            leftValue={`${formatInteger(result.holderQuantity)} IXS`}
            rightLabel="Circulating"
            rightValue={`${formatInteger(result.circulatingSupply)} IXS`}
            leftIcon={ogIcon(IconHolderBalance)}
            rightIcon={ogIcon(IconCirculatingSupply)}
          />
        </div>
        <div style={statRowSlot}>
          <PairRow
            leftLabel="Burned"
            leftValue={`${formatInteger(burnedTokens)} (${formatPercent(result.burnPercentOfMax, 2)})`}
            rightLabel="FDV (scenario)"
            rightValue={formatUsdCompact(result.fdvUsd)}
            hideBottomBorder
            leftIcon={ogIcon(IconBurned)}
            rightIcon={ogIcon(IconFdv)}
          />
        </div>
        <div
          style={{
            flexShrink: 0,
            paddingTop: 10,
            fontSize: 10,
            color: "#52525b",
            textAlign: "center",
            width: "100%",
          }}
        >
          IXS Valuation Simulator
        </div>
      </div>
    </div>
  );
}
