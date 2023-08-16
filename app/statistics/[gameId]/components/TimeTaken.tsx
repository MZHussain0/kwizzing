﻿import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTimeDelta } from "@/lib/utils";
import { differenceInSeconds } from "date-fns";
import { Hourglass } from "lucide-react";
import React from "react";

type Props = {
  timeEnded: Date;
  timeStarted: Date;
};

const TimeTaken = ({ timeEnded, timeStarted }: Props) => {
  return (
    <Card className="md:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold">Time Taken</CardTitle>
        <Hourglass />
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium">
          {formatTimeDelta(differenceInSeconds(timeEnded, timeStarted))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeTaken;
