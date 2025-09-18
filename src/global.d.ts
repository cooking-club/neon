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

type GroupType = {
	id: number;
	label: string;
	faculty: string;
};
