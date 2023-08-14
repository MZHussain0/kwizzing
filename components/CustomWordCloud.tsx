"use client";
import { useTheme } from "next-themes";
import React from "react";
import D3WordCloud from "react-d3-cloud";

const data = [
  { text: "Hello", value: 10 },
  { text: "World", value: 15 },
  { text: "React", value: 20 },
  { text: "Next", value: 3 },
  { text: "TailwindCss", value: 1 },
];

const fontSizeWrapper = (word: { value: number }) => {
  return Math.log2(word.value) * 5 + 16;
};

type Props = {};

const CustomWordCloud = (props: Props) => {
  const theme = useTheme();
  return (
    <>
      <D3WordCloud
        data={data}
        width={500}
        height={500}
        padding={10}
        font={"Impact"}
        fontSize={fontSizeWrapper}
        rotate={0}
        fill={theme.theme === "dark" ? "#fff" : "#000"}
      />
    </>
  );
};

export default CustomWordCloud;
