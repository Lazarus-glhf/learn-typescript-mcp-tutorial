export type Result<T, E> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: E;
    };

export function formatResult<T, E>(result: Result<T, E>): string {
    if (result.success) {
        return `Success: ${String(result.data)}`;
    }

    return `Failed: ${String(result.error)}`;
}

export function makeSuccess<T, E>(data: T): Result<T, E> {
    return { success: true, data };
}

export function makeFailure<T, E>(error: E): Result<T, E> {
    return { success: false, error };
}
