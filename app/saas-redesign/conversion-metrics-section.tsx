"use client";

import {
  useId,
  useMemo,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { area, curveMonotoneX, line } from "d3-shape";

type MetricProfile = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  values: number[];
};

const metricProfiles: MetricProfile[] = [
  {
    id: "keyframe",
    name: "Antoine Troovy",
    role: "Founder of Keyframe Agency",
    avatar:
      "https://framerusercontent.com/images/OyAwqa9YP58MVuHUk2Wbjbb2Ijo.jpg?width=200&height=200",
    values: [
      0.7, 1.05, 0.62, 0.84, 0.55, 0.72, 0.61, 0.76, 0.58, 0.9, 0.66, 1.08,
      1.18, 2.65, 2.28, 0.84, 2.45, 2.06, 0.72, 0.74, 1.02, 0.68, 2.58, 0.64,
      0.9, 0.96, 4.92, 0.72, 1.04, 0.65, 0.92, 1.18, 2.84, 1.16, 3.25, 1.22,
      1.34, 2.05, 0.72, 0.8, 1.22, 0.69, 1.38, 0.82, 1.56, 0.88, 1.86, 0.74,
      0.68, 7.72,
    ],
  },
  {
    id: "spreak",
    name: "Dominique Zenglein",
    role: "Partner at Zorgniotti",
    avatar:
      "https://framerusercontent.com/images/nDeWJMtJPkakkMFDMXaoNWTTAMw.webp?width=167&height=167",
    values: [
      0.84, 0.7, 0.92, 0.62, 0.74, 0.88, 0.66, 0.82, 0.75, 0.94, 0.78, 1.02,
      1.2, 1.68, 1.36, 1.02, 1.72, 1.48, 1.08, 1.12, 1.34, 1.06, 1.82, 1.14,
      1.42, 1.18, 2.54, 1.22, 1.48, 1.16, 1.38, 1.64, 2.2, 1.46, 2.62, 1.4,
      1.58, 1.96, 1.18, 1.24, 1.72, 1.26, 1.86, 1.34, 1.98, 1.42, 2.26, 1.38,
      1.28, 5.38,
    ],
  },
];

const VIEW_WIDTH = 1349;
const VIEW_HEIGHT = 380;
const PLOT = { left: 44, top: 36, right: 27, bottom: 38 };
const PLOT_WIDTH = VIEW_WIDTH - PLOT.left - PLOT.right;
const PLOT_HEIGHT = VIEW_HEIGHT - PLOT.top - PLOT.bottom;
const PLOT_BOTTOM = PLOT.top + PLOT_HEIGHT;
const MAX_VALUE = 8;
const CHANGE_INDEX = 10;
const xLabels = ["3 Dec", "29 Jan", "9 Feb", "23 Feb", "17 Mar", "10 Apr"];
const yLabels = [0, 2, 4, 6, 8];

function getProfileStats(profile: MetricProfile) {
  const average = (values: number[]) =>
    values.reduce((total, value) => total + value, 0) / values.length;
  const beforeAverage = average(profile.values.slice(0, CHANGE_INDEX + 1));
  const afterAverage = average(profile.values.slice(CHANGE_INDEX + 1));
  const increase = Math.round(
    ((afterAverage - beforeAverage) / beforeAverage) * 100,
  );

  return { beforeAverage, afterAverage, increase };
}

function ProfileIdentity({ profile }: { profile: MetricProfile }) {
  return (
    <div className="sr-metric-identity">
      <img src={profile.avatar} alt="" />
      <div>
        <strong>{profile.name}</strong>
        <span>{profile.role}</span>
      </div>
    </div>
  );
}

