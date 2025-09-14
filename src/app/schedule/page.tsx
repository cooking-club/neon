"use client";

import dayjs, { type Dayjs } from "dayjs";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";

type RecordType = {
	timestamp: string;
	subject: string;
	professor: string;
	room: string;
	kind: string;
};

type DayType = {
	date: string;
	records: RecordType[];
};

export default function Schedule() {
	const [currentDate, setDate] = useState<Dayjs>(dayjs());
	const [group, setGroup] = useState("2-44-0");
	const query = api.schedule.get.useQuery({
		date: currentDate.unix(),
		group: group,
	});

	const currentWeek = dayjs().diff("2025-09-01", "weeks");

	const updateWeek = (diff: 1 | -1) => {
		setDate((d) => dayjs(d).add(diff, "week"));
	};

	return (
		<div className="px-2 pb-7 tabular-nums">
			<div className="flex justify-between border-b px-5 py-5">
				<h2 className="font-bold text-2xl">Schedule</h2>
				<GroupSelector
					defaultValue={group}
					setGroup={(v: string) => setGroup(v)}
				/>
			</div>
			<div className="mt-3 flex w-full items-center justify-between">
				<Button
					size="icon"
					variant="secondary"
					onClick={() => updateWeek(-1)}
					className="cursor-pointer"
					disabled={currentWeek < 1}
				>
					<ChevronLeftIcon />
				</Button>
				<div className="text-center">
					<h4 className="">
						{`${dayjs(currentDate).startOf("week").format("DD.MM")} - ${dayjs(
							currentDate,
						)
							.endOf("week")
							.format("DD.MM")}`}
					</h4>
					<p className="text-muted-foreground text-xs">
						Week {((currentWeek + 1) % 2) + 1}
					</p>
				</div>
				<Button
					size="icon"
					variant="secondary"
					onClick={() => updateWeek(1)}
					className="cursor-pointer"
				>
					<ChevronRightIcon />
				</Button>
			</div>
			{query.isSuccess ? (
				<div className="my-3">
					{query.data.map((day, idx) => (
						<Day
							key={idx}
							records={day.filter((rec) => rec != null)}
							date={dayjs("2025-09-01")
								.add(currentWeek, "weeks")
								.add(idx, "days")
								.toISOString()}
						/>
					))}
				</div>
			) : null}
			<p className="text-center text-muted-foreground">this is the end c:</p>
		</div>
	);
}

function Day({ date, records }: DayType) {
	return (
		<Card className="relative mb-5">
			<CardHeader>
				<CardTitle>{dayjs(date).format("dddd, DD.MM")}</CardTitle>
			</CardHeader>
			<CardContent className="">
				{records.map((item, idx) => (
					<Record key={idx} {...item} />
				))}
			</CardContent>
		</Card>
	);
}

function Record({ timestamp, subject, professor, room }: RecordType) {
	return (
		<div className="mb-4 flex gap-4">
			<span className="font-bold">{timestamp}</span>
			<div className="">
				<p className="font-black text-xl">{subject}</p>
				<p className="text-muted-foreground italic">
					{professor} ⋅ {room}
				</p>
			</div>
		</div>
	);
}

interface GroupSelectorProps {
	defaultValue: string;
	setGroup(v: string): void;
}

function GroupSelector({ defaultValue, setGroup }: GroupSelectorProps) {
	return (
		<Select defaultValue={defaultValue} onValueChange={setGroup}>
			<SelectTrigger>
				<SelectValue placeholder={"Select your group"} />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>ИВТФ</SelectLabel>
					<SelectItem value="2-40-0">2-40</SelectItem>
					<SelectItem value="2-44-0">2-44 x</SelectItem>
					<SelectItem value="2-44-1">2-44 xx</SelectItem>
				</SelectGroup>
				<SelectGroup>
					<SelectLabel>ЭМФ</SelectLabel>
					<SelectItem value="2-31-0">2-31</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
