import dayjs from "dayjs";
import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

interface ScheduleRecord {
	id: number;
	label: string;
	kind: string;
	position: number;
	professorId: number;
	roomId: number;
	professor: ScheduleProfessor;
	room: ScheduleRoom;
	groups: object | null;
}

interface ScheduleRoom {
	id: number;
	building: string;
	floor: number;
	number: number;
	label: string;
}

interface ScheduleProfessor {
	id: number;
	firstName: string;
	patronymic: string;
	surname: string;
	departmentId: number;
	department: object;
}

interface ScheduleGroup {
	id: number;
	label: string;
	startYear: number;
	number: number;
	subgroup: number;
	departmentId: number;
	department: {
		id: number;
		shortName: string;
		fullName: string;
		faculty: string;
	};
	records: object | null;
}

export const scheduleRouter = createTRPCRouter({
	get: publicProcedure
		.input(z.object({ group: z.string(), date: z.number() }))
		.query(async ({ ctx, input }) => {
			const resp = await fetch(
				`${env.RECIPES_API_URL}/courses/?g=${input.group}&d=${input.date}`,
			);
			if (!resp.ok) return [];
			const data = (await resp.json()) as ScheduleRecord[];

			const records: RecordType[][] = Array.from({ length: 6 }).map(
				() => new Array(),
			);
			for (const item of data) {
				const inWeek = item.position % 42;
				const dayNum = Math.floor(inWeek / 7);

				const intradayPos = inWeek % 7;

				const record: RecordType = {
					kind: item.kind,
					professor: item.professor.surname, // TODO: requires backend improvements
					room: item.room.label,
					subject: item.label,
					timestamp: (intradayPos > 2
						? dayjs().hour(14).minute(0)
						: dayjs().hour(8).minute(0)
					)
						.add(
							110 * (intradayPos > 2 ? intradayPos - 3 : intradayPos),
							"minutes",
						)
						.format("HH:mm"),
				};

				records[dayNum]!.push(record);
			}

			return records;
		}),
	getGroups: publicProcedure.query(async ({ ctx }) => {
		const resp = await fetch(`${env.RECIPES_API_URL}/groups/`);
		if (!resp.ok) return [];
		const data = (await resp.json()) as ScheduleGroup[];

		const groups: GroupType[] = data.map((item) => ({
			id: item.id,
			faculty: item.department.faculty,
			label: `${(dayjs().year() - item.startYear + 1) % 10}-${item.number}${"x".repeat(item.subgroup + 1)}`, // TODO: change to item.label after api update
		}));

		return groups;
	}),
});