function ConversionChart({ profile }: { profile: MetricProfile }) {
  const gradientId = useId().replace(/:/g, "");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const stats = getProfileStats(profile);

  const chart = useMemo(() => {
    const points = profile.values.map((value, index) => {
      const x = PLOT.left + (index / (profile.values.length - 1)) * PLOT_WIDTH;
      const y = PLOT_BOTTOM - (value / MAX_VALUE) * PLOT_HEIGHT;
      return [x, y] as [number, number];
    });
    const before = points.slice(0, CHANGE_INDEX + 1);
    const after = points.slice(CHANGE_INDEX);
    const lineMaker = line<[number, number]>()
      .x((point) => point[0])
      .y((point) => point[1])
      .curve(curveMonotoneX);
    const areaMaker = area<[number, number]>()
      .x((point) => point[0])
      .y0(PLOT_BOTTOM)
      .y1((point) => point[1])
      .curve(curveMonotoneX);

    return {
      points,
      beforeLine: lineMaker(before) ?? "",
      beforeArea: areaMaker(before) ?? "",
      afterLine: lineMaker(after) ?? "",
      afterArea: areaMaker(after) ?? "",
      changeX: points[CHANGE_INDEX][0],
    };
  }, [profile]);

  const updateHover = (event: ReactMouseEvent<SVGRectElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX =
      ((event.clientX - bounds.left) / bounds.width) * PLOT_WIDTH;
    const index = Math.round(
      Math.max(0, Math.min(1, relativeX / PLOT_WIDTH)) *
        (profile.values.length - 1),
    );
    setHoverIndex(index);
  };

  const hoveredPoint = hoverIndex === null ? null : chart.points[hoverIndex];
  const tooltipX = hoveredPoint
    ? Math.min(VIEW_WIDTH - 148, hoveredPoint[0] + 12)
    : 0;
  const tooltipY = hoveredPoint
    ? Math.max(PLOT.top + 6, hoveredPoint[1] - 58)
    : 0;
  const hoveringBefore = hoverIndex !== null && hoverIndex <= CHANGE_INDEX;
  const hoverColor = hoveringBefore ? "rgba(255,255,255,.6)" : "#6FB8E0";

  return (
    <div className="sr-metric-chart" key={profile.id}>
      <div className="sr-metric-chart-label" aria-hidden="true">
        <span>[</span> average conversion: {stats.beforeAverage.toFixed(2)}%
        before → {stats.afterAverage.toFixed(2)}% after <span>]</span>
      </div>
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        role="img"
        aria-label={`Conversion rate chart for ${profile.name}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id={`${gradientId}-before`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id={`${gradientId}-after`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#6FB8E0" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6FB8E0" stopOpacity="0" />
          </linearGradient>
        </defs>

        {yLabels.map((value, index) => {
          const y = PLOT_BOTTOM - (index / (yLabels.length - 1)) * PLOT_HEIGHT;
          return (
            <g key={value}>
              <line
                x1={PLOT.left}
                x2={PLOT.left + PLOT_WIDTH}
                y1={y}
                y2={y}
                stroke="#FFFFFF"
                strokeOpacity="0.13"
                strokeDasharray="3 6"
              />
              <text x={34} y={y + 4} textAnchor="end">
                {value}%
              </text>
            </g>
          );
        })}

        {xLabels.map((label, index) => {
          const x = PLOT.left + (index / (xLabels.length - 1)) * PLOT_WIDTH;
          return (
            <text key={label} x={x} y={PLOT_BOTTOM + 26} textAnchor="middle">
              {label}
            </text>
          );
        })}

        <path d={chart.beforeArea} fill={`url(#${gradientId}-before)`} />
        <path
          d={chart.beforeLine}
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.4"
          strokeWidth="2"
          strokeDasharray="6 4"
          vectorEffect="non-scaling-stroke"
        />
        <path d={chart.afterArea} fill={`url(#${gradientId}-after)`} />
        <path
          className="sr-metric-line-in"
          d={chart.afterLine}
          fill="none"
          stroke="#6FB8E0"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />

        <line
          x1={chart.changeX}
          x2={chart.changeX}
          y1={PLOT.top}
          y2={PLOT_BOTTOM}
          stroke="#6FB8E0"
          strokeOpacity="0.5"
          strokeDasharray="4 4"
          vectorEffect="non-scaling-stroke"
        />
        <text
          className="sr-metric-change-label"
          x={chart.changeX - 10}
          y={PLOT.top + 16}
          textAnchor="end"
        >
          → Landing page changed
        </text>

        {hoveredPoint && hoverIndex !== null && (
          <g className="sr-metric-tooltip" pointerEvents="none">
            <line
              x1={hoveredPoint[0]}
              x2={hoveredPoint[0]}
              y1={PLOT.top}
              y2={PLOT_BOTTOM}
              stroke={hoverColor}
              strokeOpacity="0.34"
              strokeDasharray="3 4"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx={hoveredPoint[0]}
              cy={hoveredPoint[1]}
              r="5"
              fill="#0B1327"
              stroke={hoverColor}
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            />
            <rect
              x={tooltipX}
              y={tooltipY}
              width="136"
              height="48"
              rx="10"
              fill="#182238"
              stroke="#FFFFFF"
              strokeOpacity="0.1"
              vectorEffect="non-scaling-stroke"
            />
            <text
              className={`sr-metric-tooltip-value${hoveringBefore ? " is-before" : ""}`}
              x={tooltipX + 12}
              y={tooltipY + 20}
            >
              {profile.values[hoverIndex].toFixed(2)}%
            </text>
            <text
              className="sr-metric-tooltip-label"
              x={tooltipX + 12}
              y={tooltipY + 37}
            >
              {hoveringBefore
                ? "Before conversion rate"
                : "After conversion rate"}
            </text>
          </g>
        )}

        <rect
          x={PLOT.left}
          y={PLOT.top}
          width={PLOT_WIDTH}
          height={PLOT_HEIGHT}
          fill="transparent"
          onMouseMove={updateHover}
          onMouseLeave={() => setHoverIndex(null)}
        />
      </svg>
    </div>
  );
}

export function ConversionMetricsSection() {
  const [activeId, setActiveId] = useState(metricProfiles[0].id);
  const activeProfile =
    metricProfiles.find((profile) => profile.id === activeId) ??
    metricProfiles[0];
  const activeStats = getProfileStats(activeProfile);

  return (
    <section
      className="sr-metrics"
      id="results"
      aria-label="Conversion rate results"
      data-sr-reveal="section"
    >
      <img
        className="sr-metrics-decoration sr-metrics-decoration--left"
        src="/landing-assets/figma-originals/2052-1466.svg"
        alt=""
        aria-hidden="true"
      />
      <img
        className="sr-metrics-decoration sr-metrics-decoration--right"
        src="/landing-assets/figma-originals/2052-1465.svg"
        alt=""
        aria-hidden="true"
      />

      <div className="sr-metrics-main">
        <header className="sr-metrics-summary">
          <ProfileIdentity profile={activeProfile} />
          <div className="sr-metric-total" aria-live="polite">
            <strong>+{activeStats.increase}%</strong>
            <span>Higher average conversion rate</span>
          </div>
        </header>
        <ConversionChart profile={activeProfile} />
      </div>

      <div
        className="sr-metrics-profiles"
        aria-label="Choose a customer profile"
      >
        {metricProfiles.map((profile) => {
          const selected = profile.id === activeId;
          const stats = getProfileStats(profile);
          return (
            <button
              type="button"
              className={`sr-metric-profile${selected ? " is-active" : ""}`}
              key={profile.id}
              aria-pressed={selected}
              onClick={() => setActiveId(profile.id)}
            >
              <img src={profile.avatar} alt="" />
              <strong>{profile.name}</strong>
              <span>+{stats.increase}%</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
