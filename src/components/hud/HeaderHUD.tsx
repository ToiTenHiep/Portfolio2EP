"use client";

import { useEffect, useState } from "react";

const TOP_LINE = 24;
const BOTTOM_LINE = 72;
const LINE_GAP = BOTTOM_LINE - TOP_LINE;

const ACCENT_HEIGHT = 8;
const EDGE_INSET = 8;

const MINI_BOX_WIDTH = 136;
const MINI_BOX_HEIGHT = 24;
const MINI_ICON_SIZE = 24;
const MINI_BOX_GAP = 16;
const MINI_GROUP_WIDTH = MINI_BOX_WIDTH * 2 + MINI_BOX_GAP;
const MINI_BOX_TOP = TOP_LINE + (LINE_GAP - MINI_BOX_HEIGHT) / 2;

const CONTACT_ICON_SIZE = 24;
const CONTACT_TEXT_WIDTH = 136;
const CONTACT_HEIGHT = 24;
const CONTACT_HOVER_GAP = 8;
const CONTACT_TOTAL_WIDTH =
  CONTACT_ICON_SIZE + CONTACT_TEXT_WIDTH + CONTACT_HOVER_GAP;

const CONTACT_TOP = TOP_LINE + (LINE_GAP - CONTACT_HEIGHT) / 2;

export default function HeaderHUD() {
  return (
    <header className="relative h-[84px] w-full overflow-hidden bg-[#07000f]">
      {/* LEFT SECTION */}
      <div className="absolute left-0 top-0 h-full w-[43%]">
        <span
          className="absolute h-px bg-[#ff005d]"
          style={{
            top: TOP_LINE,
            left: EDGE_INSET,
            width: `calc(100% - ${EDGE_INSET}px)`,
          }}
        />

        <span
          className="absolute h-px bg-[#ff005d]"
          style={{
            top: BOTTOM_LINE,
            left: EDGE_INSET,
            width: `calc(100% - ${EDGE_INSET}px)`,
          }}
        />

        <div
          className="absolute top-0 h-full"
          style={{
            left: EDGE_INSET,
            width: MINI_GROUP_WIDTH,
          }}
        >
          <span
            className="absolute left-0 bg-[#ff005d]"
            style={{
              top: TOP_LINE - ACCENT_HEIGHT,
              width: 42,
              height: ACCENT_HEIGHT,
              clipPath: "polygon(0 0, 78% 0, 100% 100%, 0 100%)",
            }}
          />

          <div
            className="absolute left-0 flex items-center"
            style={{
              top: MINI_BOX_TOP,
              gap: MINI_BOX_GAP,
            }}
          >
            <CurrentDateBox />
            <CurrentTimeBox />
          </div>

          <span
            className="absolute left-0 bg-[#ff005d]"
            style={{
              top: BOTTOM_LINE,
              width: 38,
              height: ACCENT_HEIGHT,
              clipPath: "polygon(0 0, 100% 0, 78% 100%, 0 100%)",
            }}
          />
        </div>
      </div>

      {/* CENTER TITLE */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ top: TOP_LINE + LINE_GAP / 2 }}
      >
        <h1 className="text-[28px] font-normal uppercase leading-none tracking-[0.04em] text-[#ff005d]">
          PORTFOLIO
        </h1>
      </div>

      {/* RIGHT SECTION */}
      <div className="absolute right-0 top-0 h-full w-[43%]">
        <span
          className="absolute h-px bg-[#ff005d]"
          style={{
            top: TOP_LINE,
            right: EDGE_INSET,
            width: `calc(100% - ${EDGE_INSET}px)`,
          }}
        />

        <span
          className="absolute h-px bg-[#ff005d]"
          style={{
            top: BOTTOM_LINE,
            right: EDGE_INSET,
            width: `calc(100% - ${EDGE_INSET}px)`,
          }}
        />

        <div
          className="absolute top-0 h-full"
          style={{
            right: EDGE_INSET,
            width: CONTACT_TOTAL_WIDTH,
          }}
        >
          <span
            className="absolute right-0 bg-[#ff005d]"
            style={{
              top: TOP_LINE - ACCENT_HEIGHT,
              width: 46,
              height: ACCENT_HEIGHT,
              clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0 100%)",
            }}
          />

          <div className="absolute left-0" style={{ top: CONTACT_TOP }}>
            <HudContactBox />
          </div>

          <span
            className="absolute right-0 bg-[#ff005d]"
            style={{
              top: BOTTOM_LINE,
              width: 46,
              height: ACCENT_HEIGHT,
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 22% 100%)",
            }}
          />
        </div>
      </div>
    </header>
  );
}

