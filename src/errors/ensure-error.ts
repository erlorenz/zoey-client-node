export function ensureError(err: unknown): Error {
  if (err instanceof Error) return err;

  const cause = err;

  if (err === undefined) return new TypeError("error is undefined", { cause });
  if (err === null) return new TypeError("error is null", { cause });
  if (typeof err === "string")
    return new TypeError("error is a string: " + err, { cause });

  try {
    const message = JSON.stringify(err);
    return new TypeError("error is not an Error: " + message, { cause });
  } catch {
    return new TypeError("could not parse error as json", { cause });
  }
}
