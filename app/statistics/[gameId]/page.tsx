import { buttonVariants } from "@/components/ui/button";
import { getAuthSession } from "@/lib/nextAuth";
import prismadb from "@/lib/prismadb";
import { cn } from "@/lib/utils";
import { CircleDashed, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import ResultCard from "./components/ResultCard";
import AccuracyCard from "./components/AccuracyCard";
import TimeTaken from "./components/TimeTaken";
import QuestionsList from "./components/QuestionsList";

type Props = {
  params: {
    gameId: string;
  };
};

const StatisticsPage = async ({ params: { gameId } }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) redirect("/");

  const game = await prismadb.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      questions: true,
    },
  });

  if (!game) redirect("/quiz");

  let accuracy = 0;
  if (game.gameType === "mcq") {
    let totalCorrect = game.questions.reduce((acc, question) => {
      if (question.isCorrect) {
        return acc + 1;
      }
      return acc;
    }, 0);

    accuracy = Math.round((totalCorrect / game.questions.length) * 100);
  } else if (game.gameType === "open_ended") {
    let totalPercentage = game.questions.reduce((acc, question) => {
      return acc + (question.percentageCorrect || 0);
    }, 0);
    accuracy = Math.round(totalPercentage / game.questions.length);
  }
  return (
    <div className="p-8 mx-auto max-w-7xl">
      <div className="flex item-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Statistics</h2>
        <div className="flex items-center space-x-2">
          <Link href={`/dashboard`} className={cn(buttonVariants())}>
            <LayoutDashboard className="w-6 h-6 mr-2" /> Back to dashboard
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-4 mt-4 md:grid-cols-7">
        <ResultCard accuracy={accuracy} />
        <AccuracyCard accuracy={accuracy} />
        <TimeTaken
          timeStarted={new Date()}
          timeEnded={new Date(game.timeStarted ?? 0)}
        />
      </div>

      <QuestionsList questions={game.questions} />
    </div>
  );
};

export default StatisticsPage;
