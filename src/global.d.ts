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
