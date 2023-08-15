import React from "react";
import { Card } from "./ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { Separator } from "./ui/separator";

type Props = {
  correctAnswers: number;
  wrongAnswers: number;
};

const MCQCOunter = ({ correctAnswers, wrongAnswers }: Props) => {
  return (
    <Card className=" flex flex-row items-center justify-center p-2">
      <CheckCircle2 size={30} color="green" />
      <span className="mx-2 text-2xl text-[green]">{correctAnswers}</span>
      <Separator orientation="vertical" />
      <span className="mx-3 text-2xl text-[red]">{wrongAnswers}</span>
      <XCircle size={30} color="red" />
    </Card>
  );
};

export default MCQCOunter;
