import { invoke } from "@forge/bridge";
import type { FunctionKey, RegisteredFunctions } from "./functions";

export function safeInvoke<T extends FunctionKey>(
	functionKey: T,
	payload?: RegisteredFunctions[T]["payloadType"],
): Promise<Awaited<RegisteredFunctions[T]["returnType"]>> {
	return invoke(functionKey, payload);
}
