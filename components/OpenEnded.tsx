"use client";
import { cn, formatTimeDelta } from "@/lib/utils";
import { Game, Question } from "@prisma/client";
import { differenceInSeconds } from "date-fns";
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button, buttonVariants } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import axios from "axios";
import { checkAnswerSchema } from "@/schemas/form/quiz";
import Link from "next/link";
import BlankAnswerInput from "./BlankAnswerInput";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "question" | "answer">[] };
};

const OpenEnded = ({ game }: Props) => {
  const [mounted, setMounted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const [now, setNow] = useState<Date>(new Date());
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const { mutate: checkAnswer, isLoading: isCheckingAnswer } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: "",
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
      onSuccess: ({ percentageSimilar }) => {
        toast({
          title: `Your answer is ${percentageSimilar}% similar to the correct answer`,
          description: "Answers are matched based on similarity comparisons",
        });
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
      if (event.key === "Enter") {
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
            <span className="ml-4 px-3 py-2 text-white rounded-lg bg-slate-800">
              {game.topic.toUpperCase()}
            </span>
          </p>

          <div className="flex self-start mt-3 text-slate-400">
            <Timer className="mr-2" />
            {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          </div>

          {/* MCQ Counter */}
        </div>
        {/* <MCQCOunter
          correctAnswers={correctAnswers}
          wrongAnswers={worngAnswers}
        /> */}
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
        <BlankAnswerInput answer={currentQuestion.answer} />

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

export default OpenEnded;
