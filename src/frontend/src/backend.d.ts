import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    content: string;
    role: string;
    timestamp: Time;
}
export type SessionId = string;
export type Time = bigint;
export interface backendInterface {
    /**
     * / Traps if the session does not exist.
     */
    addMessage(sessionId: SessionId, message: Message): Promise<void>;
    /**
     * / If the session already exists, this function has no effect.
     */
    createSession(sessionId: SessionId): Promise<void>;
    getAllSessions(): Promise<Array<SessionId>>;
    /**
     * / Traps if the user or session does not exist.
     */
    getMessages(sessionId: SessionId): Promise<Array<Message>>;
    is2FAEnabled(): Promise<boolean>;
    /**
     * / Returns `true` if the given caller is registered and `false` otherwise.
     */
    isRegistered(): Promise<boolean>;
    /**
     * / If the user is already registered, this function has no effect.
     */
    register(): Promise<void>;
    set2FAEnabled(enabled: boolean): Promise<void>;
}