function CurrentDateBox() {
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();

      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();

      setDate(`${day}/${month}/${year}`);
    };

    updateDate();

    const timer = setInterval(updateDate, 1000);

    return () => clearInterval(timer);
  }, []);

  return <HudMiniBox text={date || "--/--/----"} />;
}

function CurrentTimeBox() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      setTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return <HudMiniBox text={time || "--:--:--"} />;
}

function HudMiniBox({ text }: { text: string }) {
  return (
    <div
      className="relative overflow-hidden border border-[#ff005d] bg-transparent"
      style={{
        width: MINI_BOX_WIDTH,
        height: MINI_BOX_HEIGHT,
      }}
    >
      {/* ICON SLOT
          Ô vuông bên trái để thêm icon sau này.
          Thêm icon SVG vào trong span này.
      */}
      <span
        className="absolute left-0 top-0 grid place-items-center"
        style={{
          width: MINI_ICON_SIZE,
          height: MINI_BOX_HEIGHT,
        }}
      >
        {/* TODO: thêm icon SVG ở đây */}
      </span>

      {/* DIVIDER LINE */}
      <span
        className="absolute top-0 bottom-0 w-px bg-[#ff005d]"
        style={{
          left: MINI_ICON_SIZE,
        }}
      />

      {/* TEXT SLOT */}
      <span
        className="absolute top-0 flex items-center justify-center text-[15px] font-medium leading-none text-[#00ffee]"
        style={{
          left: MINI_ICON_SIZE + 1,
          width: MINI_BOX_WIDTH - MINI_ICON_SIZE - 1,
          height: MINI_BOX_HEIGHT,
        }}
      >
        {text}
      </span>
    </div>
  );
}

function HudContactBox() {
  return (
    <button
      className="group relative block overflow-visible bg-transparent"
      style={{
        width: CONTACT_TOTAL_WIDTH,
        height: CONTACT_HEIGHT,
      }}
    >
      {/* ICON BOX
          Ô vuông bên trái.
          Khi có icon, thêm SVG vào trong span này.
      */}
      <span
        className="
          absolute left-0 top-0 grid place-items-center
          border border-[#ff005d]
          bg-transparent
          transition-all duration-300 ease-out
          group-hover:bg-[#ff005d]
        "
        style={{
          width: CONTACT_ICON_SIZE,
          height: CONTACT_HEIGHT,
        }}
      >
        {/* TODO: thêm icon SVG ở đây */}
      </span>

      {/* TEXT BOX
          Mặc định dính sát icon box.
          Khi hover sẽ trượt sang phải 8px.
      */}
      <span
        className="
          absolute top-0 flex items-center justify-center
          border border-[#ff005d]
          bg-transparent
          text-[15px] font-semibold leading-none text-[#00fff0]
          transition-all duration-300 ease-out
          group-hover:translate-x-[8px]
          group-hover:bg-[#124d49]
        "
        style={{
          left: CONTACT_ICON_SIZE,
          width: CONTACT_TEXT_WIDTH,
          height: CONTACT_HEIGHT,
        }}
      >
        Contact
      </span>
    </button>
  );
}