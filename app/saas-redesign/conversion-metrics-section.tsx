"use client";

import {
  useId,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { area, curveMonotoneX, line } from "d3-shape";

type MetricProfile = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  values: number[];
  dates: string[];
};

const metricProfiles: Record<"antoine" | "dominique", MetricProfile> = {
  antoine: {
    id: "keyframe",
    name: "Antoine Troovy",
    role: "Founder of Keyframe",
    avatar:
      "https://framerusercontent.com/images/OyAwqa9YP58MVuHUk2Wbjbb2Ijo.jpg?width=200&height=200",
    values: [
      0.7, 1.05, 0.62, 0.84, 0.55, 0.72, 0.61, 0.76, 0.58, 0.9, 0.66, 1.08,
      1.18, 2.65, 2.28, 0.84, 2.45, 2.06, 0.72, 0.74, 1.02, 0.68, 2.58, 0.64,
      0.9, 0.96, 4.92, 0.72, 1.04, 0.65, 0.92, 1.18, 2.84, 1.16, 3.25, 1.22,
      1.34, 2.05, 0.72, 0.8, 1.22, 0.69, 1.38, 0.82, 1.56, 0.88, 1.86, 0.74,
      0.68, 7.72,
    ],
    dates: ["1 Jan", "29 Jan", "26 Feb", "26 Mar", "23 Apr", "20 May"],
  },
  dominique: {
    id: "zorgniotti",
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
    dates: ["1 Jun", "29 Jun", "27 Jul", "24 Aug", "21 Sep", "19 Oct"],
  },
};

