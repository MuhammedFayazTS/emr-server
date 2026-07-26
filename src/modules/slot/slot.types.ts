export interface ISlot {
    startTime: string; // "HH:mm"
    endTime: string; // "HH:mm"
    date: Date;
    doctorId: string;
    isBooked: boolean;
}

export interface ISessionSlots {
    session: {
        startTime: string;
        endTime: string;
    };
    slots: ISlot[];
}
