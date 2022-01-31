export class HTTPError extends Error {
	status: number;
	context?: string;

	constructor(status: number, message: string, context?: string) {
		super(message);
		this.status = status;
		this.message = message;
		this.context = context;
	}
}
