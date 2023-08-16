"use client";
import { Game, Question } from "@prisma/client";
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button, buttonVariants } from "./ui/button";
import MCQCOunter from "./MCQCounter";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import { checkAnswerSchema } from "@/schemas/form/quiz";
import { useToast } from "./ui/use-toast";
import Link from "next/link";
import { cn, formatTimeDelta } from "@/lib/utils";
import { differenceInSeconds } from "date-fns";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "question" | "options">[] };
};

const MCQ = ({ game }: Props) => {
  const [mounted, setMounted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [worngAnswers, setWorngAnswers] = useState<number>(0);
  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const [now, setNow] = useState<Date>(new Date());
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const options = useMemo(() => {
    if (!currentQuestion) return [];
    if (!currentQuestion.options) return [];
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  const { mutate: checkAnswer, isLoading: isCheckingAnswer } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: options[selectedChoice],
      };
      const response = await axios.post("/api/checkAnswer", payload);
      return response.data;
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hasEnded]);

  const handleNext = useCallback(() => {
    if (isCheckingAnswer) return;
    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        if (isCorrect) {
          toast({
            title: "Correct Answer!",
            variant: "success",
          });

          setCorrectAnswers((prev) => prev + 1);
        } else {
          toast({
            title: "Sorry, Wrong Answer!",
            variant: "destructive",
          });
          setWorngAnswers((prev) => prev + 1);
        }
        if (questionIndex === game.questions.length - 1) {
          setHasEnded(true);
          return;
        }
        setQuestionIndex((prev) => prev + 1);
      },
    });
  }, [
    checkAnswer,
    toast,
    isCheckingAnswer,
    game.questions.length,
    questionIndex,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "1") {
        setSelectedChoice(0);
      } else if (event.key === "2") {
        setSelectedChoice(1);
      } else if (event.key === "3") {
        setSelectedChoice(2);
      } else if (event.key === "4") {
        setSelectedChoice(3);
      } else if (event.key === "Enter") {
        handleNext();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext]);

  if (!mounted) {
    return null;
  }
  if (hasEnded) {
    return (
      <div className=" absolute flex flex-col justify-start top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
          You completed in{" "}
          {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
        <Link
          href={`/statistics/${game.id}`}
          className={cn(buttonVariants(), "mt-2")}>
          View Statistics <BarChart className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw]">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          {/* Topic */}
          <p>
            <span className="text-slate-400">Topic</span>
            <span className="ml-4 px-2 py-1 text-white rounded-lg bg-slate-800">
              {game.topic}
            </span>
          </p>

          <div className="flex self-start mt-3 text-slate-400">
            <Timer className="mr-2" />
            {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          </div>

          {/* MCQ Counter */}
        </div>
        <MCQCOunter
          correctAnswers={correctAnswers}
          wrongAnswers={worngAnswers}
        />
      </div>

      <Card className="w-full mt-4">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 text-center divide-y divide-zinc-800/50">
            <div className="">{questionIndex + 1}</div>
            <div className="text-base text-slate-400">
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">
            {currentQuestion.question}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex flex-col items-center justify-center w-full mt-4">
        {options.map((option, index) => (
          <Button
            key={index}
            className="w-full justify-start py-8 mb-4"
            variant={selectedChoice === index ? "default" : "secondary"}
            onClick={() => setSelectedChoice(index)}>
            <div className="flex items-center justify-start">
              <div className="p-2 px-3 mr-5 border rounded-md">{index + 1}</div>
              <div className="text-start">{option}</div>
            </div>
          </Button>
        ))}
        <Button
          className="mt-2"
          onClick={() => handleNext()}
          disabled={isCheckingAnswer}>
          {isCheckingAnswer && (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          )}
          NEXT <ChevronRight className="w-4 h-4 ml-2 animate-pulse" />
        </Button>
      </div>
    </div>
  );
};

export default MCQ;
