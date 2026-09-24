"use client";

const CLIENT_ID_KEY = "concrete-guide:review-client-id";
const NAME_KEY = "concrete-guide:review-name";

export function getReviewClientId(): string {
  try {
    let id = window.localStorage.getItem(CLIENT_ID_KEY);
    if (!id) {
      id = crypto?.randomUUID?.() ?? `r-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      window.localStorage.setItem(CLIENT_ID_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

export function getSavedReviewName(): string {
  try {
    return window.localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveReviewName(name: string) {
  try {
    window.localStorage.setItem(NAME_KEY, name.slice(0, 24));
  } catch {
    // ignore
  }
}
