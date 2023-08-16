import HistoryComponent from "@/components/History";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthSession } from "@/lib/nextAuth";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

const RecentActivities = async (props: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }

  const gamesCount = await prismadb.game.count({
    where: {
      userId: session?.user.id,
    },
  });
  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>
          You have played total of {gamesCount} quizzes
        </CardDescription>
      </CardHeader>

      <CardContent className="max-h-[500px] overflow-scroll">
        <HistoryComponent limit={10} userId={session?.user.id} />
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
