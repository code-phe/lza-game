import React, { useEffect, useRef, useState } from "react";
import intervalToDuration from "date-fns/intervalToDuration";
import pick from "lodash/pick";
import get from "lodash/get";
import clsx from "clsx";
import isPast from "date-fns/isPast";

interface Props {
  className?: string;
  endDate: string;
  shadow?: boolean;
}

enum UnitTrans {
  days = "ngày",
  hours = "giờ",
  minutes = "phút",
  seconds = "giây",
}

const CoundownUnit: React.FC<{ number: number }> = ({ number }) => {
  const numberString =
    number.toString().length === 2
      ? number.toString()
      : `0${number.toString()}`;

  return (
    <div className="grid grid-cols-2 gap-0 md:gap-2">
      {Array.from(numberString).map((i, index) => (
        <p
          className="coundownUnit w-10 p-1 rounded-lg shadow-md border-black"
          key={index}
        >
          <span className="z-10 relative">{i}</span>
        </p>
      ))}
    </div>
  );
};

const Countdown: React.FC<Props> = ({ className, endDate, shadow = true }) => {
  const [duration, setDuration] = useState<Duration>();
  const ref = useRef<number>();

  useEffect(() => {
    ref.current = setInterval(() => {
      const isEndDatePast = isPast(new Date(endDate));
      let durationRs = intervalToDuration({
        start: isEndDatePast ? new Date() : new Date(endDate),
        end: new Date(),
      });

      setDuration(durationRs);
    }, 1000) as any;

    return () => {
      clearInterval(ref.current);
    };
  }, [endDate]);

  const months = get(duration, "months", 0);
  const days = get(duration, "days", 0) + months * 30;
  const durationShow = pick(duration, ["hours", "minutes", "seconds"]);
  durationShow.days = days;

  return (
    <div className={clsx("grid grid-cols-4 gap-2 md:flex", className)}>
      {["days", "hours", "minutes", "seconds"].map((key, index) => (
        <div key={key} className={clsx("py-1 md:px-1 text-center rounded-lg")}>
          <p
            className={clsx(
              "text-white text-lg md:text-4xl md:font-bold",
              index !== 3 && "has-dot"
            )}
          >
            <CoundownUnit number={get(durationShow, key, 0)} />
          </p>
          <p className="text-lg mt-2" style={{ color: "#2c609a" }}>
            {`${get(UnitTrans, key)}`.toUpperCase()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
