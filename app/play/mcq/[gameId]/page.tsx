import MCQ from "@/components/MCQ";
import { getAuthSession } from "@/lib/nextAuth";
import prismadb from "@/lib/prismadb";
import { GameType } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

type Props = { params: { gameId: string } };

const MCQPage = async ({ params: { gameId } }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }

  const game = await prismadb.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      questions: {
        select: {
          id: true,
          question: true,
          options: true,
        },
      },
    },
  });

  if (!game || game.gameType !== "mcq") {
    return redirect("/quiz");
  }
  return <MCQ game={game} />;
};

export default MCQPage;
