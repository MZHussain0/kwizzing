"use client";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React from "react";
import D3WordCloud from "react-d3-cloud";

type Props = {
  topics: { text: string; value: number }[];
};

const fontSizeWrapper = (word: { value: number }) => {
  return Math.log2(word.value) * 5 + 16;
};

const CustomWordCloud = ({ topics }: Props) => {
  const theme = useTheme();
  const router = useRouter();
  return (
    <>
      <D3WordCloud
        data={topics}
        width={500}
        height={500}
        padding={10}
        font={"Times New Roman"}
        fontSize={fontSizeWrapper}
        rotate={0}
        fill={theme.theme === "dark" ? "#fff" : "#000"}
        onWordClick={(e, d) => {
          router.push("/quiz?topic=" + d.text);
        }}
      />
    </>
  );
};

export default CustomWordCloud;
