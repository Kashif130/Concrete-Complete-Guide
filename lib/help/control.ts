// The model may open its reply with control tokens — [[NO_ANSWER]] (the guide doesn't cover this) and
// [[ADVICE]] (the user asked for a recommendation). They are for the server, not the user, so this
// parser strips them from the stream before anything is forwarded.

export type Control = { noAnswer: boolean; advice: boolean };

const MAX_PREFIX = 40; // give up waiting for a closing "]]" after this many chars

export class ControlPrefixParser {
  readonly control: Control = { noAnswer: false, advice: false };
  private buf = "";
  private done = false;

  /** Feed a streamed piece; returns the text that is safe to forward (possibly ""). */
  push(piece: string): string {
    if (this.done) return piece;
    this.buf += piece;
    for (;;) {
      const trimmed = this.buf.replace(/^\s+/, "");
      if (trimmed === "") return ""; // only whitespace so far
      if (trimmed.startsWith("[[")) {
        const end = trimmed.indexOf("]]");
        if (end === -1) {
          if (trimmed.length <= MAX_PREFIX) return ""; // token still arriving
          return this.release(trimmed);
        }
        const token = trimmed.slice(2, end).trim().toUpperCase();
        if (token === "NO_ANSWER") this.control.noAnswer = true;
        else if (token === "ADVICE") this.control.advice = true;
        this.buf = trimmed.slice(end + 2);
        continue;
      }
      if ("[[".startsWith(trimmed)) return ""; // a lone "[" — could still become "[["
      return this.release(trimmed);
    }
  }

  /** End of stream: flush whatever is left. */
  flush(): string {
    if (this.done) return "";
    return this.release(this.buf.replace(/^\s+/, ""));
  }

  private release(text: string): string {
    this.done = true;
    this.buf = "";
    return text;
  }
}