const VIEW_WIDTH = 1349;
const VIEW_HEIGHT = 380;
const PLOT = { left: 44, top: 36, right: 27, bottom: 38 };
const PLOT_WIDTH = VIEW_WIDTH - PLOT.left - PLOT.right;
const PLOT_HEIGHT = VIEW_HEIGHT - PLOT.top - PLOT.bottom;
const PLOT_BOTTOM = PLOT.top + PLOT_HEIGHT;
const MAX_VALUE = 8;
const CHANGE_INDEX = 10;
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
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [selection, setSelection] = useState<[number, number] | null>(null);
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

  const getIndex = (event: ReactPointerEvent<SVGRectElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX =
      ((event.clientX - bounds.left) / bounds.width) * PLOT_WIDTH;
    return Math.round(
      Math.max(0, Math.min(1, relativeX / PLOT_WIDTH)) *
        (profile.values.length - 1),
    );
  };
  const updateHover = (event: ReactPointerEvent<SVGRectElement>) => {
    const index = getIndex(event);
    setHoverIndex(index);
    if (dragStart !== null) {
      setSelection([Math.min(dragStart, index), Math.max(dragStart, index)]);
    }
  };
  const startSelection = (event: ReactPointerEvent<SVGRectElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const index = getIndex(event);
    setDragStart(index);
    setSelection([index, index]);
    setHoverIndex(index);
  };
  const finishSelection = (event: ReactPointerEvent<SVGRectElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragStart(null);
  };

  const hoveredPoint = hoverIndex === null ? null : chart.points[hoverIndex];
  const selectedRange = selection && selection[1] > selection[0] ? selection : null;
  const rangeIncrease = selectedRange
    ? ((profile.values[selectedRange[1]] - profile.values[selectedRange[0]]) /
        Math.max(0.1, profile.values[selectedRange[0]])) *
      100
    : null;

  return (
    <div className="sr-metric-chart" key={profile.id}>
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
            <stop offset="0%" stopColor="#8DCDFF" stopOpacity="0.5" />
            <stop offset="45%" stopColor="#8DCDFF" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#8DCDFF" stopOpacity="0" />
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
                className="sr-metric-grid-line"
              />
            </g>
          );
        })}

        <path d={chart.beforeArea} fill={`url(#${gradientId}-before)`} />
        <path
          d={chart.beforeLine}
          fill="none"
          stroke="#9aa3ad"
          strokeOpacity="0.72"
          strokeWidth="2"
          strokeDasharray="6 4"
          vectorEffect="non-scaling-stroke"
        />
        <path d={chart.afterArea} fill={`url(#${gradientId}-after)`} />
        <path
          className="sr-metric-line-in"
          d={chart.afterLine}
          fill="none"
          stroke="#8DCDFF"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        <line
          x1={chart.changeX}
          x2={chart.changeX}
          y1={PLOT.top}
          y2={PLOT_BOTTOM}
          stroke="#8DCDFF"
          strokeOpacity="0.5"
          strokeDasharray="4 4"
          vectorEffect="non-scaling-stroke"
        />

        {selectedRange && (
          <rect
            x={chart.points[selectedRange[0]][0]}
            y={PLOT.top}
            width={chart.points[selectedRange[1]][0] - chart.points[selectedRange[0]][0]}
            height={PLOT_HEIGHT}
            className="sr-metric-selection-band"
          />
        )}

        {hoveredPoint && hoverIndex !== null && (
          <g className="sr-metric-tooltip" pointerEvents="none">
            <rect
              x={Math.max(PLOT.left, hoveredPoint[0] - PLOT_WIDTH / profile.values.length / 2)}
              y={PLOT.top}
              width={PLOT_WIDTH / profile.values.length}
              height={PLOT_HEIGHT}
              className="sr-metric-hover-band"
            />
            <line
              x1={hoveredPoint[0]}
              x2={hoveredPoint[0]}
              y1={PLOT.top}
              y2={PLOT_BOTTOM}
              className="sr-metric-hover-line"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx={hoveredPoint[0]}
              cy={hoveredPoint[1]}
              r="5"
              className="sr-metric-hover-dot"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        )}

        <rect
          x={PLOT.left}
          y={PLOT.top}
          width={PLOT_WIDTH}
          height={PLOT_HEIGHT}
          fill="transparent"
          onPointerDown={startSelection}
          onPointerMove={updateHover}
          onPointerUp={finishSelection}
          onPointerLeave={() => {
            if (dragStart === null) setHoverIndex(null);
          }}
        />
      </svg>
      <div className="sr-metric-axis" aria-hidden="true">
        {yLabels.map((value, index) => (
          <span
            className="sr-metric-axis-y"
            key={value}
            style={{ left: `${(34 / VIEW_WIDTH) * 100}%`, top: `${((PLOT_BOTTOM - (index / (yLabels.length - 1)) * PLOT_HEIGHT) / VIEW_HEIGHT) * 100}%` }}
          >
            {value}%
          </span>
        ))}
        {profile.dates.map((label, index) => (
          <span
            className="sr-metric-axis-x"
            key={label}
            style={{ left: `${((PLOT.left + (index / (profile.dates.length - 1)) * PLOT_WIDTH) / VIEW_WIDTH) * 100}%`, top: `${((PLOT_BOTTOM + 26) / VIEW_HEIGHT) * 100}%` }}
          >
            {label}
          </span>
        ))}
        <span
          className="sr-metric-change-label"
          style={{ left: `${((chart.changeX - 10) / VIEW_WIDTH) * 100}%`, top: `${((PLOT.top + 16) / VIEW_HEIGHT) * 100}%` }}
        >
          → Landing page changed
        </span>
      </div>
      {hoveredPoint && hoverIndex !== null && (
        <div
          className="sr-metric-chart-tooltip"
          style={{
            left: `${Math.min(89, Math.max(11, (hoveredPoint[0] / VIEW_WIDTH) * 100))}%`,
            top: `${Math.max(22, (hoveredPoint[1] / VIEW_HEIGHT) * 100)}%`,
          }}
        >
          <strong>{profile.dates[Math.min(profile.dates.length - 1, Math.round((hoverIndex / (profile.values.length - 1)) * (profile.dates.length - 1)))]}</strong>
          <span><i />Conversion rate<strong>{profile.values[hoverIndex].toFixed(2)}%</strong></span>
          {selectedRange && rangeIncrease !== null && (
            <div className="sr-metric-range-summary">
              <b>Selected range</b>
              <span>{rangeIncrease >= 0 ? "+" : ""}{rangeIncrease.toFixed(1)}% conversion change</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ConversionMetricsSection({ person = "antoine", id }: { person?: "antoine" | "dominique"; id?: string }) {
  const activeProfile = metricProfiles[person];
  const activeStats = getProfileStats(activeProfile);

  return (
    <section
      className="sr-metrics"
      id={id}
      aria-label={`${activeProfile.name} conversion rate results`}
    >
      <div className="sr-metrics-main">
        <div className="sr-metrics-frame">
          <header className="sr-metrics-summary">
            <ProfileIdentity profile={activeProfile} />
            <div className="sr-metric-total" aria-live="polite">
              <strong>+{activeStats.increase}%</strong>
              <span>Higher average conversion rate</span>
            </div>
          </header>
          <ConversionChart profile={activeProfile} key={activeProfile.id} />
        </div>
      </div>
    </section>
  );
}
